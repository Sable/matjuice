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
import matjuice.analysis.PointsToMap;
import matjuice.analysis.PointsToValue;
import matjuice.analysis.MallocSite;
import matjuice.utils.Ast;

import natlab.tame.tir.*;
import natlab.tame.tir.analysis.*;
import ast.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;
import java.util.stream.Collectors;


public class CopyInsertion {
    public static boolean apply(TIRFunction func, PointsToAnalysis pta) {
        CopyInserter ci = new CopyInserter(func, pta);
        func.tirAnalyze(ci);
        return ci.addedCopy;
    }

    private static class CopyInserter extends TIRAbstractNodeCaseHandler {
        public boolean addedCopy = false;
        private List<String> outParams = new ArrayList<>();
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
            // Only "un-alias" one variable per transformation.
            if (addedCopy)
                return;

            PointsToMap inSet = pta.getInFlowSets().get(setStmt);
            String arrayName = setStmt.getArrayName().getID();
            PointsToValue ptv1 = inSet.get(arrayName);

            for (String otherVar: inSet.keySet()) {
                if (otherVar.equals(arrayName))
                    continue;

                PointsToValue ptv2 = inSet.get(otherVar);
                Set<MallocSite> common = ptv1.commonMallocSites(ptv2);
                for (MallocSite m: common) {
                    for (TIRCopyStmt aliasingStmt: ptv1.getAliasingStmts(m)) {
                        Ast.addRightSibling(aliasingStmt, Ast.makeCopyStmt(arrayName));
                    }
                    addedCopy = true;
                    return;
                }
            }
        }

        @Override
        public void caseTIRReturnStmt(TIRReturnStmt retStmt) {
            // Only "un-alias" one variable per transformation.
            if (addedCopy)
                return;

            PointsToMap inSet = pta.getInFlowSets().get(retStmt);

            // Add copies for output parameters that may point to
            // externally allocated memory.
            for (String outParam: this.outParams) {
                PointsToValue ptv = inSet.get(outParam);

                Set<MallocSite> externalAliases = ptv
                  .getMallocSites()
                  .stream()
                  .filter(m -> m.isExternal())
                  .collect(Collectors.toCollection(HashSet::new));
                if (!externalAliases.isEmpty()) {
                    for (MallocSite m: externalAliases) {
                        for (TIRCopyStmt aliasingStmt: ptv.getAliasingStmts(m)) {
                            Ast.addRightSibling(aliasingStmt, Ast.makeCopyStmt(outParam));
                        }
                        addedCopy = true;
                        return;
                    }
                }
            }

            // Add copies for output parameters that may point to
            // memory sites of other output parameters.
            for (int i = 0; i < outParams.size(); ++i) {
                for (int j = i+1; j < outParams.size(); ++j) {
                    PointsToValue ptv1 = inSet.get(outParams.get(i));
                    PointsToValue ptv2 = inSet.get(outParams.get(j));
                    Set<MallocSite> common = ptv1.commonMallocSites(ptv2);
                    for (MallocSite m: common) {
                        for (TIRCopyStmt aliasingStmt: ptv1.getAliasingStmts(m)) {
                            Ast.addRightSibling(aliasingStmt, Ast.makeCopyStmt(outParams.get(i)));
                        }
                        addedCopy = true;
                        return;
                    }
                }
            }
        }
    }
}
