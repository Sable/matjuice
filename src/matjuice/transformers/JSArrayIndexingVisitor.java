package matjuice.transformers;

import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import natlab.toolkits.rewrite.TempFactory;
import matjuice.jsast.*;
import matjuice.utils.JsAstUtils;

enum GetOrSet {
    Get,
    Set
}

@SuppressWarnings("rawtypes")
public class JSArrayIndexingVisitor implements JSVisitor<ASTNode> {
    private IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;
    private boolean boundsCheck;


    public JSArrayIndexingVisitor(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis, boolean boundsCheck) {
        this.analysis = func_analysis;
        this.boundsCheck = boundsCheck;
    }

    public static Function apply(Function f, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> func_analysis, boolean boundsCheck) {
        JSArrayIndexingVisitor renamer = new JSArrayIndexingVisitor(func_analysis, boundsCheck);
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
        StmtBlock new_block = new StmtBlock();
        new_block.setBraces(stmt.getBraces());
        for (Stmt child: stmt.getStmtList())
            new_block.addStmt((Stmt) child.accept(this));
        return new_block.copyTIRStmtFrom(stmt);
    }

    @Override
    public ASTNode visitStmtExpr(StmtExpr stmt) {
        ASTNode newExpr = stmt.getExpr().accept(this);

        if (newExpr instanceof Stmt) {
            return ((Stmt) newExpr).copyTIRStmtFrom(stmt);
        }
        else {
            StmtExpr newStmt = new StmtExpr((Expr) newExpr);
            return newStmt.copyTIRStmtFrom(stmt);
        }
    }

    @Override
    public ASTNode visitStmtReturn(StmtReturn stmt) {
        Opt<Expr> newExpr;
        if (stmt.hasExpr())
            newExpr = new Opt<Expr>((Expr) stmt.getExpr().accept(this));
        else
            newExpr = new Opt<Expr>();
        StmtReturn newStmt = new StmtReturn(newExpr);
        return newStmt.copyTIRStmtFrom(stmt);
    }

    @Override
    public ASTNode visitStmtIfThenElse(StmtIfThenElse stmt) {
        StmtIfThenElse newStmt = new StmtIfThenElse(
                (Expr) stmt.getCond().accept(this),
                (StmtBlock) stmt.getThen().accept(this),
                (StmtBlock) stmt.getElse().accept(this)
                );
        return newStmt.copyTIRStmtFrom(stmt);
    }

    @Override
    public ASTNode visitStmtWhile(StmtWhile stmt) {
        StmtWhile newStmt = new StmtWhile(
                (Expr) stmt.getCond().accept(this),
                (StmtBlock) stmt.getBody().accept(this)
                );
        return newStmt.copyTIRStmtFrom(stmt);
    }

    @Override
    public ASTNode visitStmtFor(StmtFor stmt) {
        StmtFor newStmt = new StmtFor(
                (Expr) stmt.getInit().accept(this),
                (Expr) stmt.getTest().accept(this),
                (Expr) stmt.getUpdate().accept(this),
                (StmtBlock) stmt.getBody().accept(this)
                );
        return newStmt.copyTIRStmtFrom(stmt);
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
        StmtVarDecl newStmt = new StmtVarDecl(
                stmt.getId(),
                stmt.hasInit()
                    ? new Opt<Expr>((Expr) stmt.getInit().accept(this))
                    : new Opt<Expr>()
                );
        return newStmt.copyTIRStmtFrom(stmt);
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
        ExprArray new_array = new ExprArray();
        for (Expr child: expr.getExprList())
            new_array.addExpr((Expr) child.accept(this));
        return new_array;
    }

    @Override
    public ASTNode visitExprCall(ExprCall expr) {
        // Specialize mc_array_get and mc_array_set
        if (expr.getExpr() instanceof ExprId) {
            switch (((ExprId) expr.getExpr()).getName()) {
            case "mc_array_get": return replaceArrayGetCall(expr.getArgumentList());
            case "mc_array_set": return replaceArraySetCall(expr.getArgumentList());
            }
        }

        List<Expr> new_args = new List<Expr>();
        for (Expr arg: expr.getArgumentList())
            new_args.add((Expr) arg.accept(this));
        return new ExprCall(
                (Expr) expr.getExpr().accept(this),
                new_args
                );
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


    private Expr replaceArrayGetCall(List<Expr> args) {
        Expr array = args.getChild(0);
        List<Expr> indices = ((ExprArray) args.getChild(1)).getExprList();

        if (containsSlice(indices)) {
            return generateArraySlice(array, indices, GetOrSet.Get);
        }

        // All the indices are scalar.
        ExprPropertyGet array_index_expr = new ExprPropertyGet();
        array_index_expr.setExpr(array);
        Expr indexing_expr = generateIndexingExpression(array, indices);
        array_index_expr.setProperty(boundsChecked(array, indexing_expr));
        return array_index_expr;
    }

    private Stmt replaceArraySetCall(List<Expr> args) {
        Expr array = args.getChild(0);
        List<Expr> indices = ((ExprArray) args.getChild(1)).getExprList();
        Expr new_value = args.getChild(2);

        if (containsSlice(indices)) {
            return new StmtExpr(generateArraySlice(array, indices, GetOrSet.Set));
        }

        // All the indices are scalar.
        Expr indexing_expr = generateIndexingExpression(array, indices);
        StmtBlock block = new StmtBlock();
        block.setBraces(false);

        ExprId temp = new ExprId(TempFactory.genFreshTempString());

        block.addStmt(new StmtExpr(new ExprAssign(temp, indexing_expr)));
        if (boundsCheck) {
            block.addStmt(new StmtIfThenElse(
                    new ExprBinaryOp("<", temp, new ExprInt(0)),
                    new StmtBlock(true, new List<Stmt>(new StmtExpr(new ExprCall(new ExprId("mc_error"), new List<Expr>())))),
                    new StmtBlock()));
            block.addStmt(new StmtIfThenElse(
                    new ExprBinaryOp(">=", temp, new ExprCall(new ExprPropertyGet(array, new ExprString("mj_numel")), new List<Expr>())),
                    new StmtBlock(true, new List<Stmt>(new StmtExpr(
                            new ExprAssign(array, new ExprCall(new ExprId("mc_resize"), new List<Expr>(array, temp)))))),
                            new StmtBlock()));
        }
        block.addStmt(new StmtExpr(new ExprAssign(new ExprPropertyGet(array, temp), new_value)));
        return block;
    }

    /** If any index expression is a slice expression, convert all indices
     * to slices and call the appropriate runtime function.
     */
    private boolean containsSlice(List<Expr> exprs) {
        for (Expr index: exprs) {
            if (isColonExpr(index))
                return true;
        }
        return false;
    }


    private Expr indexing(Expr e) {
        return new ExprBinaryOp("-", e, new ExprInt(1));
    }

    private Expr boundsChecked(Expr array, Expr e) {
        if (!boundsCheck)
            return e;

        String temp_name = TempFactory.genFreshTempString();
        ExprId temp = new ExprId(temp_name);
        ExprAssign temp_assignment = new ExprAssign(temp, e);
        Expr condition = new ExprBinaryOp(
                "||",
                new ExprBinaryOp("<",  temp, new ExprInt(0)),
                new ExprBinaryOp(">=", temp, new ExprCall(
                        new ExprPropertyGet(array, new ExprString("mj_numel")),
                        new List<Expr>()
                        )
                ));
        Expr then_expr = new ExprCall(new ExprId("mc_error"), new List<Expr>(new ExprString("index out of bounds")));
        return new ExprBinaryOp(
                ",",
                temp_assignment,
                new ExprTernary(condition, then_expr, temp)
                );
    }

    private Expr generateIndexingExpression(Expr array, List<Expr> indices) {
        String name = ((ExprId) array).getName();
        Stmt enclosingStmt = JsAstUtils.getEnclosingStmt(array);
        BasicMatrixValue bmv = JsAstUtils.getBasicMatrixValue(analysis, enclosingStmt, name);

        java.util.List<DimValue> dimensions = bmv.getShape().getDimensions();
        java.util.List<Expr> terms = new java.util.ArrayList<>();
        Expr multiplier = new ExprInt(1);

        for (int i = 0; i < dimensions.size(); ++i) {
            Expr index = indexing(indices.getChild(i) == null ? new ExprInt(1) : indices.getChild(i));
            Expr indexing_term = new ExprBinaryOp("*", multiplier, index);
            terms.add(indexing_term);
            Expr new_dim =
                    dimensions.get(i).hasIntValue()
                    ? new ExprInt(dimensions.get(i).getIntValue())
                    : new ExprPropertyGet(new ExprCall(new ExprPropertyGet(new ExprId(name), new ExprString("mj_size")), new List<Expr>()), new ExprInt(i));
            multiplier = new ExprBinaryOp("*", multiplier, new_dim);
        }


        Expr indexing_expr = new ExprInt(0);
        for (Expr term: terms) {
            indexing_expr = new ExprBinaryOp("+", indexing_expr, term);
        }

        return indexing_expr;
    }


    /**
     * Translate an array get/set operation with a mix of scalars and slices
     * into an operation on slices only.
     *
     * E.g. a(1, 2:4, 5) ==> a(1:1, 2:4, 5:5)
     * @param array
     * @param indices
     * @return
     */
    private Expr generateArraySlice(Expr array, List<Expr> indices, GetOrSet getOrSet) {
        List<Expr> new_indices = new List<>();
        for (Expr index: indices) {
            if (isColonExpr(index))
                new_indices.add(index);
            else
                new_indices.add(convertToColonExpr(index));
        }
        return new ExprCall(
                new ExprId(getOrSet == GetOrSet.Get ? "mc_slice_get" : "mc_slice_set"),
                new List<Expr>(
                        array,
                        new ExprArray(new_indices)
                        )
                );
    }

    /**
     * Convert a scalar expression (e.g. x) to an equivalent colon expression (e.g. x:x)
     */
    private Expr convertToColonExpr(Expr e) {
        List<Expr> args = new List<Expr>(e, e);
        return new ExprCall(new ExprId("mc_colon"), args);
    }

    /**
     * Utility function to determine whether an argument to an array indexing
     * operation gets a slice of the array.  Both : (COLON) and non-scalar
     * variables are considered colon expressions.
     * @param expr
     * @return
     */
    private boolean isColonExpr(Expr expr) {
        if (expr instanceof ExprColon)
            return true;

        if (expr instanceof ExprId) {
            String name = ((ExprId) expr).getName();

            Stmt enclosingStmt = JsAstUtils.getEnclosingStmt(expr);
            BasicMatrixValue bmv = JsAstUtils.getBasicMatrixValue(analysis, enclosingStmt, name);
            return bmv != null && !bmv.getShape().isScalar();
        }
        return false;
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
