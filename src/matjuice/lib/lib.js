var MC_COLON = {};
function mc_plus_SS(x$2, y$2) {
    return x$2 + y$2;
}
function mc_plus_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) + x$2);
    }
    ;
    return out$2;
}
function mc_plus_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) + x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 + y$2);
    }
    ;
    return out$2;
}
function mc_minus_SS(x$2, y$2) {
    return x$2 - y$2;
}
function mc_minus_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) - x$2);
    }
    ;
    return out$2;
}
function mc_minus_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) - x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 - y$2);
    }
    ;
    return out$2;
}
function mc_rem_SS(x$2, y$2) {
    return x$2 % y$2;
}
function mc_rem_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) % x$2);
    }
    ;
    return out$2;
}
function mc_rem_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) % x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 % y$2);
    }
    ;
    return out$2;
}
function mc_mod_SS(x$2, y$2) {
    var n = Math.floor(x$2 / y$2);
    return x$2 - n * y$2;
}
function mc_mod_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1; i <= m$2.mj_numel(); ++i) {
        out$2.mj_set([i], mc_mod_SS(x$2, m$2.mj_get([i])));
    }
    return out$2;
}
function mc_mod_MS(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1; i <= m$2.mj_numel(); ++i) {
        out$2.mj_set([i], mc_mod_SS(m$2.mj_get([i]), x$2));
    }
    return out$2;
}
function mc_mod_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    if (m1.mj_numel() !== m2.mj_numel()) {
        throw 'matrix sizes differ';
    }
    for (var i = 1; i <= m.mj_numel(); ++i) {
        var a = m1.mj_get([i]);
        var b = m2.mj_get([i]);
        out$2.mj_set([i], mc_mod_SS(x, y));
    }
    return out$2;
}
function mc_mtimes_SS(x$2, y$2) {
    return x$2 * y$2;
}
function mc_mtimes_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) * x$2);
    }
    ;
    return out$2;
}
function mc_mtimes_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) * x$2);
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
function mc_mrdivide_SS(x$2, y$2) {
    return x$2 / y$2;
}
function mc_mrdivide_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) / x$2);
    }
    ;
    return out$2;
}
function mc_mrdivide_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) / x$2);
    }
    ;
    return out$2;
}
function mc_rdivide_SS(x$2, y$2) {
    return x$2 / y$2;
}
function mc_rdivide_MS(m$2, d) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) / d);
    }
    ;
    return out$2;
}
function mc_rdivide_SM(d, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = d.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], d.mj_get([i]) / m$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 / y$2);
    }
    ;
    return out$2;
}
function mc_mrdivide_MM(m1, m2) {
    throw 'mc_mrdivide_MM: not implemented';
}
function mc_lt_SS(x$2, y$2) {
    return x$2 < y$2;
}
function mc_lt_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) < x$2);
    }
    ;
    return out$2;
}
function mc_lt_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) < x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 < y$2);
    }
    ;
    return out$2;
}
function mc_gt_SS(x$2, y$2) {
    return x$2 > y$2;
}
function mc_gt_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) > x$2);
    }
    ;
    return out$2;
}
function mc_gt_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) > x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 > y$2);
    }
    ;
    return out$2;
}
function mc_le_SS(x$2, y$2) {
    return x$2 <= y$2;
}
function mc_le_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) <= x$2);
    }
    ;
    return out$2;
}
function mc_le_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) <= x$2);
    }
    ;
    return out$2;
}
function mc_le_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 <= y$2);
    }
    ;
    return out$2;
}
function mc_ge_SS(x$2, y$2) {
    return x$2 >= y$2;
}
function mc_ge_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) >= x$2);
    }
    ;
    return out$2;
}
function mc_ge_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) >= x$2);
    }
    ;
    return out$2;
}
function mc_ge_MM(m1, m2) {
    var out$2 = m1.mj_clone();
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw 'array sizes differ';
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 >= y$2);
    }
    ;
    return out$2;
}
function mc_eq_SS(x1, x2) {
    return x1 === x2;
}
function mc_eq_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) === x$2);
    }
    ;
    return out$2;
}
function mc_eq_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) === x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 === y$2);
    }
    ;
    return out$2;
}
function mc_ne_SS(x1, x2) {
    return x1 !== x2;
}
function mc_ne_SM(x$2, m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) !== x$2);
    }
    ;
    return out$2;
}
function mc_ne_MS(m$2, x$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], m$2.mj_get([i]) !== x$2);
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
        var x$2 = m1.mj_get([i]);
        var y$2 = m2.mj_get([i]);
        out$2.mj_set([i], x$2 !== y$2);
    }
    ;
    return out$2;
}
function mc_length_S(x$2) {
    return 1;
}
function mc_length_M(m$2) {
    var max = 0;
    var size = m$2.mj_size();
    for (var i = 0, n = size.length; i < n; ++i)
        max = Math.max(max, size[i]);
    return max;
}
function mc_sin_S(x$2) {
    return Math.sin(x$2);
}
function mc_sin_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.sin(m$2.mj_get([i])));
    }
    ;
    return out$2;
}
function mc_sqrt_S(x$2) {
    return Math.sqrt(x$2);
}
function mc_sqrt_M(x$2) {
    var out$2 = m.mj_clone();
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.sqrt(m.mj_get([i])));
    }
    ;
    return out$2;
}
function mc_uminus_S(x$2) {
    return -x$2;
}
function mc_uminus_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 0; i < m$2.mj_numel(); ++i)
        out$2.mj_set([i], -out$2.mj_get([i]));
    return out$2;
}
function mc_round_S(x$2) {
    return Math.round(x$2);
}
function mc_round_M(m$2) {
    out = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out.mj_set([i], Math.round(m$2.mj_get([i])));
    }
    ;
    return m$2;
}
function mc_mpower_SS(a, b) {
    return Math.pow(a, b);
}
function mc_true() {
    return true;
}
function mc_false() {
    return false;
}
function mc_array_get(m$2, indices) {
    var value = m$2.mj_get(indices);
    if (value === undefined)
        throw 'invalid indices';
    else
        return value;
}
// TODO: handle array growth
function mc_array_set(m$2, indices, value) {
    return m$2.mj_set(indices, value);
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
function mc_rand() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = Math.random();
    }
    return mj_create(buf, shape);
}
// TODO(vfoley): same as rand() at the moment, need to do normal distribution.
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
function mc_exp_S(x$2) {
    return Math.exp(x$2);
}
function mc_exp_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.exp(m$2.mj_get([i])));
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
function mc_array_slice_static_1(m$2, result_length, result_dims, dimensions, indices) {
    if (indices[0] === MC_COLON)
        indices[0] = mc_colon(1, result_length);
    var buf = new Float64Array(result_length);
    var k = 0;
    for (var i = 1; i <= indices[0].mj_numel(); ++i) {
        var index = indices[0].mj_get([i]);
        buf[k] = m$2.mj_get([index]);
        k++;
    }
    return mj_create(buf, dimensions);
}
function mc_array_slice_static_2(m$2, result_length, result_dims, dimensions, indices) {
    if (indices[0] === MC_COLON)
        indices[0] = mc_colon(1, dimensions[0]);
    if (indices[1] === MC_COLON)
        indices[1] = mc_colon(1, dimensions[1]);
    var buf = new Float64Array(result_length);
    var k = 0;
    for (var j = 1; j <= indices[1].mj_numel(); ++j) {
        for (var i = 1; i <= indices[0].mj_numel(); ++i) {
            var row = indices[0].mj_get([i]);
            var col = indices[1].mj_get([j]);
            buf[k] = m$2.mj_get([
                row,
                col
            ]);
            k++;
        }
    }
    return mj_create(buf, dimensions);
}
function mc_array_slice_dynamic_1(m$2, dimensions, indices) {
    if (dimensions[0] === null)
        dimensions[0] = indices[0].mj_numel();
    if (dimensions[1] === null)
        dimensions[1] = indices[0].mj_numel();
    var result_length = 1;
    for (var i = 0; i < dimensions.length; ++i)
        result_length *= dimensions[i];
    return mc_array_slice_static_1(m$2, result_length, dimensions.length, dimensions, indices);
}
function mc_array_slice_dynamic_2(m$2, dimensions, indices) {
    if (dimensions[0] === null)
        dimensions[0] = indices[0].mj_numel();
    if (dimensions[1] === null)
        dimensions[1] = indices[1].mj_numel();
    var result_length = 1;
    for (var i = 0; i < dimensions.length; ++i)
        result_length *= dimensions[i];
    return mc_array_slice_static_2(m$2, result_length, dimensions.length, dimensions, indices);
}
function mc_const_false() {
    return false;
}
function mc_disp(x$2) {
    console.log(x$2);
}
function mc_pi() {
    return Math.PI;
}
function mc_mean(m$2) {
    // TODO(vfoley): implement mean for matrices
    if (m$2.mj_dims() == 2 && (m$2.mj_size()[0] == 1 || m$2.mj_size()[1] == 1)) {
        var sum = 0;
        var n = m$2.mj_numel();
        for (var i = 1; i <= n; ++i)
            sum += mc_array_get(m$2, [i]);
        return sum / n;
    }
    throw 'mc_mean: not implemented for matrices';
}