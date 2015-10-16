package matjuice.analysis;

import analysis.ForwardAnalysis;
import ast.ASTNode;
import natlab.tame.tir.*;
import natlab.tame.tir.analysis.TIRAbstractNodeCaseHandler;
import natlab.tame.tir.analysis.TIRAbstractSimpleStructuralForwardAnalysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import java.util.HashSet;
import java.util.Collections;


public class PointsToAnalysis extends TIRAbstractSimpleStructuralForwardAnalysis<Map<String, PointsToValue>> {
    private Map<String, PointsToValue> initialMap;

    public PointsToAnalysis(ASTNode<?> astNode, Set<String> paramNames) {
        super(astNode);
        initialMap = new HashMap<>();
        MallocSite globalSite = MallocSite.newGlobalSite();

        // Input parameters point into a common global malloc site.
        for (String param: paramNames) {
            PointsToValue ptv = new PointsToValue();
            ptv.addMallocSite(globalSite);
            initialMap.put(param, ptv);
        }
    }

    /**
     * Given two maps of PointsToValue, union the malloc sites and the
     * aliasing statements.
     *
     * E.g.
     * in1 = { "A": {M1: [Stmt1]}, "B": {M2: [Stmt2]}, "C": {M1: [Stmt1]} }
     * in2 = { "A": {M1: [Stmt1]}, "B": {M2: [Stmt2]}, "C": {M2: [Stmt2]}, "D": {M3: [Stmt3]} }
     * out = { "A": {M1: [Stmt1]}, "B": {M2: [Stmt2]}, "C": {M1: [Stmt1], M2: [Stmt2]}, "D": {M3: [Stmt3]} }
     *
     * @param in1 the first map of points-to values
     * @param in2 the second map of points-to values
     * @return the union of the two maps
     */
    @Override
    public Map<String, PointsToValue> merge(Map<String, PointsToValue> in1, Map<String, PointsToValue> in2) {
        Map<String, PointsToValue> out = copy(in1);
        for (Entry<String, PointsToValue> entry : in2.entrySet()) {
            String varName = entry.getKey();
            PointsToValue ptv = entry.getValue();

            out.put(varName, ptv.merge(out.getOrDefault(varName, new PointsToValue())));
        }

        return out;
    }


    @Override
    public Map<String, PointsToValue> copy(Map<String, PointsToValue> in) {
        Map<String, PointsToValue> out = new HashMap<>();

        for (Entry<String, PointsToValue> entry : in.entrySet()) {
            String varName = entry.getKey();
            PointsToValue ptv = entry.getValue();

            out.put(varName, ptv.copy());
        }
        return out;
    }

    @Override
    public Map<String, PointsToValue> newInitialFlow() {
        return copy(initialMap);
    }

    @Override
    public void caseTIRFunction(TIRFunction tirFunction) {
        currentInSet = newInitialFlow();
        currentOutSet = copy(currentInSet);
        caseASTNode(tirFunction);
    }

    @Override
    public void caseTIRCallStmt(TIRCallStmt stmt) {
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        // Kill the current points-to values for all output parameters.
        for (String varname : stmt.getLValues()) {
            currentOutSet.remove(varname);
        }

        // Insert new malloc sites
        for (String varname : stmt.getLValues()) {
            PointsToValue ptv = new PointsToValue();
            ptv.addMallocSite(MallocSite.newLocalSite());
            currentOutSet.put(varname, ptv);
        }

        outFlowSets.put(stmt, copy(currentOutSet));
    }

    @Override
    public void caseTIRCopyStmt(TIRCopyStmt stmt) {
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        String lhs = stmt.getVarName();
        String rhs = stmt.getSourceName().getID();

        // Kill current information for LHS
        currentOutSet.remove(lhs);

        // Add the current statement for RHS
        PointsToValue rhsPtv = currentOutSet.get(rhs);
        for (MallocSite m: rhsPtv.getMallocSites()) {
            rhsPtv.addAliasingStmt(m, stmt);
        }

        // Copy information from RHS into LHS
        currentOutSet.put(lhs, currentOutSet.get(rhs).copy());

        outFlowSets.put(stmt, copy(currentOutSet));
    }

    @Override
    public void caseStmt(ast.Stmt node) {
        inFlowSets.put(node, copy(currentInSet));
        currentOutSet = copy(currentInSet);
        outFlowSets.put(node, copy(currentOutSet));
    }

    public void print(ast.ASTNode node) {
        class Printer extends TIRAbstractNodeCaseHandler {
            @Override
            public void caseASTNode(ASTNode astNode) {
                for (int i = 0; i < astNode.getNumChild(); ++i) {
                    astNode.getChild(i).analyze(this);
                }
            }

            @Override
            public void caseStmt(ast.Stmt node) {
                System.out.printf("VFB> %s\n        %s\n", node.getPrettyPrinted(), getOutFlowSets().get(node));
            }
        }

        node.analyze(new Printer());
    }
}
