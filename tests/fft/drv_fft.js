/*
 * MatJuice API.  These functions are used internally in the library
 * for MATLAB built-ins, however they do not correspond to any MATLAB
 * built-in.
 */


/* Create a new matrix object.
 * x    : the Float64Array that contains the data.
 * shape: an array containing the dimensions of the matrix.
 *
 * Note: the elements in x are expected to be in column-major order,
 *       i.e. the matrix [1 2 ; 3 4] is represented as {1, 3, 2, 4}.
 */



Float64Array.prototype.mj_clone = function() {
    var newbuf = new Float64Array(this);
    var newshape = this.mj_size().slice(0);
    return mj_create(newbuf, newshape);
}

Float64Array.prototype.mj_scalar = function() {
    return false;
}

Float64Array.prototype.mj_numel = function() {
    return this._length;
}

Float64Array.prototype.mj_size = function() {
    return this._shape;
}

Float64Array.prototype.mj_stride = function() {
    return this._stride;
}

Float64Array.prototype.mj_dims = function() {
    return this._dims;
}

Float64Array.prototype.mj_get = function(indices) {
    return this[mj_compute_index(this, indices)];
}

Float64Array.prototype.mj_set = function(indices, value) {
    this[mj_compute_index(this, indices)] = value;
    return this;
}




Number.prototype.mj_clone = function() {
    return this;
}

Number.prototype.mj_scalar = function() {
    return true;
}

Number.prototype.mj_numel = function() {
    return 1;
}

Number.prototype.mj_size = function() {
    return [1, 1];
}

Number.prototype.mj_stride = function() {
    return [1, 0];
}

Number.prototype.mj_dims = function() {
    return 2;
}

Number.prototype.mj_get = function(indices) {
    var idx = mj_compute_index(this, indices);
    if (idx === 0)
        return this;
    else
        return undefined;
}

Number.prototype.mj_set = function(indices, value) {
    var idx = mj_compute_index(this, indices);
    if (idx === 0)
        return value;
    else
        return undefined;
}



function mj_create(x, shape) {
    function mj_make_stride(shape) {
        var stride = [1];

        for (var i = 0; i < shape.length - 1; ++i) {
            stride.push(stride[i] * shape[i]);
        }
        return stride;
    }

    if (typeof x === "object" && x.length == 1) {
        x = x[0];
    }
    else if (typeof x === "object") {
        x._length = x.length;
        x._shape = shape;
        x._dims = shape.length;
        x._stride = mj_make_stride(shape, x._dims);
    }

    return x;
}


function mj_compute_index(x, indices) {
    var array_index = 0;
    for (var i = 0, end = indices.length; i < end; ++i) {
        array_index += (indices[i] - 1) * x.mj_stride()[i];
    }
    return array_index;
}
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

// BEGINNING OF PROGRAM

function fft_four1(data, n, isign) {
    var t;
    var mc_t49;
    var mc_t48;
    var mc_t47;
    var mc_t46;
    var m;
    var mc_t45;
    var mc_t44;
    var mc_t43;
    var j;
    var mc_t42;
    var i;
    var mc_t41;
    var mc_t85;
    var mc_t40;
    var mc_t84;
    var mc_t83;
    var mc_t82;
    var mc_t81;
    var mmax;
    var mc_t80;
    var wr;
    var mc_t19;
    var mc_t18;
    var wi;
    var mc_t17;
    var result;
    var mc_t16;
    var mc_t59;
    var mc_t15;
    var mc_t58;
    var mc_t14;
    var mc_t57;
    var mc_t13;
    var mc_t56;
    var mc_t12;
    var mc_t55;
    var mc_t11;
    var mc_t54;
    var mc_t10;
    var mc_t53;
    var mc_t52;
    var istep;
    var mc_t51;
    var mc_t50;
    var nn;
    var wpr;
    var mc_t29;
    var wpi;
    var mc_t28;
    var mc_t27;
    var mc_t26;
    var mc_t25;
    var mc_t69;
    var mc_t24;
    var mc_t68;
    var mc_t23;
    var mc_t67;
    var mc_t22;
    var mc_t66;
    var mc_t21;
    var mc_t65;
    var mc_t20;
    var mc_t64;
    var mc_t63;
    var mc_t62;
    var mc_t61;
    var mc_t60;
    var mc_t8;
    var mc_t9;
    var mc_t39;
    var mc_t38;
    var mc_t37;
    var mc_t36;
    var mc_t79;
    var mc_t35;
    var theta;
    var mc_t78;
    var tempr;
    var mc_t34;
    var mc_t33;
    var mc_t77;
    var mc_t32;
    var mc_t76;
    var mc_t31;
    var mc_t75;
    var mc_t30;
    var wtemp;
    var mc_t74;
    var tempi;
    var mc_t73;
    var mc_t72;
    var mc_t71;
    var mc_t70;
    // % The original algorithim in C can be found in
    // % Numerical recipes : the art of scientific computing / William H. Press ... [et al.]

    // % Computes the discrete fourier transform for complex data type
    // % data: contains the complex data values whose real and
    // % imaginary parts are stored in contigous locations in the array data;
    // % size of data is 2 * n (the number of complex numbers in the data points).
    // % isign: is a flag whose value is either 1 or -1; if isign is 1, forward
    // % transform is computed and backward transform otherwise.


    // %if (n<2) || bitand(n, n-1)
    // %    'n must be power of 2 in four1'
    // %    return
    // %end
    mc_t62 = 2;
    nn = mc_mtimes_SS(mc_t62, n);
    j = 2;
    mc_t71 = 2;
    mc_t72 = 2;

    for (i = mc_t71; i <= nn; i = i + mc_t72) {
        mc_t67 = mc_gt_SS(j, i);
        if (mc_t67) {
            mc_t63 = 1;
            mc_t19 = mc_minus_SS(j, mc_t63);
            t = mc_array_get(data, [mc_t19]);
            mc_t64 = 1;
            mc_t20 = mc_minus_SS(i, mc_t64);
            mc_t8 = mc_array_get(data, [mc_t20]);
            mc_t65 = 1;
            mc_t15 = mc_minus_SS(j, mc_t65);
            data = mc_array_set(data, [mc_t15], mc_t8);
            mc_t66 = 1;
            mc_t16 = mc_minus_SS(i, mc_t66);
            data = mc_array_set(data, [mc_t16], t);

            t = mc_array_get(data, [j]);
            mc_t9 = mc_array_get(data, [i]);
            data = mc_array_set(data, [j], mc_t9);
            data = mc_array_set(data, [i], t);
        }
        m = n;
        mc_t68 = 2;
        mc_t21 = mc_ge_SS(m, mc_t68);
        if (mc_t21) {
            mc_t21 = mc_gt_SS(j, m);
        }
        else {
            mc_t21 = mc_false();
        }
        mc_t14 = mc_t21;
        while (mc_t14) {
            j = mc_minus_SS(j, m);
            mc_t69 = 2;
            m = mc_mrdivide_SS(m, mc_t69);
            mc_t70 = 2;
            mc_t22 = mc_ge_SS(m, mc_t70);
            if (mc_t22) {
                mc_t22 = mc_gt_SS(j, m);
            }
            else {
                mc_t22 = mc_false();
            }
            mc_t14 = mc_t22;
        }
        j = mc_plus_SS(j, m);
    }
    mmax = 2;
    mc_t85 = mc_gt_SS(nn, mmax);
    while (mc_t85) {
        mc_t73 = 2;
        istep = mc_mtimes_SS(mmax, mc_t73);
        mc_t23 = isign;
        mc_t74 = 6.28318530717959;
        mc_t24 = mc_mrdivide_SS(mc_t74, mmax);
        theta = mc_mtimes_SS(mc_t23, mc_t24);
        mc_t75 = 0.5;
        mc_t25 = mc_mtimes_SS(mc_t75, theta);
        wtemp = mc_sin_S(mc_t25);
        mc_t76 = 2.0;
        mc_t28 = mc_uminus_S(mc_t76);
        mc_t29 = wtemp;
        mc_t26 = mc_mtimes_SS(mc_t28, mc_t29);
        mc_t27 = wtemp;
        wpr = mc_mtimes_SS(mc_t26, mc_t27);
        wpi = mc_sin_S(theta);
        wr = 1.0;
        wi = 0.0;
        mc_t83 = 2;
        mc_t84 = 2;

        for (m = mc_t83; m <= mmax; m = m + mc_t84) {

            for (i = m; i <= nn; i = i + istep) {
                j = mc_plus_SS(i, mmax);
                mc_t34 = wr;
                mc_t77 = 1;
                mc_t36 = mc_minus_SS(j, mc_t77);
                mc_t35 = mc_array_get(data, [mc_t36]);
                mc_t30 = mc_mtimes_SS(mc_t34, mc_t35);
                mc_t32 = wi;
                mc_t33 = mc_array_get(data, [j]);
                mc_t31 = mc_mtimes_SS(mc_t32, mc_t33);
                tempr = mc_minus_SS(mc_t30, mc_t31);
                mc_t42 = wr;
                mc_t43 = mc_array_get(data, [j]);
                mc_t37 = mc_mtimes_SS(mc_t42, mc_t43);
                mc_t39 = wi;
                mc_t78 = 1;
                mc_t41 = mc_minus_SS(j, mc_t78);
                mc_t40 = mc_array_get(data, [mc_t41]);
                mc_t38 = mc_mtimes_SS(mc_t39, mc_t40);
                tempi = mc_plus_SS(mc_t37, mc_t38);
                mc_t79 = 1;
                mc_t46 = mc_minus_SS(i, mc_t79);
                mc_t44 = mc_array_get(data, [mc_t46]);
                mc_t45 = tempr;
                mc_t10 = mc_minus_SS(mc_t44, mc_t45);
                mc_t80 = 1;
                mc_t17 = mc_minus_SS(j, mc_t80);
                data = mc_array_set(data, [mc_t17], mc_t10);
                mc_t47 = mc_array_get(data, [i]);
                mc_t48 = tempi;
                mc_t11 = mc_minus_SS(mc_t47, mc_t48);
                data = mc_array_set(data, [j], mc_t11);
                mc_t81 = 1;
                mc_t51 = mc_minus_SS(i, mc_t81);
                mc_t49 = mc_array_get(data, [mc_t51]);
                mc_t50 = tempr;
                mc_t12 = mc_plus_SS(mc_t49, mc_t50);
                mc_t82 = 1;
                mc_t18 = mc_minus_SS(i, mc_t82);
                data = mc_array_set(data, [mc_t18], mc_t12);
                mc_t52 = mc_array_get(data, [i]);
                mc_t53 = tempi;
                mc_t13 = mc_plus_SS(mc_t52, mc_t53);
                data = mc_array_set(data, [i], mc_t13);
            }
            wtemp = wr;
            mc_t56 = mc_mtimes_SS(wtemp, wpr);
            mc_t57 = mc_mtimes_SS(wi, wpi);
            mc_t54 = mc_minus_SS(mc_t56, mc_t57);
            mc_t55 = wr;
            wr = mc_plus_SS(mc_t54, mc_t55);
            mc_t60 = mc_mtimes_SS(wi, wpr);
            mc_t61 = mc_mtimes_SS(wtemp, wpi);
            mc_t58 = mc_plus_SS(mc_t60, mc_t61);
            mc_t59 = wi;
            wi = mc_plus_SS(mc_t58, mc_t59);
        }
        mmax = istep;
        mc_t85 = mc_gt_SS(nn, mmax);
    }
    result = data;
    return result;
}


var data = new Float64Array([
    5.3766714e-01,
    1.8338850e+00,
        -2.2588469e+00,
    8.6217332e-01,
    3.1876524e-01,
        -1.3076883e+00,
        -4.3359202e-01,
    3.4262447e-01,
    3.5783969e+00,
    2.7694370e+00,
        -1.3498869e+00,
    3.0349235e+00,
    7.2540422e-01,
        -6.3054873e-02,
    7.1474290e-01,
        -2.0496606e-01,
        -1.2414435e-01,
    1.4896976e+00,
    1.4090345e+00,
    1.4171924e+00,
    6.7149713e-01,
        -1.2074869e+00,
    7.1723865e-01,
    1.6302353e+00,
    4.8889377e-01,
    1.0346930e+00,
    7.2688513e-01,
        -3.0344092e-01,
    2.9387147e-01,
        -7.8728280e-01,
    8.8839563e-01,
        -1.1470701e+00,
        -1.0688705e+00,
        -8.0949869e-01,
        -2.9442842e+00,
    1.4383803e+00,
    3.2519054e-01,
        -7.5492832e-01,
    1.3702985e+00,
        -1.7115164e+00,
        -1.0224245e-01,
        -2.4144704e-01,
    3.1920674e-01,
    3.1285860e-01,
        -8.6487992e-01,
        -3.0051296e-02,
        -1.6487902e-01,
    6.2770729e-01,
    1.0932657e+00,
    1.1092733e+00,
        -8.6365282e-01,
    7.7359091e-02,
        -1.2141170e+00,
        -1.1135007e+00,
        -6.8493281e-03,
    1.5326303e+00,
        -7.6966591e-01,
    3.7137881e-01,
        -2.2558440e-01,
    1.1173561e+00,
        -1.0890643e+00,
    3.2557464e-02,
    5.5252702e-01,
    1.1006102e+00,
    1.5442119e+00,
    8.5931133e-02,
        -1.4915903e+00,
        -7.4230184e-01,
        -1.0615817e+00,
    2.3504572e+00,
        -6.1560188e-01,
    7.4807678e-01,
        -1.9241851e-01,
    8.8861043e-01,
        -7.6484924e-01,
        -1.4022690e+00,
        -1.4223759e+00,
    4.8819391e-01,
        -1.7737516e-01,
        -1.9605349e-01,
    1.4193102e+00,
    2.9158437e-01,
    1.9781105e-01,
    1.5876991e+00,
        -8.0446596e-01,
    6.9662442e-01,
    8.3508817e-01,
        -2.4371514e-01,
    2.1567009e-01,
        -1.1658439e+00,
        -1.1479528e+00,
    1.0487472e-01,
    7.2225403e-01,
    2.5854913e+00,
        -6.6689067e-01,
    1.8733102e-01,
        -8.2494425e-02,
        -1.9330229e+00,
        -4.3896615e-01,
        -1.7946788e+00,
    8.4037553e-01,
        -8.8803208e-01,
    1.0009283e-01,
        -5.4452893e-01,
    3.0352079e-01,
        -6.0032656e-01,
    4.8996532e-01,
    7.3936312e-01,
    1.7118878e+00,
        -1.9412354e-01,
        -2.1383553e+00,
        -8.3958875e-01,
    1.3545943e+00,
        -1.0721553e+00,
    9.6095387e-01,
    1.2404980e-01,
    1.4366966e+00,
        -1.9609000e+00,
        -1.9769823e-01,
        -1.2078455e+00,
    2.9080080e+00,
    8.2521889e-01,
    1.3789720e+00,
        -1.0581803e+00,
        -4.6861558e-01,
        -2.7246941e-01,
    1.0984246e+00,
        -2.7787193e-01,
    7.0154146e-01,
        -2.0518163e+00,
        -3.5385000e-01,
        -8.2358653e-01,
        -1.5770570e+00,
    5.0797465e-01,
    2.8198406e-01,
    3.3479882e-02,
        -1.3336779e+00,
    1.1274923e+00,
    3.5017941e-01,
        -2.9906603e-01,
    2.2889793e-02,
        -2.6199543e-01,
        -1.7502124e+00,
        -2.8565097e-01,
        -8.3136651e-01,
        -9.7920631e-01,
        -1.1564017e+00,
        -5.3355711e-01,
        -2.0026357e+00,
    9.6422942e-01,
    5.2006010e-01,
        -2.0027852e-02,
        -3.4771086e-02,
        -7.9816358e-01,
    1.0186853e+00,
        -1.3321748e-01,
        -7.1453016e-01,
    1.3513858e+00,
        -2.2477106e-01,
        -5.8902903e-01,
        -2.9375360e-01,
        -8.4792624e-01,
        -1.1201283e+00,
    2.5259997e+00,
    1.6554976e+00,
    3.0753516e-01,
        -1.2571184e+00,
        -8.6546803e-01,
        -1.7653411e-01,
    7.9141606e-01,
        -1.3320044e+00,
        -2.3298672e+00,
        -1.4490973e+00,
    3.3351083e-01,
    3.9135360e-01,
    4.5167942e-01,
        -1.3028465e-01,
    1.8368910e-01,
        -4.7615302e-01,
    8.6202161e-01,
        -1.3616945e+00,
    4.5502956e-01,
        -8.4870938e-01,
        -3.3488694e-01,
    5.5278335e-01,
    1.0390907e+00,
        -1.1176387e+00,
    1.2606587e+00,
    6.6014314e-01,
        -6.7865554e-02,
        -1.9522120e-01,
        -2.1760635e-01,
        -3.0310762e-01,
    2.3045624e-02,
    5.1290356e-02,
    8.2606279e-01,
    1.5269767e+00,
    4.6691444e-01,
        -2.0971334e-01,
    6.2519036e-01,
    1.8322726e-01,
        -1.0297675e+00,
    9.4922183e-01,
    3.0706192e-01,
    1.3517494e-01,
    5.1524634e-01,
    2.6140632e-01,
        -9.4148577e-01,
        -1.6233767e-01,
        -1.4605463e-01,
        -5.3201138e-01,
    1.6821036e+00,
        -8.7572935e-01,
        -4.8381505e-01,
        -7.1200455e-01,
        -1.1742123e+00,
        -1.9223952e-01,
        -2.7407023e-01,
    1.5300725e+00,
        -2.4902474e-01,
        -1.0642134e+00,
    1.6034573e+00,
    1.2346791e+00,
        -2.2962645e-01,
        -1.5061597e+00,
        -4.4462782e-01,
        -1.5594104e-01,
    2.7606825e-01,
        -2.6116365e-01,
    4.4342191e-01,
    3.9189421e-01,
        -1.2506789e+00,
        -9.4796092e-01,
        -7.4110609e-01,
        -5.0781755e-01,
        -3.2057551e-01,
    1.2469041e-02,
        -3.0291773e+00,
        -4.5701464e-01,
    1.2424484e+00,
        -1.0667014e+00,
    9.3372816e-01,
    3.5032100e-01,
        -2.9005764e-02,
    1.8245217e-01,
        -1.5650560e+00,
        -8.4539480e-02,
    1.6039464e+00,
    9.8347775e-02,
    4.1373613e-02,
        -7.3416911e-01,
        -3.0813730e-02,
    2.3234701e-01,
    4.2638756e-01,
        -3.7280874e-01,
        -2.3645458e-01,
    2.0236909e+00,
        -2.2583540e+00,
    2.2294457e+00,
    3.3756370e-01,
    1.0000608e+00,
        -1.6641645e+00,
        -5.9003456e-01,
        -2.7806416e-01,
    4.2271569e-01,
        -1.6702007e+00,
    4.7163433e-01,
        -1.2128472e+00,
    6.6190048e-02,
    6.5235589e-01,
    3.2705997e-01,
    1.0826335e+00,
    1.0060771e+00,
        -6.5090774e-01,
    2.5705616e-01,
        -9.4437781e-01,
        -1.3217885e+00,
    9.2482593e-01,
    4.9849075e-05,
        -5.4918915e-02,
    9.1112727e-01,
    5.9458370e-01,
    3.5020117e-01,
    1.2502512e+00,
    9.2978946e-01,
    2.3976326e-01,
        -6.9036110e-01,
        -6.5155364e-01,
    1.1921019e+00,
        -1.6118304e+00,
        -2.4461937e-02,
        -1.9488472e+00,
    1.0204980e+00,
    8.6171630e-01,
    1.1620835e-03,
        -7.0837213e-02,
        -2.4862839e+00,
    5.8117232e-01,
        -2.1924349e+00,
        -2.3192803e+00,
    7.9933710e-02,
        -9.4848098e-01,
    4.1149062e-01,
    6.7697781e-01,
    8.5773255e-01,
        -6.9115913e-01,
    4.4937762e-01,
    1.0063335e-01,
    8.2607000e-01,
    5.3615708e-01,
    8.9788843e-01,
        -1.3193787e-01,
        -1.4720146e-01,
    1.0077734e+00,
        -2.1236555e+00,
        -5.0458641e-01,
        -1.2705944e+00,
        -3.8258480e-01,
    6.4867926e-01,
    8.2572715e-01,
        -1.0149436e+00,
        -4.7106991e-01,
    1.3702487e-01,
        -2.9186338e-01,
    3.0181856e-01,
    3.9993094e-01,
        -9.2996156e-01,
        -1.7683027e-01,
        -2.1320946e+00,
    1.1453617e+00,
        -6.2909076e-01,
        -1.2038500e+00,
        -2.5394468e-01,
        -1.4286469e+00,
        -2.0857618e-02,
        -5.6066500e-01,
    2.1777787e+00,
    1.1384654e+00,
        -2.4968865e+00,
    4.4132693e-01,
        -1.3981379e+00,
        -2.5505518e-01,
    1.6440407e-01,
    7.4773403e-01,
        -2.7304695e-01,
    1.5763001e+00,
        -4.8093715e-01,
    3.2751212e-01,
    6.6473412e-01,
    8.5188593e-02,
    8.8095279e-01,
    3.2321314e-01,
        -7.8414618e-01,
        -1.8053734e+00,
    1.8585929e+00,
        -6.0453009e-01,
    1.0335972e-01,
    5.6316696e-01,
    1.1359700e-01,
        -9.0472621e-01,
        -4.6771458e-01,
        -1.2488995e-01,
    1.4789585e+00,
        -8.6081569e-01,
    7.8466847e-01,
    3.0862314e-01,
        -2.3386004e-01,
        -1.0569727e+00,
        -2.8414095e-01,
        -8.6690282e-02,
        -1.4693951e+00,
    1.9218224e-01,
        -8.2229328e-01,
        -9.4240588e-02,
    3.3621334e-01,
        -9.0465406e-01,
        -2.8825636e-01,
    3.5006276e-01,
        -1.8358591e+00,
    1.0359759e+00,
    2.4244611e+00,
    9.5940051e-01,
        -3.1577200e-01,
    4.2862268e-01,
        -1.0359848e+00,
    1.8778655e+00,
    9.4070440e-01,
    7.8734578e-01,
        -8.7587426e-01,
    3.1994913e-01,
        -5.5829428e-01,
        -3.1142942e-01,
        -5.7000992e-01,
        -1.0257336e+00,
        -9.0874559e-01,
        -2.0989733e-01,
        -1.6988641e+00,
    6.0760058e-01,
        -1.1779829e-01,
    6.9916033e-01,
    2.6964864e-01,
    4.9428706e-01,
        -1.4831210e+00,
        -1.0202644e+00,
        -4.4699501e-01,
    1.0965859e-01,
    1.1287365e+00,
        -2.8996304e-01,
    1.2615507e+00,
    4.7542481e-01,
    1.1741168e+00,
    1.2694707e-01,
        -6.5681593e-01,
        -1.4813991e+00,
    1.5548900e-01,
    8.1855137e-01,
        -2.9258813e-01,
        -5.4078642e-01,
        -3.0864182e-01,
        -1.0965933e+00,
        -4.9300982e-01,
        -1.8073936e-01,
    4.5841106e-02,
        -6.3783120e-02,
    6.1133519e-01,
    1.0931769e-01,
    1.8140155e+00,
    3.1202383e-01,
    1.8044938e+00,
        -7.2312148e-01,
    5.2654704e-01,
        -2.6025086e-01,
    6.0014251e-01,
    5.9393080e-01,
        -2.1860216e+00,
        -1.3270431e+00,
        -1.4410136e+00,
    4.0184450e-01,
    1.4702013e+00,
        -3.2681423e-01,
    8.1232300e-01,
    5.4554010e-01,
        -1.0516323e+00,
    3.9746700e-01,
        -7.5189474e-01,
    1.5162669e+00,
        -3.2566509e-02,
    1.6359997e+00,
        -4.2505849e-01,
    5.8943337e-01,
        -6.2791226e-02,
        -2.0219589e+00,
        -9.8213153e-01,
    6.1251130e-01,
        -5.4886130e-02,
        -1.1187320e+00,
        -6.2637854e-01,
    2.4951774e-01,
        -9.9301901e-01,
    9.7495022e-01,
        -6.4070951e-01,
    1.8088626e+00,
        -1.0798663e+00,
    1.9918944e-01,
        -1.5210266e+00,
        -7.2363113e-01,
        -5.9325032e-01,
    4.0133634e-01,
    9.4213332e-01,
    3.0048597e-01,
        -3.7307066e-01,
    8.1548851e-01,
    7.9888699e-01,
    1.2020528e-01,
    5.7124763e-01,
    4.1279601e-01,
        -9.8696188e-01,
    7.5956833e-01,
        -6.5720130e-01,
        -6.0391848e-01,
    1.7694682e-01,
        -3.0750347e-01,
        -1.3182035e-01,
    5.9535767e-01,
    1.0468328e+00,
        -1.9795863e-01,
    3.2767816e-01,
        -2.3830150e-01,
    2.2959689e-01,
    4.3999790e-01,
        -6.1686593e-01,
    2.7483679e-01,
    6.0110203e-01,
    9.2307951e-02,
    1.7298414e+00,
        -6.0855744e-01,
        -7.3705977e-01,
        -1.7498793e+00,
    9.1048258e-01,
    8.6708255e-01,
        -7.9892839e-02,
    8.9847599e-01,
    1.8370342e-01,
    2.9079013e-01,
    1.1294472e-01,
    4.3995219e-01,
    1.0166244e-01,
    2.7873352e+00,
        -1.1666650e+00,
        -1.8542991e+00,
        -1.1406811e+00,
        -1.0933435e+00,
        -4.3360930e-01,
        -1.6846988e-01,
        -2.1853356e-01,
    5.4133444e-01,
    3.8926620e-01,
    7.5122898e-01,
    1.7782559e+00,
    1.2230626e+00,
        -1.2832561e+00,
        -2.3289545e+00,
    9.0193147e-01,
        -1.8356387e+00,
    6.6756911e-02,
    3.5479486e-02,
    2.2271681e+00,
        -6.9214254e-02,
        -5.0732306e-01,
    2.3580967e-01,
    2.4580485e-01,
    7.0045209e-02,
        -6.0858051e-01,
        -1.2225934e+00,
    3.1650036e-01,
        -1.3428692e+00,
        -1.0321843e+00,
    1.3312159e+00,
        -4.1890320e-01,
        -1.4032172e-01,
    8.9982233e-01,
        -3.0011101e-01,
    1.0293657e+00,
        -3.4506597e-01,
    1.0128019e+00,
    6.2933458e-01,
        -2.1301508e-01,
        -8.6569731e-01,
        -1.0431083e+00,
        -2.7006881e-01,
        -4.3814136e-01,
        -4.0867431e-01,
    9.8354524e-01,
        -2.9769714e-01,
    1.1436789e+00,
        -5.3162012e-01,
    9.7256573e-01,
        -5.2225048e-01,
    1.7657779e-01,
    9.7073782e-01,
        -4.1397227e-01,
        -4.3827052e-01,
    2.0033906e+00,
    9.5099350e-01,
        -4.3200384e-01,
    6.4894074e-01,
        -3.6007630e-01,
    7.0588502e-01,
    1.4158491e+00,
        -1.6045157e+00,
    1.0288531e+00,
    1.4579678e+00,
    4.7471323e-02,
    1.7462567e+00,
    1.5538751e-01,
        -1.2371197e+00,
        -2.1934943e+00,
        -3.3340707e-01,
    7.1354330e-01,
    3.1740773e-01,
    4.1361039e-01,
        -5.7708558e-01,
    1.4400180e-01,
        -1.6386657e+00,
        -7.6009000e-01,
        -8.1879310e-01,
    5.1972889e-01,
        -1.4160059e-02,
        -1.1555294e+00,
        -9.5249161e-03,
        -6.8981054e-01,
        -6.6669915e-01,
    8.6414942e-01,
    1.1341944e-01,
    3.9836285e-01,
    8.8396989e-01,
    1.8025769e-01,
    5.5085452e-01,
    6.8296428e-01,
    1.1706087e+00,
    4.7586059e-01,
    1.4122327e+00,
    2.2608484e-02,
        -4.7869410e-02,
    1.7013347e+00,
        -5.0971171e-01,
        -2.8549601e-03,
    9.1986708e-01,
    1.4980873e-01,
    1.4049334e+00,
    1.0341215e+00,
    2.9157029e-01,
        -7.7769854e-01,
    5.6669610e-01,
        -1.3826212e+00,
    2.4447468e-01,
    8.0843880e-01,
    2.1304170e-01,
    8.7967716e-01,
    2.0388763e+00,
    9.2393245e-01,
    2.6691745e-01,
    6.4166151e-01,
    4.2548536e-01,
        -1.3147235e+00,
        -4.1641122e-01,
    1.2246878e+00,
        -4.3584206e-02,
    5.8242328e-01,
        -1.0065001e+00,
    6.4516742e-02,
    6.0029195e-01,
        -1.3615150e+00,
    3.4759263e-01,
        -1.8184322e-01,
        -9.3953477e-01,
        -3.7533189e-02,
        -1.8963045e+00,
        -2.1279768e+00,
        -1.1769233e+00,
        -9.9053222e-01,
        -1.1730323e+00,
        -1.7254278e+00,
    2.8822809e-01,
        -1.5941837e+00,
    1.1021885e-01,
    7.8706668e-01,
        -2.2267863e-03,
    9.3108760e-02,
        -3.7815706e-01,
        -1.4826761e+00,
        -4.3818585e-02,
    9.6082521e-01,
    1.7382449e+00,
        -4.3020624e-01,
        -1.6273227e+00,
    1.6634749e-01,
    3.7626591e-01,
        -2.2695046e-01,
        -1.1489123e+00,
    2.0243326e+00,
        -2.3595235e+00,
        -5.0997205e-01,
        -1.3216256e+00,
        -6.3612825e-01,
    3.1785142e-01,
    1.3804797e-01,
        -7.1073507e-01,
    7.7700353e-01,
    6.2239392e-01,
    6.4738088e-01,
        -4.2563168e-01,
    1.0485808e+00,
    6.6070709e-01,
    2.5087725e+00,
    1.0634596e+00,
    1.1569217e+00,
    5.2978827e-02,
        -1.2883860e+00,
        -3.7122125e-01,
        -7.5779192e-01,
        -5.6396892e-01,
    5.5513856e-01,
        -5.5677806e-01,
        -8.9511314e-01,
        -4.0932772e-01,
        -1.6088677e-01,
    4.0933443e-01,
        -9.5263600e-01,
    3.1731747e-01,
    7.8020081e-02,
    1.3243854e+00,
        -2.1317049e-01,
        -1.3447864e-01,
        -1.1713558e+00,
        -1.3852627e+00,
    3.1050832e-01,
        -2.4948906e-01,
    5.0374406e-01,
        -8.9266140e-01,
    1.9085123e+00,
    1.2223070e-01,
    1.0470333e+00,
        -2.2692020e-01,
        -1.6250194e-01,
    6.9005190e-01,
    5.5575677e-01,
        -1.1202550e+00,
        -1.5326930e+00,
        -1.0978678e+00,
        -1.4157733e+00,
    5.9570589e-02,
        -4.1125093e-01,
        -3.6801073e-01,
        -1.3609631e+00,
    7.7956743e-01,
    4.3941111e-01,
        -8.9622484e-02,
    1.0211801e+00,
        -8.7397947e-01,
    4.1470029e-01,
    3.4844120e-01,
    3.4925442e-01,
        -7.2924727e-01,
    3.2684025e-01,
        -5.1488163e-01,
        -8.9644615e-01,
        -1.2032682e+00,
    1.0378156e+00,
        -8.4594421e-01,
        -1.7291384e-01,
        -1.2086521e+00,
        -2.9712680e-01,
        -3.2320378e+00,
        -1.0869592e+00,
        -1.4264362e+00,
        -1.0144508e+00,
        -2.1326719e-01,
        -3.2534778e-01,
    1.9443978e+00,
        -5.7177322e-01,
        -2.5003228e-01,
        -1.5693155e+00,
        -4.7738266e-01,
        -1.3379767e+00,
    3.0299024e-02,
    8.5308677e-01,
    4.0425347e-01,
        -7.0062021e-01,
        -1.6305429e+00,
    1.4600132e+00,
    2.0500427e+00,
    1.2050060e-01,
        -9.8990160e-01,
    1.1977715e+00,
        -5.9265622e-01,
        -4.6980936e-01,
    8.8637738e-01,
        -1.3852198e+00,
        -1.9567540e+00,
    4.2068370e-01,
    4.0073800e-01,
    9.5142158e-02,
    4.9668439e-01,
    1.0822406e+00,
    9.7044779e-01,
        -5.6856957e-01,
    8.0997207e-01,
    1.7324737e-01,
        -5.0554257e-01,
        -1.1933058e+00,
    6.4697094e-01,
        -3.5362260e-01,
    4.6434527e-02,
        -7.9294750e-01,
        -1.5505145e+00,
    1.7158636e-01,
        -6.2139125e-02,
    1.1990279e+00,
    8.0170407e-01,
    1.0533046e+00,
        -7.4887675e-01,
        -9.3632650e-01,
        -1.2690868e+00,
    4.9798062e-01,
    2.7890811e+00,
    7.2757204e-01,
        -7.7306410e-01,
    8.3663375e-01,
        -1.1283303e+00,
        -1.4244701e+00,
    7.1744232e-01,
        -7.7790552e-01,
    3.1598588e-01,
    1.4065351e+00,
    4.0112464e-01,
    9.2966028e-01,
        -1.6058022e+00,
    6.6153624e-01,
    2.1385023e+00,
    5.4113941e-01,
        -1.5408772e+00,
        -2.0314279e-01,
        -4.9996522e-01,
    3.8302391e-01,
    4.1203538e-01,
    4.0549255e-01,
        -3.6378075e-01,
        -5.9927204e-01,
        -5.8958899e-01,
    8.5354083e-01,
        -1.8530081e+00,
        -2.0730316e-01,
    2.7037820e-01,
        -6.5277101e-01,
    4.7722729e-01,
        -7.1319650e-02,
        -9.3830129e-01,
    1.6136353e-01,
        -2.6818288e-01,
        -4.0987265e-01,
        -7.1132271e-01,
    6.1445484e-02,
        -1.8461292e+00,
        -3.9833312e-01,
        -5.4354812e-01,
        -9.1189850e-01,
    6.5269859e-01,
        -7.3427126e-01,
    5.4063309e-01,
    9.7584088e-01,
        -1.5687041e-01,
    2.7779932e-01,
    6.3951730e-01,
        -8.0978015e-02,
    5.4087014e-01,
        -1.2625648e+00,
    1.1104238e+00,
        -9.8956268e-01,
        -1.8288359e+00,
    1.3844985e+00,
        -6.2726794e-02,
    4.4892112e-01,
        -3.6325847e-01,
        -1.0205834e+00,
        -3.0729885e+00,
    6.2627900e-01,
        -2.8668453e-01,
        -1.9734291e-01,
    4.0560537e-01,
        -1.4193485e+00,
        -7.2944524e-01,
    1.1473278e+00,
    5.9786463e-01,
        -1.2812813e+00,
        -2.2032642e+00,
        -5.7124632e-01,
    2.1399648e-01,
    9.4237693e-01,
    9.3725491e-02,
        -1.1223117e+00,
    3.0615782e-01,
        -1.1723349e+00,
        -9.6096656e-01,
        -6.5373502e-01,
        -1.2293936e+00,
        -2.7096513e-01,
        -8.9995007e-01,
        -2.8568614e-01,
        -4.6242154e-01,
        -4.0978521e-01,
        -5.0353898e-01,
    1.2332971e+00,
    6.1030522e-01,
    5.9072155e-02,
        -1.4669467e+00,
        -1.6258033e+00,
        -1.9647524e+00,
    2.6051958e+00,
    9.7237481e-01,
    2.5698097e-01,
        -9.7424046e-01,
        -1.1463644e+00,
    5.4763950e-01,
    1.5650840e+00,
        -1.6933437e+00,
        -4.4939736e-01,
        -8.4292073e-02,
        -1.9919972e+00,
    8.4124567e-01,
        -4.1465892e-01,
    1.9121808e+00,
        -3.9089873e-01,
    4.0918208e-01,
        -1.1424282e+00,
        -6.2486378e-01,
        -1.1687228e+00,
    3.9257528e-01,
    1.3018395e+00,
        -5.9364176e-01,
    4.3637539e-01,
        -5.0436248e-01,
    1.0210771e-01,
    1.1962505e+00,
    1.2028282e-01,
        -1.0368434e+00,
        -8.5710324e-01,
        -1.6987430e-01,
        -1.9166828e-01,
        -8.6581521e-01,
    1.8066413e-01,
    1.2665285e+00,
        -2.5116929e-01,
        -2.0457005e-01,
        -2.2015219e+00,
        -7.7451310e-01,
        -1.3932726e+00,
        -3.8623465e-01,
    5.2558635e-01,
    1.5232693e+00,
    1.7984945e+00,
        -1.1688427e-01,
        -3.2019619e-01,
    8.1751628e-01,
    4.9015919e-01,
    7.6525116e-01,
    7.7827905e-01,
        -1.4803052e+00,
    5.4036396e-01,
        -9.1539022e-02,
        -7.6025238e-01,
        -6.9359544e-01,
    1.2814578e+00,
        -8.0973761e-01,
        -1.2368184e+00,
    2.1468645e-01,
    2.0107718e+00,
    2.5554433e-02,
    3.0829944e-01,
        -9.3824721e-01,
    1.6742160e+00,
    1.2498817e-01,
    5.3010126e-01,
        -9.5206822e-01,
    8.5404282e-01,
    3.8914573e-01,
        -1.1560011e+00,
    3.9740127e-02,
        -4.5059860e-01,
    1.0924794e-01,
        -2.5055284e-01,
        -1.8990165e-01,
        -1.0329135e+00,
        -3.2329192e-01,
    7.6652685e-01,
    1.7446732e+00,
        -1.1605199e+00,
    2.3774119e+00,
    1.5260780e+00,
    1.6850750e-01,
        -3.0120653e-01,
        -6.9865427e-01,
    8.3277058e-01,
        -6.9460525e-01,
        -4.6188299e-01,
    8.8361714e-01,
    4.3594418e-01,
    8.9674736e-01,
    5.0473203e-01,
        -4.0089714e-01,
        -5.1384801e-01,
    7.9636760e-01,
        -6.7119016e-01,
    1.1866590e+00,
    7.9070197e-01,
    2.8772149e-01,
    3.2261146e-03,
    3.6561719e-01,
    3.5266778e+00,
        -1.1243666e-01,
        -1.5565939e+00,
    1.9151023e+00,
    6.0984605e-01,
        -6.4791162e-01,
    2.6173349e+00,
    5.5095042e-01,
    2.9420368e-01,
        -7.7784380e-01,
        -1.0649301e+00,
        -1.7684140e+00,
        -4.2291954e-01,
        -1.0531024e+00,
    6.4775524e-01,
        -3.1762819e-01,
    1.7689916e+00,
    1.5105824e+00,
    1.6401032e-01,
        -2.8276371e-01,
    1.1521658e+00,
        -1.1465076e+00,
    6.7369870e-01,
        -6.6911300e-01,
        -4.0032270e-01,
        -6.7180243e-01,
    5.7562902e-01,
        -7.7809352e-01,
        -1.0635612e+00,
    5.5297830e-01,
        -4.2342884e-01,
    3.6158716e-01,
        -3.5188924e-01,
    2.6954071e-01,
        -2.5644494e+00,
    4.6586413e-01,
    1.8535609e+00,
    1.0392893e+00,
    9.1089658e-01,
        -2.3973129e-01,
    1.8099808e-01,
    2.4424955e-01,
    9.6392885e-02,
        -8.3046850e-01,
        -3.5225219e-01,
        -1.7477504e-01,
        -4.8065342e-01,
    8.3683671e-01,
    2.5383493e+00,
        -1.3233343e+00,
    1.2834026e-01,
        -1.4423792e+00,
    1.3025082e+00,
    1.4099115e+00,
        -1.6625430e+00,
    1.9436845e+00,
        -1.0846985e+00,
    2.2681898e-01,
    1.0989292e+00,
    1.4718875e-01,
    2.2956658e+00,
    2.7525579e+00,
    1.3831772e-01,
        -1.9070662e+00,
        -3.6499299e-01,
        -8.4811001e-01,
        -7.6475336e-01,
        -1.1276948e+00,
    7.8188895e-02,
    2.1066297e+00,
        -7.1584739e-01,
        -2.8051566e-01,
    1.1664750e+00,
    1.2128214e+00,
    4.8554099e-01,
    1.0260165e+00,
    8.7072602e-01,
        -3.8175788e-01,
    4.2889303e-01,
        -2.9913052e-01,
        -8.9986852e-01,
    6.3474546e-01,
    6.7453591e-02,
        -1.8712054e-01,
    2.9172746e-01,
    9.8769469e-01,
    3.9293457e-01,
    1.9455137e-01,
    2.7978496e-01,
    5.1220312e-02,
        -7.7446624e-01,
    7.8678171e-01,
    1.4089070e+00,
        -5.3409858e-01,
    1.9277584e+00,
        -1.7624755e-01,
        -2.4375036e-01,
        -8.9760066e-01,
        -7.9233687e-01,
        -9.5297469e-01,
    3.5390545e-01,
    1.5970263e+00,
    5.2747025e-01,
    8.5420230e-01,
    1.3418465e+00,
        -2.4995334e+00,
        -1.6755932e-01,
    3.5301531e-01,
    7.1725373e-01,
        -1.3048516e+00,
        -1.0058690e+00,
    7.9068347e-01,
        -1.1657133e-01,
    5.5308989e-01,
        -9.6064480e-01,
        -1.6338024e+00,
    7.6120028e-01,
    1.1933072e+00,
    1.6320572e+00,
        -1.5321896e+00,
        -1.3368524e+00,
        -1.4738465e+00,
        -4.1663074e-02,
        -6.1550734e-01,
    1.3141548e+00,
        -1.4550666e+00,
        -1.7423492e+00,
    2.0530468e-01,
    1.1929304e+00,
        -8.0282310e-01,
        -1.2656364e+00,
        -1.4933135e-01,
        -1.6364467e+00,
    1.7344346e-02,
    8.2838727e-01,
    2.1773835e-01,
        -1.9092449e+00,
        -5.3682182e-01,
        -3.0203230e-01,
    1.8135821e+00,
    9.1485175e-01,
        -5.7080716e-02,
    1.3093621e+00,
        -1.0447358e+00,
        -3.4826681e-01,
    1.4125612e+00,
    1.5023829e+00,
    7.3037599e-01,
    4.9075227e-01,
        -5.8612614e-01,
    7.4489965e-01,
        -8.2815497e-01,
    5.7452073e-01,
    2.8184138e-01,
    1.1393063e+00,
        -4.2586785e-01,
    6.3613989e-01,
    7.9317808e-01,
        -8.9837711e-01,
    1.5624484e-01,
    1.5972539e+00,
    1.1243971e-01,
        -3.0862493e-01,
    4.5665961e-01,
        -2.7510083e-01,
    4.4314361e-01,
        -1.3476513e-01,
        -1.8328230e-02,
    4.6078943e-01,
    1.3623155e+00,
    4.5187457e-01,
    1.6483837e+00,
        -2.0283620e+00,
        -4.4925681e-01,
    2.3599320e-01,
        -8.3517296e-01,
        -1.2759552e+00,
    6.1703508e-01,
    6.1270150e-01,
    2.8938116e-01,
    3.9531612e-01,
        -8.7056284e-01,
        -4.9768838e-01,
        -1.0667182e-01,
        -6.8782914e-01,
    3.3188088e-01,
    2.3652247e+00,
        -4.8223072e-01,
    6.4744821e-01,
        -1.0344247e+00,
    1.3395546e+00,
        -9.6914036e-01,
    2.0871560e-01,
        -6.1859336e-01,
    5.1201564e-01,
    1.1354171e-02,
        -4.3988626e-02,
    2.9490925e+00,
        -6.3004619e-01,
        -4.6879400e-02,
    2.6830255e+00,
        -1.1466907e+00,
    5.5299875e-01,
        -1.0764584e+00,
    1.0306396e+00,
    3.2752981e-01,
    6.5212481e-01,
        -2.7886112e-01,
    2.4519159e-01,
    1.4725135e+00,
        -2.2751015e+00,
        -1.6332907e+00,
    4.1546894e-01,
        -6.5476885e-01,
        -2.9634832e-01,
        -1.4969189e+00,
        -9.0483445e-01,
        -4.0418155e-01,
        -7.2579817e-01,
        -8.6648503e-01,
        -4.2184678e-01,
        -9.4266632e-01,
    1.3418837e+00,
        -9.8843471e-01,
    1.8179427e+00,
        -3.7443661e-01,
        -1.4517407e+00,
        -6.1868181e-01,
    9.3450096e-01,
    1.0559293e+00,
    1.6022728e-01,
    2.8740032e-01,
    6.3290558e-01,
        -1.4590419e+00,
        -5.8170973e-01,
        -1.8301493e+00,
        -4.4910308e-01,
    9.4927470e-01,
    7.1744141e-01,
    2.2878286e+00,
    1.6672766e-01,
        -2.1564908e+00,
    1.6893993e+00,
    1.2822807e+00,
        -5.8263096e-01,
    2.2261448e-01,
    7.7945147e-01,
    3.8470716e-01,
    6.9636692e-01,
        -1.1271556e-01,
        -3.8823701e-02,
    8.8088629e-02,
        -7.8965597e-01,
    1.4229606e+00,
    6.3316841e-03,
    6.8648085e-01,
        -8.5493363e-01,
        -1.0752353e+00,
        -9.0967251e-02,
        -2.5277183e-01,
    1.1948238e+00,
    6.0606371e-01,
    5.4051443e-01,
        -1.4449394e+00,
        -9.6769381e-01,
    2.0205134e-01,
        -3.4787797e-01,
    1.2900880e+00,
    1.3411538e+00,
        -5.8079769e-01,
    8.7513560e-01,
    1.3954499e+00,
    3.2098522e-01,
    1.6233825e+00,
    1.0624333e+00,
    2.1410524e-01,
    8.7680320e-01,
    1.9440701e-01,
        -4.1489216e-01,
    3.5845873e-01,
    3.6222668e-02,
        -3.6463117e-01,
    1.7710196e+00,
    2.2127307e-01,
    2.7303776e+00,
        -2.9616538e-01,
    5.6429555e-01,
    1.5826207e+00,
    2.7292301e+00,
    3.0356428e-01,
        -7.9025848e-01,
    8.0338023e-01,
        -1.3199027e+00,
        -2.7384576e-01,
    2.7186692e-01,
    1.4895535e+00,
    1.4371415e+00,
        -2.7561397e-02,
    9.2393132e-01,
        -3.2128042e-01,
    6.6112489e-01,
    1.9152939e+00,
    1.5675961e-01,
        -3.0053646e-01,
        -5.0003478e-01,
    7.1647138e-01,
    1.3372887e+00,
    2.1256799e+00,
    5.4045784e-02,
    1.6303592e-01,
        -6.3270674e-01,
    1.6119915e+00,
        -7.5448724e-02,
        -4.7323714e-01,
    2.1842408e+00,
    8.0988111e-01,
    7.1634280e-01,
        -1.0055711e+00,
    4.3398661e-01,
    5.2014359e-01,
        -1.0922445e+00,
        -2.2579445e-01,
        -4.0492178e-01,
    5.2785922e-01,
        -1.0069629e+00,
    1.0890268e+00,
    1.7848747e+00,
        -3.0375452e-01,
        -8.6966315e-03,
    5.0663503e-01,
    1.2032520e+00,
    5.2201773e-01,
    3.9704609e-01,
        -4.8281084e-01,
        -2.3149719e-01,
    6.1338521e-01,
    1.6828505e+00,
    5.6839357e-01,
        -1.2060293e+00,
    4.3306039e-01,
        -9.2120748e-02,
        -2.4405494e-01,
        -2.1918866e-01,
        -8.7976672e-01,
        -3.2080433e-01,
        -7.8441529e-01,
        -3.6496253e-01,
    1.1727057e-01,
    1.7433969e-01,
        -2.1565641e-01,
        -1.5261148e-01,
    3.3688220e-02,
    4.5828221e-01,
    1.2816312e+00,
    6.2009005e-01,
        -2.8667386e-01,
    5.9801571e-01,
        -2.4553268e-01,
        -1.7807372e+00,
        -2.3472392e+00,
        -1.7135953e+00,
        -2.3712726e-01,
        -6.1962581e-01,
        -7.2016038e-01,
    4.0657174e-02,
        -6.5898143e-01,
        -6.3051503e-01,
    6.0962509e-01,
    7.8233497e-01,
    2.4365844e+00,
    3.0240742e-01,
    5.8319854e-02,
        -5.7413396e-01,
        -1.9521240e-01,
        -5.0531278e-02,
        -1.7557750e+00,
        -2.5735762e-01,
    7.4954189e-01,
        -5.7076431e-01,
    4.9423338e-01,
    9.9144044e-01,
    1.0771401e+00,
    7.7684180e-01,
        -2.2598404e+00,
        -5.6437669e-01,
    9.0149144e-01,
    3.9467553e-01,
    4.8544237e-03,
    4.3691863e-01,
    1.1300727e+00,
    1.5377074e-01,
        -7.5862716e-01,
        -1.8016310e-01,
        -2.0778959e-01,
    8.9674529e-01,
    4.1230770e-01,
    5.4751969e-01,
    1.4783504e-01,
        -3.6226716e-01,
    6.1141295e-02,
    2.1670555e-01,
        -1.3981224e+00,
    1.7887037e-01,
    9.2758422e-01,
        -1.1017794e-01,
    1.5723979e+00,
    5.6049061e-01,
        -4.2034461e-01,
        -1.5394539e-01,
        -2.7519859e-01,
    2.4112045e-01,
    7.5468639e-01,
        -2.9190990e-01,
    4.5844538e-01,
    1.7552886e+00,
    9.3149059e-01,
    8.2526444e-01,
        -8.1480713e-01,
        -5.3420418e-01,
    2.4255166e-01,
        -1.0064795e-01,
        -1.6250484e+00,
        -1.5144232e+00,
    1.0261894e+00,
        -7.5812748e-01,
    2.0783448e+00,
        -2.2219866e+00,
    4.4876364e-01,
    6.2611541e-04,
        -7.5623931e-01,
    4.0432483e-01,
        -7.9385288e-01,
    8.5978320e-01,
    6.6869211e-02,
        -1.6393874e+00,
        -2.4247499e+00,
        -2.8382993e-01,
    1.1458063e+00,
    1.8116929e-01,
    5.4250229e-02,
    6.8775365e-01,
        -1.3934073e+00,
    1.4253657e+00,
        -8.9385116e-01,
    3.7764700e-02,
        -3.6356929e-01,
    1.4955648e-01,
        -1.9445181e+00,
    1.5238949e+00,
    5.4581017e-01,
    2.0099275e+00,
    1.4166707e+00,
    1.1480666e-02,
        -9.3904932e-01,
        -1.7389084e+00,
    1.6970972e-02,
    2.1915909e-01,
    1.0458206e+00,
        -9.5098265e-01,
    7.9479742e-01,
    7.1429810e-02,
        -7.7368690e-01,
    7.7416184e-01,
    2.6565472e-01,
        -2.3510553e-01,
    1.8772922e+00,
    6.0923940e-01,
        -1.1027388e-01,
    2.7745747e-01,
    8.7045914e-02,
    1.7359305e-01,
    4.5359115e-01,
        -6.0351803e-01,
        -7.9702393e-01,
    3.6064890e-01,
    1.8850917e+00,
        -3.0682183e-01,
        -1.0127240e+00,
        -2.3854551e-01,
        -4.8401481e-01,
        -3.2734452e-01,
    4.7551798e-01,
        -1.3000489e-01,
        -5.9435328e-01,
        -4.4376691e-01,
        -1.3225296e+00,
        -8.5952117e-01,
        -1.4130012e+00,
        -5.1598590e-01,
        -1.0850981e+00,
        -7.0715859e-01,
        -3.0165455e-01,
        -1.2004405e+00,
        -1.9362266e-02,
    3.4037056e-01,
        -9.6323098e-01,
    1.1139226e+00,
        -1.5861054e+00,
        -3.9179466e-01,
        -1.4846862e+00,
        -3.4462717e-01,
        -1.3239159e+00,
        -5.7483495e-01,
        -7.4070673e-01,
        -1.1850019e+00,
        -2.0648600e+00,
    5.6505981e-01,
    2.0001424e+00,
    2.2233277e+00,
        -4.9217759e-01,
        -4.6002934e-02,
        -4.6574701e-01,
    7.5947432e-02,
        -9.1876964e-01,
        -1.9194665e+00,
        -3.6443143e-02,
        -1.2251257e+00,
        -1.9024343e+00,
    2.3742486e+00,
        -2.3334571e-01,
    4.0388074e-01,
    1.1924686e+00,
        -1.6847588e+00,
    4.1314853e-01,
    5.0174522e-01,
    8.3064345e-02,
    1.5779805e-01,
        -5.2794251e-01,
    7.2306070e-01,
        -8.4994165e-01,
        -7.9638405e-01,
    7.2533757e-01,
    1.6865445e+00,
        -3.8639417e-01,
        -5.0507841e-01,
    4.0807389e-01,
    1.0723561e+00,
    9.6798289e-01,
    2.7014553e-01,
        -6.3440654e-01,
    6.2976318e-01,
        -7.9233754e-02,
    1.3769492e+00,
        -1.4082125e+00,
    1.4123168e-01,
    1.2897194e+00,
        -4.9493630e-01,
        -6.2482495e-01,
        -9.3363429e-01,
        -2.7872491e-01,
        -2.0052496e-01,
    1.3674116e-01,
        -8.8334886e-01,
    8.2537923e-02,
        -6.0387490e-01,
        -3.6872826e-01,
        -8.3817042e-01,
        -2.8247504e-01,
    3.5698678e+00,
    3.4075324e+00,
    1.1469179e+00,
    7.8725753e-01,
        -1.2781374e+00,
        -5.8459310e-01,
        -6.1940566e-01,
    5.3530105e-01,
    4.8298705e-01,
    1.0847508e-01,
        -3.4028473e-01,
        -9.2584842e-01,
    5.3216898e-03,
    1.1391495e+00,
    4.2736125e-01,
    1.8103215e-01,
    6.5747974e-01,
    5.8424561e-01,
        -1.6164513e+00,
    1.8774352e-02,
        -4.2596076e-01,
        -2.0340273e+00,
        -1.3285526e+00,
        -3.1988562e-01,
    8.2543046e-01,
        -2.2929281e-01,
    2.6225081e-01,
        -8.9797954e-01,
        -2.1573027e+00,
    9.3916756e-02,
        -9.5118146e-01,
    1.1725899e+00,
    1.7350959e+00,
        -3.7169605e-01,
    1.1928641e+00,
    9.5364803e-01,
        -1.4150445e+00,
        -3.3356318e-02,
    2.6111776e-01,
    5.2299453e-01,
    6.7678684e-01,
    6.7439566e-01,
    6.7839896e-01,
        -3.1257972e-01,
    3.7924377e-01,
        -2.2528982e+00,
        -1.1683507e+00,
    1.2019656e+00,
        -6.6073859e-01,
    3.2755904e-01,
    1.5081271e+00,
        -8.8890896e-01,
        -9.5928463e-01,
        -4.9271930e-01,
    4.4105658e-01,
        -2.0476425e-01,
        -9.7780693e-01,
        -1.5729466e+00,
        -3.7026157e-01,
        -2.2114547e-01,
        -5.3521282e-01,
        -2.6197217e-01,
        -1.0954149e+00,
    5.4923349e-01,
        -2.1746206e+00,
    1.4461465e-01,
    6.6903344e-01,
        -8.4882916e-01,
        -5.7090119e-02,
    2.9178626e-01,
        -6.1461854e-01,
        -1.3643189e-02,
    4.1211350e-01,
        -9.3714960e-01,
    8.3515704e-01,
    1.0945385e+00,
    3.2118073e-01,
    1.5112839e-02,
        -1.1644925e+00,
    4.9484075e-01,
        -1.2158490e+00,
    1.5907880e+00,
    5.2647505e-01,
    2.6481859e-01,
        -3.9359789e-01,
        -2.1763100e+00,
        -1.1956544e+00,
    3.6532839e-01,
    2.4124431e+00,
    7.4024722e-01,
    3.0974639e-01,
        -5.4198718e-01,
    1.2228318e-01,
    9.6227933e-01,
        -2.5397484e-01,
    1.8917560e+00,
        -1.2202541e+00,
        -3.7623714e-01,
    5.2429149e-02,
        -1.9539337e+00,
    5.6542057e-01,
    7.7794462e-02,
    8.0701188e-02,
    7.9470781e-01,
    1.0436889e+00,
    8.0218465e-01,
        -4.6882436e-01,
        -4.6592374e-02,
    3.5345303e-01,
        -1.2568006e+00,
        -1.0360314e+00,
        -4.2696269e-01,
    7.7668679e-02,
    1.7909303e+00,
    7.9726314e-01,
        -4.4250074e-01,
        -6.2909109e-01,
    1.5337963e+00,
    2.7335404e+00,
    1.6743908e-01,
        -4.7886517e-01,
        -1.4126539e+00,
    9.7498806e-01,
    2.8971898e-01,
    1.1654083e+00,
        -9.0870562e-01,
    2.4057504e-01,
        -6.5404634e-01,
    1.2749545e+00,
        -5.5119061e-01,
        -8.7408868e-02,
        -3.4782032e-01,
    9.9396253e-01,
    4.2843617e-01,
        -1.0041853e+00,
        -6.3268788e-01,
        -1.0457100e+00,
    5.0570701e-01,
    3.3195372e-01,
        -1.6354125e+00,
        -1.9068402e+00,
        -4.0398721e-02,
    6.9719333e-01,
    1.6880258e-01,
        -1.5437963e+00,
        -1.5518024e+00,
    8.6707780e-01,
        -1.4537299e-01,
        -3.8624166e-01,
    1.3162041e+00,
        -7.9646423e-01,
    1.3544137e-01,
    4.1780643e-01,
    8.1987965e-01,
        -8.5435338e-01,
    3.5731859e-01,
    2.7484666e+00,
        -1.5129770e+00,
    4.3397903e-01,
        -2.2976773e-01,
        -8.2708638e-01,
        -8.3198262e-01,
    4.9789950e-01,
    2.3156261e+00,
        -7.9382570e-01,
    5.4095957e-01,
        -5.5906136e-01,
    1.9765661e+00,
    5.4466038e-01,
        -1.3790556e-01,
    6.1987564e-01,
        -5.5827834e-03,
    1.1071992e+00,
        -1.8559011e-01,
        -1.1214178e+00,
    2.4644952e-01,
    1.5610372e+00,
        -1.1966217e+00,
        -2.4234528e-01,
    1.0048282e+00,
        -1.9201258e+00,
    6.2544578e-01,
    7.5296042e-01,
    2.1348368e-01,
        -7.7023407e-01,
        -7.1346525e-03,
    9.3186525e-02,
    9.3525121e-01,
    6.6351792e-01,
        -3.5023267e-01,
    1.6198774e+00,
        -5.0833096e-02,
        -8.1269707e-01,
        -4.3841993e-01,
    8.5860999e-01,
    1.9521594e-01,
    8.8886215e-01,
    6.9221821e-02,
    2.4868213e+00,
        -1.6656431e+00,
        -4.1592794e-01,
        -8.4224606e-02,
    8.9251948e-02,
    1.4561472e+00,
    2.1945352e-01,
        -1.1487725e-01,
    6.8602469e-02,
    7.5149486e-01,
        -6.8942706e-01,
    4.5081358e-01,
        -1.5650247e+00,
        -7.8795924e-02,
        -9.4179197e-01,
        -6.5286151e-01,
    2.8252924e-01,
        -1.1250790e+00,
        -9.8897409e-01,
        -1.5158588e+00,
        -2.2285105e+00,
        -1.5152168e-01,
    1.1627444e+00,
        -1.8193629e-01,
        -2.3395354e-01,
        -1.0467341e+00,
    1.5833189e+00,
        -2.4941342e-01,
    1.2940190e+00,
    3.6198014e-01,
        -2.6305251e-01,
    1.0821445e+00,
    9.8243408e-01,
        -1.1144396e-01,
    1.2959508e+00,
    1.7812950e+00,
        -6.5614876e-02,
        -2.5568087e-01,
    4.0463816e-01,
    3.5175675e-01,
    8.0751106e-01,
        -2.5559049e-01,
    7.1511328e-01,
    1.0485973e+00,
    1.7754856e-01,
    1.5329768e-01,
        -1.2543245e+00,
        -1.1728009e+00,
        -1.4614418e+00,
        -1.2442880e+00,
        -1.5509938e-01,
        -1.6149138e+00,
    2.2460651e+00,
    7.3928113e-01,
        -2.0676454e+00,
        -1.1545506e+00,
        -1.0719188e-01,
        -1.7128791e+00,
        -4.5989454e-01,
    1.0910001e+00,
        -1.6388026e-01,
        -6.7240470e-02,
        -1.0015925e+00,
        -5.5566145e-01,
        -1.3515563e+00,
    3.6421132e-01,
        -4.5220760e-01,
    7.8336597e-01,
    1.2372366e+00,
    1.0771982e+00,
        -3.4841124e-02,
        -5.0398733e-01,
        -1.2240190e+00,
    1.1850908e-01,
    9.5947350e-01,
        -3.4093044e-01,
        -1.7331833e-01,
    6.1630051e-01,
    8.6391937e-01,
        -1.4169142e+00,
    1.9995196e-01,
    1.9582685e-01,
        -1.5113240e-01,
    8.9278416e-01,
        -3.6419019e-01,
        -8.2618869e-01,
    2.7601131e-01,
    4.5979730e-01,
        -2.1750667e-01,
    7.9612297e-01,
        -1.5180226e+00,
        -1.0749170e+00,
        -3.0721657e+00,
    5.2140719e-01,
        -9.9102363e-01,
        -2.5312574e-01,
    1.0092653e+00,
    5.1012053e-02,
        -4.4043279e-01,
        -8.4846941e-01,
        -2.4037084e-01,
    6.0292944e-01,
        -1.5162537e+00,
        -6.8348502e-02,
    7.8239287e-01,
        -1.4207259e+00,
    6.6936513e-01,
    6.8323664e-01,
        -8.8213622e-01,
        -1.5045088e+00,
    4.3313940e-01,
    8.0825571e-01,
    5.7893799e-01,
    7.6284913e-01,
        -1.1821270e+00,
    5.8384769e-01,
        -5.8000968e-01,
        -5.6136719e-01,
        -1.5558965e+00,
    1.1002085e+00,
    1.7505830e-01,
    1.0036113e+00,
    1.5110082e+00,
        -1.1372390e+00,
    6.4301839e-01,
        -1.2760044e-02,
    9.1425973e-01,
    1.1076946e+00,
    8.2047146e-01,
        -8.1761183e-01,
        -1.2648522e-01,
    2.6414291e-01,
    3.1585281e+00,
    1.2266172e+00,
    2.3206353e+00,
    4.1449786e-01,
    2.1183157e-01,
    6.1316689e-01,
        -5.2777696e-01,
    1.2416013e+00,
        -1.5763068e-01,
        -1.3736018e+00,
    8.7083815e-01,
        -1.5685333e+00,
        -1.8442529e+00,
    2.8840981e-01,
        -9.5091113e-01,
        -9.1073209e-01,
        -1.6194917e-01,
        -4.8890177e-01,
        -2.2278201e-01,
    2.7206650e-01,
        -1.1685309e+00,
        -1.2242343e+00,
        -2.0994787e+00,
        -3.9024263e-01,
    6.6428176e-01,
        -7.0226401e-01,
    5.0132753e-01,
    5.4031375e-01,
    9.9075099e-01,
    9.8937812e-01,
        -6.8884118e-01,
        -8.5683761e-01,
    4.8390018e-02,
        -6.6485340e-01,
    1.4527420e+00,
    1.3798458e+00,
    9.5136419e-02,
        -4.2712706e-01,
    5.1080781e-01,
        -6.5627362e-01,
        -1.2501678e-01,
        -5.3046670e-01,
    1.0558640e-01,
    1.1283504e+00,
    7.4247804e-01,
    1.1436032e+00,
        -9.1471425e-01,
    1.7980167e-01,
        -9.8334782e-01,
    3.8482857e-01,
    3.2569763e-01,
    1.2963104e+00,
    1.0992295e+00,
    6.5322305e-01,
        -5.0507339e-01,
        -4.7599381e-01,
        -2.0515614e+00,
        -4.4830454e-01,
        -1.5511965e+00,
    9.2982578e-01,
    9.0193997e-01,
    1.3828745e-01,
        -3.7840776e-01,
    1.4306426e-01,
    1.6050387e+00,
    1.3491161e+00,
        -4.4844211e-01,
    1.6841132e-01,
        -1.1204967e+00,
    4.0073091e-01,
    7.3906264e-01,
    9.0004470e-01,
        -1.5312183e+00,
    5.0462079e-01,
        -8.6421465e-01,
        -3.7655495e-01,
    7.8801041e-01,
    2.9820564e-01,
        -1.6374184e-01,
    6.0673255e-01,
    1.6344987e+00,
        -6.2349372e-01,
        -1.3501002e+00,
        -1.1622410e+00,
        -9.4427920e-01,
        -6.7121094e-01,
    5.7668117e-01,
        -2.0857701e+00,
    2.3596388e-01,
        -7.7842135e-01,
    1.0995619e+00,
        -8.5556430e-01,
    7.5576236e-03,
        -9.3758577e-01,
        -6.8155968e-01,
        -2.6013943e-01,
        -2.2879536e-01,
        -5.2481299e-01,
    1.1283185e+00,
    5.5013925e-01,
    1.8551474e+00,
        -2.7729879e-01,
    1.0666308e+00,
        -2.0992389e+00,
    6.3848377e-01,
    3.7146546e-01,
        -3.7417930e-01,
    6.9534833e-01,
    8.7762874e-01,
    1.0336056e+00,
    4.1979132e-01,
    6.0106923e-01,
        -6.7401831e-01,
        -1.0951785e+00,
        -2.6761673e-01,
    1.8655037e-01,
    9.5094467e-01,
        -7.9051874e-01,
        -4.8947798e-01,
    2.9744739e+00,
        -6.2258536e-01,
    1.9203030e+00,
    9.6114893e-01,
        -5.5780316e-01,
        -1.0655515e-01,
        -2.1516125e-01,
    4.7348969e-01,
    1.3656410e+00,
        -1.6378037e+00,
    2.0237289e+00,
    7.7778929e-01,
        -5.4890192e-01,
        -1.2601136e-01,
    2.9958041e-01,
    2.9617118e-01,
    1.2007829e+00,
    1.0901728e+00,
        -3.5870323e-01,
        -1.2992763e-01,
    7.3373752e-01,
    1.2033157e-01,
    1.1363313e+00,
        -6.8677312e-01,
    4.7168286e-01,
    2.8834247e-01,
    1.3918548e+00,
        -1.3455020e+00,
    7.4740619e-04,
    5.3494808e-02,
        -2.3419052e+00,
    1.2480951e+00,
    2.8092319e+00,
        -2.3218486e-01,
    2.8703215e-01,
        -4.6460449e-01,
    3.8431778e-01,
        -3.7982752e-01,
        -1.0177823e-01,
    1.6181511e+00,
        -8.4722988e-01,
        -5.7588318e-01,
        -7.5913128e-02,
        -1.3247159e-01,
    1.4393097e+00,
    2.0312629e+00,
        -9.7820161e-01,
        -6.4102367e-01,
    5.2047567e-01,
        -3.8070000e-01,
    1.9928519e+00,
    1.6358702e+00,
    5.5901889e-01,
    5.6363758e-01,
        -3.3839662e-01,
    7.6364737e-01,
    1.1274423e+00,
    1.4157117e-01,
    1.9281341e+00,
    6.7063791e-01,
        -1.1011124e-01,
    3.7096226e-01,
    1.0965947e+00,
        -3.9816311e-01,
        -8.5462551e-02,
    2.3732874e+00,
        -4.7392102e-01,
    9.4634086e-01,
    8.1816158e-01,
    1.5889709e+00,
    5.2601200e-01,
        -2.4651976e+00,
        -8.5252794e-01,
    5.1173541e-01,
    2.5777491e-01,
    1.9624474e+00,
    1.4063149e+00,
    4.9683373e-01,
    8.2830562e-02,
        -1.5484779e+00,
    1.8631596e+00,
    1.3402662e-01,
        -1.5460026e+00,
    4.3328240e-01,
    1.0295422e-01,
        -5.7034610e-01,
    4.9306216e-01,
        -7.0751321e-01,
        -1.3480250e+00,
        -1.7543015e+00,
        -3.6380895e-01,
        -6.2709401e-01,
    4.4015025e-01,
        -1.5026411e+00,
        -2.0823544e-01,
        -1.5051255e+00,
    1.8097408e+00,
        -1.1697257e-01,
    1.2262090e+00,
    4.9494314e-01,
    9.0859485e-01,
        -1.1542188e+00,
    1.2575555e+00,
    1.4525324e+00,
        -2.0768115e+00,
        -1.7648800e-01,
        -6.5208219e-01,
    1.5653380e-01,
        -8.5022579e-01,
    2.7904592e-01,
    5.9709373e-01,
    2.4471671e-01,
        -1.1834651e-01,
        -1.2894079e+00,
    5.7563642e-02,
        -5.2093289e-01,
        -1.2790269e+00,
        -5.6227232e-02,
        -2.0968028e-01,
    1.9210156e-01,
    9.9233229e-01,
    5.7624419e-01,
    1.3057838e+00,
        -7.2930583e-01,
        -8.6457469e-01,
        -9.4920991e-02,
    1.3832139e+00,
    1.3036814e+00,
        -1.2581218e-01,
        -5.9687378e-01,
        -1.5206463e+00,
    6.7184160e-01,
    2.2844290e-02,
        -1.1777886e+00,
        -3.3457816e-01,
        -1.8294552e+00,
    4.2998960e-01,
        -1.7399346e-01,
    1.6312424e+00,
        -1.3594280e+00,
    9.7050668e-01,
    1.4363981e-01,
    8.2603591e-02,
    7.1666401e-01,
    1.1934839e+00,
        -1.0710619e+00,
    1.3189022e+00,
        -1.2100031e+00,
        -1.0741149e+00,
        -6.7256008e-01,
    7.3646218e-01,
        -1.0699607e+00,
    3.3471512e-01,
    4.1188260e-01,
    1.5412019e-01,
    5.5457070e-01,
        -1.1728457e+00,
    1.0075867e+00,
    1.1352028e-01,
    7.3005087e-01,
        -9.8351178e-01,
    5.2031557e-02,
    8.7759937e-01,
    1.0141410e+00,
        -8.4348411e-02,
        -1.8535316e+00,
        -1.0968207e+00,
    2.1862763e-01,
    7.9424585e-01,
    4.6312419e-01,
        -6.1263002e-01,
    2.2443998e+00,
    7.2347608e-02,
    8.6551440e-01,
        -4.1569647e-01,
        -1.1149381e+00,
    6.8525243e-01,
    1.0376732e+00,
    1.8222115e+00,
        -5.2898849e-01,
        -1.6279667e+00,
    1.6173024e+00,
    2.6413674e-01,
        -1.1271462e+00,
        -5.5917586e-01,
        -8.0884516e-01,
    1.1610043e+00,
    5.9210527e-01,
    2.4274766e-01,
    2.4047748e-01,
        -8.2150040e-01,
    9.9311213e-01,
    3.4639472e-01,
        -2.6113353e-01,
        -1.8471291e-01,
        -1.0173500e-01,
        -8.8704314e-01,
    7.4137710e-01,
    1.3922079e+00,
    2.4739003e+00,
    5.0391924e-01,
        -8.2248055e-01,
    2.0098187e-01,
        -1.0070525e+00,
        -6.1317156e-01,
        -6.5896339e-01,
        -8.3322933e-01,
    3.7817930e-01,
        -1.1153426e+00,
    6.6724135e-01,
    7.9533280e-01,
    1.0374919e+00,
        -2.0431193e-02,
    6.1895309e-01,
    1.8030635e+00,
    5.2993311e-02,
        -1.7789009e-01,
    1.7724826e+00,
        -2.5088036e+00,
        -4.5658919e-01,
    2.4303775e+00,
        -4.7145409e-01,
        -5.6032849e-01,
        -1.2264674e+00,
    7.9295036e-01,
        -2.1099404e+00,
        -7.9939513e-01,
    5.6697509e-01,
        -1.4428989e-03,
    6.2392467e-01,
    1.2644083e-01,
    6.8086779e-01,
        -1.2874159e+00,
    2.1808485e-01,
        -1.5665671e+00,
    7.8328193e-01,
        -3.1056991e-01,
    6.5532441e-01,
        -5.3746736e-01,
    3.2864340e-01,
    1.0540720e+00,
        -1.9796993e+00,
        -1.8673882e+00,
        -1.8323557e+00,
    8.4859212e-01,
    4.0518726e-01,
        -7.0245604e-01,
    1.4990460e+00,
    1.3779487e-01,
        -1.5868214e+00,
        -1.0191455e+00,
        -1.3852337e+00,
    9.5488643e-01,
        -6.0112032e-01,
        -1.1718908e+00,
        -5.7711031e-01,
        -8.3643052e-01,
    8.5296953e-01,
    4.7733118e-01,
    3.0232007e-01,
    4.1577619e-01,
    4.2974829e-02,
        -9.4885323e-01,
    5.4160837e-01,
        -8.2112826e-01,
        -1.0719050e+00,
        -1.0740916e+00,
    8.6955281e-01,
    9.8105141e-01,
        -1.7588254e+00,
        -1.4809596e-01,
    2.5194175e-01,
        -6.1038463e-01,
    7.6097981e-01,
    2.5442950e-01,
        -1.5283368e-01,
        -5.5741088e-01,
    6.7701766e-01,
    8.4929744e-01,
    4.6930718e-01,
        -2.3978170e-01,
    9.2098545e-01,
        -9.0688138e-01,
    1.4444061e-01,
    1.3964090e+00,
        -1.8969876e-01,
        -8.4383589e-01,
    1.9434380e+00,
        -2.4692154e-01,
    4.4161916e-01,
        -8.0361148e-01,
    2.8760943e-01,
    4.6701809e-01,
    4.5616096e-03,
    3.2609036e-01,
    1.2045867e+00,
        -1.4041158e+00,
    2.0556356e-01,
        -1.9911958e+00,
    2.8408934e-02,
    1.9305154e+00,
    9.4113679e-01,
        -6.9244513e-03,
        -3.3824165e-01,
    5.2826578e-01,
    1.0568996e+00,
    1.4740617e-02,
    1.6147613e+00,
        -8.1585496e-01,
        -1.9977591e+00,
        -7.4819141e-01,
        -1.9930402e-01,
        -3.7276008e-01,
        -8.4737116e-01,
    1.3372380e+00,
        -1.6163173e+00,
        -4.9181759e-01,
        -9.6930157e-01,
        -4.7410792e-01,
        -6.6616383e-01,
    4.7837468e-01,
        -1.0410581e+00,
        -8.2065909e-01,
    1.0112961e-01,
    1.0839825e+00,
        -1.8545272e+00,
    1.7997528e+00,
        -8.7837431e-01,
    6.4773273e-01,
    1.0495650e+00,
    1.3230934e+00,
        -5.1735897e-01,
    2.4314950e-02,
        -1.6236687e-01,
        -6.0566109e-01,
    2.7170976e-01,
    3.5864341e-01,
        -3.5231512e-01,
    1.3235993e-01,
    2.6735818e+00,
        -7.5660754e-03,
    7.1030294e-01,
        -4.6253936e-01,
        -5.2787790e-01,
        -3.4578707e-01,
    5.6455777e-01,
        -8.0153914e-01,
        -1.8529468e+00,
    5.3216017e-02,
        -4.3641522e-01,
    2.8000747e-01,
    8.4605887e-02,
    7.2911906e-01,
    9.0075310e-01,
        -1.3256383e+00,
        -1.5245788e+00,
    5.0243333e-01,
    3.0639143e-01,
        -9.3916047e-01,
    1.2374021e+00,
    3.3011915e-02,
    1.2356832e-01,
    2.7393938e-01,
    7.5416581e-01,
    1.5244975e+00,
        -2.6197576e-01,
        -1.7306835e+00,
    1.0134643e+00,
        -9.2773610e-01,
    1.2436803e+00,
        -5.8948870e-01,
    1.4914817e+00,
        -8.0597809e-01,
        -1.1125991e+00,
    9.5693957e-01,
        -1.3630516e+00,
    6.8058496e-01,
    4.3782362e-01,
        -1.4326755e-01,
        -3.4153250e-01,
    2.0578106e+00,
        -3.7453504e-01,
        -1.9020320e-01,
        -9.3873241e-01,
        -8.1346236e-01,
        -5.8361875e-01,
    1.7095254e+00,
        -3.9041982e-01,
        -6.9006536e-01,
        -4.4822070e-01,
    7.1437635e-01,
        -1.3157312e+00,
    6.2712210e-01,
        -1.3312948e+00,
        -1.3084815e-01,
        -1.8268962e+00,
    5.3592247e-01,
    6.9286472e-01,
        -6.8754976e-01,
    3.1757576e-01,
    1.6284234e-01,
    1.1591159e+00,
    1.2838806e-01,
    1.0394581e+00,
        -1.1677114e-01,
        -6.4829691e-01,
        -3.7981205e-02,
        -1.9932482e-01,
    8.8166987e-01,
        -5.6144071e-02,
        -8.4123887e-01,
        -1.5484384e-01,
    1.1885947e+00,
        -4.1490728e-01,
        -6.5861676e-01,
    9.8399067e-01,
    1.0122749e-01,
        -3.6270582e-01,
        -7.3882783e-01,
        -1.4798424e+00,
    1.5337175e-01,
        -3.1701747e-01,
    3.1891825e-01,
        -1.4565466e+00,
    1.3218345e+00,
    4.8720394e-01,
        -1.5666262e+00,
    1.0570596e+00,
        -5.8757780e-01,
    3.0222162e-01,
    2.1946239e-01,
        -8.7820110e-01,
        -2.8613998e+00,
    5.3555530e-01,
        -3.4203731e-01,
        -5.9785885e-01,
    4.1891271e-01,
        -6.8968072e-01,
    6.7119104e-01,
    1.5089746e-01,
        -9.9131888e-01,
    8.3682995e-01,
    4.7450897e-01,
    1.2521659e+00,
        -8.9262266e-01,
        -8.9527423e-01,
    3.1332593e-01,
    6.6703316e-01,
    8.2811655e-01,
    6.5092782e-03,
        -2.3589220e-01,
    6.5282109e-01,
    1.9645325e+00,
    8.8458417e-01,
    8.4536957e-02,
        -5.7451406e-01,
    4.9975063e-01,
        -4.8410448e-01,
    2.3844564e-01,
    7.7824819e-01,
    9.2427293e-01,
    5.8813791e-01,
    1.3779343e+00,
    1.8512049e+00,
        -1.8976648e+00,
        -1.7786842e+00,
        -9.2264124e-01,
        -1.9979271e+00,
        -3.5710006e-01,
        -3.3640076e-01,
    2.5042600e-01,
    2.8616190e-01,
        -6.8616857e-01,
        -8.1331449e-01,
    7.9340256e-01,
        -3.8194525e-01,
        -1.3712042e+00,
    1.0307454e-02,
    2.0413205e-01,
        -4.1102551e-01,
    6.6356118e-01,
    2.2578214e-01,
        -2.1284311e-01,
        -4.4034571e-02,
    4.5818182e-01,
        -4.4141738e-01,
        -1.0549467e+00,
        -1.5558426e-01,
    1.2914786e-01,
    5.0942833e-01,
        -3.0123529e-02,
        -4.5736495e-01,
    5.9633563e-01,
        -1.1352845e-01,
    8.0702442e-01,
        -8.9802740e-02,
        -6.2921252e-03,
        -9.1860671e-02,
        -9.2123828e-01,
        -9.2695153e-01,
        -9.6122067e-01,
    1.7848298e+00,
        -2.0018899e-01,
    9.4041165e-01,
    3.4915634e-01,
    1.8592803e+00,
    9.2707197e-01,
        -1.2269638e+00,
        -3.2723914e-01,
    8.9164640e-01,
    2.8818558e-01,
    2.2651954e+00,
        -4.7890330e-02,
        -1.5518641e+00,
    4.4408331e-01,
        -9.1181888e-01,
    4.9434648e-02,
    1.0780459e+00,
    3.0817876e-01,
    2.9963854e-01,
        -1.9721846e-01,
        -1.4642243e-01,
        -1.0307087e-01,
        -2.7989819e+00,
    3.9327518e-01,
    9.9024715e-01,
        -1.2976329e+00,
        -1.5219684e+00,
    6.2101131e-01,
        -1.5075226e+00,
        -1.6794021e+00,
    7.8897620e-01,
        -6.5428236e-01,
    1.2449030e+00,
        -1.2922644e+00,
        -6.1435247e-01,
    2.4169521e-01,
    5.4934915e-01,
    4.6763432e-01,
    1.9145700e-01,
        -2.2980496e-01,
        -5.7921684e-01,
    4.8048118e-01,
        -3.8683264e-01,
    4.2161554e-01,
    1.0877059e+00,
        -2.2493319e+00,
    1.8044801e+00,
        -6.3206038e-01,
    1.3164582e+00,
    1.5515921e+00,
        -1.4689081e+00,
    1.7693836e-01,
    3.4662599e+00,
        -2.1462672e-01,
    4.8628256e-01,
    3.3088512e-01,
    1.2679021e+00,
    1.0905142e+00,
        -9.4645061e-01,
        -4.3849914e-01,
    3.4322067e-01,
        -5.8403382e-02,
    2.5349747e+00,
    4.3864544e-01,
    4.3751772e-01,
        -8.3767600e-01,
        -1.3075026e+00,
    7.9414272e-01,
        -1.9726379e-01,
    6.4915282e-01,
        -8.3147427e-01,
    8.9595406e-01,
        -1.8134864e+00,
    1.5666835e+00,
    8.4650066e-01,
    1.1015484e-01,
        -1.1611015e+00,
        -3.9753570e-01,
    2.5429431e-01,
    1.2077894e+00,
        -1.0335416e+00,
    1.2951468e+00,
    2.7681230e+00,
        -4.9534715e-01,
    4.6876552e-01,
        -6.5729689e-01,
        -1.7169572e+00,
    1.4705191e+00,
    6.9413727e-01,
        -5.1069699e-01,
    1.1338738e-01,
        -2.2980715e-01,
        -1.4617328e+00,
        -2.8823361e+00,
        -4.7467608e-02,
        -4.6246595e-01,
        -5.7664589e-01,
        -8.4596836e-01,
        -1.8172355e+00,
        -5.2173061e-01,
    1.6143588e-01,
        -1.0618109e+00,
    4.5049374e-01,
        -2.7279807e-01,
        -1.0145435e-01,
        -1.4291059e+00,
        -7.6440944e-01,
    4.1013754e-01,
        -7.8993275e-01,
    1.6163713e-01,
    1.9779040e+00,
    7.9526643e-01,
    1.0373667e+00,
    2.3603300e+00,
    1.1753951e+00,
    3.9774043e-01,
    1.9512487e+00,
        -9.0465636e-01,
        -6.8215219e-01,
    2.0182916e+00,
    4.5434318e-01,
        -4.2104180e-02,
    4.5816730e-01,
        -2.6414414e-01,
        -2.9198515e-01,
        -3.8679814e-01,
        -5.5399293e-01,
        -9.4372793e-01,
        -5.9848183e-02,
        -5.7468477e-01,
    1.4418553e+00,
    2.3552673e-01,
    1.0213766e+00,
        -1.3983053e-01,
        -8.1551103e-02,
    1.2582468e+00,
    1.4685340e+00,
    3.2940856e-02,
    1.6924781e+00,
    4.7572856e-01,
    3.6853022e-01,
    2.1920007e+00,
    1.5356851e+00,
    9.0726022e-01,
    4.0225958e-01,
        -5.3838200e-01,
        -1.1521549e-01,
    1.8220001e+00,
        -2.0215067e+00,
        -6.3697746e-01,
        -1.8880322e-01,
    1.4827504e-01,
        -1.7838800e+00,
    5.2906755e-01,
    7.2973186e-01,
        -9.4013492e-01,
        -2.5928695e-01,
        -1.2135448e+00,
    1.6245497e+00,
    3.7351241e-01,
        -2.5089179e-01,
        -9.2545590e-01,
    9.8660330e-02,
    1.6842798e+00,
    2.7525940e-01,
    3.5328938e-01,
        -1.2003756e+00,
    1.6612868e-01,
    7.7616176e-01,
        -1.3814354e+00,
    1.1282790e+00,
    2.4654396e+00,
        -1.5579172e+00,
        -2.0666478e+00,
        -7.2598665e-02,
    7.5911144e-01,
        -8.1664148e-02,
        -1.5847329e-01,
    6.4980365e-03,
        -1.0646078e+00,
        -1.6439151e+00,
    1.5815498e+00,
    2.9261414e-01,
        -1.1876086e+00,
    1.0759367e+00,
        -1.2973716e+00,
        -1.2177023e-01,
    7.4077154e-01,
        -8.4071763e-01,
        -3.4947080e-01,
    2.9631957e-02,
    1.9523735e+00,
    4.5902353e-01,
        -3.9931193e-01,
        -2.2538464e-01,
        -2.8028294e-01,
    1.3067246e+00,
        -2.8437513e-01,
        -7.9171049e-01,
    2.4061889e-01,
        -9.4645984e-02,
    7.9323468e-01,
    9.5943953e-01,
    1.0871028e+00,
    6.4716871e-01,
    6.3255017e-01,
    1.9032763e+00,
        -1.1600255e+00,
        -3.4730926e-01,
        -1.6950647e+00,
    9.1938606e-01,
    2.1531217e-02,
        -2.9934033e-01,
        -1.7210158e+00,
    1.8343187e-01,
        -2.5973230e-01,
        -1.3547889e+00,
        -1.1574420e+00,
        -7.6198636e-01,
        -2.5029959e-01,
        -1.6487631e+00,
        -1.8199062e-01,
    6.1568723e-01,
        -3.7667427e-01,
        -6.9803527e-01,
    3.0412243e-01,
    1.1010799e+00,
        -4.4660797e-01,
        -4.6671225e-01,
        -1.4358206e+00,
        -9.7771611e-01,
    6.0589460e-01,
        -1.1365452e-01,
    7.6456155e-01,
    6.6989746e-01,
    3.7578369e-01,
    7.6665281e-01,
    1.5234718e+00,
    5.7682419e-01,
    4.2597302e-01,
        -4.2930971e-02,
        -1.2422630e+00,
        -5.0495167e-01,
    3.2585131e-01,
        -1.1114234e+00,
    4.6818432e-01,
    3.2261288e-01,
    1.0002144e-01,
    3.0143458e-01,
    2.3823638e-02,
        -2.2054734e-02,
        -8.7579288e-03,
    9.2945513e-01,
        -9.0432312e-02,
        -2.6411458e+00,
        -4.8614999e-01,
    1.9596962e-01,
    9.5972221e-01,
    1.3803244e+00,
        -9.4146364e-01,
    7.6086810e-01,
    2.3792045e-01,
        -2.0837346e-01,
    2.4739199e-02,
        -2.8091104e-02,
    1.4035913e-01,
    2.3758618e-01,
        -6.7154873e-01,
        -1.0450000e+00,
    9.6576664e-01,
        -2.1975652e-01,
    1.4145359e+00,
        -9.2418666e-01,
        -5.9414082e-01,
    1.4212755e+00,
    1.4076076e+00,
        -1.0290008e+00,
    2.0651223e-01,
    1.3411113e+00,
    1.3327166e+00,
        -1.2848947e+00,
    1.6183759e+00,
    6.6164377e-01,
    2.2734644e-01,
        -2.2557613e-01,
        -9.6599344e-01,
    9.5017861e-02,
        -2.5673250e-01,
    2.3101314e+00,
    1.9005972e-01,
        -1.7340399e-01,
        -1.4028823e-02,
        -6.1273831e-01,
    2.0717999e+00,
    6.3702409e-01,
    7.4893933e-02,
    1.1232672e+00,
        -3.3127938e-02,
        -9.7747705e-02,
        -5.5661989e-01,
        -6.1549901e-01,
    1.6045532e+00,
    7.6849543e-01,
    8.6933473e-02,
    1.7043591e+00,
    2.3633855e-02,
    2.9004282e-01,
        -1.4198992e+00,
    4.7527356e-01,
        -1.4473190e+00,
        -9.8827999e-01,
    9.4937952e-01,
    3.5122397e-01,
        -8.7228157e-01,
        -3.9812717e-01,
    2.5643588e-01,
    2.2002545e-01,
        -1.7114406e+00,
        -1.2057552e+00,
        -1.7729137e+00,
        -7.2491642e-02,
        -1.7211148e+00,
    7.0188123e-01,
        -1.0054680e+00,
        -1.1064268e+00,
    1.7905599e+00,
    2.1623842e+00,
        -8.1927752e-01,
        -3.7049590e-02,
    1.9630040e+00,
        -5.4026637e-01,
    1.7175038e+00,
    8.1980828e-01,
    5.5520834e-02,
        -3.5312534e-01,
    1.6931493e+00,
    7.1105040e-01,
        -6.3276394e-01,
    3.9272639e-01,
        -8.7796157e-01,
    1.4894543e-01,
    1.5318781e+00,
    5.3184776e-01,
        -7.5966712e-01,
    3.4798414e-01,
        -6.9780270e-01,
    2.0193148e+00,
        -1.7936995e+00,
        -6.5950755e-01,
    7.7145334e-01,
        -8.2034110e-01,
    1.7888182e-02,
    6.5453522e-01,
    1.2576988e+00,
        -9.2707999e-01,
        -1.6987767e-01,
        -4.7167249e-01,
        -1.1423349e-01,
    3.6948689e-01,
        -6.1861528e-01,
    8.0011512e-01,
    4.2669605e-01,
        -4.7233076e-01,
    2.7595178e-01,
    9.8422710e-01,
    9.9310744e-01,
    6.6820912e-01,
        -6.4998424e-02,
        -6.2009863e-01,
    2.2410427e-01,
        -4.6613619e-01,
        -3.3208688e-01,
    9.2481481e-01,
    1.4470255e+00,
    5.9583211e-01,
    2.0532706e+00,
        -1.5292503e+00,
    2.2687575e-02,
    9.5284810e-02,
    1.6145263e+00,
    5.0127317e-01,
        -3.2384021e-01,
    5.5421661e-01,
    6.4244346e-01,
    1.8262511e-01,
        -2.0274764e+00,
    1.0230809e+00,
        -3.4915418e+00,
    1.0948964e-01,
        -1.5513315e+00,
        -3.5511091e-01,
    1.3985575e+00,
        -5.1347496e-01,
    1.9171796e+00,
    7.7841056e-01,
        -2.4645511e-01,
        -9.0353165e-01,
        -4.9590226e-01,
    3.7449479e-01,
        -2.3705321e+00,
    6.1506201e-01,
    2.7946498e-01,
    8.1886509e-01,
    2.0475065e+00,
        -3.2374435e-01,
        -9.8054229e-01,
    1.1796342e+00,
    8.9458275e-01,
        -1.4293062e-01,
        -5.9347053e-01,
    2.4891720e-01,
        -1.1297823e+00,
    6.6094615e-02,
        -6.3792459e-01,
        -8.1930765e-01,
    9.6795352e-01,
    3.0349010e-02,
    1.3510965e+00,
        -1.0863743e+00,
    2.4026504e-01,
        -1.0461813e+00,
    6.1871764e-01,
    1.3050342e+00,
    1.0234911e+00,
        -2.1153825e+00,
    6.8172887e-01,
    8.7092754e-03,
    3.3427333e-01,
        -5.4741276e-01,
        -1.6509843e+00,
    8.9279328e-01,
        -5.0705555e-01,
        -3.2979115e-01,
    1.6835380e-01,
    2.5367400e+00,
    2.2936267e+00,
        -1.3186609e+00,
        -4.7413473e-01,
    9.8738199e-01,
        -2.0730264e+00,
    1.2440261e+00,
        -3.1523958e-01,
    1.3992940e+00,
        -8.7988140e-01,
        -9.2247246e-01,
    2.3144029e+00,
    5.8801320e-01,
        -3.0976763e-01,
        -1.0329641e+00,
    1.1033507e+00,
    3.4210893e-01,
        -2.2639932e+00,
        -9.0328582e-01,
    2.9700290e+00,
        -1.1766296e-02,
        -1.9995391e+00,
        -8.8801531e-01,
        -4.1990240e-01,
    6.9457836e-01,
        -1.6275270e-01,
    1.0157664e-01,
        -1.7858461e-02,
        -9.6032709e-01,
    1.1728056e+00,
        -3.6527268e-01,
        -4.6341064e-01,
    1.9498957e-01,
        -6.6946503e-02,
        -5.2153014e-01,
    1.2709976e-01,
    2.1130185e+00,
    5.4128110e-01,
        -6.5508527e-01,
        -8.6952873e-01,
        -2.3889789e-01,
        -1.5759873e+00,
    1.8257512e+00,
    2.0426748e-01,
        -1.1633958e+00,
    1.2060982e-01,
        -1.4435184e+00,
    5.8234605e-01,
        -1.8146547e-01,
    4.2009782e-02,
    3.6184195e-01,
    8.5371462e-01,
        -8.0977202e-01,
        -1.4670507e+00,
        -1.0389624e-01,
        -8.2291339e-01,
    4.2498142e-01,
        -1.8546844e+00,
    8.5857509e-01,
    3.0639365e-01,
        -1.1115618e+00,
        -3.1724072e-01,
    8.3786265e-01,
    2.4264653e+00,
        -3.5108944e-01,
    1.3819618e+00,
        -8.6065546e-01,
    2.0689047e-01,
        -2.0749724e-01,
    3.4025704e-01,
        -4.9811215e-01,
        -1.4213947e+00,
        -2.7077415e-01,
    4.3966311e-01,
        -5.0614377e-01,
        -1.8434823e-01,
    4.0199901e-01,
    5.3922824e-01,
        -7.3359322e-01,
        -2.6837199e-01,
    8.7059843e-01,
    3.3076052e-01,
        -1.3478967e+00,
    1.5478718e+00,
        -6.1663675e-01,
        -6.9857096e-01,
        -1.4235951e+00,
        -1.0963236e-01,
        -1.0271211e-01,
        -3.2271660e-01,
        -8.3958739e-01,
        -1.6605510e+00,
    3.0124866e+00,
    1.5008405e+00,
        -3.5899163e-01,
        -1.1487933e-01,
    3.5890115e-01,
        -1.2137355e-02,
        -5.7035976e-01,
    9.3403477e-01,
        -1.1383168e+00,
    1.9572382e+00,
        -1.7632295e+00,
        -3.2333433e-01,
    8.7259219e-01,
    1.1791539e-01,
        -1.5030548e+00,
    9.2183522e-01,
    1.6324491e-01,
        -8.1467084e-01,
    4.0371009e-01,
    7.5615741e-01,
    2.1844397e+00,
        -9.3782544e-02,
        -2.9420609e-01,
        -5.0480559e-01,
        -1.9269990e+00,
    5.2138067e-01,
        -2.0544112e+00,
        -2.6983751e-01,
        -2.7503206e-01,
    8.4514475e-01,
        -2.7711814e+00,
    9.1807491e-01,
        -5.1925434e-01,
        -1.2930122e+00,
        -8.7180927e-03,
    2.3335268e-01,
        -4.2419570e-01,
        -1.4694487e+00,
    1.2064203e+00,
    1.9734222e-01,
        -7.0687553e-01,
    1.2163673e+00,
    3.6717042e-01,
        -1.2675156e+00,
    6.2105007e-01,
        -1.7954546e+00,
        -1.0578395e+00,
    1.5154448e-01,
    4.1126407e-01,
    7.0497786e-02,
        -1.9330266e+00,
    8.1872201e-01,
    1.2617571e+00,
    1.1673429e+00,
        -5.7032999e-01,
        -3.9389757e-01,
        -1.0174340e+00,
    2.5020587e-01,
    2.5212481e-01,
        -7.7147891e-01,
    9.1954546e-01,
    8.5215755e-01,
    6.5712619e-01,
        -7.5346434e-01,
        -1.3385018e+00,
    6.5222508e-01,
    1.4472167e+00,
        -1.2901260e+00,
        -2.2081892e+00,
    1.4361081e+00,
        -6.1672203e-02,
    1.1778065e+00,
    9.8551342e-01,
        -1.2185784e+00,
        -4.3187829e-01,
        -8.3494129e-01,
    1.7968010e-01,
    1.1663024e+00,
    5.5985942e-02,
        -2.1000418e+00,
    1.2352971e+00,
    2.6715270e-03,
        -4.5953679e-01,
        -2.1031766e+00,
    3.7392168e-01,
    2.4518051e-01,
    3.3857920e-01,
        -1.0780652e+00,
        -7.3016233e-01,
        -9.1632727e-01,
    1.7875532e+00,
        -8.2040353e-01,
        -1.9671134e-01,
        -8.9014374e-01,
    9.1074861e-01,
        -1.2265250e-02,
    7.2814482e-02,
    9.3941631e-01,
    6.7523734e-01,
    7.8596852e-01,
        -2.1327407e+00,
    2.1992964e-01,
    9.6628554e-01,
    3.4999411e-01,
    9.0181528e-01,
    2.1211884e+00,
    1.2485867e+00,
        -1.1231858e+00,
        -8.3008507e-01,
        -1.2177874e-01,
        -6.4259106e-01,
        -7.8949967e-02,
    1.2281128e+00,
        -5.3136584e-01,
        -2.8610480e-01,
        -2.2760565e-01,
    6.7452317e-01,
    1.0368400e+00,
        -1.4946252e-01,
        -3.1708134e-01,
    9.3359467e-01,
    7.2328409e-01,
    4.8818481e-01,
    3.2661987e+00,
    3.1700758e-02,
    3.4127493e-01,
        -8.3530989e-02,
    6.1642109e-01,
        -5.2499919e-01,
    1.0077067e+00,
    1.8291022e+00,
    8.5288069e-02,
        -6.8324725e-02,
        -5.6346541e-01,
        -4.7357406e-01,
        -1.7035345e+00,
        -5.3720048e-02,
        -8.8134407e-01,
    1.2558914e+00,
    1.5584155e-01,
    5.4932681e-02,
    1.3985524e+00,
        -1.7756484e+00,
    3.2965406e-01,
        -1.0579028e+00,
        -6.4336916e-01,
    2.5844079e-01,
    8.9169430e-01,
        -8.3662241e-01,
    5.5314825e-01,
    1.4584093e+00,
        -8.5508218e-01,
        -9.9212262e-01,
        -1.1699417e-02,
    6.2691073e-01,
    1.4992170e-03,
        -8.1632674e-01,
    1.1514754e-01,
    2.0706866e-01,
        -4.4456181e-01,
        -1.1204897e+00,
    4.3535796e-01,
    1.7088634e-02,
        -3.6298563e-01,
        -6.3123748e-01,
        -5.0032498e-01,
        -8.6719317e-01,
        -1.0400932e+00,
    1.2654315e+00,
        -2.4145786e-01,
        -1.7290314e+00,
        -4.8824088e-01,
    1.0603843e+00,
        -5.3815397e-01,
    1.7773377e+00,
        -7.7951879e-01,
        -7.5297192e-01,
        -1.0331334e+00,
    1.1638385e+00,
        -5.8010606e-01,
    4.1730239e-01,
        -1.6481250e+00,
        -5.7267546e-01,
    6.5923204e-01,
        -1.2804016e+00,
    5.0124050e-02,
    5.4840294e-01,
    1.7784467e+00,
    6.4108717e-01,
    9.4670338e-01,
        -3.5425499e-01,
        -5.7881717e-01,
    5.6473317e-02,
        -8.9332269e-01,
    1.1220779e+00,
    7.7582877e-01,
    9.6249562e-01,
    1.2607841e+00,
        -1.0791852e-01,
        -5.7715755e-01,
    5.2563260e-01,
    1.1519597e+00,
    8.5837886e-01,
    9.4557620e-01,
    1.5061304e+00,
    2.9533794e-01,
    1.2040969e+00,
        -1.1845806e-02,
    7.8950035e-01,
        -1.4035822e+00,
    1.5421061e+00,
        -1.7749068e+00,
    2.0565654e-01,
        -3.4620991e-01,
        -1.1589828e+00,
    3.3582634e-01,
    3.3224306e-01,
    1.4112094e+00,
    1.3686292e-01,
    5.7762813e-01,
    2.4308799e-01,
    1.4676711e+00,
    1.1305540e+00,
    1.0653161e-02,
    1.2433369e-01,
    1.7794311e+00,
        -2.3947227e-01,
    8.5799247e-01,
        -8.7835478e-01,
        -7.6194602e-01,
    8.6278270e-01,
    6.4830514e-01,
    1.0580923e+00,
        -6.3319139e-01,
    1.0179894e+00,
    1.7192567e-01,
        -4.7474088e-02,
    1.6891455e+00,
    1.4370445e+00,
        -2.2510783e+00,
    3.5648913e-01,
        -8.5024155e-01,
        -2.9955104e-01,
        -6.3424859e-01,
    1.6244774e+00,
    1.2410701e+00,
    5.5528054e-01,
    7.0341762e-01,
    4.5816334e-01,
    6.8398399e-01,
    2.5128958e-01,
        -1.7850390e-01,
    5.0772583e-01,
        -3.0989912e-01,
        -3.9437025e-01,
        -2.6973854e-01,
        -8.8130172e-02,
    8.0292744e-03,
    2.5317956e+00,
        -1.2232431e+00,
        -1.0717506e+00,
    2.4605865e-01,
        -5.0611477e-02,
        -7.3015063e-01,
    3.2698713e-01,
    7.5299091e-01,
        -1.1537215e+00,
        -4.0786705e-01,
        -1.2879064e+00,
    8.3577687e-02,
    1.6379930e-01,
    6.8257471e-01,
        -1.0863676e+00,
    2.9749238e-01,
        -1.4330826e-01,
    1.3919537e+00,
    3.0674737e-01,
        -5.3718420e-01,
        -2.2893224e-01,
        -5.3622040e-01,
    1.4390213e+00,
        -5.1109969e-01,
        -1.6068354e+00,
        -2.0124302e-01,
    1.1435034e+00,
    6.6329108e-01,
    1.6408437e-01,
    1.7854055e+00,
        -5.8771148e-01,
    2.5903631e-01,
        -8.7183352e-01,
        -7.8791653e-01,
        -3.4433974e-01,
    6.4761709e-01,
    2.0541267e+00,
    7.9894175e-01,
        -1.0710775e+00,
        -2.0515549e-01,
        -5.5444310e-01,
        -2.9294310e-01,
    1.1802320e+00,
    3.7739506e-01,
    9.9157436e-01,
    6.0345188e-01,
        -7.9288612e-01,
    9.3081805e-01,
        -1.3503883e+00,
    7.9978948e-01,
    5.9963742e-01,
    1.1004289e+00,
        -1.4197418e+00,
        -2.0363609e-01,
    1.7913067e-02,
    1.0035144e-01,
    8.7635660e-01,
    7.0069421e-01,
    6.5201577e-01,
    1.7853039e-01,
    1.6760104e+00,
        -3.2509744e-01,
    1.0114783e-01,
        -5.7669223e-01,
        -6.1528110e-02,
    7.2558776e-01,
        -1.2273418e+00,
    1.9093060e-01,
        -7.3481838e-01,
    7.8838452e-01,
        -1.9653822e+00,
        -1.9555242e+00,
    1.6242935e+00,
        -1.4942006e-01,
        -1.9682681e+00,
        -1.6861375e+00,
        -8.6921689e-02,
    3.0738609e-01,
    3.3754561e-01,
    1.0669918e+00,
    3.3294152e-01,
        -7.3483651e-02,
    1.0477568e+00,
    2.0588629e+00,
    2.6693350e-02,
        -2.4052429e-01,
    1.0384752e+00,
        -5.0722529e-01,
        -1.4830797e+00,
        -1.0648791e-01,
    2.4526394e-01,
    1.4579303e-01,
        -1.1180854e+00,
        -5.9694114e-01,
        -6.7948815e-01,
    9.5505445e-01,
        -1.3080054e-01,
    6.4940418e-01,
    5.9851504e-01,
        -1.9250056e-01,
        -1.9807989e+00,
    3.6293827e-01,
    7.0394960e-01,
        -7.5259694e-01,
        -1.6917471e-02,
        -4.4166418e-01,
    1.7013348e+00,
        -3.0569220e-02,
    2.0391776e-01,
        -1.0478102e+00,
        -7.3537036e-01,
        -1.3565626e+00,
    7.2858558e-01,
    6.0718685e-01,
        -8.2828538e-01,
    2.8876443e+00,
    9.1913541e-01,
    4.0578904e-01,
    1.9161839e+00,
        -2.4556876e+00,
        -9.1063410e-02,
        -2.4680046e-02,
    1.9993605e-01,
        -1.0383147e+00,
    5.2936683e-01,
        -2.2171188e+00,
    1.0741638e-01,
    4.3890941e-01,
        -4.0993407e-02,
    3.6430918e-01,
        -7.6369762e-01,
    5.4952405e-01,
        -3.7463762e-01,
        -1.6591589e+00,
        -3.1022860e-01,
        -6.1994303e-01,
        -1.0245912e+00,
    5.0499851e-01,
    4.0473113e-02,
        -2.5473023e-01,
        -5.4773592e-01,
    1.6765939e+00,
    1.1730029e+00,
        -1.8906131e-01,
    8.6572643e-02,
    1.5125601e+00,
    1.7932707e+00,
    1.1026205e+00,
        -3.2584746e-01,
        -5.8281492e-01,
    7.5158724e-01,
        -8.6373432e-01,
        -1.0708756e+00,
        -3.5523680e-01,
    9.5587957e-01,
    1.5928165e-01,
    2.4494181e-01,
    1.1247497e+00,
    2.3462792e-01,
        -1.1385625e+00,
    8.4209364e-01,
    4.7634184e-01,
        -8.8389690e-02,
        -4.1303563e-01,
        -5.4458331e-01,
        -2.4006686e-02,
        -8.0051366e-01,
        -5.1219037e-01,
        -1.4866754e+00,
        -5.1864189e-01,
        -6.9322905e-01,
    5.7765178e-01,
    1.4549670e+00,
    1.0354848e+00,
    1.0468235e+00,
    6.7621054e-01,
    5.4659461e-01,
    7.4998867e-01,
        -7.2983898e-01,
    8.3320245e-01,
        -1.1985504e+00,
    6.1877348e-01,
        -8.3241264e-01,
        -9.7049481e-01,
        -4.5351080e-01,
        -1.3027075e+00,
    1.5974798e-02,
    1.1106592e+00,
        -2.4937389e-01,
    4.9570163e-01,
    1.6203749e-01,
    1.2118210e+00,
        -1.5831558e-01,
    2.9297104e-01,
    2.4677144e+00,
    1.1462338e+00,
        -9.3384311e-01,
    1.1197921e+00,
        -9.2422674e-01,
    9.9069600e-03,
    2.8936686e-01,
    8.7000305e-01,
        -3.9726179e-01,
    5.3785778e-01,
    1.7697367e+00,
        -1.9054850e+00,
        -1.0767481e+00,
    1.1949409e+00,
        -2.9394846e-01,
        -3.8177810e-02,
    9.2393457e-01,
    2.2230611e+00,
        -1.3018954e+00,
        -9.0899084e-01,
        -7.7500170e-02,
    5.1044732e-04,
    1.0685544e-01,
        -3.1246453e-01,
    1.2196467e+00,
        -9.0956139e-01,
    2.0397663e-01,
    9.8974745e-01,
    3.7519958e-01,
        -6.2212621e-01,
    1.2055499e-01,
        -3.1739604e-01,
        -5.9968385e-01,
    1.3531539e+00,
        -1.9766765e-01,
        -5.7800196e-01,
        -7.5596950e-01,
    1.2119893e-01,
        -1.4958414e+00,
        -1.6461589e+00,
    1.9289750e-01,
        -1.2897696e+00,
        -3.9984896e-01,
    7.7540305e-01,
    9.2214998e-01,
    1.5445358e+00,
        -1.0095623e+00,
    8.5670638e-01,
    3.2528654e-01,
    1.2524388e+00,
    2.2015858e-01,
    8.1519668e-01,
    1.1394222e+00,
        -4.1171096e-01,
        -4.6106510e-01,
        -1.3290486e+00,
        -8.7500182e-02,
    3.5544599e-01,
        -7.4313873e-01,
    7.2030684e-02,
        -3.5640336e-01,
        -4.3169178e-01,
    7.7932818e-01,
    8.1632458e-01,
    1.1483040e+00,
        -1.0849599e+00,
        -1.3612227e-01,
    6.5509173e-01,
        -1.2934611e+00,
    1.9267400e+00,
    2.3325175e-01,
        -5.4502235e-01,
    1.0328125e+00,
    3.7713655e-01,
    1.0925533e-01,
        -6.8018830e-01,
        -1.7653924e+00,
        -9.6356772e-01,
        -6.4563264e-01,
    4.5252778e-01,
    6.1449822e-01,
        -7.8530065e-01,
    8.2817619e-01,
    6.6741701e-01,
        -1.2550088e-01,
        -9.5122887e-01,
    8.9204000e-01,
        -1.2972158e-01,
        -1.0134851e+00,
    2.5228702e-01,
    5.2358533e-01,
        -1.4616296e+00,
    1.8664056e+00,
        -2.1490520e+00,
        -1.6352367e+00,
    1.2240191e+00,
    3.2517401e-01,
        -4.2891304e-01,
    1.1596089e-02,
    7.3131847e-01,
        -8.6802276e-01,
    9.2815958e-01,
    6.9731676e-01,
        -4.5150343e-02,
    1.9121114e-01,
        -6.2876296e-01,
        -8.5661321e-01,
        -3.8871274e-01,
    1.0285085e+00,
        -2.3972032e-01,
        -4.5162277e-01,
        -9.7926722e-01,
        -1.1334473e+00,
    2.2120893e-02,
    1.0402395e+00,
    1.2314841e+00,
    5.6017942e-01,
        -3.0903867e-01,
        -3.6760408e-01,
    3.6563336e-01,
    9.3743870e-01,
    9.7424370e-01,
        -2.1189240e+00,
        -4.6464742e-02,
        -9.6678090e-01,
        -4.7124902e-01,
    1.7352274e+00,
        -7.7753013e-01,
        -1.6837974e+00,
    1.7702710e-01,
        -1.2447754e-01,
        -4.1555486e-01,
    8.7945826e-01,
    5.6612811e-01,
    3.7591699e-01,
        -2.7695383e-01,
    3.5009853e-01,
        -2.9130716e-01,
    1.8607806e-01,
    5.7659945e-01,
    3.3965727e-01,
        -6.7282710e-01,
        -5.3701369e-01,
        -1.0401578e+00,
    9.9728432e-01,
        -2.6053949e-02,
        -6.5699920e-01,
    6.7774562e-01,
        -5.1083413e-01,
    4.4600463e-01,
    1.5166346e+00,
    9.3775628e-01,
        -1.6016268e-01,
        -1.1383812e-01,
    1.9371262e+00,
        -1.7079881e-01,
    3.0116854e-01,
    3.2598869e-01,
    9.2483667e-01,
    2.1529123e-01,
    3.6624931e-01,
    3.2215091e-01,
    2.6890035e+00,
    8.7606887e-01,
        -8.7649001e-01,
        -1.2174470e+00,
        -1.6148397e+00,
    1.8400805e+00,
        -8.1892576e-01,
    9.9213557e-01,
    5.3381779e-01,
        -1.5267271e+00,
    2.0228592e+00,
    5.5229595e-01,
    1.8201424e+00,
    3.4264449e-01,
    1.7956149e-01,
        -1.0193183e+00,
    3.7599465e-02,
    1.3712330e-01,
        -1.5210523e+00,
        -1.8918453e-02,
    1.6324668e-01,
        -7.2115068e-01,
    4.1060336e-01,
        -1.2126311e+00,
        -5.7374469e-01,
    1.0539219e-01,
        -6.0509605e-01,
    4.2179462e-01,
        -3.6280894e-01,
        -8.7411518e-01,
    9.3159389e-01,
    6.0004206e-01,
    5.7136069e-01,
    6.8511019e-01,
    1.0094205e+00,
    9.9087072e-01,
    3.3690533e-02,
        -4.5027003e-01,
        -1.1065628e-01,
    1.2378587e+00,
        -1.1978601e+00,
        -5.6439393e-01,
    1.0433086e+00,
    8.4600172e-01,
        -4.9553620e-01,
        -2.0681771e-01,
        -1.5579616e-01,
        -2.7539808e-01,
        -2.4432491e+00,
        -4.2732284e-01,
    3.0906039e-01,
    2.4515752e+00,
        -1.4626280e+00,
        -6.3554156e-01,
        -3.8547285e-01,
        -9.4227755e-01,
        -6.7377310e-01,
        -1.9242439e+00,
        -1.1241763e-01,
        -5.1850946e-01,
    5.3498250e-01,
    5.7407891e-02,
    1.0658172e+00,
    1.6207366e+00,
    1.2185369e-01,
        -1.2380409e+00,
    2.4412558e-01,
    1.3982582e+00,
        -9.5473333e-02,
    3.8762274e-01,
        -9.6631458e-01,
    1.5091863e+00,
    4.0383074e-01,
        -4.2214127e-01,
        -1.6740241e+00,
        -6.8763015e-01,
        -1.0271854e+00,
        -4.9255750e-01,
    3.4680832e-01,
    8.2935248e-01,
    1.5563256e-01,
    8.3713866e-02,
    3.7461680e-01,
    2.6532022e+00,
    3.3271397e-01,
    1.4077083e-01,
    1.5778350e+00,
    8.9547741e-02,
        -6.7298373e-01,
    9.3189346e-01,
        -3.5789040e-01,
    2.0210165e-01,
    8.7625037e-01,
    8.0794833e-01,
        -1.6033339e+00,
        -2.3620519e+00,
        -7.0170011e-01,
    1.6519033e+00,
    2.3507284e-01,
        -1.5175278e-01,
        -1.5588861e-01,
    1.0381647e+00,
    3.3048379e-01,
    4.7580663e-01,
        -2.0905018e+00,
        -1.7403482e-01,
    1.9188173e-02,
        -8.6002734e-01,
 -2.2949442e-02,
 -6.0231726e-01,
 8.6990179e-01,
 -5.7081246e-01,
 1.3046795e+00,
 -4.2644228e-02,
 8.9553077e-01,
 2.2848560e+00,
 6.6827382e-02,
 1.4945894e+00,
 -1.0724642e+00,
 1.8233446e+00,
 -1.2084292e+00,
 -6.5391595e-02,
 -3.2683633e-01,
 -1.1491507e+00,
 -1.3080417e+00,
 6.4638296e-01,
 -1.3892035e+00,
 -1.3406826e+00,
 1.1288720e+00,
 1.6961295e-03,
 3.7968389e-01,
 -9.0133163e-01,
 -1.9679434e-01,
 3.0694151e-01,
 1.6745668e-01,
 1.7880788e+00,
 -6.2408245e-01,
 -1.4996092e-01,
 8.3221505e-01,
 9.4809110e-01,
 -1.9737376e+00,
 -3.9187865e-01,
 -6.7671123e-01,
 -1.6020988e-02,
 5.1517479e-01,
 4.4482965e-01,
 1.1408983e+00,
 4.4768101e-01,
 3.1544024e-01,
 9.4559153e-01,
 4.2866311e-01,
 -1.3246069e+00,
 1.0982152e-01,
 -1.6547219e+00,
 1.1106722e+00,
 -2.1078617e+00,
 -5.4983693e-01,
 9.4260745e-02,
 -3.8219800e-02,
 1.8829274e+00,
 5.5460684e-02,
 -6.1389014e-01,
 5.8701661e-01,
 -1.2067089e+00,
 5.4533054e-01,
 2.5093038e-01,
 -3.9274747e-01,
 -6.2204193e-01,
 -1.1904767e+00,
 -1.8784667e+00,
 -4.2400841e-01,
 7.7724193e-01,
 -7.1392600e-01,
 1.5846397e+00,
 -8.8831132e-01,
 2.1408295e+00,
 -6.9217812e-01,
 9.9297348e-02,
 1.4349784e+00,
 1.2334012e+00,
 -7.5764454e-01,
 7.3857814e-01,
 -1.1143612e+00,
 -1.7058691e+00,
 6.6116235e-01,
 -1.7296420e+00,
 -2.1380735e+00,
 -6.0047665e-02,
 1.3856907e+00,
 1.2178159e+00,
 -1.4950508e+00,
 3.7283100e-02,
 8.0287087e-01,
 9.7385359e-01,
 1.5607339e+00,
 1.5862495e+00,
 8.5629778e-01,
 -1.4244830e+00,
 3.9702337e-02,
 -1.3799116e+00,
 1.2330709e+00,
 1.7420764e+00,
 -2.0014951e+00,
 8.3549699e-01,
 -3.4281833e-01,
 -4.7796210e-01,
 -8.8910141e-01,
 1.2634291e+00,
 3.8320116e-01,
 -1.1886736e-01,
 4.1724716e-01,
 1.0132218e+00,
 -8.6951749e-01,
 -7.9468048e-01,
 6.8850228e-01,
 1.5856729e+00,
 1.2501788e+00,
 -1.1560351e-01,
 -1.3317697e+00,
 -2.3428056e+00,
 -9.2656333e-01,
 1.1295675e+00,
 -5.4912753e-01,
 2.8373170e-01,
 2.1277932e-01,
 -2.2027632e+00,
 1.2510730e+00,
 2.0247050e+00,
 -3.8896715e-02,
 9.9858363e-01,
 -7.5733370e-01,
 5.9614514e-01,
 2.1232170e+00,
 1.3117254e+00,
 -6.9994151e-01,
 -1.0196133e+00,
 5.3114787e-02,
 -2.3701917e-01,
 -6.2735983e-02,
 1.2711091e+00,
 2.2113837e-01,
 1.6640232e+00,
 -4.2959875e-02,
 -1.3323545e-01,
 7.9319983e-01,
 4.2627254e-01,
 -2.0990186e-01,
 -1.5881591e+00,
 -1.1163807e+00,
 6.1685504e-01,
 5.4346425e-01,
 -1.4678960e+00,
 1.1990833e-01,
 5.2935550e-01,
 -1.1752443e+00,
 -9.9821525e-01,
 1.1940423e+00,
 -1.7536975e+00,
 4.4652935e-01,
 9.7805995e-01,
 -1.7912573e+00,
 -1.3018900e-01,
 -1.1752373e+00,
 8.9962083e-02,
 -4.2216589e-01,
 -1.6509336e+00,
 6.1796865e-01,
 5.9616028e-01,
 -6.1843733e-01,
 5.2787538e-01,
 -1.3443181e+00,
 -1.2347653e+00,
 -1.1534399e+00,
 -1.0932804e-01,
 -5.2419476e-01,
 1.9112984e+00,
 -7.1106032e-02,
 5.6183537e-01,
 5.7407171e-01,
 3.7173356e-01,
 1.9169388e-01,
 1.2440852e+00,
 -1.1641598e+00,
 1.6352697e+00,
 6.8632968e-01,
 -1.1494866e+00,
 1.1101573e+00,
 1.1825638e+00,
 1.7073281e+00,
 -4.2031542e-01,
 1.6393777e+00,
 2.6346851e-01,
 -1.4634831e+00,
 -7.7617098e-01,
 9.2948801e-01,
 1.7929577e+00,
 -1.1831518e+00,
 -1.1117586e-01,
 -6.5676581e-01,
 1.8797341e+00,
 -8.9608088e-01,
 1.3315057e+00,
 -6.2457313e-01,
 7.7667888e-01,
 -1.3242537e+00,
 1.5002767e+00,
 -2.2029029e+00,
 3.2251470e-01,
 4.2100445e-01,
 -8.2070114e-01,
 -9.6645875e-01,
 6.0934820e-01,
 -1.0362114e+00,
 -2.8237518e-02,
 -2.8197668e+00,
 -2.0810495e+00,
 -4.4753129e-02,
 1.1179550e+00,
 -1.6495036e+00,
 6.7866722e-01,
 4.9432325e-01,
 -5.8846858e-01,
 -2.3924660e-02,
 2.1913130e+00,
 -1.4005810e+00,
 4.8009949e-01,
 2.0755068e-01,
 3.2208477e-01,
 -5.8804828e-03,
 2.8138908e-01,
 -2.5133924e-01,
 -1.6934595e+00,
 -5.8401619e-01,
 2.3444273e-01,
 2.5878622e-01,
 6.0365642e-01,
 2.2209654e+00,
 -1.6541306e+00,
 6.8041050e-01,
 1.3582931e-01,
 -3.7987452e-02,
 -6.9313723e-01,
 -1.2752501e-01,
 6.8036184e-01,
 4.2621460e-01,
 -1.6056695e+00,
 9.0621075e-01,
 2.4951414e-01,
 1.8942282e+00,
 -1.1123787e+00,
 -7.2204177e-01,
 -1.7521868e+00,
 3.6123135e-03,
 9.9514429e-01,
 -4.7896935e-01,
 -5.1910136e-01,
 -2.9465974e-01,
 -1.6054991e-01,
 1.0235161e+00,
 1.5894737e-02,
 -4.8265707e-01,
 6.3467451e-01,
 -1.3644380e+00,
 5.9862480e-01,
 -2.0649811e-01,
 2.1393663e+00,
 -6.4881377e-01,
 4.2359224e-01,
 1.1786535e-01,
 -1.0807785e+00,
 8.7552669e-01,
 -2.2262817e+00,
 -1.9461113e+00,
 -1.3095947e+00,
 1.3056231e+00,
 9.8396953e-01,
 -1.2513864e+00,
 -1.7975379e-01,
 -7.4340645e-01,
 2.3324192e-01,
 2.1013448e+00,
 -8.7666631e-01,
 1.9487885e+00,
 -4.6527218e-01,
 -6.5191720e-01,
 6.0963059e-01,
 7.0912402e-01,
 2.7979604e-01,
 -1.4674561e+00,
 -6.9131731e-01,
 -8.6798846e-01,
 -5.1250774e-01,
 -7.8208649e-01,
 4.2578916e-01,
 1.0115405e+00,
 -2.5066737e-01,
 5.5423606e-01,
 7.5888080e-01,
 1.3384266e-01,
 -2.7256150e-01,
 -5.4262765e-01,
 -1.1631046e+00,
 -2.7351740e-01,
 1.5950387e-01,
 -1.8670812e-01,
 2.1790415e-01,
 4.6238300e-02,
 6.7032497e-01,
 -6.3050094e-01,
 -1.1841016e-01,
 2.4206458e-01,
 -3.7608463e-01,
 2.8044441e-01,
 -1.7744521e+00,
 4.5857781e-01,
 4.6182289e-01,
 -1.1874866e-03,
 -3.5293875e-01,
 -4.3299126e-01,
 -1.7047741e+00,
 1.0957167e+00,
 6.3577212e-01,
 -1.0871843e+00,
 -1.4772654e+00,
 -3.8524941e-01,
 6.8083666e-01,
 8.3264935e-01,
 5.3459824e-01,
 7.6802457e-01,
 1.7548877e+00,
 -1.7043124e+00,
 4.6950822e-01,
 -5.4303845e-02,
 -7.4887498e-01,
 7.1676404e-01,
 -5.5129014e-03,
 1.2001143e+00,
 -1.0340171e+00,
 -8.4756775e-01,
 4.3342204e-01,
 -8.8752398e-01,
 1.2123262e-01,
 -4.0190489e-01,
 1.0966783e+00,
 4.3667465e-01,
 -4.0700469e-01,
 -6.3869017e-01,
 -4.0488120e-01,
 2.3938625e+00,
 -4.9623014e-02,
 -2.0257591e-01,
 -1.9753405e-01,
 1.5163160e+00,
 -1.7322081e+00,
 1.1124725e+00,
 -7.1928103e-01,
 -2.7336558e-01,
 6.7740442e-01,
 -9.3645082e-01,
 4.2571685e-01,
 -7.4543103e-02,
 -1.3988073e+00,
 1.9230610e-01,
 5.8038972e-01,
 6.3785926e-01,
 -5.6598162e-01,
 -1.6137626e-02,
 6.2232257e-01,
 5.3343636e-01,
 -3.8934076e-01

]);

function drv_fft(scale) {
    var out;
    var n;
    var mc_t0;
    var mc_t2;
    var mc_t1;
    var mc_t4;
    var mc_t3;
    var mc_t6;
    var data;
    var mc_t5;
    var mc_t7;
    // %Driver for fast fourier transform
    // %input is n randomly generated complex numbers stored in an array of size 2*n
    // %n must be a power of 2
    // % transf=fft_four1(data,n,1) computes forward transform
    // % 1/n * fft_four1(transf,n,-1) computes backward tranform

    mc_t1 = mc_round_S(scale);
    mc_t3 = 2;
    mc_t0 = mc_mpower_SS(mc_t3, mc_t1);
    mc_t4 = 1024;
    n = mc_mtimes_SS(mc_t4, mc_t0);
    mc_t5 = 2;
    mc_t2 = mc_mtimes_SS(mc_t5, n);
    mc_t6 = 1;
    data = mc_randn(mc_t6, mc_t2);

    // %'computing the forward transform'

    mc_t7 = 1;
    out = fft_four1(data, n, mc_t7);

}
