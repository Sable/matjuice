package matjuice.analysis;

public class MallocSite {
    private boolean isGlobal = false;

    public static MallocSite newLocalSite() {
        return new MallocSite(false);
    }

    public static MallocSite newGlobalSite() {
        return new MallocSite(true);
    }

    private MallocSite(boolean isGlobal) {
        this.isGlobal = isGlobal;
    }

    public boolean isGlobal() {
        return isGlobal;
    }

    public String toString() {
        if (isGlobal)
            return String.format("GlobalMalloc(%x)", hashCode());
        else
            return String.format("LocalMalloc(%x)", hashCode());
    }
}
