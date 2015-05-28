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

import java.util.Collections;
import java.util.Set;
import java.util.HashSet;

import matjuice.jsast.*;


public class JSAddVarDeclsVisitor implements JSVisitor<Set<String>> {
    public static void apply(Function f) {
        Set<String> vars = f.accept(new JSAddVarDeclsVisitor());
        StmtBlock sb = f.getStmtBlock();
        List<Stmt> stmts = sb.getStmtList();
        for (String var: vars) {
            stmts.insertChild(new StmtVarDecl(var, new Opt<>()), 0);
        }
    }

    @Override
    public Set<String> visitProgram(Program program) {
        return null;
    }

    @Override
    public Set<String> visitFunction(Function function) {
        Set<String> params = new HashSet<>();
        for (Parameter param: function.getParamList()) {
            params.add(param.getName());
        }

        Set<String> locals = function.getStmtBlock().accept(this);
        locals.removeAll(params);
        return locals;
    }

    @Override
    public Set<String> visitStmtBlock(StmtBlock stmt) {
        Set<String> locals = new HashSet<>();
        for (Stmt child: stmt.getStmtList()) {
            locals.addAll(child.accept(this));
        }
        return locals;
    }

    @Override
    public Set<String> visitStmtExpr(StmtExpr stmt) {
        return stmt.getExpr().accept(this);
    }

    @Override
    public Set<String> visitStmtReturn(StmtReturn stmt) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitStmtIfThenElse(StmtIfThenElse stmt) {
        Set<String> locals = new HashSet<>();
        locals.addAll(stmt.getCond().accept(this));
        locals.addAll(stmt.getThen().accept(this));
        locals.addAll(stmt.getElse().accept(this));
        return locals;
    }

    @Override
    public Set<String> visitStmtWhile(StmtWhile stmt) {
        Set<String> locals = new HashSet<>();
        locals.addAll(stmt.getCond().accept(this));
        locals.addAll(stmt.getBody().accept(this));
        return locals;
    }

    @Override
    public Set<String> visitStmtFor(StmtFor stmt) {
        Set<String> locals = new HashSet<>();
        locals.addAll(stmt.getInit().accept(this));
        locals.addAll(stmt.getTest().accept(this));
        locals.addAll(stmt.getUpdate().accept(this));
        locals.addAll(stmt.getBody().accept(this));
        return locals;
    }

    @Override
    public Set<String> visitStmtBreak(StmtBreak stmt) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitStmtContinue(StmtContinue stmt) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitStmtEmpty(StmtEmpty stmt) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitStmtComment(StmtComment stmt) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitStmtVarDecl(StmtVarDecl stmt) {
        if (stmt.hasInit())
            return stmt.getInit().accept(this);
        else
            return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprInt(ExprInt expr) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprFloat(ExprFloat expr) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprString(ExprString expr) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprBoolean(ExprBoolean expr) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprArray(ExprArray expr) {
        Set<String> acc = Collections.emptySet();
        for (Expr subexpr: expr.getExprList())
            acc.addAll(subexpr.accept(this));
        return acc;
    }

    @Override
    public Set<String> visitExprCall(ExprCall expr) {
        Set<String> acc = new HashSet<>();
        acc.addAll(expr.getExpr().accept(this));
        for (Expr arg: expr.getArgumentList())
            acc.addAll(arg.accept(this));
        return acc;
    }

    @Override
    public Set<String> visitExprAssign(ExprAssign expr) {
        Set<String> lhs = new HashSet<>();
        if (expr.getLHS() instanceof ExprId) {
            lhs.add(((ExprId) expr.getLHS()).getName());
        }
        else {
            lhs = expr.getLHS().accept(this);
        }
        Set<String> rhs = expr.getRHS().accept(this);
        lhs.addAll(rhs);
        return lhs;
    }

    @Override
    public Set<String> visitExprUnaryOp(ExprUnaryOp expr) {
        return expr.getExpr().accept(this);
    }

    @Override
    public Set<String> visitExprBinaryOp(ExprBinaryOp expr) {
        Set<String> acc = new HashSet<>();
        acc.addAll(expr.getLHS().accept(this));
        acc.addAll(expr.getRHS().accept(this));
        return acc;
    }

    @Override
    public Set<String> visitExprId(ExprId expr) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprPropertyGet(ExprPropertyGet expr) {
        Set<String> acc = new HashSet<>();
        acc.addAll(expr.getExpr().accept(this));
        acc.addAll(expr.getProperty().accept(this));
        return acc;
    }

    @Override
    public Set<String> visitExprColon(ExprColon expr) {
        return Collections.emptySet();
    }

    @Override
    public Set<String> visitExprTernary(ExprTernary expr) {
        Set<String> acc = new HashSet<>();
        acc.addAll(expr.getExpr().accept(this));
        acc.addAll(expr.getThenExpr().accept(this));
        acc.addAll(expr.getElseExpr().accept(this));
        return acc;
    }


}
