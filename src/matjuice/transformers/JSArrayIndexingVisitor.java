package matjuice.transformers;

import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import matjuice.jsast.*;
import matjuice.pretty.Pretty;

@SuppressWarnings("rawtypes")
public class JSArrayIndexingVisitor implements JSVisitor<ASTNode> {
    private ValueAnalysis<AggrValue<BasicMatrixValue>> analysis;
    private int index;


    public JSArrayIndexingVisitor(ValueAnalysis<AggrValue<BasicMatrixValue>> analysis, int index) {
        this.analysis = analysis;
        this.index = index;
    }

    public static Function apply(Function f, ValueAnalysis<AggrValue<BasicMatrixValue>> analysis, int index) {
        JSArrayIndexingVisitor renamer = new JSArrayIndexingVisitor(analysis, index);
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
        return new_block;
    }

    @Override
    public ASTNode visitStmtExpr(StmtExpr stmt) {
        return new StmtExpr((Expr) stmt.getExpr().accept(this));
    }

    @Override
    public ASTNode visitStmtReturn(StmtReturn stmt) {
        if (stmt.hasExpr())
            return new StmtReturn(new Opt<Expr>((Expr) stmt.getExpr().accept(this)));
        else
            return new StmtReturn(new Opt<Expr>());
    }

    @Override
    public ASTNode visitStmtIfThenElse(StmtIfThenElse stmt) {
        return new StmtIfThenElse(
                (Expr) stmt.getCond().accept(this),
                (StmtBlock) stmt.getThen().accept(this),
                (StmtBlock) stmt.getElse().accept(this)
                );
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
        return new StmtVarDecl(
                stmt.getId(),
                stmt.hasInit()
                    ? new Opt<Expr>((Expr) stmt.getInit().accept(this))
                    : new Opt<Expr>()
                );
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
            return generateArraySliceGet(array, indices);
        }

        // All the indices are scalar.
        ExprPropertyGet array_index_expr = new ExprPropertyGet();
        array_index_expr.setExpr(array);
        array_index_expr.setProperty(generateIndexingExpression(array, indices));
        return array_index_expr;
    }

    private Expr replaceArraySetCall(List<Expr> args) {
        Expr array = args.getChild(0);
        List<Expr> indices = ((ExprArray) args.getChild(1)).getExprList();
        Expr new_value = args.getChild(2);


        if (containsSlice(indices)) {
            return generateArraySliceGet(array, indices);
        }

        // All the indices are scalar.
        ExprPropertyGet array_index_expr = new ExprPropertyGet();
        array_index_expr.setExpr(array);
        array_index_expr.setProperty(generateIndexingExpression(array, indices));
        return new ExprAssign(array_index_expr, new_value);
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

    private Expr generateIndexingExpression(Expr array, List<Expr> indices) {
        String name = ((ExprId) array).getName();
        BasicMatrixValue bmv = getBasicMatrixValue(name);

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
                    : new ExprPropertyGet(new ExprId(name + "." + "mj_size()"), new ExprInt(i));
            multiplier = new ExprBinaryOp("*", multiplier, new_dim);
        }


        Expr indexing_expr = new ExprInt(0);
        for (Expr term: terms) {
            indexing_expr = new ExprBinaryOp("+", indexing_expr, term);
        }

        return indexing_expr;
    }


    /**
     * Translate an array get operation with a mix of scalars and slices
     * into an operation on slices only.
     *
     * E.g. a(1, 2:4, 5) ==> a(1:1, 2:4, 5:5)
     * @param array
     * @param indices
     * @return
     */
    private Expr generateArraySliceGet(Expr array, List<Expr> indices) {
        List<Expr> new_indices = new List<>();
        for (Expr index: indices) {
            if (isColonExpr(index))
                new_indices.add(index);
            else
                new_indices.add(convertToColonExpr(index));
        }
        return new ExprCall(
                new ExprId("mc_array_slice"),
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

            BasicMatrixValue bmv = getBasicMatrixValue(name);
            return bmv != null && !bmv.getShape().isScalar();
        }
        return false;
    }

    private BasicMatrixValue getBasicMatrixValue(String variable) {
        AggrValue<BasicMatrixValue> val = analysis
                .getNodeList()
                .get(index)
                .getAnalysis()
                .getCurrentOutSet()
                .get(variable)
                .getSingleton();
        if (val instanceof BasicMatrixValue)
            return (BasicMatrixValue) val;
        else
            return null;
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
