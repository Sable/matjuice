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

package matjuice.transformers;

import ast.ASTNode;
import matjuice.jsast.*;
import natlab.tame.tir.*;
import natlab.tame.tir.analysis.TIRAbstractNodeCaseHandler;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

import java.util.ArrayList;

/**
 * Created by vfoley1 on 07/07/15.
 */
public class JSCopyArrayParams {
    public static Function apply(Function f, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        Function new_f = f.copy();
        for (Parameter p: new_f.getParamList()) {
            BasicMatrixValue bmv = (BasicMatrixValue) analysis.getCurrentInSet().get(p.getName()).getSingleton();
            if (!bmv.getShape().isScalar()) {
                java.util.List<TIRStmt> assignmentPoints = PossiblyAssigned.apply(f.getTIRFunction(), p.getName());
                if (!assignmentPoints.isEmpty()) {
                    addCopyStatement(new_f, p);
                }
            }
        }
        return new_f;
    }

    private static void addCopyStatement(Function f, Parameter p) {
        StmtBlock block = f.getStmtBlock();
        List<Stmt> stmts = block.getStmts();
        Stmt copyStmt = new StmtExpr(new ExprAssign(
                new ExprId(p.getName()),
                new ExprCall(new ExprPropertyGet(new ExprId(p.getName()), new ExprString("mj_clone")), new List<Expr>())
        ));
        stmts.insertChild(copyStmt, 0);
    }

    private static class PossiblyAssigned extends TIRAbstractNodeCaseHandler {
        private java.util.List<TIRStmt> assignments = new ArrayList<>();
        private String varname;

        public static java.util.List<TIRStmt> apply(TIRFunction tirFunc, String varname) {
            PossiblyAssigned analyzer = new PossiblyAssigned(varname);
            tirFunc.getStmtList().tirAnalyze(analyzer);
            return analyzer.assignments;
        }

        public PossiblyAssigned(String varname) {
            this.varname = varname;
        }

        @Override
        public void caseASTNode(ASTNode astNode) {
            for(int i = 0; i < astNode.getNumChild(); i++) {
                ASTNode child = astNode.getChild(i);
                if (child instanceof TIRNode) {
                    ((TIRNode) child).tirAnalyze(this);
                }
                else {
                    child.analyze(this);
                }
            }
        }

        @Override
        public void caseTIRArraySetStmt(TIRArraySetStmt stmt) {
            if (stmt.getArrayName().getVarName().equals(varname))
                assignments.add(stmt);
        }
    }
}
