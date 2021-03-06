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

import matjuice.pretty.Pretty;
import matjuice.codegen.Generator;
import matjuice.codegen.FunctionRenamer;
import matjuice.jsast.Program;

import matjuice.utils.Utils;
import natlab.tame.BasicTamerTool;
import natlab.tame.tir.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.value.Args;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

import natlab.tame.valueanalysis.components.shape.Shape;
import natlab.toolkits.analysis.core.Def;
import natlab.toolkits.analysis.core.ReachingDefs;
import natlab.toolkits.analysis.core.UseDefDefUseChain;
import natlab.toolkits.filehandling.GenericFile;
import natlab.toolkits.path.FileEnvironment;


import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;


public class Main {
    private static void usage() {
        System.err.println("Usage: java -cp MatJuice.jar natlab.backends.javascript.Main <matlab file> <output file> <shapes>");
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
        boolean verbose = true;
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
        int numberOfShapes = opts.arguments.size() - 2;
        String[] shapeDesc = new String[numberOfShapes]; // E.g. "DOUBLE&1*1&REAL"
        for (int i = 2; i < opts.arguments.size(); ++i) {
            shapeDesc[i-2] = opts.arguments.get(i);
        }

        // Compilation time
        long startTime = 0;     // start time of the whole compilation
        long endTime = 0;       // end time of the whole compilation
        double totalPtCiTime = 0.0; // total time of PT/CI time

        startTime = System.currentTimeMillis();

        GenericFile gfile = GenericFile.create(matlabFile);
        if (!gfile.exists()) {
            System.err.printf("Error: file '%s' does not exist.%n", gfile.getName());
            System.exit(1);
        }

        FileEnvironment fenv = new FileEnvironment(gfile);
        ValueAnalysis<AggrValue<BasicMatrixValue>> analysis = BasicTamerTool.analyze(shapeDesc, fenv);

        Set generated = new HashSet<String>();
        Program program = new Program();
        String entryPointName = null;
        String entryPointShape = null;

        int numFunctions = analysis.getNodeList().size();
        for (int i = 0; i < numFunctions; ++i) {
            IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> funcAnalysis = analysis.getNodeList().get(i).getAnalysis();

            String functionName = funcAnalysis.getTree().getName().getID();
            String originalFunctionName = functionName;

            String suffix = FunctionRenamer.toSuffix(funcAnalysis.getArgs());
            if (suffix != "") {
                functionName += "_" + suffix;
            }

            if (!generated.contains(functionName)) {
                TIRFunction matlabFunction = funcAnalysis.getTree();
                Generator gen = new Generator(funcAnalysis, opts.doCopyInsertion);
                program.addFunction(gen.genFunction(matlabFunction));
                generated.add(functionName);
                System.out.println("Generated: " + functionName);
                totalPtCiTime += gen.getCopyInsertionTime();
            }

            // Treat the first function as the entry point of the program
            if (i == 0) {
                entryPointName = functionName;
                entryPointShape = suffix;
            }
        }
        endTime = System.currentTimeMillis();

        // End of compilation
        if (opts.timeCompilation) {
            double total = (endTime - startTime) / 1000.0;
            System.out.printf("MATJUICE: PT/CI compile time: %.3f secs\n", totalPtCiTime);
            System.out.printf("MATJUICE: Total compile time: %.3f secs\n", total);
            System.out.printf("MATJUICE: Ratio PT/CI:Total : %.3f\n", totalPtCiTime / total);
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
            out.write(String.format("module.exports['/pando/1.0.0'] = function (x, cb) {%n" +
                                    "  try {%n" +
                                    "    var r = %s(x)%n" +
                                    "    cb(null, r)%n" +
                                    "  } catch (e) {%n" +
                                    "    cb(e)%n" +
                                    "  }%n" +
                                    "}", entryPointName));
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

    @Parameter(names={ "--inline-indexing" }, arity=1, description="replace mj_get/mj_set with JavaScript indexing")
    public boolean inlineIndexing= true;

    @Parameter(names={ "--enable-bounds-checking" }, arity=1, description="generate bounds checking code")
    public boolean enableBoundsChecking = true;

    @Parameter(names={ "--copy-insertion" }, arity=1, description="do points-to analysis and copy insertion")
    public boolean doCopyInsertion = true;

    @Parameter(names={ "--time" }, arity=1, description="time compilation time")
    public boolean timeCompilation = false;
}
