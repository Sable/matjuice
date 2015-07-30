/*
 *  Copyright 2014-2015, Vincent Foley-Bourgon, McGill University
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package matjuice;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

import matjuice.codegen.JSASTGenerator;
import matjuice.jsast.Function;
import matjuice.jsast.Program;
import matjuice.jsast.Stmt;
import matjuice.pretty.Pretty;
import matjuice.transformers.*;
import natlab.tame.BasicTamerTool;
import natlab.tame.tir.TIRFunction;
import natlab.tame.tir.TIRStatementList;
import natlab.tame.tir.TIRStmt;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.toolkits.filehandling.GenericFile;
import natlab.toolkits.path.FileEnvironment;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;


public class Main {
    private static void usage() {
        System.err.println("Usage: java -cp MatJuice.jar natlab.backends.javascript.Main <shape> <matlab file> <output file>");
        System.exit(1);
    }

    private static String slurp(BufferedReader in) {
        StringBuffer sb = new StringBuffer();
        while (true) {
            String line;
            try {
                line = in.readLine();
            } catch (IOException e) {
                return "";
            }
            if (line == null)
                return sb.toString();
            sb.append(line + "\n");
        }
    }

    public static void main(String[] args) {
        CommandLineOptions opts = new CommandLineOptions();
        JCommander jcommander = new JCommander(opts, args);
        jcommander.setProgramName("matjuice");

        if (opts.help) {
            jcommander.usage();
            System.exit(0);
        }

        if (opts.arguments.size() < 3) {
            usage();
        }

        String matlabFile = opts.arguments.get(0);
        String javascriptFile = opts.arguments.get(1);

        // The last arguments are the shape information of the parameters of the entry function.
        int number_of_shapes = opts.arguments.size() - 2;
        String[] shapeDesc = new String[number_of_shapes]; // E.g. "DOUBLE&1*1&REAL"
        for (int i = 2; i < opts.arguments.size(); ++i) {
            shapeDesc[i-2] = opts.arguments.get(i);
        }

        GenericFile gfile = GenericFile.create(matlabFile);
        if (!gfile.exists()) {
            System.err.printf("Error: file '%s' does not exist.%n", gfile.getName());
            System.exit(1);
        }

        FileEnvironment fenv = new FileEnvironment(gfile);
        ValueAnalysis<AggrValue<BasicMatrixValue>> analysis = BasicTamerTool.analyze(shapeDesc, fenv);

        Program program = new Program();

        // Convert the Tamer instructions to JavaScript.
        Map<String, Function> processedFunctions = new HashMap<>();
        Map<String, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>>> functionAnalyses = new HashMap<>();
        int numFunctions = analysis.getNodeList().size();
        for (int i = 0; i < numFunctions; ++i) {
            IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis = analysis.getNodeList().get(i).getAnalysis();
            TIRFunction matlabFunction = func_analysis.getTree();
            String func_name = matlabFunction.getName().getID();
            if (!processedFunctions.containsKey(func_name)) {
                JSASTGenerator generator = new JSASTGenerator(func_analysis);
                Function jsFunction = generator.genFunction(matlabFunction);
                processedFunctions.put(func_name, jsFunction);
                functionAnalyses.put(func_name, func_analysis);
            }
        }

        // Apply JavaScript program transformations
        for (Map.Entry<String, Function> entry: processedFunctions.entrySet()) {
            Function f = entry.getValue();

            IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis = functionAnalyses.get(entry.getKey());

            // First transformer: copy all array parameters that are written to in the function.
            // The analysis returns extra information through an out parameter: the set of
            // formal parameters that have been copied.
            Set<String> copiedParameters = new HashSet<String>();
            f = JSCopyArrayParams.apply(f, func_analysis, copiedParameters);

            // Second transformer: replace functions with operators (e.g. add(x, 1) --> x+1)
            if (opts.renameOperators) {
                f = JSRenameOperatorsVisitor.apply(f, func_analysis);
            }

            // Third transformer: replace functions with array indexing
            // (e.g. mc_array_get(a, [1,2]) --> a[(1-1) + a.mj_size()[0]*(2-1)])
            if (opts.renameArrayIndexing) {
                f = JSArrayIndexingVisitor.apply(f, func_analysis, opts.enableBoundsChecking);
            }

            // Fourth transformer: Replace builtin functions with specialized versions
            // (e.g. mc_sqrt(9) --> mc_sqrt_S(9))
            f = JSRenameBuiltinsVisitor.apply(f, func_analysis);

            // Fifth transformer: add var declarations for every local and temp variable.
            JSAddVarDeclsVisitor.apply(f);

            program.addFunction(f);
        }

        // Write out the JavaScript program.
        // TODO: Better error messages.
        FileWriter out = null;
        String[] jsDeps = {
            "mjapi.js",
            "lib.js",
        };

        try {
            out = new FileWriter(javascriptFile);

            for (String jsDep: jsDeps) {
                InputStream stream = Main.class.getResourceAsStream("/" + jsDep);
                if (stream != null) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(stream));
                    out.write(slurp(in));
                }
            }

            out.write(String.format("%n%n// BEGINNING OF PROGRAM%n%n"));
            out.write(Pretty.display(program.pp()));
            out.write('\n');
        }
        catch (IOException exc) {
            System.err.println("Error: cannot write to " + javascriptFile);
        }
        finally {
            try {
                out.close();
            }
            catch (IOException e) {}
        }
    }
}


@Parameters(separators = "=")
final class CommandLineOptions {
    @Parameter
    public java.util.List<String> arguments = new ArrayList<String>();

    @Parameter(names={ "-h", "--help" }, help=true, description="display this help message")
    public boolean help = false;

    @Parameter(names={ "--rename-operators" }, arity=1, description="replace scalar functions with JavaScript operators")
    public boolean renameOperators = true;

    @Parameter(names={ "--rename-array-indexing" }, arity=1, description="replace array_get/array_set with JavaScript indexing")
    public boolean renameArrayIndexing= true;

    @Parameter(names={ "--enable-bounds-checking" }, arity=1, description="generate bounds checking code")
    public boolean enableBoundsChecking = true;
}
