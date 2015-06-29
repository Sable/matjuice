package matjuice.transformers;

import java.util.ArrayList;
import java.util.HashMap;

import natlab.tame.builtin.Builtin;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import matjuice.jsast.*;
import matjuice.pretty.Pretty;
import matjuice.utils.JsAstUtils;

@SuppressWarnings("rawtypes")
public class JSRenameOperatorsVisitor implements JSVisitor<ASTNode> {
    private static HashMap<String, String> binary_ops = new HashMap<>();
    private static HashMap<String, String> unary_ops = new HashMap<>();

    static {
        binary_ops.put("plus", "+");
        binary_ops.put("minus", "-");
        binary_ops.put("times", "*");
        binary_ops.put("mtimes", "*");
        binary_ops.put("mrdivide", "/");
        binary_ops.put("rdivide", "/");
        binary_ops.put("le", "<=");
        binary_ops.put("lt", "<");
        binary_ops.put("ge", ">=");
        binary_ops.put("gt", ">");
        binary_ops.put("eq", "===");
        binary_ops.put("ne", "!==");

        unary_ops.put("uminus", "-");
    }

    private IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;
    private List<Expr> callArgs = null;


    public JSRenameOperatorsVisitor(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis) {
        this.analysis = func_analysis;
    }

    public static Function apply(Function f, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis) {
        JSRenameOperatorsVisitor renamer = new JSRenameOperatorsVisitor(func_analysis);
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
        StmtBlock newBlock = new StmtBlock();
        newBlock.setBraces(stmt.getBraces());
        for (Stmt child: stmt.getStmtList()) {
            Stmt newChild = (Stmt) child.accept(this);
            newChild.copyTIRStmtFrom(child);
            newBlock.addStmt(newChild);
        }
        return newBlock.copyTIRStmtFrom(stmt);
    }


    @Override
    public ASTNode visitStmtExpr(StmtExpr stmt) {
        StmtExpr newStmt = new StmtExpr((Expr) stmt.getExpr().accept(this));
        return newStmt;
    }

    @Override
    public ASTNode visitStmtReturn(StmtReturn stmt) {
        if (stmt.hasExpr()) {
            Expr expr = (Expr) stmt.getExpr().accept(this);
            StmtReturn newStmt = new StmtReturn(new Opt<Expr>(expr));
            return newStmt;
        }
        return stmt;
    }

    @Override
    public ASTNode visitStmtIfThenElse(StmtIfThenElse stmt) {
        Expr new_cond = (Expr) stmt.getCond().accept(this);
        StmtBlock new_then = (StmtBlock) stmt.getThen().accept(this);
        StmtBlock new_else = (StmtBlock) stmt.getElse().accept(this);
        StmtIfThenElse newStmt = new StmtIfThenElse(new_cond, new_then, new_else);
        return newStmt;
    }

    @Override
    public ASTNode visitStmtWhile(StmtWhile stmt) {
        StmtWhile newStmt = new StmtWhile(
                (Expr) stmt.getCond().accept(this),
                (StmtBlock) stmt.getBody().accept(this)
                );
        return newStmt;
    }

    @Override
    public ASTNode visitStmtFor(StmtFor stmt) {
        StmtFor newStmt = new StmtFor(
                (Expr) stmt.getInit().accept(this),
                (Expr) stmt.getTest().accept(this),
                (Expr) stmt.getUpdate().accept(this),
                (StmtBlock) stmt.getBody().accept(this)
                );
        return newStmt;
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
        if (stmt.hasInit()) {
            StmtVarDecl newStmt = new StmtVarDecl(
                    stmt.getId(),
                    new Opt<>((Expr) stmt.getInit().accept(this))
                    );
            return newStmt;
        }
        return stmt;
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
        ASTNode new_expr = expr.getExpr().accept(this);
        callArgs = null;

        if (new_expr instanceof ExprBinaryOp || new_expr instanceof ExprUnaryOp) {
            return new_expr;
        }

        ExprCall new_call = new ExprCall();
        new_call.setExpr((Expr) new_expr);
        for (Expr arg: expr.getArgumentList()) {
            new_call.addArgument((Expr) arg.accept(this));
        }
        return new_call;
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

        if (Builtin.getInstance(expr.getName()) != null) {
            // Keep in a list which arguments are scalar and which
            // aren't.
            ArrayList<Boolean> scalar_arguments = new ArrayList<>();
            for (Expr e : callArgs) {
                ExprId arg = (ExprId) e;
                Stmt enclosingStmt = JsAstUtils.getEnclosingStmt(e);
                BasicMatrixValue bmv = JsAstUtils.getBasicMatrixValue(analysis, enclosingStmt, arg.getName());
                scalar_arguments.add(bmv.getShape().isScalar());
            }

            if (binary_ops.containsKey(expr.getName())
                    && scalar_arguments.size() == 2
                    && scalar_arguments.get(0)
                    && scalar_arguments.get(1)) {
                return new ExprBinaryOp(
                        binary_ops.get(expr.getName()),
                        callArgs.getChild(0),
                        callArgs.getChild(1)
                        );
            }
            else if (unary_ops.containsKey(expr.getName())
                    && scalar_arguments.size() == 1
                    && scalar_arguments.get(0)) {
                return new ExprUnaryOp(
                        unary_ops.get(expr.getName()),
                        callArgs.getChild(0)
                        );
            }
        }
        return expr;
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
