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

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;

import natlab.tame.BasicTamerTool;
import natlab.tame.tir.TIRFunction;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.toolkits.filehandling.GenericFile;
import natlab.toolkits.path.FileEnvironment;
import matjuice.codegen.JSASTGenerator;
import matjuice.jsast.*;
import matjuice.pretty.Pretty;
import matjuice.transformers.JSAddVarDeclsVisitor;
import matjuice.transformers.JSArrayIndexingVisitor;
import matjuice.transformers.JSRenameBuiltinsVisitor;
import matjuice.transformers.JSRenameOperatorsVisitor;


public class Main {
    private static void usage() {
        System.err.println("Usage: java -cp MatJuice.jar natlab.backends.javascript.Main <shape> <matlab file> <output file>");
        System.exit(1);
    }

    private static String slurp(String filename) {
        try {
            return new String(Files.readAllBytes(Paths.get(filename)));
        } catch (IOException e) {
            return "";
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
        Map<String, Integer> processedFunctions = new HashMap<>();
        int numFunctions = analysis.getNodeList().size();
        for (int i = 0; i < numFunctions; ++i) {
            TIRFunction matlabFunction = analysis.getNodeList().get(i).getAnalysis().getTree();
            String func_name = matlabFunction.getName().getID();
            if (!processedFunctions.containsKey(func_name)) {
                JSASTGenerator generator = new JSASTGenerator(analysis.getNodeList().get(i).getAnalysis());
                program.addFunction(generator.genFunction(matlabFunction));
                processedFunctions.put(func_name, i);
            }
        }

        // Apply JavaScript program transformations
        for (int i = 0; i < program.getFunctionList().getNumChild(); ++i) {
            Function f = program.getFunction(i);
            Function new_function = f;

            if (opts.renameOperators) {
                new_function = (Function) JSRenameOperatorsVisitor.apply(
                        new_function,
                        analysis,
                        processedFunctions.get(new_function.getFunctionName().getName()));
            }

            if (opts.renameArrayIndexing) {
                new_function = (Function) JSArrayIndexingVisitor.apply(
                        new_function,
                        analysis,
                        processedFunctions.get(new_function.getFunctionName().getName()),
                        opts.enableBoundsChecking);
            }

            new_function = (Function) JSRenameBuiltinsVisitor.apply(
                    new_function,
                    analysis,
                    processedFunctions.get(new_function.getFunctionName().getName()));

            JSAddVarDeclsVisitor.apply(new_function);

            program.setFunction(new_function, i);
        }

        String matjuicePath = getMatjuicePath();

        // Write out the JavaScript program.
        // TODO: Fix the relative path of lib.js.
        // TODO: Better error messages.
        FileWriter out = null;
        String[] jsDeps = {
            "src/matjuice/lib/mjapi.js",
            "gen/lib.js",
        };

        try {
            out = new FileWriter(javascriptFile);

            for (String jsDep: jsDeps) {
                out.write(slurp(matjuicePath + File.separator + jsDep));
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

    private static String getMatjuicePath() {
        String path = Main.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        File f = new File(path);
        return f.getParent().toString();
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
