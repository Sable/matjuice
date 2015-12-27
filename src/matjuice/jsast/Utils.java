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

package matjuice.jsast;

import matjuice.pretty.Pretty;
import matjuice.pretty.PrettyBase;

public class Utils {
    public static PrettyBase[] ppStmts(List<Stmt> stmts) {
        int n = stmts.count();
        PrettyBase[] out = new PrettyBase[n];
        int i = 0;
        for (Stmt stmt: stmts) {
            out[i] = stmt.pp();
            i++;
        }
        return out;
    }
}
