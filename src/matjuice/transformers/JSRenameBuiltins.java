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

import java.util.Arrays;

import natlab.tame.builtin.Builtin;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

import matjuice.jsast.*;


/**
 * Rename JavaScript function calls; the prefix "mc_" is added to all
 * built-in calls, and a suffix describing the shape of the parameters
 * is also added with "S" representing a scalar parameter and "M" a
 * matrix parameter.
 *
 * e.g. plus(3, 4)        => mc_plus_SS(3, 4)
 *      times([1 2 3], 4) => mc_times_MS([1 2 3], 4)
 * @author vfoley1
 *
 */
public class JSRenameBuiltins {
    /* Array of builtins that we should add a type suffix to.
     * Mostly variadic functions. */
    private static String[] SPECIALIZED = {
	"plus", "minus", "mtimes", "rem", "mod", "mrdivide", "lt", "le", "gt",
	"ge", "eq", "ne", "length", "sin", "uminus", "exp", "rdivide", "round",
	"sqrt", "mpower",
    };

    // The specialized functions are ordered so that we can run a binary search over them.
    static {
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));
    }


    public static void apply(ASTNode node, ValueAnalysis<AggrValue<BasicMatrixValue>> analysis, int index) {
        if (node instanceof ExprCall) {
            ExprCall call = (ExprCall) node;
            if (call.getExpr() instanceof ExprVar) {
                ExprVar var = (ExprVar) call.getExpr();

                if (Builtin.getInstance(var.getName()) != null) {
                    String suffix = "";
                    boolean is_specialized = Arrays.binarySearch(SPECIALIZED, var.getName(), (s, t) -> s.compareTo(t)) >= 0;
                    if (is_specialized) {
	                    for (Expr e: call.getArguments()) {
	                        ExprVar arg = (ExprVar) e;
	                        AggrValue<BasicMatrixValue> val =
	                                analysis.getNodeList()
	                                .get(index)
	                                .getAnalysis()
	                                .getCurrentOutSet()
	                                .get(arg.getName())
	                                .getSingleton();
	                        if (val instanceof BasicMatrixValue) {
	                            if (((BasicMatrixValue) val).getShape().isScalar())
	                                suffix += "S";
	                            else
	                                suffix += "M";
	                        }
	                    }
                    }
                    var.setName("mc_" + var.getName() + (is_specialized ? "_" + suffix : ""));
                }
            }
        }

        for (int i = 0; i < node.getNumChild(); ++i) {
            apply(node.getChild(i), analysis, index);
        }
    }
}
