package matjuice;

import java.util.ArrayList;
import java.util.List;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;

@Parameters(separators = "=")
public class CommandLineOptions {
    @Parameter
    public List<String> arguments = new ArrayList<String>();

    @Parameter(names={ "--help" }, help=true, description="display this help message")
    public boolean help = false;

    @Parameter(names={ "--rename-operators" }, arity=1, description="replace scalar functions with JavaScript operators")
    public boolean renameOperators = true;

}
