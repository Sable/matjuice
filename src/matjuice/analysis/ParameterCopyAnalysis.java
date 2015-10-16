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

package matjuice.analysis;

import ast.*;
import natlab.tame.tir.*;
import natlab.tame.tir.analysis.TIRAbstractNodeCaseHandler;

import natlab.toolkits.analysis.core.Def;
import natlab.toolkits.analysis.core.ReachingDefs;
import natlab.toolkits.analysis.core.UseDefDefUseChain;

import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;


public class ParameterCopyAnalysis {
    public static Map<TIRStatementList, Set<String>> apply(TIRFunction f) {
        // Get a UseDef-DefUse chain that will be used to know if a
        // use refers to a formal parameter.
        ReachingDefs rdefs = new ReachingDefs(f);
        rdefs.analyze();
        UseDefDefUseChain uddu = UseDefDefUseChain.fromReachingDefs(rdefs);

        // A map between a block and the set of variables that need to
        // be copied at the beginning of that block.
        Map<TIRStatementList, Set<String>> paramWrites = new HashMap<>();

        for (ast.Name paramName : f.getInputParamList()) {
            Set<TIRArraySetStmt> writeStmts = findWriteStatements(f, paramName, uddu);

            // A parameter that is never written to requires no copy and thus will
            // not be returned in the set of need-to-copy parameters.
            if (writeStmts.isEmpty())
                continue;

            java.util.List<java.util.List<TIRStatementList>> enclosingBlocksList = new ArrayList<>();
            for (TIRArraySetStmt stmt: writeStmts) {
                enclosingBlocksList.add(findEnclosingBlocks(stmt));
            }

            TIRStatementList commonBlock = findInnermostCommonBlock(enclosingBlocksList);
            Set<String> paramSet = paramWrites.getOrDefault(commonBlock, new HashSet<>());
            paramSet.add(paramName.getID());
            paramWrites.put(commonBlock, paramSet);
        }
        return paramWrites;
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
        // list and keep only the statement lists up to the first loop statement.
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
    private static TIRStatementList findInnermostCommonBlock(java.util.List<java.util.List<TIRStatementList>> enclosingNodesList) {
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
     * Given a Tamer function and the name of a formal parameter, return the set of
     * all array write statements to that parameter.
     * @param tf A TIRFunction
     * @param paramName The name of the formal parameter
     * @param uddu The UseDef-DefUse analysis result
     * @return A set of the TIRArraySetStmt objects that write to the parameter
     */
    private static Set<TIRArraySetStmt> findWriteStatements(TIRFunction f, ast.Name param, UseDefDefUseChain uddu) {
        WriteStatementFinder wsf = new WriteStatementFinder(param, uddu);
        f.tirAnalyze(wsf);
        return wsf.writeStatements;
    }

    /**
     * TIR visitor that returns for a given function and a given parameter name the set of
     * all statements where that array is written to.
     */
    private static class WriteStatementFinder extends TIRAbstractNodeCaseHandler {
        public Set<TIRArraySetStmt> writeStatements = new HashSet<>();
        private ast.Name paramName;
        private UseDefDefUseChain uddu;

        public WriteStatementFinder(ast.Name paramName, UseDefDefUseChain uddu) {
            this.paramName = paramName;
            this.uddu = uddu;
        }

        @Override
        public void caseASTNode(ASTNode astNode) {
            for (int i = 0; i < astNode.getNumChild(); i++) {
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
            if (uddu.getUses(paramName).contains(stmt.getArrayName())) {
                writeStatements.add(stmt);
            }
        }
    }

}
