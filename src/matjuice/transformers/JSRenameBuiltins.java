/*
 *  Copyright 2014, Vincent Foley-Bourgon, McGill University
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

package matjuice.transformers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Arrays;

import natlab.tame.builtin.Builtin;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import matjuice.jsast.*;
import matjuice.pretty.Pretty;

/**
 * Rename JavaScript function calls; the prefix "mc_" is added to all built-in
 * calls, and a suffix describing the shape of the parameters is also added with
 * "S" representing a scalar parameter and "M" a matrix parameter.
 *
 * e.g. plus(3, 4) => mc_plus_SS(3, 4) times([1 2 3], 4) => mc_times_MS([1 2 3],
 * 4)
 *
 * @author vfoley1
 *
 */
public class JSRenameBuiltins {
    /* Binary operators in JavaScript */
    private static HashMap<String, String> binary_ops = new HashMap<>();

    /*
     * Array of builtins that we should add a type suffix to. Mostly variadic
     * functions.
     */
    private static String[] SPECIALIZED = { "plus", "minus", "mtimes", "rem",
            "mod", "mrdivide", "lt", "le", "gt", "ge", "eq", "ne", "length",
            "sin", "uminus", "exp", "rdivide", "round", "sqrt", "mpower", };

    static {
        // The specialized functions are ordered so that we can run a binary
        // search over them.
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));

        binary_ops.put("plus", "+");
        binary_ops.put("minus", "-");
        binary_ops.put("times", "*");
        binary_ops.put("mtimes", "*");
        binary_ops.put("mrdivide", "/");
        binary_ops.put("rdivide", "/");
    }

    public static ASTNode apply(ASTNode node,
            ValueAnalysis<AggrValue<BasicMatrixValue>> analysis, int index) {
        ASTNode new_node = node;

        if (node instanceof ExprCall) {
            ExprCall call = (ExprCall) node;
            if (call.getExpr() instanceof ExprVar) {
                ExprVar var = (ExprVar) call.getExpr();

                if (Builtin.getInstance(var.getName()) != null) {
                    // Keep in a list which arguments are scalar and which
                    // aren't.
                    ArrayList<Boolean> scalar_arguments = new ArrayList<>();
                    for (Expr e : call.getArguments()) {
                        ExprVar arg = (ExprVar) e;
                        AggrValue<BasicMatrixValue> val = analysis
                                .getNodeList().get(index).getAnalysis()
                                .getCurrentOutSet().get(arg.getName())
                                .getSingleton();
                        scalar_arguments.add(((BasicMatrixValue) val)
                                .getShape().isScalar());
                    }

                    // Transform `op(x, y)` into `x op y` for scalars.
                    if (binary_ops.containsKey(var.getName())
                            && scalar_arguments.size() == 2
                            && scalar_arguments.get(0)
                            && scalar_arguments.get(1)) {
                        new_node = new ExprBinaryOp(
                                binary_ops.get(var.getName()),
                                call.getArgument(0),
                                call.getArgument(1)
                                );
                    }
                    // Transform `specialized(x, y)` into `mc_specialized_MM(x, y)`
                    else {
                        String suffix = "";
                        if (Arrays.binarySearch(SPECIALIZED, var.getName(), (s, t) -> s.compareTo(t)) >= 0) {
                            for (boolean isScalar : scalar_arguments) {
                                suffix += isScalar ? "S" : "M";
                            }
                        }
                        new_node = new ExprCall(
                                new ExprVar("mc_" + var.getName() + (suffix.equals("") ? "" : "_" + suffix)),
                                call.getArgumentList()
                                );
                    }
                }
            }
        }

        for (int i = 0; i < new_node.getNumChild(); ++i) {
            new_node.setChild(apply(new_node.getChild(i), analysis, index), i);
        }
        return new_node;
    }
}
