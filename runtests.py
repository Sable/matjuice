# -*- coding:utf-8 -*-

from contextlib import contextmanager

import pprint
import os
import sys
import tempfile

EPSILON = 0.001
MATLAB_HEADER_LINES = 10

@contextmanager
def cd(dir):
    curdir = os.getcwd()
    os.chdir(dir)
    yield
    os.chdir(curdir)

def run_matlab(directory, func, arg):
    with cd(directory):
        pipe = os.popen("matlab -nodesktop -nosplash -r '%s(%s); quit;'" % (func, arg))
        lines = pipe.readlines()
        results = [float(line.strip()) for line in lines[MATLAB_HEADER_LINES:] if line.strip()]
        return results

def run_javascript(directory, func, arg):
    with cd(directory):
        with tempfile.NamedTemporaryFile() as temp:
            with open(func + ".js") as orig:
                temp.write(orig.read())
            temp.write("%s(%s);\n" % (func, arg))
            temp.flush()
            pipe = os.popen("node %s" % temp.name)
            lines = pipe.readlines()
            results = [float(line.strip()) for line in lines if line.strip()]
            return results


def main():
    matlab_results = run_matlab(sys.argv[1], sys.argv[2], sys.argv[3])
    javascript_results = run_javascript(sys.argv[1], sys.argv[2], sys.argv[3])
    if matlab_results == javascript_results:
        sys.exit(0)
    else:
        print(matlab_results)
        print(javascript_results)
        sys.exit(1)


if __name__ == "__main__":
    main()
