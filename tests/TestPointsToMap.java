import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import org.junit.Test;

import matjuice.analysis.PointsToMap;
import matjuice.analysis.PointsToValue;
import matjuice.analysis.MallocSite;

import natlab.tame.tir.TIRCopyStmt;

import java.util.Set;
import java.util.HashSet;

public class TestPointsToMap {
    @Test
    public void empty() {
        PointsToMap ptm = new PointsToMap();
        assertEquals("ptm is empty", 0, ptm.keySet().size());
    }

    @Test
    public void addVariable() {
        PointsToMap ptm = new PointsToMap();
        assertEquals("ptm is empty", 0, ptm.keySet().size());
        ptm.addVariable("var");
        assertEquals("ptm has one variable", 1, ptm.keySet().size());
        assertTrue("ptm contains 'var'", ptm.keySet().contains("var"));
    }

    @Test
    public void addMallocSite() {
        PointsToMap ptm = new PointsToMap();
        ptm.addVariable("var");
        assertEquals("ptm[var] has no malloc sites", 0, ptm.getMallocSites("var").size());

        MallocSite m1 = MallocSite.newLocalSite();
        ptm.addMallocSite("var", m1);
        assertEquals("ptm[var] has one malloc sites", 1, ptm.getMallocSites("var").size());

        MallocSite m2 = MallocSite.newLocalSite();
        ptm.addMallocSite("var", m2);
        assertEquals("ptm[var] has two malloc sites", 2, ptm.getMallocSites("var").size());

        assertTrue("ptv[var] contains m1", ptm.getMallocSites("var").contains(m1));
        assertTrue("ptv[var] contains m2", ptm.getMallocSites("var").contains(m2));
    }

    @Test
    public void addAliasingStmt() {
        PointsToMap ptm = new PointsToMap();
        ptm.addVariable("var");

        MallocSite m1 = MallocSite.newLocalSite();
        ptm.addMallocSite("var", m1);

        TIRCopyStmt s1 = new TIRCopyStmt(null, null);
        TIRCopyStmt s2 = new TIRCopyStmt(null, null);
        assertEquals("ptm[var] has no aliasing statements", 0, ptm.getAliasingStmts("var", m1).size());
        ptm.addAliasingStmt("var", m1, s1);
        assertEquals("ptm[var] has one aliasing statements", 1, ptm.getAliasingStmts("var", m1).size());
        ptm.addAliasingStmt("var", m1, s2);
        assertEquals("ptm[var] has two aliasing statements", 2, ptm.getAliasingStmts("var", m1).size());
    }

    @Test
    public void removeAliasingStmt() {
        PointsToMap ptm = new PointsToMap();
        ptm.addVariable("var");

        MallocSite m1 = MallocSite.newLocalSite();
        ptm.addMallocSite("var", m1);

        TIRCopyStmt s1 = new TIRCopyStmt(null, null);
        TIRCopyStmt s2 = new TIRCopyStmt(null, null);
        ptm.addAliasingStmt("var", m1, s1);
        ptm.addAliasingStmt("var", m1, s2);
        assertEquals("ptm[var] has two aliasing statements", 2, ptm.getAliasingStmts("var", m1).size());
        assertTrue("ptm[var] contains s1", ptm.getAliasingStmts("var", m1).contains(s1));
        assertTrue("ptm[var] contains s2", ptm.getAliasingStmts("var", m1).contains(s2));

        ptm.removeAliasingStmt("var", s1);
        assertEquals("ptm[var] has one aliasing statements", 1, ptm.getAliasingStmts("var", m1).size());
        assertFalse("ptm[var] does not contain s1", ptm.getAliasingStmts("var", m1).contains(s1));
        assertTrue("ptm[var] contains s2", ptm.getAliasingStmts("var", m1).contains(s2));

        ptm.removeAliasingStmt("var", s2);
        assertEquals("ptm[var] has no aliasing statements", 0, ptm.getAliasingStmts("var", m1).size());
        assertFalse("ptm[var] does not contain s1", ptm.getAliasingStmts("var", m1).contains(s1));
        assertFalse("ptm[var] does not contain s2", ptm.getAliasingStmts("var", m1).contains(s2));
    }

    @Test
    public void getAllAliasingStmts() {
        PointsToMap ptm = new PointsToMap();
        ptm.addVariable("v1");
        ptm.addVariable("v2");
        ptm.addVariable("v3");

        // s0: v1 = malloc();
        // s1: v2 = v1;
        // s2: v3 = v2;
        MallocSite m = MallocSite.newLocalSite();
        ptm.addMallocSite("v1", m);
        ptm.addMallocSite("v2", m);
        ptm.addMallocSite("v3", m);

        TIRCopyStmt s1 = new TIRCopyStmt(null, null);
        TIRCopyStmt s2 = new TIRCopyStmt(null, null);
        ptm.addAliasingStmt("v1", m, s1);
        ptm.addAliasingStmt("v2", m, s1);
        ptm.addAliasingStmt("v2", m, s2);
        ptm.addAliasingStmt("v3", m, s2);

        assertEquals("ptm[v1] has 1 aliasing stmt", 1, ptm.getAllAliasingStmts("v1").size());
        assertTrue("ptm[v1].contains(s1)", ptm.getAllAliasingStmts("v1").contains(s1));
        assertFalse("!ptm[v1].contains(s2)", ptm.getAllAliasingStmts("v1").contains(s2));

        assertEquals("ptm[v2] has 2 aliasing stmts", 2, ptm.getAllAliasingStmts("v2").size());
        assertTrue("ptm[v2].contains(s1)", ptm.getAllAliasingStmts("v2").contains(s1));
        assertTrue("ptm[v2].contains(s2)", ptm.getAllAliasingStmts("v2").contains(s2));

        assertEquals("ptm[v3] has 1 aliasing stmt", 1, ptm.getAllAliasingStmts("v3").size());
        assertFalse("!ptm[v3].contains(s1)", ptm.getAllAliasingStmts("v3").contains(s1));
        assertTrue("ptm[v3].contains(s2)", ptm.getAllAliasingStmts("v3").contains(s2));
    }

    @Test
    public void removeAliasingStmts() {
        PointsToMap ptm = new PointsToMap();
        ptm.addVariable("v1");
        ptm.addVariable("v2");

        MallocSite m1 = MallocSite.newLocalSite();
        MallocSite m2 = MallocSite.newLocalSite();
        MallocSite m3 = MallocSite.newLocalSite();

        ptm.addMallocSite("v1", m1);
        ptm.addMallocSite("v1", m2);
        ptm.addMallocSite("v2", m2);
        ptm.addMallocSite("v2", m3);

        TIRCopyStmt s1 = new TIRCopyStmt(null, null);

        ptm.addAliasingStmt("v1", m2, s1);
        ptm.addAliasingStmt("v2", m2, s1);

        assertEquals("ptm[v1] has one aliasing statement for m2", 1, ptm.getAliasingStmts("v1", m2).size());
        assertEquals("ptm[v2] has one aliasing statement for m2", 1, ptm.getAliasingStmts("v2", m2).size());

        Set<TIRCopyStmt> stmts1 = new HashSet<>();
        stmts1.add(s1);
        ptm.removeAliasingStmts(stmts1);

        assertEquals("ptm[v1] has zero aliasing statements for m2", 0, ptm.getAliasingStmts("v1", m2).size());
        assertEquals("ptm[v2] has zero aliasing statements for m2", 0, ptm.getAliasingStmts("v2", m2).size());

    }

}
