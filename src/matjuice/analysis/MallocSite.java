package matjuice.analysis;

public class MallocSite {
    public boolean isGlobal = false;

    public MallocSite() {
    }

    public MallocSite(boolean isGlobal) {
        this.isGlobal = isGlobal;
    }

    public String toString() {
        if (isGlobal)
            return String.format("GlobalMalloc(%x)", hashCode());
        else
            return String.format("LocalMalloc(%x)", hashCode());
    }
}
