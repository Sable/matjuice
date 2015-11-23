# -*- coding:utf-8 -*-

from contextlib import contextmanager

import glob
import os
import sys

EPSILON = 0.001

@contextmanager
def cd(dir):
    curdir = os.getcwd()
    os.chdir(dir)
    yield
    os.chdir(curdir)

def read_results_and_time(stdout):
    results = []
    time = 0.0
    for line in stdout:
        if line.strip() == "OUT":
            break
    for line in stdout:
        line = line.strip()
        if line == "TIME":
            break
        if line:
            results.append(float(line))
    for line in stdout:
        time = float(line.strip())
        break
    return results, time

def run_matlab(benchmark, problem_size):
    with cd(benchmark):
        with os.popen("matlab -nodesktop -nosplash -r 'main(%s); quit;'" % problem_size) as stdout:
            return read_results_and_time(stdout)

def run_javascript(benchmark, problem_size):
    os.system("cp %s/%s.js mj_out/native_%s.js" % (benchmark, benchmark, benchmark))
    with cd("mj_out"):
        with open("native_%s.js" % benchmark, "a") as f:
            print >>f, "main(%d);" % problem_size
        with os.popen("node native_%s.js" % benchmark) as stdout:
            return read_results_and_time(stdout)


def run_matjuice(benchmark, problem_size):
    # Compile
    with cd(benchmark):
        os.system('../../matjuice.sh main.m ../mj_out/%s.js "DOUBLE&1*1&REAL" > /dev/null 2>&1' % benchmark)

    with cd("mj_out"):
        with open(benchmark + ".js", "a") as f:
            print >>f, "main(%d);" % problem_size

        with os.popen("node %s.js" % benchmark) as stdout:
            return read_results_and_time(stdout)

def verify_bubble(sorted_list):
    for i in xrange(len(sorted_list) - 1):
        if sorted_list[i] > sorted_list[i+1]:
            return False
    return True

benchmarks = [
    #("bubble", 15000, verify_bubble),
    ("collatz", 10000, lambda _: True),
]

def main():
    try:
        os.mkdir("mj_out")
    except OSError:
        pass

    for b in benchmarks:
        mj_result, mj_time = run_matjuice(b[0], b[1])
        js_result, js_time = run_javascript(b[0], b[1])
        matlab_results, matlab_time = run_matlab(b[0], b[1])
        print "%s, %f, %d, %f, %d, %f, %d" % (b[0], mj_time, verify_bubble(mj_result),
                                              js_time, verify_bubble(js_result),
                                              matlab_time, verify_bubble(matlab_results))


# def main():
#     if len(sys.argv) != 4:
#         print "Usage: %s <benchmark dir> <driver function> <arg>" % sys.argv[0]
#         sys.exit(1)
#     matlab_results, matlab_time = run_matlab(sys.argv[1], sys.argv[2], sys.argv[3])

#     compile_javascript(sys.argv[1], sys.argv[2])
#     t1 = time.time()
#     javascript_results = run_javascript(sys.argv[1], sys.argv[2], sys.argv[3])
#     t2 = time.time()
#     javascript_time = t2 - t1

#     if len(matlab_results) == len(javascript_results) and \
#        all(abs(x-y) < EPSILON for x, y in itertools.izip(matlab_results, javascript_results)):
#         print "MATLAB    : %.5f" % matlab_time
#         print "JavaScript: %.5f" % javascript_time
#         sys.exit(0)
#     else:
#         print(matlab_results)
#         print(javascript_results)
#         sys.exit(1)


if __name__ == "__main__":
    main()
