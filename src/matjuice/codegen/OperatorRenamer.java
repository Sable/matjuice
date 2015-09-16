package matjuice.codegen;

import matjuice.jsast.*;
import matjuice.utils.Utils;

import natlab.tame.tir.TIRCallStmt;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

import java.util.HashMap;

public class OperatorRenamer {
    private static HashMap<String, Binop> binaryOps = new HashMap<>();
    private static HashMap<String, Unop> unaryOps = new HashMap<>();

    static {
        binaryOps.put("plus", Binop.Add);
        binaryOps.put("minus", Binop.Sub);
        binaryOps.put("times", Binop.Mul);
        binaryOps.put("mtimes", Binop.Mul);
        binaryOps.put("mrdivide", Binop.Div);
        binaryOps.put("rdivide", Binop.Div);
        binaryOps.put("le", Binop.Le);
        binaryOps.put("lt", Binop.Lt);
        binaryOps.put("ge", Binop.Ge);
        binaryOps.put("gt", Binop.Gt);
        binaryOps.put("eq", Binop.Eq);
        binaryOps.put("ne", Binop.Gt);

        unaryOps.put("uminus", Unop.Negate);
        unaryOps.put("not", Unop.Not);
    }

    public static boolean isBasicArithmeticOperator(TIRCallStmt tirStmt,
        IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        String funcName = tirStmt.getFunctionName().getID();
        if (binaryOps.containsKey(funcName) || unaryOps.containsKey(funcName)) {
            for (ast.Expr arg : tirStmt.getArguments()) {
                String argVar = ((ast.NameExpr) arg).getName().getID();
                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, argVar);
                if (!bmv.getShape().isScalar()) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    public static Stmt renameOperator(TIRCallStmt tirStmt, java.util.List<Expr> args) {
        String funcName = tirStmt.getFunctionName().getID();
        if (binaryOps.containsKey(funcName)) {
            Binop op = binaryOps.get(funcName);
            return new StmtBinop(
                tirStmt.getTargetName().getID(),
                op,
                args.get(0),
                args.get(1)
                );
        }
        else if (unaryOps.containsKey(funcName)) {
            Unop op = unaryOps.get(funcName);
            return new StmtUnop(
                tirStmt.getTargetName().getID(),
                op,
                args.get(0)
                );
        }
        throw new UnsupportedOperationException(
            String.format("Cannot covert the call [%s] to an operator statement", funcName));
    }
}
