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

import java.util.HashSet;
import java.util.Set;

public class LocalVars {
    public static Set<String> apply(TIRFunction f) {
        Finder finder = new Finder();
        f.analyze(finder);

        Set<String> params = new HashSet<>();
        for (int i = 0; i < f.getNumInputParam(); ++i) {
            params.add(f.getInputParam(i).getID());
        }

        Set<String> locals = finder.locals;
        locals.removeAll(params);
        locals.removeAll(finder.globals);
        return locals;
    }

    private static class Finder extends TIRAbstractNodeCaseHandler {
        public Set<String> globals = new HashSet<>();
        public Set<String> locals = new HashSet<>();

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
        public void caseTIRGlobalStmt(TIRGlobalStmt stmt) {
            for (Name name : stmt.getNameList())
                globals.add(name.getID());
        }

        @Override
        public void caseTIRAbstractAssignStmt(TIRAbstractAssignStmt stmt) {
            for (String lhsName: stmt.getLValues())
                locals.add(lhsName);
        }

        @Override
        public void caseTIRForStmt(TIRForStmt stmt) {
            locals.add(stmt.getLoopVarName().getID());
        }
    }
}
