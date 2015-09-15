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

import matjuice.jsast.*;
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

    public Generator(
        Set<String> locals,
        IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis
        ) {
        this.locals = locals;
        this.analysis = analysis;
    }



    // TODO(vfoley): copy input parameters that are written to.
    public Function genFunction(TIRFunction tirFunction) {
        // Do the statements first as some may create new locals.
        List<Stmt> jsStmts = new List<>();
        for (ast.Stmt tirStmt : tirFunction.getStmtList()) {
            jsStmts.add(genStmt(tirStmt));
        }
        jsStmts.add(createReturnStmt(tirFunction));

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

    /**
     * Transform a Tamer statement into a JavaScript statement.
     * If an unsupported statement is passed, an exception
     * is thrown.
     */
    private Stmt genStmt(ast.Stmt tirStmt) {
        if (tirStmt instanceof TIRCopyStmt)
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

    // TODO(vfoley): implement copy analysis
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

    private Stmt genCallStmt(TIRCallStmt tirStmt) {
        if (RenameOperator.isBasicArithmeticOperator(tirStmt, analysis)) {
            return genOp(tirStmt);
        }

        List<Expr> args = new List<>();
        for (ast.Expr expr : tirStmt.getArguments()) {
            args.add(genExpr(expr));
        }

        if (tirStmt.isAssignToVar()) {
            return new StmtCall(
                new Opt<Identifier>(new Identifier(tirStmt.getTargetName().getID())),
                tirStmt.getFunctionName().getID(),
                args);
        }
        else if (tirStmt.getTargets().size() == 0) {
            return new StmtCall(
                new Opt<Identifier>(),
                tirStmt.getFunctionName().getID(),
                args);
        }
        else {
            String listTarget = newTemp();
            StmtCall funCall = new StmtCall(
                new Opt<Identifier>(new Identifier(listTarget)),
                tirStmt.getFunctionName().getID(),
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

    private Stmt genOp(TIRCallStmt tirStmt) {
        java.util.List<Expr> args = new java.util.ArrayList<>();
        for (ast.Expr arg : tirStmt.getArguments()) {
            args.add(genExpr(arg));
        }
        return RenameOperator.renameOperator(tirStmt, args);
    }


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
            seq.addStmt(new StmtGet(numElementClosure, arrayName, new ExprString("mj_numel")));
            seq.addStmt(new StmtCall(new Opt<>(new Identifier(numElements)), numElementClosure, new List<>()));
            seq.addStmt(new StmtBinop(lessThanZero, Binop.Lt, new ExprId(linearizedIndex), new ExprInt(0)));
            seq.addStmt(new StmtBinop(greaterThanEnd, Binop.Ge, new ExprId(linearizedIndex), new ExprId(numElements)));
            seq.addStmt(new StmtBinop(outOfBounds, Binop.Or, new ExprId(lessThanZero), new ExprId(greaterThanEnd)));
            seq.addStmt(new StmtIf(outOfBounds,
                new List<>(new StmtCall(new Opt<>(), "mc_error", new List<>(new ExprString("index out of bounds")))),
                new List<>()));

            seq.addStmt(new StmtGet(getSingleLhs(tirStmt), arrayName, new ExprId(linearizedIndex)));
            return seq;
        }
    }

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
            String linearizedIndex = newTemp();
            String arrayName = tirStmt.getArrayName().getID();
            StmtSequence seq = genIndexingComputation(tirStmt, arrayName, tirStmt.getIndices(), linearizedIndex);

            // Bounds check
            String lessThanZero = newTemp();
            String numElementClosure = newTemp();
            String numElements = newTemp();
            String greaterThanEnd = newTemp();
            seq.addStmt(new StmtGet(numElementClosure, arrayName, new ExprString("mj_numel")));
            seq.addStmt(new StmtCall(new Opt<>(new Identifier(numElements)), numElementClosure, new List<>()));
            seq.addStmt(new StmtBinop(lessThanZero, Binop.Lt, new ExprId(linearizedIndex), new ExprInt(0)));
            seq.addStmt(new StmtIf(
                  lessThanZero,
                  new List<>(new StmtCall(new Opt<>(), "mc_error", new List<>(new ExprString("index out of bounds")))),
                  new List<>()));
            seq.addStmt(new StmtBinop(greaterThanEnd, Binop.Ge, new ExprId(linearizedIndex), new ExprId(numElements)));
            seq.addStmt(new StmtIf(
                  greaterThanEnd,
                  new List<>(new StmtCall(new Opt<>(new Identifier(arrayName)), "mc_resize", new List<>(new ExprId(arrayName), new ExprId(linearizedIndex)))),
                  new List<>()));

            seq.addStmt(new StmtSet(arrayName, new ExprId(linearizedIndex), tirStmt.getValueName().getID()));
            return seq;
        }
    }

    private Stmt genIfStmt(TIRIfStmt tirStmt) {
        List<Stmt> thenStmts = new List<>();
        for (ast.Stmt thenStmt : tirStmt.getIfStatements()) {
            thenStmts.add(genStmt(thenStmt));
        }
        List<Stmt> elseStmts = new List<>();
        for (ast.Stmt elseStmt : tirStmt.getElseStatements()) {
            elseStmts.add(genStmt(elseStmt));
        }
        return new StmtIf(tirStmt.getConditionVarName().getID(), thenStmts, elseStmts);
    }

    private Stmt genWhileStmt(TIRWhileStmt tirStmt) {
        List<Stmt> bodyStmts = new List<>();
        for (ast.Stmt bodyStmt : tirStmt.getStatements()) {
            bodyStmts.add(genStmt(bodyStmt));
        }
        return new StmtWhile(genExpr(tirStmt.getCondition()), bodyStmts);
    }

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
        String cmpVar = newTemp();

        Expr incr = tirStmt.hasIncr() ? new ExprId(tirStmt.getIncName().getID()) : new ExprInt(1);

        List<Stmt> body = new List<Stmt>();
        for (ast.Stmt bodyStmt : tirStmt.getStatements()) {
            body.add(genStmt(bodyStmt));
        }
        body.add(new StmtBinop(iterVar, Binop.Add, new ExprId(iterVar), incr));
        body.add(new StmtBinop(cmpVar, cmpOp, new ExprId(iterVar), new ExprId(tirStmt.getUpperName().getID())));
        StmtWhile whileLoop = new StmtWhile(new ExprId(cmpVar), body);

        return new StmtSequence(
            new List<Stmt>(
                new StmtAssign(iterVar, new ExprId(tirStmt.getLowerName().getID())),
                new StmtBinop(cmpVar, cmpOp, new ExprId(iterVar), new ExprId(tirStmt.getUpperName().getID())),
                whileLoop
                )
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

        List<Stmt> body = new List<>();
        for (ast.Stmt bodyStmt : tirStmt.getStatements()) {
            body.add(genStmt(bodyStmt));
        }
        body.add(new StmtBinop(
              tirStmt.getLoopVarName().getID(),
              Binop.Add,
              loopVar,
              step));
        body.add(new StmtCall(
              new Opt<>(new Identifier(testVar)),
              testFunc,
              new List<>(loopVar, to)));
        seq.addStmt(new StmtWhile(new ExprId(testVar), body));
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

    private StmtSequence genIndexingComputation(TIRStmt tirStmt, String arrayName, TIRCommaSeparatedList indices, String linearizedIndex) {
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

            DimValue currDim = dims.get(i);
            if (currDim.hasIntValue()) {
                seq.addStmt(new StmtBinop(stride, Binop.Mul, new ExprId(stride), new ExprInt(currDim.getIntValue())));
            }
            ++i;
        }
        return seq;
    }

    private boolean isSlicingOperation(TIRStmt tirStmt, TIRCommaSeparatedList indices) {
        for (ast.Expr index : indices) {
            ast.Name indexName = ((ast.NameExpr) index).getName();
            BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, indexName.getID());
            if (!bmv.getShape().isScalar())
                return true;
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
