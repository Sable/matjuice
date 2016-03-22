# -*- coding: utf-8 -*-

import os
import shutil
import subprocess
import sys

BENCHMARKS = [
    ("bbai/drv_babai.m"                  , "drv_babai"       , 1) ,
    ("bubble/drv_bubble.m"               , "drv_bubble"      , 1000) ,
    ("capr/drv_capr.m"                   , "drv_capr"        , 1) ,
    ("clos/drv_clos.m"                   , "drv_clos"        , 1) ,
    ("collatz/drv_collatz.m"             , "drv_collatz"     , 1000) ,
    #("create/drv_createlhs.m"            , "drv_createlhs"   , 1) ,
    ("crni/drv_crni.m"                   , "drv_crni"        , 1) ,
    ("dich/drv_dich.m"                   , "drv_dich"        , 1) ,
    ("fdtd/drv_fdtd.m"                   , "drv_fdtd"        , 1) ,
    ("fft/drv_fft.m"                     , "drv_fft"         , 1) ,
    ("fiff/drv_fiff.m"                   , "drv_fiff"        , 1) ,
    ("lgdr/drv_lgdr.m"                   , "drv_lgdr"        , 1) ,
    ("make_change_dyn/drv_make_change.m" , "drv_make_change" , 1000) ,
    ("matmul/drv_matmul_p.m"             , "drv_matmul_p"    , 256) ,
    ("mcpi/drv_mcpi_p.m"                 , "drv_mcpi_p"      , 1) ,
    ("nb1d/drv_nb1d.m"                   , "drv_nb1d"        , 1) ,
    ("numprime/drv_prime.m"              , "drv_prime"       , 1) ,
]

HTML_TEMPLATE = """
<html>
  <head>
    <script type="text/javascript" src="%s"></script>
  </head>
</html>
"""

NOCI = "_BUILD_NOCI"
CI = "_BUILD_CI"
RUN_SCRIPT = "run.py"

def main():
    shutil.rmtree(NOCI, ignore_errors=True)
    shutil.rmtree(CI, ignore_errors=True)
    os.mkdir(NOCI)
    os.mkdir(CI)
    shutil.copyfile(RUN_SCRIPT, os.path.join(NOCI, RUN_SCRIPT))
    shutil.copyfile(RUN_SCRIPT, os.path.join(CI, RUN_SCRIPT))
    for (drv_file, drv_func, scale) in BENCHMARKS:
        print drv_func,
        sys.stdout.flush()
        base_file = os.path.basename(drv_file)
        js_file = base_file + ".js"
        html_file = base_file + ".html"

        # No copy insertion
        subprocess.call(["../matjuice.sh", "--copy-insertion=false", drv_file, os.path.join(NOCI, js_file), "DOUBLE&1*1&REAL"],
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        with open(os.path.join(NOCI, html_file), "w") as f:
            f.write(HTML_TEMPLATE % js_file)
        with open(os.path.join(NOCI, js_file), "a") as f:
            f.write("%s(%d);" % (drv_func, scale))
            f.write("console.log(CLONE_COUNT, CLONE_LENGTHS, CLONE_LENGTHS / CLONE_COUNT);\n")

        # With copy insertion
        subprocess.call(["../matjuice.sh", drv_file, os.path.join(CI, js_file), "DOUBLE&1*1&REAL"],
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        with open(os.path.join(CI, html_file), "w") as f:
            f.write(HTML_TEMPLATE % js_file)
        with open(os.path.join(CI, js_file), "a") as f:
            f.write("%s(%d);" % (drv_func, scale))
            f.write("console.log(CLONE_COUNT, CLONE_LENGTHS, CLONE_LENGTHS / CLONE_COUNT);\n")

        print "done"

if __name__ == "__main__":
    main()
