package matjuice.utils;

import matjuice.jsast.ASTNode;
import matjuice.jsast.Stmt;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;


public class JsAstUtils {
    /**
     * Find the enclosing Stmt node that has a non-null TIRStmt pointer.
     * @param node
     * @return
     */
    @SuppressWarnings("rawtypes")
    public static Stmt getEnclosingStmt(ASTNode node) {
        ASTNode parent = node.getParent();
        while (true) {
            if (parent == null)
                return null;
            if (parent instanceof Stmt && ((Stmt) parent).getTIRStmt() != null)
                return (Stmt) parent;
            parent = parent.getParent();
        }
    }

    public static BasicMatrixValue getBasicMatrixValue(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis,
            Stmt stmt, String variable) {
        AggrValue<BasicMatrixValue> val = analysis
                .getOutFlowSets()
                .get(stmt.getTIRStmt())
                .get(variable)
                .getSingleton();
        if (val instanceof BasicMatrixValue)
            return (BasicMatrixValue) val;
        else
            return null;
    }

    public static Stmt copyingTIRStmt(Stmt from, Stmt to) {
        to.setTIRStmt(from.getTIRStmt());
        return to;
    }
}
