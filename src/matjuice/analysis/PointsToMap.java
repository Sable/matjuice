package matjuice.analysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

import natlab.tame.tir.TIRCopyStmt;

public class PointsToMap {
    private Map<String, PointsToValue> map = new HashMap<>();

    // Map-like methods

    /**
     * Return the keys of the map (i.e. the variables we have
     * information on).
     */
    public Set<String> keySet() {
        return map.keySet();
    }

    /**
     * Add a <key, value> pair to the map
     */
    // TODO(vfoley): necessary?
    public void put(String key, PointsToValue value) {
        map.put(key, value);
    }

    public PointsToValue get(String key) {
        return map.getOrDefault(key, new PointsToValue());
    }

    public void remove(String key) {
        map.remove(key);
    }

    // Domain specific methods
    public void addVariable(String var) {
        this.put(var, new PointsToValue());
    }

    public void addMallocSite(String var, MallocSite m) {
        PointsToValue ptv = this.get(var);
        ptv.addMallocSite(m);
        this.put(var, ptv);
    }

    public void addAliasingStmt(String var, MallocSite m, TIRCopyStmt stmt) {
        PointsToValue ptv = this.get(var);
        ptv.addAliasingStmt(m, stmt);
        this.put(var, ptv);
    }

    public Set<MallocSite> getMallocSites(String var) {
        return this.get(var).getMallocSites();
    }

    /**
     * Get the aliasing statements of a variable `var` for a given
     * malloc site `m`.
     */
    public Set<TIRCopyStmt> getAliasingStmts(String var, MallocSite m) {
        return this.get(var).getAliasingStmts(m);
    }

    /**
     * Get the aliasing statements of a variable `var` for all its
     * malloc sites.
     */
    public Set<TIRCopyStmt> getAllAliasingStmts(String var) {
        Set<TIRCopyStmt> aliasingStmts = new HashSet<>();
        for (MallocSite m: this.getMallocSites(var)) {
            aliasingStmts.addAll(this.getAliasingStmts(var, m));
        }
        return aliasingStmts;
    }

    /**
     * Remove the given aliasing statements as aliasing statements
     * from all variables in the map.
     */
    public void removeAliasingStmts(Set<TIRCopyStmt> aliasingStmts) {
        for (String var: this.keySet()) {
            PointsToValue ptv = this.get(var);
            for (MallocSite m: ptv.getMallocSites()) {
                for (TIRCopyStmt stmt: aliasingStmts) {
                    ptv.removeAliasingStmt(m, stmt);
                }
            }
        }
    }

    public PointsToMap merge(PointsToMap other) {
        PointsToMap out = this.copy();
        for (String key : other.keySet()) {
            PointsToValue ptv = other.get(key);
            out.put(key, ptv.merge(this.get(key)));
        }
        return out;
    }

    public PointsToMap copy() {
        PointsToMap out = new PointsToMap();
        for (String key : this.keySet()) {
            PointsToValue ptv = this.get(key);
            out.put(key, ptv.copy());
        }
        return out;
    }

    public String toString() {
        return this.map.toString();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof PointsToMap)) {
            return false;
        } else {
            PointsToMap otherPtm = (PointsToMap) other;
            return this.map.equals(otherPtm.map);
        }
    }

    @Override
    public int hashCode() {
        return this.map.hashCode();
    }
}
