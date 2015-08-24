package matjuice.transformers;

import matjuice.jsast.Function;
import natlab.tame.tir.TIRArraySetStmt;
import natlab.toolkits.analysis.core.Def;
import natlab.toolkits.analysis.core.ReachingDefs;
import natlab.toolkits.analysis.core.UseDefDefUseChain;

import java.util.Set;

/**
 * Created by vfoley1 on 10/08/15.
 */
public class JSCopyLocals {
    public static Function apply(Function f, Set<String> formalParameters) {
        ReachingDefs rd = new ReachingDefs(f.getTIRFunction());
        rd.analyze();
        UseDefDefUseChain uddu = rd.getUseDefDefUseChain();

        for (ast.Stmt stmt: f.getTIRFunction().getStmtList()) {
            if (stmt instanceof TIRArraySetStmt) {
                Set<Def> defs = uddu.getDefs(((TIRArraySetStmt) stmt).getArrayName());
                for (Def def: defs) {
                    
                }
            }
        }

        return f;
    }
}
