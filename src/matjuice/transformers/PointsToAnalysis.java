package matjuice.transformers;

import analysis.ForwardAnalysis;
import ast.ASTNode;
import natlab.tame.tir.TIRCopyStmt;
import natlab.tame.tir.analysis.TIRAbstractSimpleStructuralForwardAnalysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import java.util.HashSet;


/**
 * Created by vfoley1 on 03/08/15.
 */
public class PointsToAnalysis extends TIRAbstractSimpleStructuralForwardAnalysis<Map<String, Set<MallocSite>>> {
    private Map<String, Set<MallocSite>> initialMap;

    public PointsToAnalysis(ASTNode<?> astNode, Set<String> paramNames, Set<String> copiedParameters) {
        super(astNode);
        initialMap = new HashMap<>();
        MallocSite globalSite = new MallocSite();
        for (String param: paramNames) {
            Set<MallocSite> singletonSite = new HashSet<MallocSite>();
            singletonSite.add(globalSite);
            initialMap.put(param, singletonSite);
        }
    }

    /**
     * Given two maps of malloc sites, "union" them.
     * E.g.
     * in1 = { "A" -> [M1], "B" -> [M2], "C" -> [M1], "D" -> [M4]}
     * in2 = { "A" -> [M1], "B" -> [M2], "C" -> [M3]}
     * out = { "A" -> [M1], "B" -> [M2], "C" -> [M1, M3], "D" -> [M4]}
     * @param in1 the first map of mallocs
     * @param in2 the second map of mallocs
     * @return the "union" of the two maps
     */
    @Override
    public Map<String, Set<MallocSite>> merge(Map<String, Set<MallocSite>> in1, Map<String, Set<MallocSite>> in2) {
        Map<String, Set<MallocSite>> out = new HashMap<>(in1);
        for (Entry<String, Set<MallocSite>> entry : in2.entrySet()) {
            String varName = entry.getKey();
            Set<MallocSite> mallocs = entry.getValue();
            Set<MallocSite> mergedEntries = out.getOrDefault(varName, new HashSet<>());
            mergedEntries.addAll(mallocs);
            out.put(varName, mergedEntries);
        }
        return out;
    }

    @Override
    public Map<String, Set<MallocSite>> copy(Map<String, Set<MallocSite>> in) {
        return new HashMap<>(in);
    }

    @Override
    public Map<String, Set<MallocSite>> newInitialFlow() {
        return initialMap;
    }

    @Override
    public void caseTIRCopyStmt(TIRCopyStmt stmt) {
        inFlowSets.put(stmt, copy(currentInSet));
        currentOutSet = copy(currentInSet);
        currentOutSet.remove(stmt.getVarName());
        currentOutSet.put(stmt.getVarName(), new HashSet<>(currentInSet.get(stmt.getRHS().getVarName())));
        outFlowSets.put(stmt, copy(currentOutSet));
    }
}
