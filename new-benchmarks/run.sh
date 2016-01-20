#!/bin/bash

for jsfile in _BUILD/*.js; do
    func_name=$(basename $jsfile .js)

    case $func_name in
        drv_prime)
            scale=1000000
            ;;
        *)
            scale=1
            ;;
    esac

    echo "var t1 = Date.now();" >> $jsfile
    echo "$func_name($scale)" >> $jsfile
    echo "var t2 = Date.now();" >> $jsfile
    echo "console.log((t2 - t1) / 1000);" >> $jsfile
done
