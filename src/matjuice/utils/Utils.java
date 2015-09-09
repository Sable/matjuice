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

package matjuice.utils;

import matjuice.jsast.*;

import natlab.tame.tir.TIRStmt;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;


public class Utils {
    public static BasicMatrixValue getBasicMatrixValue(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis,
      TIRStmt stmt, String variable) {
        if (stmt == null)
            return null;

        AggrValue<BasicMatrixValue> val = analysis
          .getOutFlowSets()
          .get(stmt)
          .get(variable)
          .getSingleton();
        if (val instanceof BasicMatrixValue)
            return (BasicMatrixValue) val;
        else
            return null;
    }
}
