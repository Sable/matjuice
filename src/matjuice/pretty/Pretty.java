/*
 *  Copyright 2014, Vincent Foley-Bourgon, McGill University
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

package matjuice.pretty;

import java.util.*;

public class Pretty {
    public static int INDENT_WIDTH = 4;

    public static PrettyBase EMPTY = text("");
    public static PrettyBase NEWLINE = PrettyLine.getInstance();

    public static PrettyBase text(String s) {
        return new PrettyText(s);
    }


    public static PrettyBase concat(PrettyBase... parts) {
        return new PrettyConcat(parts);
    }


    public static PrettyBase indent(PrettyBase node) {
        return new PrettyIndent(node);
    }


    public static PrettyBase wrapped(PrettyBase opener, PrettyBase closer, PrettyBase node) {
        return concat(opener, node, closer);
    }


    public static PrettyBase parenthesized(PrettyBase node) {
        return wrapped(text("("), text(")"), node);
    }


    public static PrettyBase block(PrettyBase... nodes) {
        return wrapped(
                concat(text("{"), NEWLINE),
                concat(NEWLINE, text("}")),
                indent(separateBy(NEWLINE, nodes)));
    }


    public static PrettyBase separateBy(PrettyBase sep, PrettyBase... parts) {
        PrettyBase[] separatedParts = new PrettyBase[Math.max(0, 2 * parts.length - 1)];
        int i = 0;
        boolean first = true;

        for (PrettyBase part : parts) {
            if (!first)
                separatedParts[i++] = sep;
            first = false;
            separatedParts[i++] = part;
        }

        return concat(separatedParts);
    }


    public static PrettyBase argList(PrettyBase... parts) {
        return parenthesized(separateBy(text(", "), parts));
    }


    private static String pad(int width) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < width; ++i)
            sb.append(' ');
        return sb.toString();
    }


    public static String display(PrettyBase root) {
        int currCol = 0;
        StringBuffer sb = new StringBuffer();
        Stack<Pair> worklist = new Stack<>();
        worklist.push(new Pair(root, 0));

        while (!worklist.isEmpty()) {
            Pair pair = worklist.pop();
            PrettyBase node = pair.prettyNode;
            int currLevel = pair.level;

            if (node instanceof PrettyLine) {
                currCol = 0;
                sb.append(node.toString());
            }
            else if (node instanceof PrettyText) {
                String s = pad(currLevel*INDENT_WIDTH - currCol) + node.toString();
                currCol += s.length();
                sb.append(s);
            }
            else if (node instanceof PrettyConcat) {
                PrettyConcat pc = (PrettyConcat) node;
                for (int i = pc.parts.length - 1; i >= 0; --i) {
                    worklist.push(new Pair(pc.parts[i], currLevel));
                }
            }
            else if (node instanceof PrettyIndent) {
                PrettyIndent pi = (PrettyIndent) node;
                worklist.push(new Pair(pi.child, currLevel+1));
            }
        }

        return sb.toString();
    }
}
