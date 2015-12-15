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

def verify_sorted(sorted_list):
    for i in xrange(len(sorted_list) - 1):
        if sorted_list[i] > sorted_list[i+1]:
            return False
    return True

def verify_ignore(results):
    return True


benchmarks = [
    ("bubble", 15000, verify_sorted),
    ("insertion_sort", 15000, verify_sorted),
    ("merge_sort", 15000, verify_sorted),
    #("make_change_rec", 200, verify_ignore),
    ("make_change_dyn", 1000, verify_ignore),
    ("collatz", 1000000, verify_ignore),
    ("matmul", 1000, verify_ignore),
]

def main():
    try:
        os.mkdir("mj_out")
    except OSError:
        pass

    print "benchmark, mjtime, mjsuccess, jstime, jssuccess, matlabtime, matlabsuccess"
    for name, size, verify_fn in benchmarks:
        mj_result, mj_time = run_matjuice(name, size)
        #js_result, js_time = run_javascript(name, size)
        js_result, js_time = [], 0
        matlab_result, matlab_time = run_matlab(name, size)
        print "%s, %f, %d, %f, %d, %f, %d" % (name,
                                              mj_time, verify_fn(mj_result),
                                              js_time, verify_fn(js_result),
                                              matlab_time, verify_fn(matlab_result))


if __name__ == "__main__":
    main()
