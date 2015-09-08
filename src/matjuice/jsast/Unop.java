package matjuice.jsast;

import matjuice.pretty.Pretty;
import matjuice.pretty.PrettyBase;

public enum Unop {
    Negate("-"),
    Not("!");

    private String jsOperator;

    Unop(String jsOperator) {
        this.jsOperator = jsOperator;
    }

    public PrettyBase pp() {
        return Pretty.text(this.jsOperator);
    }
}
