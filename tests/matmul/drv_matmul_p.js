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

// BEGINNING OF PROGRAM

function matmul_p(A, B, m, k, n) {
    var j;
    var mc_t2;
    var i;
    var h;
    var mc_t4;
    var mc_t3;
    var mc_t6;
    var mc_t5;
    var mc_t8;
    var C;
    var mc_t7;
    var mc_t9;
    
    C = mc_zeros(m, n);
    // %!parfor
    mc_t9 = 1;
    
    for (j = mc_t9; j <= n; j = j + 1) {
        mc_t8 = 1;
        
        for (h = mc_t8; h <= k; h = h + 1) {
            mc_t7 = 1;
            
            for (i = mc_t7; i <= m; i = i + 1) {
                mc_t3 = mc_array_get(C, [i, j]);
                mc_t5 = mc_array_get(A, [i, h]);
                mc_t6 = mc_array_get(B, [h, j]);
                mc_t4 = mc_mtimes_SS(mc_t5, mc_t6);
                mc_t2 = mc_plus_SS(mc_t3, mc_t4);
                C = mc_array_set(C, [i, j], mc_t2);
            }
        }
    }
    
    return C;
}

function drv_matmul_p(scale) {
    var n;
    var m;
    var k;
    var mc_t0;
    var B;
    var A;
    
    // %m = arr(1);
    // %k = arr(2);
    // %n = arr(3);
    
    m = scale;
    mc_t0 = 2;
    k = mc_mrdivide_SS(scale, mc_t0);
    n = scale;
    
    A = mc_rand(m, k);
    B = mc_rand(k, n);
    
    // %tic
    matmul_p(A, B, m, k, n);
    // %toc
}
