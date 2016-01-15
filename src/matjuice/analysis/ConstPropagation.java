package matjuice.analysis;

import analysis.ForwardAnalysis;
import natlab.tame.tir.*;
import natlab.tame.tir.analysis.TIRAbstractNodeCaseHandler;
import natlab.tame.tir.analysis.TIRAbstractSimpleStructuralForwardAnalysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Collections;


public class ConstPropagation extends TIRAbstractSimpleStructuralForwardAnalysis<Map<String, ConstInfo>> {
    private Map<String, ConstInfo> initialMap;

    public static Map<String, ConstInfo> apply(TIRFunction tirFunction) {
        ConstPropagation cp = new ConstPropagation(tirFunction);
        tirFunction.tirAnalyze(cp);
        return cp.currentOutSet;
    }

    public ConstPropagation(TIRFunction tirFunction) {
        super(tirFunction);
        initialMap = new HashMap<>();
    }

    @Override
    public Map<String, ConstInfo> merge(Map<String, ConstInfo> in1, Map<String, ConstInfo> in2) {
        Map<String, ConstInfo> out = new HashMap<>(in1);

        for (String var: in2.keySet()) {
            if (out.containsKey(var)) {
                out.put(var, out.get(var).merge(in2.get(var)));
            } else {
                out.put(var, in2.get(var));
            }
        }

        return out;
    }


    @Override
    public Map<String, ConstInfo> copy(Map<String, ConstInfo> in) {
        return new HashMap<>(in);
    }

    @Override
    public Map<String, ConstInfo> newInitialFlow() {
        return copy(initialMap);
    }

    @Override
    public void caseTIRFunction(TIRFunction tirFunction) {
        System.out.println(tirFunction.getPrettyPrinted());
        currentInSet = newInitialFlow();
        currentOutSet = copy(currentInSet);
        caseASTNode(tirFunction);
    }

    @Override
    public void caseTIRAssignLiteralStmt(TIRAssignLiteralStmt stmt) {
        System.out.println("Literal: " + stmt.getPrettyPrinted());
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        if (stmt.getRHS() instanceof ast.IntLiteralExpr) {
            ast.IntLiteralExpr expr = (ast.IntLiteralExpr) stmt.getRHS();
            int value = expr.getValue().getValue().intValue();
            currentOutSet.put(stmt.getTargetName().getID(), ConstInfo.intValue(value));
        } else if (stmt.getRHS() instanceof ast.IntLiteralExpr) {
            ast.FPLiteralExpr expr = (ast.FPLiteralExpr) stmt.getRHS();
            double value = expr.getValue().getValue().doubleValue();
            currentOutSet.put(stmt.getTargetName().getID(), ConstInfo.floatValue(value));
        }
        outFlowSets.put(stmt, copy(currentOutSet));
    }

    @Override
    public void caseStmt(ast.Stmt node) {
        inFlowSets.put(node, copy(currentInSet));
        currentOutSet = copy(currentInSet);
        outFlowSets.put(node, copy(currentOutSet));
    }



}
