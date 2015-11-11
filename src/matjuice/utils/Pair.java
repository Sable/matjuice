package matjuice.utils;

public class Pair<T1, T2> {
    public T1 _1;
    public T2 _2;

    public Pair(T1 x, T2 y) {
        _1 = x;
        _2 = y;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Pair))
            return false;
        Pair<T1, T2> that = (Pair<T1, T2>) other;
        return this._1.equals(that._1) && this._2.equals(that._2);
    }

    @Override
    public int hashCode() {
        int result = 43;
        int c;

        c = (_1 == null) ? 0 : _1.hashCode();
        result = 37 * result + c;

        c = (_2 == null) ? 0 : _2.hashCode();
        result = 37 * result + c;

        return result;
    }
}
