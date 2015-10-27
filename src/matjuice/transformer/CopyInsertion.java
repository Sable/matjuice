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
import java.util.Map;
import java.util.Map.Entry;

public class CopyInsertion {
    public static boolean apply(TIRFunction func, PointsToAnalysis pta) {
        CopyInserter ci = new CopyInserter(pta);
        func.tirAnalyze(ci);
        return ci.addedCopy;
    }

    private static class CopyInserter extends TIRAbstractNodeCaseHandler {
        public boolean addedCopy = false;
        private PointsToAnalysis pta;

        public CopyInserter(PointsToAnalysis pta) {
            this.pta = pta;
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
            // Only add one copy per iteration.
            if (addedCopy) {
                return;
            }

            String arrayName = setStmt.getArrayName().getID();
            Map<String, PointsToValue> outSet = pta.getOutFlowSets().get(setStmt);
            PointsToValue stmtPtv = outSet.get(arrayName);

            // Iterate over the outset to find possible aliasing.
            for (Entry<String, PointsToValue> entry: outSet.entrySet()) {
                String varName = entry.getKey();
                PointsToValue ptv = entry.getValue();

                // Don't compare against youself
                if (arrayName.equals(varName))
                    continue;

                Set<MallocSite> commonMallocs = stmtPtv.commonMallocSites(ptv);
                if (!commonMallocs.isEmpty()) {
                    for (MallocSite m: commonMallocs) {
                        Set<TIRStmt> aliasingStmts = stmtPtv.getAliasingStmts(m);
                        for (TIRStmt stmt: aliasingStmts) {
                            Ast.addRightSibling((TIRCopyStmt) stmt, Ast.makeCopyStmt(arrayName));
                        }

                        // Early return
                        addedCopy = true;
                        return;
                    }
                }
            }
        }
    }
}
