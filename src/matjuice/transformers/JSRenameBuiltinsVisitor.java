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

import java.util.ArrayList;
import java.util.Arrays;

import natlab.tame.builtin.Builtin;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import matjuice.jsast.*;
import matjuice.utils.JsAstUtils;


@SuppressWarnings("rawtypes")
public class JSRenameBuiltinsVisitor implements JSVisitor<ASTNode> {
    /*
     * Array of builtins that we should add a type suffix to. Mostly variadic
     * functions.
     */
    private static String[] SPECIALIZED = { "plus", "minus", "mtimes", "rem",
            "mod", "mrdivide", "lt", "le", "gt", "ge", "eq", "ne", "length",
            "sin", "uminus", "exp", "rdivide", "round", "sqrt", "mpower", };

    static {
        // The specialized functions are ordered so that we can run a binary
        // search over them.
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));
    }

    private IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;
    private List<Expr> callArgs = null;


    public JSRenameBuiltinsVisitor(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis) {
        this.analysis = func_analysis;
    }

    public static Function apply(Function f, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis) {
        JSRenameBuiltinsVisitor renamer = new JSRenameBuiltinsVisitor(func_analysis);
        Function new_f = (Function) f.accept(renamer);
        return new_f;
    }


    @Override
    public ASTNode visitProgram(Program program) {
        return null;
    }

    @Override
    public ASTNode visitFunction(Function function) {
        return new Function(
                function.getFunctionNameOpt(),
                function.getParamList(),
                (StmtBlock) function.getStmtBlock().accept(this)
                );
    }

    @Override
    public ASTNode visitStmtBlock(StmtBlock stmt) {
        List<Stmt> new_stmts = new List<>();
        for (Stmt child: stmt.getStmtList())
            new_stmts.add((Stmt) child.accept(this));
        return new StmtBlock(stmt.getBraces(), new_stmts);
    }

    @Override
    public ASTNode visitStmtExpr(StmtExpr stmt) {
        return new StmtExpr((Expr) stmt.getExpr().accept(this));
    }

    @Override
    public ASTNode visitStmtReturn(StmtReturn stmt) {
        if (stmt.hasExpr()) {
            return new StmtReturn(new Opt<Expr>((Expr) stmt.getExpr().accept(this)));
        }
        else {
            return new StmtReturn();
        }
    }

    @Override
    public ASTNode visitStmtIfThenElse(StmtIfThenElse stmt) {
        StmtIfThenElse new_stmt = new StmtIfThenElse();
        new_stmt.setCond((Expr) stmt.getCond().accept(this));
        new_stmt.setThen((StmtBlock) stmt.getThen().accept(this));
        new_stmt.setElse((StmtBlock) stmt.getElse().accept(this));
        return new_stmt;
    }

    @Override
    public ASTNode visitStmtWhile(StmtWhile stmt) {
        return new StmtWhile(
                (Expr) stmt.getCond().accept(this),
                (StmtBlock) stmt.getBody().accept(this)
                );
    }

    @Override
    public ASTNode visitStmtFor(StmtFor stmt) {
        return new StmtFor(
                (Expr) stmt.getInit().accept(this),
                (Expr) stmt.getTest().accept(this),
                (Expr) stmt.getUpdate().accept(this),
                (StmtBlock) stmt.getBody().accept(this)
                );
    }

    @Override
    public ASTNode visitStmtBreak(StmtBreak stmt) {
        return stmt;
    }

    @Override
    public ASTNode visitStmtContinue(StmtContinue stmt) {
        return stmt;
    }

    @Override
    public ASTNode visitStmtEmpty(StmtEmpty stmt) {
        return stmt;
    }

    @Override
    public ASTNode visitStmtComment(StmtComment stmt) {
        return stmt;
    }

    @Override
    public ASTNode visitStmtVarDecl(StmtVarDecl stmt) {
        StmtVarDecl new_stmt = new StmtVarDecl();
        new_stmt.setId(stmt.getId());
        if (stmt.hasInit()) {
            new_stmt.setInit((Expr) stmt.getInit().accept(this));
        }
        return new_stmt;
    }

    @Override
    public ASTNode visitExprInt(ExprInt expr) {
        return expr;
    }

    @Override
    public ASTNode visitExprFloat(ExprFloat expr) {
        return expr;
    }

    @Override
    public ASTNode visitExprString(ExprString expr) {
        return expr;
    }

    @Override
    public ASTNode visitExprBoolean(ExprBoolean expr) {
        return expr;
    }

    @Override
    public ASTNode visitExprArray(ExprArray expr) {
        return expr;
    }

    @Override
    public ASTNode visitExprCall(ExprCall expr) {
        callArgs = expr.getArgumentList();
        ASTNode new_name = expr.getExpr().accept(this);
        callArgs = null;

        // If the variable was the name of an operator, return the new node
        if (new_name instanceof ExprCall) {
            return new_name;
        }

        ExprCall new_expr = new ExprCall();
        new_expr.setExpr((Expr) new_name);
        for (Expr arg: expr.getArgumentList())
            new_expr.addArgument((Expr) arg.accept(this));
        return new_expr;
    }

    @Override
    public ASTNode visitExprAssign(ExprAssign expr) {
        return new ExprAssign(
                (Expr) expr.getLHS().accept(this),
                (Expr) expr.getRHS().accept(this)
                );
    }

    @Override
    public ASTNode visitExprUnaryOp(ExprUnaryOp expr) {
        return new ExprUnaryOp(
                expr.getOp(),
                (Expr) expr.getExpr().accept(this)
                );
    }

    @Override
    public ASTNode visitExprBinaryOp(ExprBinaryOp expr) {
        return new ExprBinaryOp(
                expr.getOp(),
                (Expr) expr.getLHS().accept(this),
                (Expr) expr.getRHS().accept(this)
                );
    }

    @Override
    public ASTNode visitExprId(ExprId expr) {
        if (callArgs == null) return expr;

        Expr new_expr = expr;
        if (Builtin.getInstance(expr.getName()) != null) {
            // Keep in a list which arguments are scalar and which aren't.
            ArrayList<Boolean> scalar_arguments = new ArrayList<>();
            for (Expr e : callArgs) {
                ExprId arg = (ExprId) e;
                Stmt enclosingStmt = JsAstUtils.getEnclosingStmt(e);
                BasicMatrixValue bmv = JsAstUtils.getBasicMatrixValue(analysis, enclosingStmt, arg.getName());
                scalar_arguments.add(bmv.getShape().isScalar());
            }

            String suffix = "";
            if (Arrays.binarySearch(SPECIALIZED, expr.getName(), (s, t) -> s.compareTo(t)) >= 0) {
                for (boolean isScalar : scalar_arguments) {
                    suffix += isScalar ? "S" : "M";
                }
            }
            new_expr = new ExprCall(
                    new ExprId("mc_" + expr.getName() + (suffix.equals("") ? "" : "_" + suffix)),
                    callArgs
                    );
        }
        return new_expr;
    }

    @Override
    public ASTNode visitExprPropertyGet(ExprPropertyGet expr) {
        return new ExprPropertyGet(
                (Expr) expr.getExpr().accept(this),
                (Expr) expr.getProperty().accept(this)
                );
    }

    @Override
    public ASTNode visitExprColon(ExprColon expr) {
        return expr;
    }

    @Override
    public ASTNode visitExprTernary(ExprTernary expr) {
        return new ExprTernary(
                (Expr) expr.getExpr().accept(this),
                (Expr) expr.getThenExpr().accept(this),
                (Expr) expr.getElseExpr().accept(this)
                );
    }
}
