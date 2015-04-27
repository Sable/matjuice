var MC_COLON = {};
function mc_plus_SS(x, y) {
    return x + y;
}
function mc_plus_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) + x);
    }
    ;
    return out$2;
}
function mc_plus_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) + x);
    }
    ;
    return out$2;
}
function mc_plus_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x + y);
    }
    ;
    return out$2;
}
function mc_minus_SS(x, y) {
    return x - y;
}
function mc_minus_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) - x);
    }
    ;
    return out$2;
}
function mc_minus_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) - x);
    }
    ;
    return out$2;
}
function mc_minus_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x - y);
    }
    ;
    return out$2;
}
function mc_rem_SS(x, y) {
    return x % y;
}
function mc_rem_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) % x);
    }
    ;
    return out$2;
}
function mc_rem_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) % x);
    }
    ;
    return out$2;
}
function mc_rem_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x % y);
    }
    ;
    return out$2;
}
function mc_mtimes_SS(x, y) {
    return x * y;
}
function mc_mtimes_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) * x);
    }
    ;
    return out$2;
}
function mc_mtimes_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) * x);
    }
    ;
    return out$2;
}
function mc_mtimes_MM(m1, m2) {
    var m1_rows = m1.mj_size()[0];
    var m1_cols = m1.mj_size()[1];
    var m2_rows = m2.mj_size()[0];
    var m2_cols = m2.mj_size()[1];
    if (m1_cols !== m2_rows) {
        throw 'Inner matrix dimensions must agree.';
    }
    var out$2 = mc_zeros(m1_rows, m2_cols);
    for (var row = 1; row <= m1_rows; ++row) {
        for (var col = 1; col <= m2_cols; ++col) {
            var acc = 0;
            for (var k = 1; k <= m2_rows; ++k) {
                acc += mc_array_get(m1, [
                    row,
                    k
                ]) * mc_array_get(m2, [
                    k,
                    col
                ]);
            }
            out$2 = mc_array_set(out$2, [
                row,
                col
            ], acc);
        }
    }
    return out$2;
}
function mc_mrdivide_SS(x, y) {
    return x / y;
}
function mc_mrdivide_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) / x);
    }
    ;
    return out$2;
}
function mc_mrdivide_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) / x);
    }
    ;
    return out$2;
}
function mc_rdivide_SS(x, y) {
    return x / y;
}
function mc_rdivide_MS(m, d) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) / d);
    }
    ;
    return out$2;
}
function mc_rdivide_SM(d, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = d.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], d.mj_get([i]) / m);
    }
    ;
    return out$2;
}
function mc_rdivide_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x / y);
    }
    ;
    return out$2;
}
function mc_mrdivide_MM(m1, m2) {
    throw 'mc_mrdivide_MM: not implemented';
}
function mc_lt_SS(x, y) {
    return x < y;
}
function mc_lt_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) < x);
    }
    ;
    return out$2;
}
function mc_lt_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) < x);
    }
    ;
    return out$2;
}
function mc_lt_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x < y);
    }
    ;
    return out$2;
}
function mc_gt_SS(x, y) {
    return x > y;
}
function mc_gt_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) > x);
    }
    ;
    return out$2;
}
function mc_gt_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) > x);
    }
    ;
    return out$2;
}
function mc_gt_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x > y);
    }
    ;
    return out$2;
}
function mc_eq_SS(x1, x2) {
    return x1 === x2;
}
function mc_eq_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) === x);
    }
    ;
    return out$2;
}
function mc_eq_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) === x);
    }
    ;
    return out$2;
}
function mc_eq_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x === y);
    }
    ;
    return out$2;
}
function mc_ne_SS(x1, x2) {
    return x1 !== x2;
}
function mc_ne_SM(x, m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) !== x);
    }
    ;
    return out$2;
}
function mc_ne_MS(m, x) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m.mj_get([i]) !== x);
    }
    ;
    return out$2;
}
function mc_ne_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set([i], x !== y);
    }
    ;
    return out$2;
}
function mc_length_S(x) {
    return 1;
}
function mc_length_M(m) {
    var max = 0;
    var size = m.mj_size();
    for (var i = 0, n = size.length; i < n; ++i)
        max = Math.max(max, size[i]);
    return max;
}
function mc_sin_S(x) {
    return Math.sin(x);
}
function mc_sin_M(m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.sin(m.mj_get([i])));
    }
    ;
    return out$2;
}
function mc_uminus_S(x) {
    return -x;
}
function mc_uminus_M(m) {
    var out$2 = m.mj_clone();
    for (var i = 0; i < m.mj_numel(); ++i)
        out$2.mj_set([i], -out$2.mj_get([i]));
    return out$2;
}
function mc_round_S(x) {
    return Math.round(x);
}
function mc_round_M(m) {
    out = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out.mj_set([i], Math.round(m.mj_get([i])));
    }
    ;
    return m;
}
function mc_array_get(m, indices) {
    var value = m.mj_get(indices);
    if (value === undefined)
        throw 'invalid indices';
    else
        return value;
}
// TODO: handle array growth
function mc_array_set(m, indices, value) {
    return m.mj_set(indices, value);
}
// TODO: handle concatenating matrices of more than 2 dimensions
function mc_horzcat() {
    var num_rows = -1;
    var num_cols = 0;
    var len = 0;
    // Compute the length and number of columns of the result.
    // Also check that all arguments have the same number of rows.
    for (var i = 0; i < arguments.length; ++i) {
        if (num_rows == -1) {
            num_rows = arguments[i].mj_size()[0];
        } else if (arguments[i].mj_size()[0] != num_rows) {
            throw 'Dimensions of matrices being concatenated are not consistent.';
        }
        num_cols += arguments[i].mj_size()[1];
        len += arguments[i].mj_numel();
    }
    // Create the result array buffer and populate it by just putting
    // all the arguments back-to-back.
    var buf = new Float64Array(len);
    var offset = 0;
    for (var i = 0; i < arguments.length; ++i) {
        if (arguments[i].mj_scalar()) {
            buf[offset] = arguments[i];
        } else {
            buf.set(arguments[i], offset);
        }
        offset += arguments[i].mj_numel();
    }
    return mj_create(buf, [
        num_rows,
        num_cols
    ]);
}
// TODO: handle concatenating matrices
function mc_vertcat() {
    var num_rows = 0;
    var num_cols = -1;
    var len = 0;
    for (var i = 0; i < arguments.length; ++i) {
        if (num_cols == -1) {
            num_cols = arguments[i].mj_size()[1];
        } else if (arguments[i].mj_size()[1] != num_cols) {
            throw 'Dimensions of matrices being concatenated are not consistent.';
        }
        num_rows += arguments[i].mj_size()[0];
        len += arguments[i].mj_numel();
    }
    var buf = new Float64Array(len);
    var offset = 0;
    for (var col = 1; col <= num_cols; ++col) {
        for (var arg_id = 0; arg_id < arguments.length; ++arg_id) {
            for (var row = 1; row <= arguments[arg_id].mj_size()[0]; ++row) {
                buf[offset] = arguments[arg_id].mj_get([
                    row,
                    col
                ]);
                offset++;
            }
        }
    }
    return mj_create(buf, [
        num_rows,
        num_cols
    ]);
}
function mc_compute_shape_length(arg) {
    var shape, length;
    if (arg.length === 0) {
        shape = [
            1,
            1
        ];
        length = 1;
    } else if (arg.length === 1) {
        var len = Math.max(arg[0], 0);
        shape = [
            len,
            len
        ];
        length = len * len;
    } else {
        shape = arg;
        length = 1;
        for (var i = 0; i < shape.length; ++i)
            length *= arg[i];
    }
    return [
        shape,
        length
    ];
}
function mc_randn() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = Math.random();
    }
    return mj_create(buf, shape);
}
function mc_zeros() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    return mj_create(buf, shape);
}
function mc_ones() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = 1;
    }
    return mj_create(buf, shape);
}
function mc_eye(rows, cols) {
    if (cols === undefined)
        cols = rows;
    var buf = new Float64Array(rows * cols);
    var mat = mj_create(buf, [
            rows,
            cols
        ]);
    for (var i = 1; i <= rows; ++i) {
        mat.mj_set([
            i,
            i
        ], 1);
    }
    return mat;
}
function mc_exp_S(x) {
    return Math.exp(x);
}
function mc_exp_M(m) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.exp(m.mj_get([i])));
    }
    ;
    return out$2;
}
function mc_colon() {
    var start, stop, step;
    switch (arguments.length) {
    case 2:
        start = arguments[0];
        stop = arguments[1];
        step = 1;
        break;
    case 3:
        start = arguments[0];
        stop = arguments[2];
        step = arguments[1];
        break;
    default:
        throw 'invalid number of arguments';
    }
    var len = Math.floor((stop - start) / step) + 1;
    var buf = new Float64Array(len);
    var i = 0;
    var val = start;
    while (true) {
        if (start <= stop && val > stop)
            break;
        if (start > stop && val < stop)
            break;
        buf[i] = val;
        val += step;
        i++;
    }
    return mj_create(buf, [
        1,
        len
    ]);
}
function mc_array_slice(m, slices) {
    if (m.mj_size().length === slices.length) {
        for (var i = 0; i < slices.length; ++i) {
            if (slices[i] === MC_COLON) {
                console.log(mc_colon(1, m.mj_size()[i]));
            } else {
                console.log(slices[i]);
            }
        }
    }
}