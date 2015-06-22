/*
 *  Copyright 2014-2015, Vincent Foley-Bourgon, McGill University
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package matjuice.codegen;


import natlab.utils.NodeFinder;
import natlab.tame.tir.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import natlab.toolkits.rewrite.TempFactory;

import matjuice.jsast.*;


public class JSASTGenerator {

    private enum LoopDirection {Ascending, Descending, Unknown}

    private IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;

    public JSASTGenerator(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        this.analysis = analysis;
    }

    /**
     * Entry point for converting a piece of MATLAB code.  We perform
     * a rather straight-forward conversion from MATLAB to JavaScript.
     * @param tirFunc the function to compile.
     * @return a Function node.
     */
    public Function genFunction(TIRFunction tirFunc) {
        Function fn = new Function();

        // Add input parameters.
        fn.setFunctionName(new FunctionName(tirFunc.getName().getID()));
        for (ast.Name param: tirFunc.getInputParamList())
            fn.addParam(new Parameter(param.getID()));

        // Add body statements.
        StmtBlock stmts = new StmtBlock();
        stmts.setBraces(true);
        for (ast.Stmt astStmt: tirFunc.getStmts()) {
            TIRStmt tirStmt = (TIRStmt) astStmt;
            stmts.addStmt(genStmt(tirStmt));
        }

        // Add a return statement at the end of the function.
        Stmt returnStmt = makeStmtReturn(tirFunc);
        stmts.addStmt(returnStmt);

        fn.setStmtBlock(stmts);

        return fn;

    }

    /**
     * In MATLAB, results are returned to the caller by assigning into
     * out parameters.  We accumulate the name of these parameters
     * into a list, and return an array of the out parameters or just
     * the name in case there is only one.
     * @param astFunc the function to create a return statement for
     * @return null if the function doesn't have output parameters, a StmtReturn otherwise.
     */
    private Stmt makeStmtReturn(ast.Function astFunc) {
        List<Expr> returnNames = new List<>();
        for (ast.Name outParam: astFunc.getOutputParamList()) {
            returnNames.add(new ExprId(outParam.getID()));
        }

        switch (returnNames.getNumChild()) {
        case 0:  return new StmtReturn(new Opt<Expr>());
        case 1:  return new StmtReturn(new Opt<Expr>(returnNames.getChild(0)));
        default: return new StmtReturn(new Opt<Expr>(new ExprArray(returnNames)));
        }
    }

    /**
     * Main dispatching method for statements. It would be cleaner if
     * we could use Java's dynamic dispatch mechanism, but it would
     * require us to modify every Tamer/McSAF class, which we don't
     * want to do.
     * @param stmt The IR statement to convert.
     * @return The JS statement.
     */
    private Stmt genStmt(TIRStmt tirStmt) {
        Stmt js_stmt = null;

        // Assignment statements.
        if (tirStmt instanceof TIRDotSetStmt)
            js_stmt = genDotSetStmt((TIRDotSetStmt) tirStmt);
        else if (tirStmt instanceof TIRArraySetStmt)
            js_stmt = genArraySetStmt((TIRArraySetStmt) tirStmt);
        else if (tirStmt instanceof TIRAbstractAssignToVarStmt)
            js_stmt = genAssignToVarStmt((TIRAbstractAssignToVarStmt) tirStmt);
        else if (tirStmt instanceof TIRAbstractAssignToListStmt)
            js_stmt = genAssignToListStmt((TIRAbstractAssignToListStmt) tirStmt);

        // Control flow statements. (Missing: None)
        else if (tirStmt instanceof TIRIfStmt)
            js_stmt = genIfStmt((TIRIfStmt) tirStmt);
        else if (tirStmt instanceof TIRWhileStmt)
            js_stmt = genWhileStmt((TIRWhileStmt) tirStmt);
        else if (tirStmt instanceof TIRForStmt)
            js_stmt = genForStmt((TIRForStmt) tirStmt);
        else if (tirStmt instanceof TIRReturnStmt)
            js_stmt = genReturnStmt((TIRReturnStmt) tirStmt);
        else if (tirStmt instanceof TIRBreakStmt)
            js_stmt = genBreakStmt();
        else if (tirStmt instanceof TIRContinueStmt)
            js_stmt = genContinueStmt();

        // Other statements. (Missing: TIRPersistentStmt)
        else if (tirStmt instanceof TIRCommentStmt)
            js_stmt = genCommentStmt((TIRCommentStmt) tirStmt);

        else
            throw new UnsupportedOperationException(
                    String.format("Statement not supported: %d. %s [%s]",
                            ((ast.Stmt) tirStmt).getStartLine(),
                            ((ast.Stmt) tirStmt).getPrettyPrinted(),
                            ((ast.Stmt) tirStmt).getClass().getName())
                    );

        // Link the JavaScript statement with the TIR statement for use in future analyses.
        js_stmt.setTIRStmt(tirStmt);
        return js_stmt;
    }


    /**
     * In Tamer, we have a TIRStatementList that forces its elements
     * to be TIRStmt objects.  This method creates a block of code
     * that contains the translation of those statements.
     * @param tirStmts the statement list
     * @return a StmtBlock
     */
    private StmtBlock genStmtList(TIRStatementList tirStmts) {
        StmtBlock stmts = new StmtBlock();
        stmts.setBraces(true);
        for (int i = 0; i < tirStmts.getNumChild(); ++i) {
            TIRStmt currStmt = (TIRStmt) tirStmts.getChild(i);
            stmts.addStmt(genStmt(currStmt));
        }
        return stmts;
    }


    /**
     * A helper function that extracts the lhs name of an assignment.
     * Because it's a TIRAbstractAssignToVarStmt object, we are guaranteed
     * that there is exactly one element in the .getLValues() set.
     * @param tirStmt Extract the lhs from this statement.
     * @return the string of the name of the lhs.
     */
    private String extractLHSName(TIRAbstractAssignToVarStmt tirStmt) {
        String lhs = null;
        for (String name: tirStmt.getLValues())
            lhs = name;
        return lhs;
    }



    /**
     * MATLAB assignments of the form:
     *   x = <lit>
     *   x = y
     * where x and y are variables.
     *
     * @param tirStmt the statement to process.
     * @return A JS assignment statement (ExprAssign wrapped in a StmtExpr).
     */
    private Stmt genAssignToVarStmt(TIRAbstractAssignToVarStmt tirStmt) {
        String lhs = extractLHSName(tirStmt);
        ast.Expr rhs = tirStmt.getRHS();
        return new StmtExpr(new ExprAssign(new ExprId(lhs), genExpr(rhs)));
    }


    /**
     * MATLAB assignments of the form:
     *   [x1, x2, ..., xn] = f(a1, a2, ..., an)
     *
     * If the target list is empty, we simply generate a call to the function.
     *
     * If the target list contains a single variable, we assign directly to it.
     *
     * If the target list contains more than one item, we store the result
     * of the function call in a temporary array variable and then extract
     * the individual parts into the target parameters.
     *
     * @param tirStmt
     * @return A statement block (without braces) containing the call + assignments.
     */
    private Stmt genAssignToListStmt(TIRAbstractAssignToListStmt tirStmt) {
        StmtBlock stmts = new StmtBlock();
        stmts.setBraces(false);
        Expr call = tirStmt instanceof TIRCallStmt
          ? genCallExpr((ast.ParameterizedExpr) tirStmt.getRHS())
          : genArrayGetExpr((ast.ParameterizedExpr) tirStmt.getRHS(), tirStmt.getTargets());

        switch (tirStmt.getNumTargets()) {
        case 0:
            stmts.addStmt(new StmtExpr(call));
            break;

        case 1:
            stmts.addStmt(new StmtExpr(new ExprAssign(new ExprId(tirStmt.getTargetName().getID()), call)));
            break;

        default:
            ExprId tempVar = new ExprId(TempFactory.genFreshTempString());
            stmts.addStmt(new StmtExpr(new ExprAssign(tempVar, call)));
            int i = 0;
            for (ast.Expr target: tirStmt.getTargets()) {
                stmts.addStmt(
                    new StmtExpr(
                        new ExprAssign(
                            new ExprId(((ast.NameExpr) target).getName().getID()),
                            new ExprPropertyGet(tempVar, new ExprInt(i)))
                        )
                    );
                i++;
            }

        }

        return stmts;
    }


    /**
     * MATLAB assignments of the form:
     *   m(i1, i2, ..., in) = x
     * @param tirStmt
     * @return m = mc_array_set(m, x, [i1, i2, ..., in])
     */
    private Stmt genArraySetStmt(TIRArraySetStmt tirStmt) {
        String lhs = tirStmt.getArrayName().getID();
        String rhs = tirStmt.getValueName().getID();
        TIRCommaSeparatedList indicesList = tirStmt.getIndices();

        ExprArray indices = new ExprArray();
        for (ast.Expr expr: indicesList) {
            indices.addExpr(genExpr(expr));
        }

        List<Expr> args = new List<>(new ExprId(lhs), indices, new ExprId(rhs));

        return new StmtExpr(new ExprCall(new ExprId("mc_array_set"), args));
    }


    private Stmt genDotSetStmt(TIRDotSetStmt tirStmt) {
        throw new UnsupportedOperationException("MATLAB structs are not yet supported");
    }


    /**
     * Transformation of a MATLAB while loop.
     * @param tirWhile the while loop to transform
     * @return a StmtWhile node
     */
    private Stmt genWhileStmt(TIRWhileStmt tirWhile) {
        StmtBlock body = new StmtBlock();
        body.setBraces(true);
        for (ast.Stmt stmt: tirWhile.getStmtList()) {
            body.addStmt(genStmt((TIRStmt) stmt));
        }

        return new StmtWhile(
            genExpr(tirWhile.getExpr()),
            body
            );
    }


    /**
     * Transformation of a MATLAB for loop.  Tamer ensures
     * that the loops always have the form:
     *   for i = low:inc:high
     *     ...
     *   end
     *
     * @param tirFor the for loop to transform
     * @return a StmtFor node
     */
    private Stmt genForStmt(TIRForStmt tirFor) {
        // Generate the loop variables
        ExprId iterVar = new ExprId(tirFor.getLoopVarName().getID());
        ExprId lowerBound = new ExprId(tirFor.getLowerName().getID());
        ExprId upperBound = new ExprId(tirFor.getUpperName().getID());
        Expr incr = tirFor.hasIncr() ? new ExprId(tirFor.getIncName().getID()) : new ExprInt(1);

        LoopDirection dir = loopDir(tirFor);

        ExprId genericCmp = new ExprId(TempFactory.genFreshTempString());
        Stmt preamble = new StmtEmpty();
        // If the direction of the loop cannot be determined, add a preamble to select the correct comparison operator.
        if (dir == LoopDirection.Unknown) {
            // Preamble block to pick the correct comparison function
            // if incr > 0, use mc_le
            // if incr < 0, use mc_ge
            // if incr = 0, always return false
            Expr incrPositive = new ExprBinaryOp(">", incr, new ExprInt(0));
            StmtExpr incrPositiveBody = new StmtExpr(new ExprAssign(genericCmp, new ExprId("mc_le_SS")));

            Expr incrNegative = new ExprBinaryOp("<", incr, new ExprInt(0));
            StmtExpr incrNegativeBody = new StmtExpr(new ExprAssign(genericCmp, new ExprId("mc_ge_SS")));

            Expr incrZero = new ExprBinaryOp("===", incr, new ExprInt(0));
            StmtExpr incrZeroBody = new StmtExpr(new ExprAssign(genericCmp, new ExprId("mc_const_false")));

            preamble = new StmtBlock(
                    false,
                    new List<Stmt>(
                        new StmtIfThenElse(incrPositive, new StmtBlock(true, new List<Stmt>(incrPositiveBody)), new StmtBlock()),
                        new StmtIfThenElse(incrNegative, new StmtBlock(true, new List<Stmt>(incrNegativeBody)), new StmtBlock()),
                        new StmtIfThenElse(incrZero, new StmtBlock(true, new List<Stmt>(incrZeroBody)), new StmtBlock())
                        )
                    );
        }

        // Create the JS for loop continuation expression.
        Expr cmp;
        switch (dir) {
        case Ascending:
            cmp = new ExprBinaryOp("<=", iterVar, upperBound);
            break;
        case Descending:
            cmp = new ExprBinaryOp(">=", iterVar, upperBound);
            break;
        default:
            cmp = new ExprCall(genericCmp, new List<Expr>(iterVar, upperBound));
            break;
        }

        // Create the body block of the for loop and add the statements to the body.
        StmtBlock body = new StmtBlock();
        body.setBraces(true);
        for (ast.Stmt stmt: tirFor.getStmtList()) {
            body.addStmt(genStmt((TIRStmt) stmt));
        }

        // Return the preamble followed by the for loop
        return new StmtBlock(
                false,
                new List<Stmt>(
                        preamble,
                        new StmtFor(
                                new ExprAssign(iterVar, lowerBound),
                                cmp,
                                new ExprAssign(iterVar, new ExprBinaryOp("+", iterVar, incr)),
                                body
                                )
                        )
                );
    }


    /**
     * Compile an if/else/end statement to JavaScript.  In Tamer, there is
     * always an else block, though it may be empty.  If the else block is empty,
     * we won't generate it in our JavaScript.
     * @param tirIf the if/else/end statement
     * @return a StmtIfThenElse node
     */
    private Stmt genIfStmt(TIRIfStmt tirIf) {
        Expr condVar = new ExprId(tirIf.getConditionVarName().getID());
        StmtBlock thenBlock = genStmtList(tirIf.getIfStatements());
        StmtBlock elseBlock = genStmtList(tirIf.getElseStatements());
        return new StmtIfThenElse(condVar, thenBlock, elseBlock);
    }


    /**
     * Convert a MATLAB continue to a JavaScript continue.
     * @return A JavaScript continue statement.
     */
    private Stmt genContinueStmt() {
        return new StmtContinue();
    }


    /**
     * Convert a MATLAB break to a JavaScript break.
     * @return A JavaScript break statement.
     */
    private Stmt genBreakStmt() {
        return new StmtBreak();
    }


    /**
     * Convert a MATLAB return to a JavaScript break.  In MATLAB, you don't give
     * an expression to return, it exits the current function and the output
     * parameters are returned to the caller.  To emulate this behavior in JavaScript,
     * we find the names of the output parameters of the enclosing function and return them
     * explicitly.
     * @param tirReturn
     * @return A JavaScript return statement (returns a single value or a JS array depending
     *         on the number
     */
    private Stmt genReturnStmt(TIRReturnStmt tirReturn) {
        ast.Function astFunc = NodeFinder.findParent(ast.Function.class, tirReturn);
        Stmt returnStmt = makeStmtReturn(astFunc);
        return returnStmt;
    }

    private Stmt genCommentStmt(TIRCommentStmt tirComment) {
        if (tirComment.hasComments())
            return new StmtComment(tirComment.getNodeString());
        else
            return new StmtEmpty();
    }


    /**
     * Main dispatching method for expressions.  Like with statements, we use instanceof
     * to dispatch to the correct method, since we don't want to modify the class of all
     * the node types we handle.
     * @param expr The IR expression to convert.
     * @return The JS expression.
     */
    private Expr genExpr(ast.Expr expr) {
        if (expr instanceof ast.IntLiteralExpr) return genIntLiteralExpr((ast.IntLiteralExpr) expr);
        if (expr instanceof ast.FPLiteralExpr) return genFPLiteralExpr((ast.FPLiteralExpr) expr);
        if (expr instanceof ast.StringLiteralExpr) return genStringLiteralExpr((ast.StringLiteralExpr) expr);
        if (expr instanceof ast.NameExpr) return genNameExpr((ast.NameExpr) expr);
        if (expr instanceof ast.ParameterizedExpr) return genCallExpr((ast.ParameterizedExpr) expr);
        if (expr instanceof ast.ColonExpr) return genColonExpr((ast.ColonExpr) expr);
        throw new UnsupportedOperationException(
                String.format("Expr node not supported. %d:%d: [%s] [%s]",
                        expr.getStartLine(), expr.getStartColumn(),
                        expr.getPrettyPrinted(), expr.getClass().getName())
                );

    }

    /**
     * Convert an integer literal into JavaScript.
     * @param expr
     * @return
     */
    private ExprInt genIntLiteralExpr(ast.IntLiteralExpr expr) {
        return new ExprInt(Integer.parseInt(expr.getValue().getText()));
    }


    /**
     * Convert a double literal into JavaScript.
     * @param expr
     * @return
     */
    private ExprFloat genFPLiteralExpr(ast.FPLiteralExpr expr) {
        return new ExprFloat(Double.parseDouble(expr.getValue().getText()));
    }



    /**
     * Convert a string literal into JavaScript.
     *
     * TODO: handle escaping.
     * @param expr
     * @return
     */
    private ExprString genStringLiteralExpr(ast.StringLiteralExpr expr) {
        String value = expr.getValue();
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < value.length(); ++i) {
            if (value.charAt(i) == '"')
                buf.append("\\\"");
            else
                buf.append(value.charAt(i));
        }
        return new ExprString(buf.toString());
    }

    private ExprId genNameExpr(ast.NameExpr expr) {
        return new ExprId(expr.getName().getID());
    }

    /**
     * Convert a function call expression into JavaScript.
     *
     * @param expr a ParametrizedExpr where the name corresponds to a
     * function kind.
     * @return The JavaScript function call.
     *
     * TODO: Replace builtin calls like plus() and mtimes() with
     *       JavaScript operators when operands are scalars.
     */
    private Expr genCallExpr(ast.ParameterizedExpr expr) {
        String funcName = expr.getVarName();
        ExprCall call = new ExprCall();
        ExprId funName = new ExprId(funcName);
        call.setExpr(funName);
        for (ast.Expr arg: expr.getArgList()) {
            call.addArgument(genExpr(arg));
        }
        return call;
    }


    private Expr genArrayGetExpr(ast.ParameterizedExpr expr, TIRCommaSeparatedList targets) {
        ExprArray indices = new ExprArray();
        for (ast.Expr arg: expr.getArgList()) {
            indices.addExpr(genExpr(arg));
        }
        List<Expr> args = new List<Expr>(new ExprId(expr.getVarName()), indices);
        return new ExprCall(new ExprId("mc_array_get"), args);

        /*
        // Traverse the indices to see if they are all scalars, or if there is at least one
        // colon-expression (i.e. slicing operation)
        boolean has_slices = false;
        for (ast.Expr index: expr.getArgList()) {
            has_slices = has_slices || isColonExpr(index);
        }

        // Common case: If there is no colon expression, do a simple array lookup.
        if (!has_slices) {
            return genSingleElementIndexing(expr);
        }

        // General case: at least one index is a colon expression.

        // Step 1: convert all indices to slices (easier to handle in the JS library)
        ExprArray indices = new ExprArray();
        for (ast.Expr index: expr.getArgList()) {
            if (isColonExpr(index)) {
                indices.addExpr(genExpr(index));
            }
            else {
                Expr slice = convertToColonExpr(genExpr(index));
                indices.addExpr(slice);
            }
        }

        // Step 2: create an array of the resulting dimensions (use null if the size is not
        // known statically).  Also compute the number of elements in the result (or null
        // if it can't be known statically).
        ExprArray result_dimensions = new ExprArray();
        boolean dimensions_known_statically = true;
        Integer result_size = 1;

        AggrValue<BasicMatrixValue> singleton = analysis.getCurrentOutSet().get(targets.getName(0).getID()).getSingleton();
        BasicMatrixValue val = (BasicMatrixValue) singleton;
        System.out.println(val + " " + val.getShape());

        for (DimValue dv: val.getShape().getDimensions()) {
            Integer dim = dv.getIntValue();
            dimensions_known_statically = dimensions_known_statically && dim != null;
            result_dimensions.addExpr(dim == null ? new ExprId("null") : new ExprInt(dim));
            if (dimensions_known_statically)
                result_size *= dim;
            else
                result_size = null;
        }


        // Step 3: generate a function call, specializing for statically known dimensions.
        Integer num_dimensions = result_dimensions.getNumExpr();
        Integer num_indices = indices.getNumExpr();
        if ((num_dimensions == 1 || num_dimensions == 2) && dimensions_known_statically) {
            return new ExprCall(
                    new ExprId("mc_array_slice_static_" + num_indices),
                    new List<Expr>(genExpr(expr.getTarget()), new ExprInt(result_size), new ExprInt(num_dimensions), result_dimensions, indices)
                    );
        }
        else if (num_dimensions == 1 || num_dimensions == 2) {
            return new ExprCall(
                    new ExprId("mc_array_slice_dynamic_" + num_indices),
                    new List<Expr>(genExpr(expr.getTarget()), result_dimensions, indices)
                    );
        }

        return null;
        */
    }




    private Expr genColonExpr(ast.ColonExpr expr) {
        return new ExprColon();
    }



    /**
     * Try to statically determine whether a for loop is ascending or descending.
     * @param forStmt the foor loop
     * @return an enum value that says whether the loop ascends, descends or its direction is unknown.
     */
    private LoopDirection loopDir(TIRForStmt forStmt) {
        // If no explicit increment, then it defaults to 1.
        if (!forStmt.hasIncr()) {
            return LoopDirection.Ascending;
        }

        String incrName = forStmt.getIncName().getID();
        AggrValue<BasicMatrixValue> val = analysis.getOutFlowSets().get(forStmt).get(incrName).getSingleton();
        BasicMatrixValue bmv = (BasicMatrixValue)val;

        if (bmv.hasRangeValue()) {
            if (bmv.getRangeValue().isRangeValuePositive())
                return LoopDirection.Ascending;
            else if (bmv.getRangeValue().isRangeValueNegative())
                return LoopDirection.Descending;
            else
                return LoopDirection.Unknown;
        }
        else {
            return LoopDirection.Unknown;
        }
    }

}
