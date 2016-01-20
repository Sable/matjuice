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

        for (String varname : stmt.getLValues()) {
            Set<TIRCopyStmt> aliasingStmts = currentOutSet.getAllAliasingStmts(varname);
            currentOutSet.removeAliasingStmts(aliasingStmts);
            currentOutSet.remove(varname);

            currentOutSet.addVariable(varname);
            currentOutSet.addMallocSite(varname, mallocSiteForStmt(stmt, varname));
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

        // Add the current statement as aliasing statement of RHS.
        for (MallocSite m: currentOutSet.getMallocSites(rhs)) {
            currentOutSet.addAliasingStmt(rhs, m, stmt);
        }

        // Copy information from RHS into LHS
        currentOutSet.put(lhs, currentOutSet.get(rhs).copy());

        outFlowSets.put(stmt, copy(currentOutSet));
    }

    @Override
    public void caseTIRAssignLiteralStmt(TIRAssignLiteralStmt stmt) {
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        currentOutSet.remove(stmt.getTargetName().getID());

        outFlowSets.put(stmt, copy(currentOutSet));
    }

    public void caseMJCopyStmt(MJCopyStmt stmt) {
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);

        String lhs = stmt.getVarName();

        Set<TIRCopyStmt> aliasingStmtsOfLhs = currentOutSet.getAllAliasingStmts(lhs);
        currentOutSet.removeAliasingStmts(aliasingStmtsOfLhs);

        // Kill information for `lhs`
        currentOutSet.remove(lhs);

        // Gen new information for `lhs`
        MallocSite m = mallocSiteForStmt(stmt, lhs);
        currentOutSet.addVariable(lhs);
        currentOutSet.addMallocSite(lhs, m);

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
        }

        node.analyze(new Printer());
    }
}
