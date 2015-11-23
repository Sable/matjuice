package matjuice.analysis;

import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

import natlab.tame.tir.TIRCopyStmt;

public class PointsToMap {
    private Map<String, PointsToValue> map = new HashMap<>();

    public Set<String> keySet() {
        return map.keySet();
    }

    public void put(String key, PointsToValue value) {
        map.put(key, value);
    }

    public PointsToValue get(String key) {
        return map.getOrDefault(key, new PointsToValue());
    }

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

    public Set<TIRCopyStmt> getAliasingStmts(String var, MallocSite m) {
        return this.get(var).getAliasingStmts(m);
    }

    public void removeAliasingStmt(String var, TIRCopyStmt aliasingStmt) {
        PointsToValue ptv = this.get(var);
        PointsToValue newPtv = new PointsToValue();

        for (MallocSite m: ptv.getMallocSites()) {
            newPtv.addMallocSite(m);
            for (TIRCopyStmt otherAliasingStmt: ptv.getAliasingStmts(m)) {
                if (!otherAliasingStmt.equals(aliasingStmt)) {
                    newPtv.addAliasingStmt(m, otherAliasingStmt);
                }
            }
        }
        this.put(var, newPtv);
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
