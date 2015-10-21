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

import natlab.tame.tir.*;
import natlab.tame.tir.analysis.*;
import ast.Name;
import ast.ASTNode;

import java.util.Set;
import java.util.Map;

public class ParameterCopyTransformer {
    public static void apply(TIRFunction originalFunction,
                             Map<TIRStatementList, Set<String>> writtenParams) {
        AddCopyStmtVisitor visitor = new AddCopyStmtVisitor(writtenParams);
        originalFunction.analyze(visitor);
    }

    private static class AddCopyStmtVisitor extends TIRAbstractNodeCaseHandler {
        private Map<TIRStatementList, Set<String>> writtenParams;

        public AddCopyStmtVisitor(Map<TIRStatementList, Set<String>> writtenParams) {
            this.writtenParams = writtenParams;
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
        public void caseTIRStatementList(TIRStatementList stmts) {
            if (writtenParams.containsKey(stmts)) {
                for (String paramName: writtenParams.get(stmts)) {
                    stmts.insertChild(new MJCopyStmt(new Name(paramName)), 0);
                }
            }
            caseASTNode(stmts);
        }
    }
}
