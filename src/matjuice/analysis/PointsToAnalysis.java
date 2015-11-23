package matjuice.analysis;

import matjuice.transformer.MJCopyStmt;
import matjuice.utils.Pair;

import analysis.ForwardAnalysis;
import natlab.tame.tir.*;
import natlab.tame.tir.analysis.TIRAbstractNodeCaseHandler;
import natlab.tame.tir.analysis.TIRAbstractSimpleStructuralForwardAnalysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import java.util.HashSet;
import java.util.Collections;


public class PointsToAnalysis extends TIRAbstractSimpleStructuralForwardAnalysis<PointsToMap> {
    private PointsToMap initialMap;
    private Map<Pair<TIRStmt, String>, MallocSite> statementMallocs;

    public PointsToAnalysis(TIRFunction tirFunction) {
        super(tirFunction);
        initialMap = new PointsToMap();
        statementMallocs = new HashMap<>();
        MallocSite externalSite = MallocSite.newExternalSite();

        // TODO(vfoley): scalar parameters should not have a malloc site
        // Input parameters point into a common external malloc site.
        for (ast.Name param : tirFunction.getInputParamList()) {
            String paramName = param.getID();
            initialMap.addVariable(paramName);
            initialMap.addMallocSite(paramName, externalSite);
        }

        // Output parameters start with an empty PointsToValue.
        for (ast.Name param : tirFunction.getOutputParamList()) {
            String paramName = param.getID();
            initialMap.addVariable(paramName);
        }
    }

    /**
     * Create a new memory site for the pair <stmt, varname> if one
     * doesn't exist and memoize it, otherwise return the previously
     * created memory site.
     */
    private MallocSite mallocSiteForStmt(TIRStmt stmt, String varname) {
        Pair<TIRStmt, String> p = new Pair<>(stmt, varname);
        if (statementMallocs.containsKey(p)) {
            return statementMallocs.get(p);
        }
        else {
            MallocSite m = MallocSite.newLocalSite();
            statementMallocs.put(p, m);
            return m;
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
    public PointsToMap merge(PointsToMap in1, PointsToMap in2) {
        PointsToMap out = in1.merge(in2);
        return out;
    }


    @Override
    public PointsToMap copy(PointsToMap in) {
        PointsToMap out = in.copy();
        return out;
    }

    @Override
    public PointsToMap newInitialFlow() {
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
            this.removeAllAliasingStmtsInvolving(varname);
            currentOutSet.remove(varname);
        }

        // Insert new malloc sites
        for (String varname : stmt.getLValues()) {
            PointsToValue ptv = new PointsToValue();
            ptv.addMallocSite(mallocSiteForStmt(stmt, varname));
            currentOutSet.put(varname, ptv);
        }

        outFlowSets.put(stmt, copy(currentOutSet));
    }

    @Override
    public void caseTIRCopyStmt(TIRCopyStmt stmt) {
        if (stmt instanceof MJCopyStmt) {
            caseMJCopyStmt((MJCopyStmt) stmt);
            return;
        }

        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        String lhs = stmt.getVarName();
        String rhs = stmt.getSourceName().getID();

        if (lhs.equals(rhs))
            return;

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

    public void removeAllAliasingStmtsInvolving(String lhs) {
        // Kill the aliasing stmts that lhs was involved in from
        // the other variables in the outSet.
        System.out.printf("VFB: [%s] %s\n", lhs, currentOutSet);
        PointsToValue lhsPtv = currentOutSet.get(lhs);
        Set<TIRCopyStmt> lhsAliasingStmts = lhsPtv.getAllAliasingStmts();
        for (String otherVar: currentOutSet.keySet()) {
            if (otherVar.equals(lhs))
                continue;

            PointsToValue otherPtv = currentOutSet.get(otherVar);
            for (MallocSite m: otherPtv.getMallocSites()) {
                for (TIRCopyStmt aliasingStmt: lhsAliasingStmts) {
                    otherPtv.removeAliasingStmt(m, aliasingStmt);
                }
            }
        }
    }

    public void caseMJCopyStmt(MJCopyStmt stmt) {
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        String lhs = stmt.getVarName();

        this.removeAllAliasingStmtsInvolving(lhs);

        // Kill information for `lhs`
        currentOutSet.remove(lhs);

        // Gen new information for `lhs`
        MallocSite m = mallocSiteForStmt(stmt, lhs);
        PointsToValue ptv = new PointsToValue();
        ptv.addMallocSite(m);
        currentOutSet.put(lhs, ptv);

        // Put the new dataflow information in the outFlowSets
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
            public void caseASTNode(ast.ASTNode astNode) {
                for (int i = 0; i < astNode.getNumChild(); ++i) {
                    astNode.getChild(i).analyze(this);
                }
            }

            @Override
            public void caseStmt(ast.Stmt node) {
                System.out.printf("MatJuice: %s\n        %s\n", node.getPrettyPrinted(), getOutFlowSets().get(node));
            }
        }

        node.analyze(new Printer());
    }
}
