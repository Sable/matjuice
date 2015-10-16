package matjuice.analysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import java.util.HashSet;
import java.util.Collections;

import natlab.tame.tir.TIRStmt;


/**
 * The abstract value that will be associated with a variable in
 * the points-to analysis.  A value is a map between malloc sites
 * and the Tamer statements that created aliasing of that malloc
 * site between multiple identifiers.
 */
public class PointsToValue {
    private Map<MallocSite, Set<TIRStmt>> mallocs = new HashMap<>();

    /**
     * Add a mapping between m and an empty set.
     */
    public void addMallocSite(MallocSite m) {
        // TODO(vfoley): what should happen if m is already in there?
        if (mallocs.containsKey(m))
            return;

        mallocs.put(m, new HashSet<>());
    }

    /**
     * Return all the malloc sites.
     */
    public Set<MallocSite> getMallocSites() {
        return mallocs.keySet();
    }

    /**
     * Add a statement to the set of statements that cause
     * aliasing of `m` to happen.
     */
    public void addAliasingStmt(MallocSite m, TIRStmt s) {
        Set<TIRStmt> stmts = mallocs.getOrDefault(m, new HashSet<>());
        stmts.add(s);
        mallocs.put(m, stmts);
    }

    /**
     * Return the aliasing statements of a given malloc site.
     */
    public Set<TIRStmt> getAliasingStmts(MallocSite m) {
        return mallocs.getOrDefault(m, new HashSet<>());
    }

    /**
     * Merge two PointsToValue together:
     * - The output value contains all the keys of both input values;
     * - When both input values had a common key, their sets of
     *   statements are union together.
     */
    public PointsToValue merge(PointsToValue other) {
        PointsToValue out = new PointsToValue();

        for (MallocSite m: this.mallocs.keySet()) {
            out.addMallocSite(m);
            for (TIRStmt stmt: this.getAliasingStmts(m))
                out.addAliasingStmt(m, stmt);
        }

        for (MallocSite m: other.mallocs.keySet()) {
            out.addMallocSite(m);
            for (TIRStmt stmt: other.getAliasingStmts(m))
                out.addAliasingStmt(m, stmt);
        }

        return out;
    }

    /**
     * Copy a Points to value.  The sets of statements are also copied.
     */
    public PointsToValue copy() {
        PointsToValue out = new PointsToValue();

        for (Entry<MallocSite, Set<TIRStmt>> entry: this.mallocs.entrySet()) {
            MallocSite m = entry.getKey();
            Set<TIRStmt> stmts = entry.getValue();
            out.mallocs.put(m, new HashSet<>(stmts));
        }

        return out;
    }

    @Override
    public String toString() {
        return String.format("PointsToValue(%s)", mallocs);
    }

    /**
     * Two PointsToValue are equal if they have the same entry sets.
     */
    @Override
    public boolean equals(Object other) {
        return other instanceof PointsToValue &&
          this.mallocs.equals(((PointsToValue) other).mallocs);
    }
}
