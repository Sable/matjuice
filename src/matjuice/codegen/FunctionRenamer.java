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

package matjuice.codegen;

import matjuice.utils.Utils;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Arrays;
import java.util.Iterator;

import natlab.tame.builtin.Builtin;
import natlab.tame.tir.TIRCommaSeparatedList;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.tir.TIRCallStmt;
import natlab.tame.tir.TIRFunction;
import natlab.tame.valueanalysis.value.Args;

/**
 * Rename JavaScript function calls; the prefix "mc_" is added to all built-in
 * calls; A suffix describing the shape of the parameters is also added with
 * "S" representing a scalar parameter and "M" a matrix parameter.
 *
 * If the function call is an arithmetic operation on two scalars available in
 * JavaScript, we replace the function call node with a binary expression node.
 *
 * e.g. plus(3, 4) => 3 + 4
 *      times([1 2 3], 4) => mc_times_MS([1 2 3], 4)
 *
 * @author vfoley1
 * @author Erick Lavoie
 *
 */
public class FunctionRenamer {
        /*
     * Array of builtins that we should add a type suffix to. Mostly variadic
     * functions.
     */

    private static String[] SPECIALIZED = {
            "plus", "minus", "mtimes", "rem", "mod", "mrdivide",
            "lt", "le", "gt", "ge", "eq", "ne", "length",
            "sin", "cos", "tan", "uminus", "exp", "rdivide", "round", "sqrt",
            "mpower", "floor", "ceil", "power", "abs", "fix", "and", "times",
            "log"
    };
    private static String[] NONSPECIALIZED = {
            "any", "assert"
    };
    static {
        // The specialized functions are ordered so that we can run a binary
        // search over them.
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));
        Arrays.sort(NONSPECIALIZED, (s, t) -> s.compareTo(t));
    }

    public static String toSuffix(Args<AggrValue<BasicMatrixValue>> args) {
        String suffix = "";
        Iterator var2 = args.iterator();

        while(var2.hasNext()) {
            BasicMatrixValue bmv = (BasicMatrixValue)var2.next();
            if (bmv.hasShape() && bmv.getShape().isScalar())
                suffix += "S";
            else
                suffix += "M";
        }

        return suffix;
    }

    public static String toSuffix(TIRCallStmt tirStmt, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        String suffix = "";
        for (ast.Expr argExpr : tirStmt.getArguments()) {
           ast.NameExpr nameExpr = (ast.NameExpr) argExpr;
           BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, nameExpr.getName().getID());
            if (bmv.hasShape() && bmv.getShape().isScalar())
                suffix += "S";
            else
                suffix += "M";
        }
        return suffix;
    }

    public static String getFunctionName(TIRCallStmt tirStmt,
      IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        String functionName = tirStmt.getFunctionName().getID();
        String suffix = toSuffix(tirStmt, analysis);

        if (Builtin.getInstance(functionName) == null) {
            return functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else if (Arrays.binarySearch(SPECIALIZED, functionName, (s, t) -> s.compareTo(t)) >= 0) {
            return "mc_" + functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else {
            return "mc_" + functionName;
        }
    }

    public static String getFunctionName(TIRFunction function,
                                         IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        String functionName = function.getName().getID();
        String suffix = toSuffix(analysis.getArgs());

        // Add suffix or otherwise, redefine a builtin when a function name shadows one of them
        if (Builtin.getInstance(functionName) == null) {
            return functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else if (Arrays.binarySearch(SPECIALIZED, functionName, (s, t) -> s.compareTo(t)) >= 0) {
            return "mc_" + functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else {
            throw new Error("Unsupported redefinition of builtin function " + functionName);
        }
    }
}
