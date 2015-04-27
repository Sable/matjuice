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

function diffraction(CELLS, SLITSIZE1, SLITSIZE2, T1, T2) {
    var x;
    var intensity;
    var mc_t49;
    var mc_t48;
    var mc_t47;
    var mc_t46;
    var mc_t45;
    var mc_t44;
    var mc_t43;
    var mc_t42;
    var mc_t41;
    var mc_t40;
    var cellnum;
    var CELLSIZE;
    var mc_t19;
    var mc_t18;
    var mag;
    var mc_t17;
    var mc_t16;
    var mc_t59;
    var horizpos;
    var mc_t15;
    var mc_t58;
    var mc_t14;
    var mc_t57;
    var mc_t13;
    var mc_t56;
    var mc_t12;
    var mc_t55;
    var mc_t11;
    var K;
    var mc_t54;
    var mc_t10;
    var mc_t53;
    var sourcept;
    var newdata;
    var mc_t52;
    var mc_t51;
    var mc_t50;
    var SLITRES;
    var WAVELENGTH;
    var mc_t29;
    var mc_t28;
    var SCREENLENGTH;
    var mc_t27;
    var mc_t26;
    var mc_t25;
    var mc_t69;
    var mc_t24;
    var mc_t68;
    var mc_t23;
    var mc_t22;
    var mc_t66;
    var mc_t21;
    var mc_t20;
    var mc_t64;
    var mc_t2;
    var mc_t63;
    var mc_t1;
    var mc_t4;
    var mc_t62;
    var mc_t61;
    var mc_t3;
    var mc_t60;
    var mc_t6;
    var mc_t5;
    var mc_t8;
    var mc_t7;
    var DISTANCE;
    var mc_t9;
    var SCREENRES;
    var mc_t39;
    var mc_t38;
    var mc_t37;
    var mc_t36;
    var mc_t35;
    var mc_t34;
    var mc_t78;
    var mc_t33;
    var mc_t77;
    var mc_t32;
    var mc_t75;
    var mc_t31;
    var mc_t74;
    var mc_t30;
    var wavesum;
    var mc_t73;
    var screenpt;
    var mc_t72;
    var mc_t71;
    var mc_t70;
    
    
    // %-----------------------------------------------------------------------
    // %
    // %	This function M-file calculates the diffraction pattern of
    // %	monochromatic light through a transmission grating for
    // %	arbitrary slit sizes and slit transmission coefficients.
    // %
    // %	This MATLAB program is intended as a pedagogical example
    // %	of how diffraction and interference arise strictly from
    // %	the wave nature of light.
    // %
    // %	Invocation:
    // %		>> mag=diffraction(CELLS, SSIZE1, SSIZE2, T1, T2)
    // %
    // %		where
    // %
    // %		i. CELLS is the number of pairs of slits,
    // %
    // %		i. SSIZE1 is the width of slit 1 in meters,
    // %
    // %		i. SSIZE2 is the width of slit 2 in meters,
    // %
    // %		i. T1 is the transmission coefficient of slit 1,
    // %
    // %		i. T2 is the transmission coefficient of slit 2.
    // %
    // %		o. mag is the result.
    // %
    // %	Requirements:
    // %		0 < T1, T2 < 1.
    // %
    // %	Examples:
    // %		% One-slit diffraction.
    // %		>> mag=diffraction(1, 1e-5, 1e-5, 1, 0)
    // %
    // %		% Young's two-slit experiment.
    // %		>> mag=diffraction(2, 1e-5, 1e-5, 1, 0)
    // %
    // %	Source:
    // %		MATLAB 5 user contributed M-Files at
    // %		http://www.mathworks.com/support/ftp/.
    // %		("Functions Related to Physics" category.)
    // %
    // %	Author:
    // %		Ian Appelbaum (appeli@mit.edu).
    // %
    // %	Date:
    // %		December 1999.
    // %
    // %-----------------------------------------------------------------------
    
    DISTANCE = 5;
    // % Distance from slit to screen in meters.
    WAVELENGTH = 6.33E-7;
    // % Wavelength of light in meters
    // % (633 nm is HeNe laser line).
    mc_t3 = mc_pi();
    mc_t62 = 2;
    mc_t1 = mc_mtimes_SS(mc_t62, mc_t3);
    mc_t2 = WAVELENGTH;
    K = mc_mrdivide_SS(mc_t1, mc_t2);
    // % Wavenumber.
    CELLSIZE = mc_plus_SS(SLITSIZE1, SLITSIZE2);
    
    // % The following constants are calculated from the inputs assuming that
    // % SLITX >> WAVELENGTH.
    
    // % Resolution of position of sources at slit.
    mc_t63 = 100;
    SLITRES = mc_mrdivide_SS(WAVELENGTH, mc_t63);
    
    // % Resolution of pattern at screen.
    mc_t9 = DISTANCE;
    mc_t64 = 10;
    mc_t10 = mc_mtimes_SS(CELLS, mc_t64);
    mc_t7 = mc_mrdivide_SS(mc_t9, mc_t10);
    mc_t8 = WAVELENGTH;
    mc_t4 = mc_mtimes_SS(mc_t7, mc_t8);
    mc_t6 = mc_horzcat(SLITSIZE1, SLITSIZE2);
    mc_t5 = mc_mean(mc_t6);
    SCREENRES = mc_mrdivide_SS(mc_t4, mc_t5);
    
    // % Distance from center point to end of screen in meters.
    mc_t66 = 3;
    mc_t14 = mc_mtimes_SS(mc_t66, DISTANCE);
    mc_t15 = WAVELENGTH;
    mc_t11 = mc_mtimes_SS(mc_t14, mc_t15);
    mc_t13 = mc_horzcat(SLITSIZE1, SLITSIZE2);
    mc_t12 = mc_mean(mc_t13);
    SCREENLENGTH = mc_mrdivide_SS(mc_t11, mc_t12);
    
    mc_t68 = 0;
    mc_t69 = 2;
    mag = mc_zeros(mc_t68, mc_t69);
    mc_t77 = 0;
    if (SCREENRES > 0) mc_t78 = mc_le_SS;
    if (SCREENRES < 0) mc_t78 = mc_ge_SS;
    if (SCREENRES === 0) mc_t78 = mc_const_false;
    for (screenpt = mc_t77; mc_t78(screenpt, SCREENLENGTH); screenpt = screenpt + SCREENRES) {
        wavesum = 0;
        mc_t70 = 1;
        mc_t54 = mc_minus_SS(CELLS, mc_t70);
        mc_t73 = 0;
        
        for (cellnum = mc_t73; cellnum <= mc_t54; cellnum = cellnum + 1) {
            mc_t71 = 0;
            
            for (sourcept = mc_t71; sourcept <= SLITSIZE1; sourcept = sourcept + SLITRES) {
                mc_t16 = screenpt;
                mc_t18 = mc_mtimes_SS(cellnum, CELLSIZE);
                mc_t19 = sourcept;
                mc_t17 = mc_plus_SS(mc_t18, mc_t19);
                horizpos = mc_minus_SS(mc_t16, mc_t17);
                // % First slit.
                mc_t21 = horizpos;
                mc_t23 = mc_i();
                mc_t24 = DISTANCE;
                mc_t22 = mc_mtimes_SS(mc_t23, mc_t24);
                mc_t20 = mc_plus_SS(mc_t21, mc_t22);
                x = mc_abs(mc_t20);
                
                // % Add up the wave contribution from the first slit.
                mc_t25 = wavesum;
                mc_t27 = T1;
                mc_t32 = mc_i();
                mc_t33 = K;
                mc_t30 = mc_mtimes_SS(mc_t32, mc_t33);
                mc_t31 = x;
                mc_t29 = mc_mtimes_SS(mc_t30, mc_t31);
                mc_t28 = mc_exp_S(mc_t29);
                mc_t26 = mc_mtimes_SS(mc_t27, mc_t28);
                wavesum = mc_plus_SS(mc_t25, mc_t26);
            }
            mc_t72 = 0;
            
            for (sourcept = mc_t72; sourcept <= SLITSIZE2; sourcept = sourcept + SLITRES) {
                mc_t34 = screenpt;
                mc_t38 = mc_mtimes_SS(cellnum, CELLSIZE);
                mc_t39 = SLITSIZE1;
                mc_t36 = mc_plus_SS(mc_t38, mc_t39);
                mc_t37 = sourcept;
                mc_t35 = mc_plus_SS(mc_t36, mc_t37);
                horizpos = mc_minus_SS(mc_t34, mc_t35);
                // % Second slit.
                // ...
                mc_t41 = horizpos;
                mc_t43 = mc_i();
                mc_t44 = DISTANCE;
                mc_t42 = mc_mtimes_SS(mc_t43, mc_t44);
                mc_t40 = mc_plus_SS(mc_t41, mc_t42);
                x = mc_abs(mc_t40);
                
                // % Add up the wave contribution from the second slit.
                mc_t45 = wavesum;
                mc_t47 = T2;
                mc_t52 = mc_i();
                mc_t53 = K;
                mc_t50 = mc_mtimes_SS(mc_t52, mc_t53);
                mc_t51 = x;
                mc_t49 = mc_mtimes_SS(mc_t50, mc_t51);
                mc_t48 = mc_exp_S(mc_t49);
                mc_t46 = mc_mtimes_SS(mc_t47, mc_t48);
                wavesum = mc_plus_SS(mc_t45, mc_t46);
            }
        }
        mc_t55 = mc_abs(wavesum);
        mc_t74 = 2;
        intensity = mc_mpower(mc_t55, mc_t74);
        // % Intensity is electric field
        // % squared.
        
        // % Normalize intensity so that it is approximately 1.
        mc_t75 = 100;
        mc_t56 = mc_mtimes_SS(screenpt, mc_t75);
        mc_t58 = intensity;
        mc_t60 = mc_mtimes_SS(CELLS, CELLSIZE);
        mc_t61 = SLITRES;
        mc_t59 = mc_mrdivide_SS(mc_t60, mc_t61);
        mc_t57 = mc_mrdivide_SS(mc_t58, mc_t59);
        newdata = mc_horzcat(mc_t56, mc_t57);
        
        mag = mc_vertcat(mag, newdata);
    }
    
    return mag;
}

function drv_diff(scale) {
    var T2;
    var T1;
    var time;
    var mc_t0;
    var SLITSIZE1;
    var SLITSIZE2;
    var mag;
    var CELLS;
    // %
    // %  Driver for the diffraction pattern calculator.
    // %
    
    CELLS = 2;
    SLITSIZE1 = 1.0E-5;
    SLITSIZE2 = 1.0E-5;
    T1 = 1;
    T2 = 0;
    mc_t0 = 1;
    
    for (time = mc_t0; time <= scale; time = time + 1) {
        mag = diffraction(CELLS, SLITSIZE1, SLITSIZE2, T1, T2);
    }
    
}
