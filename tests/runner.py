# -*- coding: utf-8 -*-

import glob
import os
import shutil

TESTS = [
    ("numprime", "drv_prime", 1000*1000),
]

for testdir, testdrv, scale in TESTS:
    os.chdir(testdir)
    js_file = testdrv + ".js"
    js_runner_file = "runner_" + js_file
    shutil.copyfile(js_file, js_runner_file)
    with open(js_runner_file, "a") as f:
        f.writelines([
            "var t1 = performance.now();",
            "%s(%s);" % (testdrv, scale),
            "var t2 = performance.now();",
            "print(t2 - t1);",
        ])
    os.system("/home/sable/vfoley1/src/v8/out/x64.release/d8 %s" % js_runner_file)
    os.chdir("..")
