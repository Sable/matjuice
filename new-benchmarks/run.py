# -*- coding: utf-8 -*-

import glob
import time
import subprocess
import os

import numpy as np

N = 10

BENCHMARKS = [
    "drv_babai",
    "drv_bubble",
    "drv_capr",
    "drv_clos",
    "drv_collatz",
    "drv_crni",
    "drv_dich",
    "drv_fdtd",
    "drv_fft",
    "drv_fiff",
    "drv_lgdr",
    "drv_make_change",
    "drv_matmul_p",
    "drv_mcpi_p",
    "drv_nb1d",
    "drv_prime",
]
BUILD_DIRS = ["_BUILD_NOCI", "_BUILD_CI"]

for b in BENCHMARKS:
    LINE = [b]
    times = [0 for i in range(N)]
    copy_counts = -1
    for dir in BUILD_DIRS:
        os.chdir(dir)
        for i in range(N):
            t1 = time.time()
            output = subprocess.check_output(["node", b + ".m.js"], stderr=subprocess.STDOUT)
            t2 = time.time()
            times[i] = t2 - t1
            lines = output.split()
            copy_counts = float(lines[-1])
        LINE.append(np.round(np.mean(times), decimals=2))
        LINE.append(np.round(np.std(times), decimals=2))
        LINE.append(copy_counts)
        os.chdir("..")

    print(r"%s & %.2f $\pm$ %.2f & %f & %.2f $\pm$ %.2f & %f \\" % tuple(LINE))
