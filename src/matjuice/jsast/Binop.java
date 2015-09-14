package matjuice.jsast;

import matjuice.pretty.Pretty;
import matjuice.pretty.PrettyBase;

public enum Binop {
    Add("+"),
    Sub("-"),
    Mul("*"),
    Div("/"),
    Mod("%"),
    Eq("==="),
    Ne("!=="),
    Lt("<"),
    Le("<="),
    Gt(">"),
    Ge(">="),
    And("&&"),
    Or("||");

    private String jsOperator;

    Binop(String jsOperator) {
        this.jsOperator = jsOperator;
    }

    public PrettyBase pp() {
        return Pretty.text(this.jsOperator);
    }
}
