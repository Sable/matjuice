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

import natlab.tame.builtin.Builtin;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.tir.TIRCallStmt;

/**
 * Rename JavaScript function calls; the prefix "mc_" is added to all built-in
 * calls, and a suffix describing the shape of the parameters is also added with
 * "S" representing a scalar parameter and "M" a matrix parameter.
 *
 * If the function call is an arithmetic operation on two scalars available in
 * JavaScript, we replace the function call node with a binary expression node.
 *
 * e.g. plus(3, 4) => 3 + 4
 *      times([1 2 3], 4) => mc_times_MS([1 2 3], 4)
 *
 * @author vfoley1
 *
 */
public class BuiltinRenamer {
        /*
     * Array of builtins that we should add a type suffix to. Mostly variadic
     * functions.
     */
    private static String[] SPECIALIZED = {
        "plus", "minus", "mtimes", "rem",
        "mod", "mrdivide", "lt", "le", "gt", "ge", "eq", "ne", "length",
        "sin", "uminus", "exp", "rdivide", "round", "sqrt", "mpower",
        "floor", "ceil", "power", "abs"
    };

    static {
        // The specialized functions are ordered so that we can run a binary
        // search over them.
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));

    }

    public static String getFunctionName(TIRCallStmt tirStmt,
      IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        String functionName = tirStmt.getFunctionName().getID();
        if (Builtin.getInstance(functionName) == null)
            return functionName;

        String suffix = "";
        if (Arrays.binarySearch(SPECIALIZED, functionName, (s, t) -> s.compareTo(t)) >= 0) {
            for (ast.Expr argExpr : tirStmt.getArguments()) {
                ast.NameExpr nameExpr = (ast.NameExpr) argExpr;
                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, nameExpr.getName().getID());
                if (bmv.hasShape() && bmv.getShape().isScalar())
                    suffix += "S";
                else
                    suffix += "M";
            }
        }
        return "mc_" + functionName + (suffix.equals("") ? "" : "_" + suffix);
    }
}
