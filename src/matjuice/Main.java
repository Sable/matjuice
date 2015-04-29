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

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

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
import matjuice.transformers.JSAddVarDecls;
import matjuice.transformers.JSRenameBuiltins;


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
        if (args.length < 3) usage();

        String[] shapeDesc = { args[0] };  // E.g. "DOUBLE&1*1&REAL"
        String   matlabFile = args[1];
        String   javascriptFile = args[2];

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
            // Add variable declarations inside every function.
            JSAddVarDecls.apply(f);

            // Rename builtin function calls and binary operators.
            program.setFunction(
                    (Function)JSRenameBuiltins.apply(f, analysis, processedFunctions.get(f.getFunctionName().getName())),
                    i);

        }


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
                out.write(slurp(jsDep));
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
