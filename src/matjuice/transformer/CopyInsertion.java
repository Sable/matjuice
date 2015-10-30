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

package matjuice.transformer;

import matjuice.analysis.PointsToAnalysis;
import matjuice.analysis.PointsToValue;
import matjuice.analysis.MallocSite;
import matjuice.utils.Ast;

import natlab.tame.tir.*;
import natlab.tame.tir.analysis.*;
import ast.*;

import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;

public class CopyInsertion {
    public static boolean apply(TIRFunction func, PointsToAnalysis pta) {
        CopyInserter ci = new CopyInserter(func, pta);
        func.tirAnalyze(ci);
        return ci.addedCopy;
    }

    private static class CopyInserter extends TIRAbstractNodeCaseHandler {
        public boolean addedCopy = false;
        private Set<String> outParams = new HashSet<>();
        private PointsToAnalysis pta;

        public CopyInserter(TIRFunction tirFunction, PointsToAnalysis pta) {
            this.pta = pta;
            for (Name outParamName: tirFunction.getOutputParams())
                this.outParams.add(outParamName.getID());
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
        public void caseTIRArraySetStmt(TIRArraySetStmt setStmt) {
            String arrayName = setStmt.getArrayName().getID();
            insertCopy(arrayName, setStmt);
        }

        @Override
        public void caseTIRReturnStmt(TIRReturnStmt retStmt) {
            for (String outParam: outParams) {
                insertCopy(outParam, retStmt);
            }
        }

        private void insertCopy(String variable, TIRStmt stmt) {
            // Only add one copy per iteration.
            if (addedCopy) {
                return;
            }
            Map<String, PointsToValue> inSet = pta.getInFlowSets().get(stmt);
            PointsToValue stmtPtv = inSet.get(variable);

            // Iterate over the inset to find possible aliasing.
            for (Entry<String, PointsToValue> entry: inSet.entrySet()) {
                String varName = entry.getKey();
                PointsToValue ptv = entry.getValue();

                // Don't compare against youself
                if (variable.equals(varName))
                    continue;

                Set<MallocSite> commonMallocs = stmtPtv.commonMallocSites(ptv);
                for (MallocSite m: commonMallocs) {
                    Set<TIRCopyStmt> aliasingStmts = stmtPtv.getAliasingStmts(m);
                    for (TIRCopyStmt copyStmt: aliasingStmts) {
                        Ast.addRightSibling(copyStmt, Ast.makeCopyStmt(variable));
                    }

                    // Early return
                    addedCopy = true;
                    return;
                }
            }
        }
    }
}
