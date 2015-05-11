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

import matjuice.jsast.*;

public interface JSVisitor<T> {
    public T visitProgram(Program program);
    public T visitFunction(Function function);

    public T visitStmtBlock(StmtBlock stmt);
    public T visitStmtBlockNoBraces(StmtBlockNoBraces stmt);
    public T visitStmtExpr(StmtExpr stmt);
    public T visitStmtNull(StmtNull stmt);
    public T visitStmtReturn(StmtReturn stmt);
    public T visitStmtIfThenElse(StmtIfThenElse stmt);
    public T visitStmtWhile(StmtWhile stmt);
    public T visitStmtFor(StmtFor stmt);
    public T visitStmtGlobalDecl(StmtGlobalDecl stmt);
    public T visitStmtBreak(StmtBreak stmt);
    public T visitStmtContinue(StmtContinue stmt);
    public T visitStmtEmpty(StmtEmpty stmt);
    public T visitStmtComment(StmtComment stmt);
    public T visitStmtVarDecl(StmtVarDecl stmt);

    public T visitExprInt(ExprInt expr);
    public T visitExprNum(ExprNum expr);
    public T visitExprString(ExprString expr);
    public T visitExprBoolean(ExprBoolean expr);
    public T visitExprArray(ExprArray expr);
    public T visitExprCall(ExprCall expr);
    public T visitExprLambda(ExprLambda expr);
    public T visitExprAssign(ExprAssign expr);
    public T visitExprUnaryOp(ExprUnaryOp expr);
    public T visitExprBinaryOp(ExprBinaryOp expr);
    public T visitExprVar(ExprVar expr);
    public T visitExprPropertyGet(ExprPropertyGet expr);
    public T visitExprColon(ExprColon expr);
}
