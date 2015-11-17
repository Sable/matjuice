import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import org.junit.Test;

import matjuice.analysis.PointsToValue;
import matjuice.analysis.MallocSite;

import natlab.tame.tir.TIRCopyStmt;

public class TestPointsToValue {
    @Test
    public void empty() {
        PointsToValue ptv1 = new PointsToValue();
        assertEquals("ptv1 has no memory sites", 0, ptv1.getMallocSites().size());
    }

    @Test
    public void addMallocSite() {
        PointsToValue p = new PointsToValue();
        MallocSite m1 = MallocSite.newLocalSite();
        MallocSite m2 = MallocSite.newLocalSite();

        assertEquals("p has no memory sites", 0, p.getMallocSites().size());
        p.addMallocSite(m1);
        assertEquals("p has 1 memory site", 1, p.getMallocSites().size());
        assertTrue("m1 is a memory site of p", p.getMallocSites().contains(m1));
        p.addMallocSite(m1);
        assertEquals("p has 1 memory site", 1, p.getMallocSites().size());
        assertTrue("m1 is a memory site of p", p.getMallocSites().contains(m1));
        p.addMallocSite(m2);
        assertEquals("p has 2 memory sites", 2, p.getMallocSites().size());
        assertTrue("m1 is a memory site of p", p.getMallocSites().contains(m1));
        assertTrue("m2 is a memory site of p", p.getMallocSites().contains(m2));
    }

    @Test
    public void addAliasingStmt() {
        PointsToValue p = new PointsToValue();
        MallocSite m1 = MallocSite.newLocalSite();
        MallocSite m2 = MallocSite.newLocalSite();
        TIRCopyStmt s1 = new TIRCopyStmt(null, null);
        TIRCopyStmt s2 = new TIRCopyStmt(null, null);

        p.addMallocSite(m1);
        assertEquals("p[m1] is empty", 0, p.getAliasingStmts(m1).size());
        p.addAliasingStmt(m1, s1);
        assertEquals("p[m1] contains s1", 1, p.getAliasingStmts(m1).size());
        assertTrue("p[m1] contains s1", p.getAliasingStmts(m1).contains(s1));

        assertFalse("p does not contain m2", p.getMallocSites().contains(m2));
        p.addAliasingStmt(m2, s2);
        assertTrue("p contains m2", p.getMallocSites().contains(m2));
        assertEquals("p[m2] contains s2", 1, p.getAliasingStmts(m2).size());
        assertTrue("p[m2] contains s2", p.getAliasingStmts(m2).contains(s2));

        p.addMallocSite(m2);  // Doesn't affect current set
        assertTrue("p contains m2", p.getMallocSites().contains(m2));
        assertEquals("p[m2] contains s2", 1, p.getAliasingStmts(m2).size());
        assertTrue("p[m2] contains s2", p.getAliasingStmts(m2).contains(s2));
    }

    @Test
    public void merge() {
        PointsToValue p1 = new PointsToValue();
        PointsToValue p2 = new PointsToValue();

        MallocSite m1 = MallocSite.newLocalSite();
        MallocSite m2 = MallocSite.newLocalSite();
        MallocSite m3 = MallocSite.newLocalSite();

        TIRCopyStmt s1 = new TIRCopyStmt(null, null);
        TIRCopyStmt s2 = new TIRCopyStmt(null, null);
        TIRCopyStmt s3 = new TIRCopyStmt(null, null);

        p1.addAliasingStmt(m1, s1);
        p1.addAliasingStmt(m2, s2);

        p2.addAliasingStmt(m1, s1);
        p2.addAliasingStmt(m3, s3);

        PointsToValue p3 = p1.merge(p2);
        PointsToValue p4 = p2.merge(p1);

        assertTrue("p3 contains m1", p3.getMallocSites().contains(m1));
        assertTrue("p3 contains m2", p3.getMallocSites().contains(m2));
        assertTrue("p3 contains m3", p3.getMallocSites().contains(m3));
        assertTrue("p3[m1] contains s1", p3.getAliasingStmts(m1).contains(s1));
        assertTrue("p3[m2] contains s2", p3.getAliasingStmts(m2).contains(s2));
        assertTrue("p3[m3] contains s3", p3.getAliasingStmts(m3).contains(s3));

        assertTrue("p4 contains m1", p4.getMallocSites().contains(m1));
        assertTrue("p4 contains m2", p4.getMallocSites().contains(m2));
        assertTrue("p4 contains m3", p4.getMallocSites().contains(m3));
        assertTrue("p4[m1] contains s1", p4.getAliasingStmts(m1).contains(s1));
        assertTrue("p4[m2] contains s2", p4.getAliasingStmts(m2).contains(s2));
        assertTrue("p4[m3] contains s3", p4.getAliasingStmts(m3).contains(s3));
    }

    @Test
    public void equals() {
                PointsToValue p1 = new PointsToValue();
        PointsToValue p2 = new PointsToValue();

        MallocSite m1 = MallocSite.newLocalSite();
        MallocSite m2 = MallocSite.newLocalSite();
        MallocSite m3 = MallocSite.newLocalSite();

        TIRCopyStmt s1 = new TIRCopyStmt(null, null);
        TIRCopyStmt s2 = new TIRCopyStmt(null, null);
        TIRCopyStmt s3 = new TIRCopyStmt(null, null);

        p1.addAliasingStmt(m1, s1);
        p1.addAliasingStmt(m2, s2);

        p2.addAliasingStmt(m1, s1);
        p2.addAliasingStmt(m3, s3);

        PointsToValue p3 = p1.merge(p2);
        PointsToValue p4 = p2.merge(p1);

        assertTrue("p1.equals(p1)", p1.equals(p1));
        assertFalse("p1.equals(p2)", p1.equals(p2));
        assertFalse("p1.equals(p3)", p1.equals(p3));
        assertFalse("p1.equals(p4)", p1.equals(p4));

        assertTrue("p2.equals(p2)", p2.equals(p2));
        assertFalse("p2.equals(p1)", p2.equals(p1));
        assertFalse("p2.equals(p3)", p2.equals(p3));
        assertFalse("p2.equals(p4)", p2.equals(p4));

        assertTrue("p3.equals(p3)", p3.equals(p3));
        assertTrue("p3.equals(p4)", p3.equals(p4));
        assertFalse("p3.equals(p1)", p3.equals(p1));
        assertFalse("p3.equals(p2)", p3.equals(p2));

        assertTrue("p4.equals(p3)", p4.equals(p3));
        assertTrue("p4.equals(p4)", p4.equals(p4));
        assertFalse("p4.equals(p1)", p4.equals(p1));
        assertFalse("p4.equals(p2)", p4.equals(p2));

        assertTrue("new = new", (new PointsToValue()).equals(new PointsToValue()));
    }

    @Test
    public void testHashCode() {
        PointsToValue p1 = new PointsToValue();
        PointsToValue p2 = new PointsToValue();
        MallocSite m1 = MallocSite.newLocalSite();
        TIRCopyStmt s1 = new TIRCopyStmt(null, null);

        assertTrue("(1) p1.hashCode() == p2.hashCode()", p1.hashCode() == p2.hashCode());
        p1.addMallocSite(m1);
        assertTrue("(2) p1.hashCode() != p2.hashCode()", p1.hashCode() != p2.hashCode());
        p2.addMallocSite(m1);
        assertTrue("(3) p1.hashCode() == p2.hashCode()", p1.hashCode() == p2.hashCode());
        p1.addAliasingStmt(m1, s1);
        assertTrue("(4) p1.hashCode() != p2.hashCode()", p1.hashCode() != p2.hashCode());
        p2.addAliasingStmt(m1, s1);
        assertTrue("(5) p1.hashCode() == p2.hashCode()", p1.hashCode() == p2.hashCode());
    }

}
