import static org.junit.Assert.assertTrue;

import org.junit.Test;

import matjuice.analysis.MallocSite;

public class TestMallocSite {
    @Test
    public void equals() {
        MallocSite m1 = MallocSite.newLocalSite();
        MallocSite m2 = MallocSite.newLocalSite();
        MallocSite g3 = MallocSite.newExternalSite();

        assertTrue("m1.equals(m1)", m1.equals(m1));
        assertTrue("m2.equals(m2)", m2.equals(m2));
        assertTrue("g3.equals(g3)", g3.equals(g3));

        assertTrue("!m1.equals(m2)", !m1.equals(m2));
        assertTrue("!m1.equals(g3)", !m1.equals(g3));

        assertTrue("!m2.equals(m1)", !m2.equals(m1));
        assertTrue("!m2.equals(g3)", !m2.equals(g3));

        assertTrue("!g3.equals(m1)", !g3.equals(m1));
        assertTrue("!g3.equals(m2)", !g3.equals(m2));
    }
}
