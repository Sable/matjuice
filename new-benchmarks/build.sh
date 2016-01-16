#!/bin/bash

MATJUICE=../matjuice.sh
BUILD_DIR=_BUILD


HTML_TEMPLATE=`cat <<EOF
<html>
  <head>
    <script type="text/javascript" src="SOURCE_FILE"></script>
  </head>
</html>
EOF`


BENCHMARKS=(
    adpt/drv_adpt.m
    arsim/drv_arsim.m
    bbai/drv_babai.m
    bubble/drv_bubble.m
    capr/drv_capr.m
    clos/drv_clos.m
    create/drv_createlhs.m
    crni/drv_crni.m
    dich/drv_dich.m
    diff/drv_diff.m
    edit/drv_edit.m
    fdtd/drv_fdtd.m
    fft/drv_fft.m
    fiff/drv_fiff.m
    lgdr/drv_lgdr.m
    matmul/drv_matmul_p.m
    mbrt/drv_mbrt.m
    mcpi/drv_mcpi_p.m
    nb1d/drv_nb1d.m
    nb3d/drv_nb3d.m
    numprime/drv_prime.m
    optstop/drv_osp.m
    spqr/drv_spqr.m
)

rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

for b in ${BENCHMARKS[@]}; do
    basefile=$(basename $b .m)
    jsdrv=$basefile.js
    htmlfile=$basefile.html
    echo -n "$b... "
    $MATJUICE $b $BUILD_DIR/$jsdrv "DOUBLE&1*1&REAL" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "OK"
        echo $HTML_TEMPLATE > $BUILD_DIR/$htmlfile
        sed -i "s/SOURCE_FILE/$jsdrv/" $BUILD_DIR/$htmlfile
    else
        echo "FAIL"
    fi
done
