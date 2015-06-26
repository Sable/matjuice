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

import java.util.*;

import matjuice.jsast.*;
import matjuice.jsast.List;

/**
 * In MATLAB, you don't declare variables, however in JavaScript you need
 * to declare your local variables.  This class finds the locals and inserts
 * the appropriate declarations.
 * @author vfoley1
 *
 */
public class JSAddVarDecls {

    public static void apply(Function func) {
        Set<String> vars = getVars(func);

        StmtBlock sb = func.getStmtBlock();
        List<Stmt> stmts = sb.getStmtList();
        for (String var: vars) {
            stmts.insertChild(new StmtVarDecl(var, new Opt<Expr>()), 0);
        }
    }

    /**
     * Compute the following three sets:
     *   - Local variables
     *   - Global variables
     *   - Formal parameters
     * and return locals - params, which are the variables
     * that need to be declared.
     * @return the names of local variables that are assigned to.
     */
    public static Set<String> getVars(Function func) {
        Set<String> locals = getLocals(func);
        Set<String> params = getParams(func);

        locals.removeAll(params);
        return locals;
    }

    private static Set<String> getParams(Function func) {
        Set<String> params =  new HashSet<String>();
        for (Parameter param: func.getParamList()) {
            params.add(param.getName());
        }
        return params;
    }

    /**
     * Get all the names of variables on the lhs of an assignment.
     * @return a set of strings of the variable names.
     */
    private static Set<String> getLocals(ASTNode node) {
        Set<String> vars = new HashSet<>();
        for (int i = 0; i < node.getNumChild(); ++i) {
            ASTNode child = node.getChild(i);

            if (child instanceof ExprAssign) {
                ExprAssign assignment = (ExprAssign) child;
                if (assignment.getLHS() instanceof ExprId)
                    vars.add(((ExprId) assignment.getLHS()).getName());
            }
            vars.addAll(getLocals(child));
        }
        return vars;
    }
}
