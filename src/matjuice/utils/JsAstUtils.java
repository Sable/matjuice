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

package matjuice.utils;

import matjuice.jsast.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;


public class JsAstUtils {
    /**
     * Find the enclosing Stmt node that has a non-null TIRStmt pointer.
     * @param node
     * @return
     */
    @SuppressWarnings("rawtypes")
    public static Stmt getEnclosingStmt(ASTNode node) {
        ASTNode parent = node.getParent();
        while (true) {
            if (parent == null)
                return null;
            if (parent instanceof Stmt && ((Stmt) parent).getTIRStmt() != null)
                return (Stmt) parent;
            parent = parent.getParent();
        }
    }

    public static BasicMatrixValue getBasicMatrixValue(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis,
            Stmt stmt, String variable) {
        if (stmt == null)
            return null;

        AggrValue<BasicMatrixValue> val = analysis
                .getOutFlowSets()
                .get(stmt.getTIRStmt())
                .get(variable)
                .getSingleton();
        if (val instanceof BasicMatrixValue)
            return (BasicMatrixValue) val;
        else
            return null;
    }

    public static Stmt copyingTIRStmt(Stmt from, Stmt to) {
        to.setTIRStmt(from.getTIRStmt());
        return to;
    }

    /**
     * Create a copy statement in the JS AST
     * @param varname variable name to copy
     * @return foo = foo["mj_clone"]()
     */
    public static StmtExpr copyStmt(String varname) {
        return new StmtExpr(
                new ExprAssign(
                        new ExprId(varname),
                        new ExprCall(new ExprPropertyGet(new ExprId(varname), new ExprString("mj_clone")), new List<Expr>())
                ));
    }
}
