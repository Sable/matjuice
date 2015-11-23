import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
      TestPointsToMap.class,
      TestPointsToValue.class,
      TestMallocSite.class
})

public class TestSuite {
}
