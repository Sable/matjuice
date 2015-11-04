package matjuice.analysis;

public class MallocSite {
    private boolean isExternal = false;

    public static MallocSite newLocalSite() {
        return new MallocSite(false);
    }

    public static MallocSite newExternalSite() {
        return new MallocSite(true);
    }

    private MallocSite(boolean isExternal) {
        this.isExternal = isExternal;
    }

    public boolean isExternal() {
        return isExternal;
    }

    @Override
    public String toString() {
        if (isExternal)
            return String.format("ExternalMalloc(%x)", hashCode());
        else
            return String.format("LocalMalloc(%x)", hashCode());
    }

    @Override
    public boolean equals(Object other) {
        return this == other;
    }
}
