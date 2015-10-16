package matjuice.analysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import java.util.HashSet;
import java.util.Collections;

import natlab.tame.tir.TIRStmt;

public class PointsToValue {
    private Map<MallocSite, Set<TIRStmt>> mallocs = new HashMap<>();

    public void addMallocSite(MallocSite m) {
        // TODO(vfoley): what should happen if m is already in there?
        if (mallocs.containsKey(m))
            return;

        mallocs.put(m, new HashSet<>());
    }

    public Set<MallocSite> getMallocSites() {
        return mallocs.keySet();
    }

    public void addAliasingStmt(MallocSite m, TIRStmt s) {
        Set<TIRStmt> stmts = mallocs.getOrDefault(m, new HashSet<>());
        stmts.add(s);
        mallocs.put(m, stmts);
    }

    public PointsToValue merge(PointsToValue other) {
        PointsToValue out = this.copy();
        for (MallocSite m: out.mallocs.keySet()) {
            Set<TIRStmt> mergedStmts = out.mallocs.getOrDefault(m, new HashSet<>());
            mergedStmts.addAll(other.mallocs.get(m));
            out.mallocs.put(m, mergedStmts);
        }
        return out;
    }

    public PointsToValue copy() {
        PointsToValue out = new PointsToValue();

        for (Entry<MallocSite, Set<TIRStmt>> entry: this.mallocs.entrySet()) {
            MallocSite m = entry.getKey();
            Set<TIRStmt> stmts = entry.getValue();
            out.mallocs.put(m, new HashSet<>(stmts));
        }

        return out;
    }

    public String toString() {
        return String.format("PointsToValue(%s)", mallocs);
    }
}
