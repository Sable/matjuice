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
import ast.ForStmt;
import ast.WhileStmt;
import matjuice.jsast.*;
import natlab.tame.tir.*;
import natlab.tame.tir.analysis.TIRAbstractNodeCaseHandler;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by vfoley1 on 07/07/15.
 *
 * This class will make copies of the formal parameters of function that
 * are possibly written to in the body of the function.  We try to put the
 * copies as "deep" as possible (i.e. nearest to the actual writes).
 */
public class JSCopyArrayParams {
    /**
     * Add copy statements for the formal parameters that may be modified.
     * @param f The function to transform
     * @param analysis The analysis containing the shape information of the formal parameters
     * @return A new function
     */
    public static Function apply(Function f, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        for (Parameter p: f.getParamList()) {
            Set<TIRArraySetStmt> arrayWrites = findWriteStatements(f.getTIRFunction(), p.getName());

            java.util.List<java.util.List<TIRStatementList>> enclosingBlocksList = new ArrayList<>();
            for (TIRArraySetStmt stmt: arrayWrites) {
                enclosingBlocksList.add(findEnclosingBlocks(stmt));
            }
            TIRStatementList commonBlock = findInnermostCommonNode(enclosingBlocksList);
            if (commonBlock != null) {
                StmtBlock jsBlock = f.getFromTIRBlock(commonBlock);
                List<Stmt> stmts = jsBlock.getStmtList();
                stmts.insertChild(copyStmt(p.getName()), 0);
                jsBlock.setStmtList(stmts);
            }
        }
        return f;
    }

    /**
     * Create a copy statement in the JS AST
     * @param varname variable name to copy
     * @return foo = foo["mj_clone"]()
     */
    private static StmtExpr copyStmt(String varname) {
        return new StmtExpr(
                new ExprAssign(
                        new ExprId(varname),
                        new ExprCall(new ExprPropertyGet(new ExprId(varname), new ExprString("mj_clone")), new List<Expr>())
                ));
    }

    /**
     * Given a Tamer function and the name of a formal parameter, return the set of
     * all array write statements to that parameter.
     * @param tf A TIRFunction
     * @param paramName The name of the formal parameter
     * @return A set of the TIRArraySetStmt objects that write to the parameter
     */
    private static Set<TIRArraySetStmt> findWriteStatements(TIRFunction tf, String paramName) {
        WriteStatementFinder wsf = new WriteStatementFinder(paramName);
        tf.tirAnalyze(wsf);
        return wsf.writeStatements;
    }

    /**
     * Given an array write statement, find the enclosing AST nodes that contain it before
     * the first loop is encountered.
     * @param stmt a TIRArraySetStmt
     * @return a list of the parents of stmt that occur before loops
     */
    private static java.util.List<TIRStatementList> findEnclosingBlocks(TIRArraySetStmt stmt) {
        java.util.List<ASTNode> enclosing = new ArrayList<>();
        ASTNode parent = stmt.getParent();
        // Find all the parents
        while (parent != null) {
            enclosing.add(parent);
            parent = parent.getParent();
        }

        // The parents were accumulated in inner-most to outer-most order.  Reverse that
        // list and keep only the nodes up to the first loop statement.
        Collections.reverse(enclosing);
        java.util.List<TIRStatementList> nonLoopEnclosing = new ArrayList<>();
        for (ASTNode node: enclosing) {
            if (node instanceof WhileStmt || node instanceof ForStmt)
                break;
            if (node instanceof TIRStatementList)
                nonLoopEnclosing.add((TIRStatementList) node);
        }

        return nonLoopEnclosing;
    }

    /**
     * Given a list of lists of enclosing nodes, find the inner-most common node.
     * @param enclosingNodesList
     * @return
     */
    private static TIRStatementList findInnermostCommonNode(java.util.List<java.util.List<TIRStatementList>> enclosingNodesList) {
        if (enclosingNodesList.isEmpty())
            return null;

        int minimalLength = Integer.MAX_VALUE;
        for (java.util.List list: enclosingNodesList) {
            minimalLength = Math.min(minimalLength, list.size());
        }

        TIRStatementList common = null;
        for (int i = 0; i < minimalLength; ++i) {
            boolean allEqual = true;
            for (int j = 1; j < enclosingNodesList.size(); ++j) {
                TIRStatementList node1 = enclosingNodesList.get(j).get(i);
                TIRStatementList node2 = enclosingNodesList.get(j-1).get(i);
                allEqual = allEqual && node1.equals(node2);
            }

            if (allEqual)
                common = enclosingNodesList.get(0).get(i);
            else
                break;
        }
        return common;
    }

    /**
     * TIR visitor that returns for a given function and a given parameter name the set of
     * all statements where that array is written to.
     */
    private static class WriteStatementFinder extends TIRAbstractNodeCaseHandler {
        public Set<TIRArraySetStmt> writeStatements = new HashSet<>();
        private String paramName;

        public WriteStatementFinder(String paramName) {
            this.paramName = paramName;
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
            if (stmt.getArrayName().getVarName().equals(paramName))
                writeStatements.add(stmt);
        }
    }
}
