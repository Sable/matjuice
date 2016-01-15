package matjuice.analysis;

public enum ConstKind {
    Bottom(0),
    Int(1),
    Float(2),
    Top(3);

    private final int value;
    private ConstKind(int value) {
        this.value = value;
    }

    public ConstKind merge(ConstKind other) {
        ConstKind[][] table = {
            { ConstKind.Bottom, ConstKind.Int, ConstKind.Float, ConstKind.Top },
            { ConstKind.Int   , ConstKind.Int, ConstKind.Top  , ConstKind.Top },
            { ConstKind.Float , ConstKind.Top, ConstKind.Float, ConstKind.Top },
            { ConstKind.Top   , ConstKind.Top, ConstKind.Top  , ConstKind.Top },
        };
        return table[this.value][other.value];
    }
}
