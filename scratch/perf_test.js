var EPS = 0.00001;

function approx_equal(x, y) {
    return Math.abs(x-y) < EPS;
}

function test1(n) {
    var x1 = 0;
    var y1 = 0.02;
    var x2 = new Float64Array([0]);
    var y2 = new Float64Array([0.02]);

    var t1 = performance.now();
    for (var i = 0; i < n; ++i) {
        x1 += y1;
    }
    var t2 = performance.now();

    var t3 = performance.now();
    for (var i = 0; i < n; ++i) {
        x2[0] += y2[0];
    }
    var t4 = performance.now();

    return {
        same_result: approx_equal(x1, x2[0]),
        time_scalar: t2-t1,
        time_array: t4-t3
    };
}

function test2(n) {
    var x1 = 1;
    var y1 = 0.0003;
    var x2 = new Float64Array([1]);
    var y2 = new Float64Array([0.0003]);

    var t1 = performance.now();
    for (var i = 0; i < n; ++i) {
        x1 *= y1;
    }
    var t2 = performance.now();

    var t3 = performance.now();
    for (var i = 0; i < n; ++i) {
        x2[0] *= y2[0];
    }
    var t4 = performance.now();

    return {
        same_result: approx_equal(x1, x2[0]),
        time_scalar: t2-t1,
        time_array: t4-t3
    };
}
