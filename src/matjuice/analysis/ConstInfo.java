package matjuice.analysis;

public class ConstInfo {
    private Integer intValue = null;
    private Double floatValue = null;
    private ConstKind kind = ConstKind.Bottom;

    public ConstKind getKind() {
        return kind;
    }

    public Integer getIntValue() {
        return intValue;
    }

    public Double getFloatValue() {
        return floatValue;
    }

    public boolean isConst() {
        return kind == ConstKind.Int || kind == ConstKind.Float;
    }


    private ConstInfo mkBot() {
        ConstInfo ci = new ConstInfo();
        ci.kind = ConstKind.Bottom;
        return ci;
    }

    private ConstInfo mkTop() {
        ConstInfo ci = new ConstInfo();
        ci.kind = ConstKind.Top;
        return ci;
    }

    public static ConstInfo floatValue(double f) {
        ConstInfo ci = new ConstInfo();
        ci.floatValue = f;
        ci.kind = ConstKind.Float;
        return ci;
    }

    public static ConstInfo intValue(int n) {
        ConstInfo ci = new ConstInfo();
        ci.intValue = n;
        ci.kind = ConstKind.Int;
        return ci;
    }

    public ConstInfo merge(ConstInfo other) {
        switch (this.kind.merge(other.kind)) {
        case Bottom: return mkBot();
        case Top: return mkTop();
        case Int:
            if (this.getIntValue() == other.getIntValue())
                return this;
            else
                return mkTop();
        case Float:
            if (this.getFloatValue() == other.getFloatValue())
                return this;
            else
                return mkTop();
        }
        return null;            // UNREACHABLE
    }

    @Override
    public String toString() {
        if (kind == ConstKind.Top)
            return "TOP";
        if (kind == ConstKind.Bottom)
            return "BOT";
        if (kind == ConstKind.Int)
            return "INT(" + intValue + ")";
        if (kind == ConstKind.Float)
            return "FLOAT(" + floatValue + ")";
        return "???";
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof ConstInfo))
            return false;

        ConstInfo that = (ConstInfo) other;
        if (this.kind == ConstKind.Bottom && that.kind == ConstKind.Bottom)
            return true;
        if (this.kind == ConstKind.Top && that.kind == ConstKind.Top)
            return true;
        if (this.kind == ConstKind.Int && that.kind == ConstKind.Int)
            return this.getIntValue() == that.getIntValue();
        if (this.kind == ConstKind.Float && that.kind == ConstKind.Float)
            return this.getFloatValue() == that.getFloatValue();
        return false;
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }
}
