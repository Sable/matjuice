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

import java.util.Set;
import java.util.HashSet;
import java.util.Map;

import matjuice.jsast.*;
import matjuice.analysis.ParameterCopyAnalysis;
import matjuice.analysis.LocalVars;
import matjuice.analysis.PointsToAnalysis;
import matjuice.analysis.PointsToValue;
import matjuice.transformer.ParameterCopyTransformer;
import matjuice.transformer.CopyInsertion;
import matjuice.transformer.MJCopyStmt;
import matjuice.utils.Utils;

import natlab.utils.NodeFinder;
import natlab.tame.tir.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import natlab.toolkits.rewrite.TempFactory;

public class Generator {
    private enum LoopDirection {Ascending, Descending, NonMoving, Unknown}

    private Set<String> locals;
    private IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;

    public Generator(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        this.analysis = analysis;
    }



    /**
     * Transform a Tamer function into a JavaScript function.
     *
     * - "var" declarations will be added for the locals and temporaries
     * - formal parameters that might be written to will be cloned
     * - a return statement of the output parameter list is added at
     *   the end of the function
     */
    public Function genFunction(TIRFunction tirFunction) {
        // Add an explicit return at the end of the function
        addReturn(tirFunction);

        // Identify locals in order to add proper "var" declarations in JS.
        locals = LocalVars.apply(tirFunction);

        // Do copy insertion
        performCopyInsertion(tirFunction);

        // Do the statements first as some may create new locals.
        StmtSequence jsStmts = genStmtList(tirFunction.getStmtList());

        List<Identifier> jsArgs = new List<>();
        for (ast.Name argName : tirFunction.getInputParamList()) {
            jsArgs.add(new Identifier(argName.getID()));
        }

        List<Identifier> jsLocals = new List<>();
        for (String localName : locals) {
            jsLocals.add(new Identifier(localName));
        }

        return new Function(tirFunction.getName().getID(), jsArgs, jsLocals, jsStmts);
    }

    private static void addReturn(TIRFunction tirFunction) {
        TIRStatementList stmts = tirFunction.getStmtList();
        TIRStmt ret = new TIRReturnStmt();
        stmts.add(ret);
        tirFunction.setStmtList(stmts);
    }

    private static void performCopyInsertion(TIRFunction tirFunction) {
        // Identify the input parameters that need to be copied
        // and insert the appropriate MJCopyStmt nodes in tirFunction.
        Map<TIRStatementList, Set<String>> writtenParams = ParameterCopyAnalysis.apply(tirFunction);
        ParameterCopyTransformer.apply(tirFunction, writtenParams);

        // Insert copy statements to prevent aliasing.
        // 1. perform the points-to analysis
        // 2. insert MJCopyStmt nodes for one aliased variable
        // 3. re-run analysis and transformation
        // 4. iterate until fixed point
        PointsToAnalysis pta;
        do {
            pta = new PointsToAnalysis(tirFunction);
            tirFunction.tirAnalyze(pta);
            pta.print(tirFunction);
        } while (CopyInsertion.apply(tirFunction, pta));
    }

    /**
     * Transform a Tamer statement into a JavaScript statement.
     * If an unsupported statement is passed, an exception
     * is thrown.
     */
    private Stmt genStmt(ast.Stmt tirStmt) {
        if (tirStmt instanceof MJCopyStmt)
            return genMJCopyStmt((MJCopyStmt) tirStmt);
        else if (tirStmt instanceof TIRCopyStmt)
            return genCopyStmt((TIRCopyStmt) tirStmt);
        else if (tirStmt instanceof TIRAssignLiteralStmt)
            return genAssignLiteralStmt((TIRAssignLiteralStmt) tirStmt);
        else if (tirStmt instanceof TIRArrayGetStmt)
            return genArrayGetStmt((TIRArrayGetStmt) tirStmt);
        else if (tirStmt instanceof TIRArraySetStmt)
            return genArraySetStmt((TIRArraySetStmt) tirStmt);
        else if (tirStmt instanceof TIRCallStmt)
            return genCallStmt((TIRCallStmt) tirStmt);
        else if (tirStmt instanceof TIRReturnStmt)
            return genReturnStmt((TIRReturnStmt) tirStmt);
        else if (tirStmt instanceof TIRBreakStmt)
            return new StmtBreak();
        else if (tirStmt instanceof TIRContinueStmt)
            return new StmtContinue();
        else if (tirStmt instanceof TIRIfStmt)
            return genIfStmt((TIRIfStmt) tirStmt);
        else if (tirStmt instanceof TIRWhileStmt)
            return genWhileStmt((TIRWhileStmt) tirStmt);
        else if (tirStmt instanceof TIRForStmt)
            return genForStmt((TIRForStmt) tirStmt);
        else if (tirStmt instanceof TIRCommentStmt) {
            // Return an empty sequence for a comment statement.
            return new StmtSequence();
        }
        else
            throw new UnsupportedOperationException(
                String.format("Statement not supported: %d. %s [%s]",
                  tirStmt.getStartLine(),
                  tirStmt.getPrettyPrinted(),
                  tirStmt.getClass().getName())
                );
    }

    private Stmt genMJCopyStmt(MJCopyStmt tirStmt) {
        String lhs = getSingleLhs(tirStmt);
        return new StmtMethod(new Opt<>(new Identifier(lhs)), "mj_clone", new ExprId(lhs), new List<>());
    }

    /**
     * Transform a statement of the form
     *   id1 = id2;
     * into JavaScript.  If id2 is not a scalar and may be written
     * to, we perform a deep copy.
     */
    private Stmt genCopyStmt(TIRCopyStmt tirStmt) {
        String lhs = getSingleLhs(tirStmt);
        return new StmtAssign(lhs, genExpr(tirStmt.getRHS()));
    }

    /**
     * Transform a statement of the form
     *   id = lit;
     * into JavaScript.  Literals are number literals (ints and floats),
     * strings, etc.
     */
    private Stmt genAssignLiteralStmt(TIRAssignLiteralStmt tirStmt) {
        String lhs = getSingleLhs(tirStmt);
        return new StmtAssign(lhs, genExpr(tirStmt.getRHS()));
    }

    /**
     * Transform a statement of the form
     *   return;
     * into JavaScript.  Because the way functions return values is
     * different in MATLAB and JavaScript, the helper `createReturnStmt`
     * performs some extra work.
     */
    private Stmt genReturnStmt(TIRReturnStmt tirStmt) {
        ast.Function astFunc = NodeFinder.findParent(ast.Function.class, tirStmt);
        return createReturnStmt(astFunc);
    }

    private Stmt createReturnStmt(ast.Function astFunc) {
        List<Identifier> returnNames = new List<>();
        for (ast.Name outParam: astFunc.getOutputParamList()) {
            returnNames.add(new Identifier(outParam.getID()));
        }

        // Choosing "return;", "return x;" or "return [x, y];"
        // is done in the pretty printer.
        return new StmtReturn(returnNames);
    }

    /**
     * Transform a call statement.  If the function is a MATLAB operator
     * (e.g. plus() or rem()), the call is replaced by a StmtBinop.  If
     * the function is a built-in, the "mc_" prefix is prepended and a
     * suffix describing the type (e.g. mc_plus_MM) will be appended.
     */
    private Stmt genCallStmt(TIRCallStmt tirStmt) {
        if (OperatorRenamer.isBasicArithmeticOperator(tirStmt, analysis)) {
            return genOp(tirStmt);
        }

        List<Expr> args = new List<>();
        for (ast.Expr expr : tirStmt.getArguments()) {
            args.add(genExpr(expr));
        }

        String functionName = BuiltinRenamer.getFunctionName(tirStmt, analysis);

        if (tirStmt.isAssignToVar()) {
            return new StmtCall(
                new Opt<Identifier>(new Identifier(tirStmt.getTargetName().getID())),
                functionName,
                args);
        }
        else if (tirStmt.getTargets().size() == 0) {
            return new StmtCall(
                new Opt<Identifier>(),
                functionName,
                args);
        }
        else {
            String listTarget = newTemp();
            StmtCall funCall = new StmtCall(
                new Opt<Identifier>(new Identifier(listTarget)),
                functionName,
                args);
            StmtSequence seq = new StmtSequence();
            seq.addStmt(funCall);
            int i = 0;
            for (ast.Expr expr : tirStmt.getTargets()) {
                seq.addStmt(new StmtGet(
                      ((ast.NameExpr) expr).getName().getID(),
                      listTarget,
                      new ExprInt(i)));
                  ++i;
            }
            return seq;
        }
    }

    /**
     * Transform an operator function call into an operator operation.
     * E.g. plus(x, y) => x+y
     */
    private Stmt genOp(TIRCallStmt tirStmt) {
        java.util.List<Expr> args = new java.util.ArrayList<>();
        for (ast.Expr arg : tirStmt.getArguments()) {
            args.add(genExpr(arg));
        }
        return OperatorRenamer.renameOperator(tirStmt, args);
    }


    /**
     * Transform a MATLAB array fetching operation into a JavaScript get
     * operation.  If the indices might represent a slice, a call to the
     * dynamic "mc_slice_get" function is made.  If all the indices are scalars
     * we convert them to a linearized index, perform bounds check on that index
     * and generate a JavaScript StmtGet.
     */
    private Stmt genArrayGetStmt(TIRArrayGetStmt tirStmt) {
        String dst = getSingleLhs(tirStmt);
        String src = tirStmt.getArrayName().getID();
        if (isSlicingOperation(tirStmt, tirStmt.getIndices())) {
            ExprList indices = new ExprList();
            for (ast.Expr index : tirStmt.getIndices()) {
                indices.addValue(genExpr(index));
            }

            List<Expr> args = new List<>(new ExprId(src), indices);
            return new StmtSequence(
                new List<Stmt>(
                    new StmtCall(new Opt<Identifier>(new Identifier(dst)), "mc_slice_get", args)
                )
            );
        }
        else {
            ExprList indices = new ExprList();
            for (ast.Expr index : tirStmt.getIndices()) {
                indices.addValue(genExpr(index));
            }

            List<Expr> args = new List<>(indices);
            return new StmtSequence(
                new List<Stmt>(
                    new StmtMethod(new Opt<Identifier>(new Identifier(dst)), "mj_get", new ExprId(src), args)
                )
            );
            /*
            String linearizedIndex = newTemp();
            String arrayName = tirStmt.getArrayName().getID();
            StmtSequence seq = genIndexingComputation(
                tirStmt, arrayName, tirStmt.getIndices(), linearizedIndex);

            // Bounds check
            String lessThanZero = newTemp();
            String numElementClosure = newTemp();
            String numElements = newTemp();
            String greaterThanEnd = newTemp();
            String outOfBounds = newTemp();
            seq.addStmt(new StmtMethod(new Opt<>(new Identifier(numElements)), "mj_numel", new ExprId(arrayName), new List<>()));
            seq.addStmt(new StmtBinop(lessThanZero, Binop.Lt, new ExprId(linearizedIndex), new ExprInt(0)));
            seq.addStmt(new StmtBinop(greaterThanEnd, Binop.Ge, new ExprId(linearizedIndex), new ExprId(numElements)));
            seq.addStmt(new StmtBinop(outOfBounds, Binop.Or, new ExprId(lessThanZero), new ExprId(greaterThanEnd)));
            seq.addStmt(new StmtIf(outOfBounds,
                new StmtSequence(new List<>(new StmtCall(new Opt<>(), "mc_error", new List<>(new ExprString("index out of bounds"))))),
                new StmtSequence()));
            seq.addStmt(new StmtGet(getSingleLhs(tirStmt), arrayName, new ExprId(linearizedIndex)));
            return seq;
            */
        }
    }

    /**
     * Transform a MATLAB array set operation into a JavaScript set
     * operation.  If the indices might represent a slice, a call to the
     * dynamic "mc_slice_set" function is made.  If all the indices are scalars
     * we convert them to a linearized index, perform bounds check on that index
     * and generate a JavaScript StmtSet.
     */
    private Stmt genArraySetStmt(TIRArraySetStmt tirStmt) {
        String dst = tirStmt.getArrayName().getID();
        String src = tirStmt.getValueName().getID();
        if (isSlicingOperation(tirStmt, tirStmt.getIndices())) {
            ExprList indices = new ExprList();
            for (ast.Expr index : tirStmt.getIndices()) {
                indices.addValue(genExpr(index));
            }

            List<Expr> args = new List<>(new ExprId(dst), new ExprId(src), indices);
            return new StmtSequence(
                new List<Stmt>(
                    new StmtCall(new Opt<Identifier>(), "mc_slice_set", args)
                    )
                );
        }
        else {
            ExprList indices = new ExprList();
            for (ast.Expr index : tirStmt.getIndices()) {
                indices.addValue(genExpr(index));
            }

            List<Expr> args = new List<>(indices, new ExprId(src));
            return new StmtSequence(
                new List<Stmt>(
                    new StmtMethod(new Opt<Identifier>(), "mj_set", new ExprId(dst), args)
                )
            );

            /*
            String linearizedIndex = newTemp();
            String arrayName = tirStmt.getArrayName().getID();
            StmtSequence seq = genIndexingComputation(tirStmt, arrayName, tirStmt.getIndices(), linearizedIndex);

            // Bounds check
            String lessThanZero = newTemp();
            String numElementClosure = newTemp();
            String numElements = newTemp();
            String greaterThanEnd = newTemp();
            seq.addStmt(new StmtMethod(new Opt<>(new Identifier(numElements)), "mj_numel", new ExprId(arrayName), new List<>()));
            seq.addStmt(new StmtBinop(lessThanZero, Binop.Lt, new ExprId(linearizedIndex), new ExprInt(0)));
            seq.addStmt(new StmtIf(
                  lessThanZero,
                  new StmtSequence(new List<>(new StmtCall(new Opt<>(), "mc_error", new List<>(new ExprString("index out of bounds"))))),
                  new StmtSequence()));
            seq.addStmt(new StmtBinop(greaterThanEnd, Binop.Ge, new ExprId(linearizedIndex), new ExprId(numElements)));
            seq.addStmt(new StmtIf(
                  greaterThanEnd,
                  new StmtSequence(new List<>(new StmtCall(new Opt<>(new Identifier(arrayName)), "mc_resize", new List<>(new ExprId(arrayName), new ExprId(linearizedIndex))))),
                  new StmtSequence()));

            seq.addStmt(new StmtSet(arrayName, new ExprId(linearizedIndex), tirStmt.getValueName().getID()));
            return seq;
            */
        }
    }

    /**
     * Transform a MATLAB if statement into a JavaScript if statement.  The
     * pretty printer is responsible for not displaying the else part if it
     * contains 0 statements.
     */
    private Stmt genIfStmt(TIRIfStmt tirStmt) {
        return new StmtIf(
            tirStmt.getConditionVarName().getID(),
            genStmtList(tirStmt.getIfStatements()),
            genStmtList(tirStmt.getElseStatements()));
    }

    /**
     * Transform a MATLAB while statement into JavaScript.
     */
    private Stmt genWhileStmt(TIRWhileStmt tirStmt) {
        return new StmtWhile(
            genExpr(tirStmt.getCondition()),
            genStmtList(tirStmt.getStatements()));
    }

    /**
     * Transform a MATLAB for loop into an equivalent JavaScript
     * while loop.  For simplicity's sake, our JavaScript IR does
     * not have a for loop.
     */
    private Stmt genForStmt(TIRForStmt tirStmt) {
        LoopDirection direction = loopDir(tirStmt);
        switch (direction) {
        case Ascending:
        case Descending:
            return genStaticForStmt(tirStmt, direction);
        case Unknown:
            return genDynamicForStmt(tirStmt);
        default:
            /* UNREACHABLE */
            return genDynamicForStmt(tirStmt);
        }
    }


    /**
     * Generate a for loop when the direction can be known statically.
     */
    private Stmt genStaticForStmt(TIRForStmt tirStmt, LoopDirection direction) {
        Binop cmpOp = (direction == LoopDirection.Ascending) ? Binop.Le : Binop.Ge;
        String iterVar = tirStmt.getLoopVarName().getID();
        Expr incr = tirStmt.hasIncr() ? new ExprId(tirStmt.getIncName().getID()) : new ExprInt(1);
        StmtSequence body = genStmtList(tirStmt.getStatements());

        return new StmtFor(
            iterVar,
            new ExprId(tirStmt.getLowerName().getID()),
            new ExprId(tirStmt.getUpperName().getID()),
            incr,
            cmpOp,
            Binop.Add,
            body
            );
    }


    private Stmt genDynamicForStmt(TIRForStmt tirStmt) {
        String testFunc = newTemp();
        StmtSequence seq = new StmtSequence();

        Expr from = new ExprId(tirStmt.getLowerName().getID());
        Expr to = new ExprId(tirStmt.getUpperName().getID());
        Expr step = tirStmt.hasIncr() ? new ExprId(tirStmt.getIncName().getID()) : new ExprInt(1);
        Expr loopVar = new ExprId(tirStmt.getLoopVarName().getID());

        seq.addStmt(new StmtCall(
              new Opt<Identifier>(new Identifier(testFunc)),
              "loop_direction",
              new List<Expr>(from, step, to)
              )
            );

        String testVar = newTemp();
        seq.addStmt(new StmtCall(new Opt<>(new Identifier(testVar)), testFunc, new List<Expr>(loopVar, to)));

        StmtSequence body = genStmtList(tirStmt.getStatements());
        body.addStmt(new StmtBinop(
              tirStmt.getLoopVarName().getID(),
              Binop.Add,
              loopVar,
              step));
        body.addStmt(new StmtCall(
              new Opt<>(new Identifier(testVar)),
              testFunc,
              new List<>(loopVar, to)));
        seq.addStmt(new StmtWhile(new ExprId(testVar), body));
        return seq;
    }

    private StmtSequence genStmtList(TIRStatementList tirStmts) {
        StmtSequence seq = new StmtSequence();
        for (ast.Stmt stmt : tirStmts) {
            seq.addStmt(genStmt(stmt));
        }
        return seq;
    }


    private Expr genExpr(ast.Expr expr) {
        if (expr instanceof ast.IntLiteralExpr)
            return genIntLiteralExpr((ast.IntLiteralExpr) expr);
        if (expr instanceof ast.FPLiteralExpr)
            return genFPLiteralExpr((ast.FPLiteralExpr) expr);
        if (expr instanceof ast.StringLiteralExpr)
            return genStringLiteralExpr((ast.StringLiteralExpr) expr);
        if (expr instanceof ast.NameExpr)
            return genNameExpr((ast.NameExpr) expr);
        if (expr instanceof ast.ColonExpr)
            return new ExprId("MC_COLON");

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

    private Expr genNameExpr(ast.NameExpr expr) {
        String varName = expr.getName().getID();
        return new ExprId(varName);
    }

    private static String getSingleLhs(TIRAbstractAssignToVarStmt tirStmt) {
        String ret = null;
        for (String name : tirStmt.getLValues())
            ret = name;
        return ret;
    }

    private String getSingleLhs(TIRAbstractAssignToListStmt tirStmt) {
        String ret = null;
        for (String name : tirStmt.getLValues())
            ret = name;
        return ret;
    }

    /**
     * Take a list of 1-based indices and generate a 0-based linearized index that will be stored
     * in the variable name referred by [linearizedIndex].
     */
    private StmtSequence genIndexingComputation(TIRStmt tirStmt, String arrayName, TIRCommaSeparatedList indices, String linearizedIndex) {
        // Small optimization for when indexing is done with a single index.
        if (indices.size() == 1) {
            return new StmtSequence(new List<>(
                  new StmtBinop(linearizedIndex, Binop.Sub, new ExprId(indices.getName(0).getID()), new ExprInt(1))
                  ));
        }

        // General case for >= 2 indices.
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, arrayName);
        java.util.List<DimValue> dims = bmv.getShape().getDimensions();

        StmtSequence seq = new StmtSequence();

        String stride = newTemp();
        String scratch = newTemp();

        seq.addStmt(new StmtAssign(stride, new ExprInt(1)));
        seq.addStmt(new StmtAssign(linearizedIndex, new ExprInt(0)));

        int i = 0;
        for (ast.Expr tirIndex : indices) {
            seq.addStmt(new StmtBinop(scratch, Binop.Sub, genExpr(tirIndex), new ExprInt(1)));
            seq.addStmt(new StmtBinop(scratch, Binop.Mul, new ExprId(scratch), new ExprId(stride)));
            seq.addStmt(new StmtBinop(linearizedIndex, Binop.Add, new ExprId(linearizedIndex), new ExprId(scratch)));

            int dimensionSize = (i < dims.size() && dims.get(i).hasIntValue()) ? dims.get(i).getIntValue() : 1;
            seq.addStmt(new StmtBinop(stride, Binop.Mul, new ExprId(stride), new ExprInt(dimensionSize)));
            ++i;
        }
        return seq;
    }

    private boolean isSlicingOperation(TIRStmt tirStmt, TIRCommaSeparatedList indices) {
        for (ast.Expr index : indices) {
            if (index instanceof ast.ColonExpr)
                return true;
            if (index instanceof ast.NameExpr) {
                ast.Name indexName = ((ast.NameExpr) index).getName();
                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, indexName.getID());
                if (!bmv.getShape().isScalar())
                    return true;
            }
        }
        return false;
    }

    private String newTemp() {
        String tmp = TempFactory.genFreshTempString();
        locals.add(tmp);
        return tmp;
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

        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, forStmt, forStmt.getIncName().getID());

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
