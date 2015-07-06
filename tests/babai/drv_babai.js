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


function mj_convert_to_slices(array, indices) {
    var slice_indices = new Array(indices.length);
    for (var i = 0; i < indices.length; ++i) {
        if (indices[i] === MC_COLON) {
            slice_indices[i] = mc_colon(1, array.mj_size()[i]);
        }
        else if (typeof indices[i] === "object") { // slice
            slice_indices[i] = indices[i];
        }
        else {
            slice_indices[i] = mc_colon(indices[i], indices[i]);
        }
    }
    return slice_indices;
}

function mj_compute_shape(array, slice_indices) {
    var shape = [];
    for (var i = 0; i < slice_indices.length; ++i) {
        shape.push(slice_indices[i].mj_numel());
    }
    // HACK(vfoley): make sure always at least two dimensions.
    if (shape.length === 1)
        shape.push(1);
    return shape;
}

function mj_compute_indices(slices) {
    var N = slices.length;
    var max = 1;
    var digits = [];
    for (var i = 0; i < N; ++i) {
        max *= slices[i].mj_numel();
        digits.push(slices[i].mj_numel());
    }

    var indices = new Array(N);
    for (var i = 0; i < N; ++i)
        indices[i] = 0;

    var all_combinations = new Array(max);
    for (var i = 0; i < max; ++i) {
        var curr = new Array(N);

        // Create the new index
        for (var j = 0; j < N; ++j) {
            //curr[j] = slices[j][indices[j]];
            curr[j] = slices[j].mj_get([indices[j] + 1]);
        }
        all_combinations[i] = curr;

        // Update
        for (var j = N-1; j >= 0; --j) {
            indices[j] = (indices[j] + 1) % digits[j];
            if (indices[j] !== 0)
                break;
        }
    }
    return all_combinations;
}
var MC_COLON = {};
var MC_TICTOC = 0;
function mc_error(msg) {
    throw msg;
}
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
        throw 'index out of bounds';
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
function mc_randi(imax) {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 1));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = Math.abs(Math.floor(Math.random() * imax));
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
// function mc_array_slice_static_1(m, result_length, result_dims, dimensions, indices) {
//     if (indices[0] === MC_COLON) indices[0] = mc_colon(1, result_length);
//     var buf = new Float64Array(result_length);
//     var k = 0;
//     for (var i = 1; i <= indices[0].mj_numel(); ++i) {
//         var index = indices[0].mj_get([i]);
//         buf[k] = m.mj_get([index]);
//         k++;
//     }
//     return mj_create(buf, dimensions);
// }
// function mc_array_slice_static_2(m, result_length, result_dims, dimensions, indices) {
//     if (indices[0] === MC_COLON) indices[0] = mc_colon(1, dimensions[0]);
//     if (indices[1] === MC_COLON) indices[1] = mc_colon(1, dimensions[1]);
//     var buf = new Float64Array(result_length);
//     var k = 0;
//     for (var j = 1; j <= indices[1].mj_numel(); ++j) {
//         for (var i = 1; i <= indices[0].mj_numel(); ++i) {
//             var row = indices[0].mj_get([i]);
//             var col = indices[1].mj_get([j]);
//             buf[k] = m.mj_get([row, col]);
//             k++;
//         }
//     }
//     return mj_create(buf, dimensions);
// }
// function mc_array_slice_dynamic_1(m, dimensions, indices) {
//     if (dimensions[0] === null) dimensions[0] = indices[0].mj_numel();
//     if (dimensions[1] === null) dimensions[1] = indices[0].mj_numel();
//     var result_length = 1;
//     for (var i = 0; i < dimensions.length; ++i)
//         result_length *= dimensions[i];
//     return mc_array_slice_static_1(m, result_length, dimensions.length, dimensions, indices);
// }
// function mc_array_slice_dynamic_2(m, dimensions, indices) {
//     if (dimensions[0] === null) dimensions[0] = indices[0].mj_numel();
//     if (dimensions[1] === null) dimensions[1] = indices[1].mj_numel();
//     var result_length = 1;
//     for (var i = 0; i < dimensions.length; ++i)
//         result_length *= dimensions[i];
//     return mc_array_slice_static_2(m, result_length, dimensions.length, dimensions, indices);
// }
function mc_slice_get(a, indices) {
    // Compute shape and length of resulting array
    var slice_indices = mj_convert_to_slices(a, indices);
    var result_shape = mj_compute_shape(a, slice_indices);
    var result_length = 1;
    for (var i = 0; i < result_shape.length; ++i)
        result_length *= result_shape[i];
    var result_array = mj_create(new Float64Array(result_length), result_shape);
    var new_indices = mj_compute_indices(slice_indices);
    var first_index = new_indices[0];
    for (var i = 1; i <= result_length; ++i) {
        var this_index = new_indices[i - 1].slice();
        for (var j = 0; j < first_index.length; ++j)
            this_index[j] = this_index[j] - first_index[j] + 1;
        mc_array_set(result_array, this_index, mc_array_get(a, new_indices[i - 1]));
    }
    return result_array;
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
function mc_max(a, b) {
    return Math.max(a, b);
}
function mc_min(a, b) {
    return Math.min(a, b);
}
function mc_tic() {
    MC_TICTOC = performance.now();
}
function mc_toc() {
    var elapsed = performance.now() - MC_TICTOC;
    return elapsed / 1000;
}
function mc_resize(array, new_index) {
    // new_index contains the 0-based index to assign to.
    var new_array = mj_create(new Float64Array(new_index + 1), array.mj_dims());
    new_array.set(array, 0);
    return new_array;
}


// BEGINNING OF PROGRAM

function babai(R, y) {
    var mc_t190;
    var mc_t191;
    var mc_t192;
    var z_hat;
    var mc_t201;
    var mc_t202;
    var n;
    var mc_t203;
    var mc_t204;
    var mc_t205;
    var k;
    var mc_t206;
    var mc_t207;
    var ck;
    var mc_t182;
    var mc_t183;
    var mc_t184;
    var mc_t185;
    var mc_t186;
    var mc_t187;
    var mc_t188;
    var par;
    var mc_t189;
    var mc_t200;
    var mc_t212;
    var mc_t213;
    var mc_t214;
    var mc_t215;
    var mc_t216;
    var mc_t193;
    var mc_t194;
    var mc_t195;
    var mc_t196;
    var mc_t197;
    var mc_t198;
    var mc_t199;
    var mc_t211;
    // %
    // %   compute the Babai estimation
    // %   find a sub-optimal solution for min_z ||R*z-y||_2
    // %   R - an upper triangular real matrix of n-by-n
    // %   y - a real vector of n-by-1
    // %   z_hat - resulting integer vector
    // %
    n = mc_length_M(y);
    mc_t202 = 1;
    z_hat = mc_zeros(n, mc_t202);
    mc_t185 = y[(mc_t211 = ((n - 1) + (y["mj_size"]()[0] * (1 - 1))) , ((mc_t211 < 0) || (mc_t211 >= y["mj_numel"]())) ? mc_error("index out of bounds") : mc_t211)];
    mc_t186 = R[(mc_t212 = ((n - 1) + (R["mj_size"]()[0] * (n - 1))) , ((mc_t212 < 0) || (mc_t212 >= R["mj_numel"]())) ? mc_error("index out of bounds") : mc_t212)];
    mc_t184 = (mc_t185 / mc_t186);
    mc_t182 = mc_round_S(mc_t184);
    mc_t213 = ((n - 1) + (z_hat["mj_size"]()[0] * (1 - 1)));
    if ((mc_t213 < 0)) {
        mc_error();
    }
    if ((mc_t213 >= z_hat["mj_numel"]())) {
        z_hat = mc_resize(z_hat, mc_t213);
    }
    z_hat[mc_t213] = mc_t182;
    
    mc_t203 = 1;
    mc_t200 = (n - mc_t203);
    mc_t204 = 1;
    mc_t201 = -mc_t204;
    mc_t207 = 1;
    
    for (k = mc_t200; (k >= mc_t207); k = (k + mc_t201)) {
        mc_t192 = k;
        mc_t205 = 1;
        mc_t194 = (k + mc_t205);
        mc_t195 = n;
        mc_t193 = mc_colon(mc_t194, mc_t195);
        mc_t187 = mc_slice_get(R, [mc_colon(mc_t192, mc_t192), mc_t193]);
        mc_t206 = 1;
        mc_t190 = (k + mc_t206);
        mc_t191 = n;
        mc_t189 = mc_colon(mc_t190, mc_t191);
        mc_t188 = mc_slice_get(z_hat, [mc_t189]);
        par = mc_mtimes_MM(mc_t187, mc_t188);
        mc_t198 = y[(mc_t214 = ((k - 1) + (y["mj_size"]()[0] * (1 - 1))) , ((mc_t214 < 0) || (mc_t214 >= y["mj_numel"]())) ? mc_error("index out of bounds") : mc_t214)];
        mc_t199 = par;
        mc_t196 = (mc_t198 - mc_t199);
        mc_t197 = R[(mc_t215 = ((k - 1) + (R["mj_size"]()[0] * (k - 1))) , ((mc_t215 < 0) || (mc_t215 >= R["mj_numel"]())) ? mc_error("index out of bounds") : mc_t215)];
        ck = (mc_t196 / mc_t197);
        mc_t183 = mc_round_S(ck);
        mc_t216 = ((k - 1) + (z_hat["mj_size"]()[0] * (1 - 1)));
        if ((mc_t216 < 0)) {
            mc_error();
        }
        if ((mc_t216 >= z_hat["mj_numel"]())) {
            z_hat = mc_resize(z_hat, mc_t216);
        }
        z_hat[mc_t216] = mc_t183;
    }
    
    return z_hat;
}

function drv_babai(scale) {
    var mc_t146;
    var mc_t147;
    var mc_t148;
    var mc_t149;
    var mc_t89;
    var mc_t88;
    var mc_t87;
    var mc_t86;
    var mc_t85;
    var mc_t84;
    var mc_t83;
    var mc_t140;
    var mc_t82;
    var mc_t141;
    var mc_t81;
    var mc_t142;
    var mc_t80;
    var mc_t143;
    var mc_t144;
    var mc_t145;
    var mc_t19;
    var mc_t18;
    var mc_t17;
    var mc_t16;
    var mc_t157;
    var mc_t15;
    var mc_t158;
    var mc_t14;
    var mc_t159;
    var mc_t13;
    var mc_t12;
    var mc_t99;
    var mc_t11;
    var mc_t98;
    var mc_t10;
    var mc_t97;
    var mc_t96;
    var mc_t95;
    var mc_t150;
    var mc_t94;
    var mc_t151;
    var mc_t93;
    var mc_t152;
    var mc_t92;
    var mc_t153;
    var mc_t91;
    var mc_t154;
    var mc_t90;
    var mc_t155;
    var mc_t156;
    var mc_t168;
    var mc_t169;
    var mc_t69;
    var mc_t68;
    var mc_t67;
    var mc_t66;
    var mc_t0;
    var mc_t65;
    var mc_t64;
    var mc_t2;
    var mc_t63;
    var mc_t1;
    var mc_t160;
    var mc_t62;
    var mc_t4;
    var mc_t161;
    var mc_t61;
    var mc_t3;
    var mc_t162;
    var mc_t6;
    var mc_t60;
    var mc_t163;
    var mc_t5;
    var mc_t164;
    var mc_t8;
    var mc_t165;
    var mc_t7;
    var mc_t166;
    var mc_t167;
    var mc_t9;
    var mc_t180;
    var mc_t181;
    var mc_t179;
    var mc_t79;
    var mc_t78;
    var mc_t77;
    var mc_t217;
    var mc_t76;
    var mc_t75;
    var mc_t74;
    var mc_t171;
    var mc_t73;
    var mc_t172;
    var mc_t72;
    var mc_t173;
    var mc_t71;
    var mc_t174;
    var mc_t70;
    var mc_t175;
    var mc_t176;
    var mc_t178;
    var z;
    var y;
    var mc_t49;
    var mc_t48;
    var mc_t102;
    var mc_t47;
    var mc_t103;
    var mc_t104;
    var mc_t46;
    var mc_t105;
    var mc_t45;
    var mc_t106;
    var mc_t44;
    var mc_t107;
    var mc_t43;
    var mc_t108;
    var mc_t42;
    var i;
    var mc_t109;
    var mc_t41;
    var mc_t40;
    var mc_t100;
    var mc_t101;
    var mc_t113;
    var mc_t59;
    var mc_t114;
    var mc_t58;
    var mc_t115;
    var mc_t57;
    var mc_t116;
    var mc_t56;
    var mc_t117;
    var mc_t55;
    var mc_t118;
    var mc_t119;
    var mc_t53;
    var mc_t52;
    var mc_t51;
    var mc_t50;
    var mc_t110;
    var mc_t111;
    var A;
    var mc_t112;
    var mc_t29;
    var mc_t28;
    var mc_t27;
    var mc_t124;
    var mc_t26;
    var mc_t125;
    var mc_t25;
    var mc_t126;
    var mc_t24;
    var mc_t127;
    var mc_t23;
    var mc_t128;
    var mc_t22;
    var mc_t129;
    var mc_t21;
    var mc_t20;
    var mc_t120;
    var mc_t121;
    var mc_t122;
    var mc_t123;
    var mc_t39;
    var mc_t38;
    var mc_t135;
    var mc_t37;
    var mc_t136;
    var mc_t36;
    var mc_t137;
    var mc_t35;
    var mc_t138;
    var mc_t34;
    var mc_t139;
    var mc_t33;
    var mc_t32;
    var mc_t31;
    var mc_t30;
    var mc_t130;
    var mc_t131;
    var mc_t132;
    var mc_t133;
    var mc_t134;
    
    mc_t181 = 0;
    mc_t180 = (scale > mc_t181);
    if (mc_t180) {
        A = mc_rand(scale, scale);
        mc_t52 = 1;
        y = mc_rand(scale, mc_t52);
        mc_t53 = 1;
        
        for (i = mc_t53; (i <= scale); i = (i + 1)) {
            z = babai(A, y);
        }
        mc_t55 = 1;
        mc_disp(mc_t55);
    }
    else {
        mc_t56 = 2.2588;
        mc_t0 = -mc_t56;
        mc_t57 = 1.3077;
        mc_t1 = -mc_t57;
        mc_t58 = 0.4336;
        mc_t2 = -mc_t58;
        mc_t59 = 1.3499;
        mc_t3 = -mc_t59;
        mc_t60 = 0.0631;
        mc_t4 = -mc_t60;
        mc_t61 = 0.205;
        mc_t5 = -mc_t61;
        mc_t62 = 0.1241;
        mc_t6 = -mc_t62;
        mc_t63 = 1.2075;
        mc_t7 = -mc_t63;
        mc_t64 = 0.3034;
        mc_t8 = -mc_t64;
        mc_t65 = 0.7873;
        mc_t9 = -mc_t65;
        mc_t66 = 1.1471;
        mc_t10 = -mc_t66;
        mc_t67 = 1.0689;
        mc_t11 = -mc_t67;
        mc_t68 = 0.8095;
        mc_t12 = -mc_t68;
        mc_t69 = 2.9443;
        mc_t13 = -mc_t69;
        mc_t70 = 0.7549;
        mc_t14 = -mc_t70;
        mc_t71 = 1.7115;
        mc_t15 = -mc_t71;
        mc_t72 = 0.1022;
        mc_t16 = -mc_t72;
        mc_t73 = 0.2414;
        mc_t17 = -mc_t73;
        mc_t74 = 0.8649;
        mc_t18 = -mc_t74;
        mc_t75 = 0.0301;
        mc_t19 = -mc_t75;
        mc_t76 = 0.1649;
        mc_t20 = -mc_t76;
        mc_t77 = 0.8637;
        mc_t21 = -mc_t77;
        mc_t78 = 1.2141;
        mc_t22 = -mc_t78;
        mc_t79 = 1.1135;
        mc_t23 = -mc_t79;
        mc_t80 = 0.0068;
        mc_t24 = -mc_t80;
        mc_t81 = 0.7697;
        mc_t25 = -mc_t81;
        mc_t82 = 0.2256;
        mc_t26 = -mc_t82;
        mc_t83 = 1.0891;
        mc_t27 = -mc_t83;
        mc_t84 = 1.4916;
        mc_t28 = -mc_t84;
        mc_t85 = 0.7423;
        mc_t29 = -mc_t85;
        mc_t86 = 1.0616;
        mc_t30 = -mc_t86;
        mc_t87 = 0.6156;
        mc_t31 = -mc_t87;
        mc_t88 = 0.1924;
        mc_t32 = -mc_t88;
        mc_t89 = 0.7648;
        mc_t33 = -mc_t89;
        mc_t90 = 1.4023;
        mc_t34 = -mc_t90;
        mc_t91 = 1.4224;
        mc_t35 = -mc_t91;
        mc_t92 = 0.1774;
        mc_t36 = -mc_t92;
        mc_t93 = 0.1961;
        mc_t37 = -mc_t93;
        mc_t94 = 0.8045;
        mc_t38 = -mc_t94;
        mc_t95 = 0.2437;
        mc_t39 = -mc_t95;
        mc_t96 = 1.1658;
        mc_t40 = -mc_t96;
        mc_t97 = 1.148;
        mc_t41 = -mc_t97;
        mc_t98 = 0.6669;
        mc_t42 = -mc_t98;
        mc_t99 = 0.0825;
        mc_t43 = -mc_t99;
        mc_t100 = 1.933;
        mc_t44 = -mc_t100;
        mc_t101 = 0.439;
        mc_t45 = -mc_t101;
        mc_t102 = 1.7947;
        mc_t46 = -mc_t102;
        mc_t104 = 0.5377;
        mc_t105 = 1.8339;
        mc_t106 = 0.8622;
        mc_t107 = 0.3188;
        mc_t108 = 0.3426;
        mc_t109 = 3.5784;
        mc_t110 = 2.7694;
        mc_t103 = mc_horzcat(mc_t104, mc_t105, mc_t0, mc_t106, mc_t107, mc_t1, mc_t2, mc_t108, mc_t109, mc_t110);
        mc_t112 = 3.0349;
        mc_t113 = 0.7254;
        mc_t114 = 0.7147;
        mc_t115 = 1.4897;
        mc_t116 = 1.409;
        mc_t117 = 1.4172;
        mc_t111 = mc_horzcat(mc_t3, mc_t112, mc_t113, mc_t4, mc_t114, mc_t5, mc_t6, mc_t115, mc_t116, mc_t117);
        mc_t119 = 0.6715;
        mc_t120 = 0.7172;
        mc_t121 = 1.6302;
        mc_t122 = 0.4889;
        mc_t123 = 1.0347;
        mc_t124 = 0.7269;
        mc_t125 = 0.2939;
        mc_t118 = mc_horzcat(mc_t119, mc_t7, mc_t120, mc_t121, mc_t122, mc_t123, mc_t124, mc_t8, mc_t125, mc_t9);
        mc_t127 = 0.8884;
        mc_t128 = 1.4384;
        mc_t129 = 0.3252;
        mc_t130 = 1.3703;
        mc_t126 = mc_horzcat(mc_t127, mc_t10, mc_t11, mc_t12, mc_t13, mc_t128, mc_t129, mc_t14, mc_t130, mc_t15);
        mc_t132 = 0.3192;
        mc_t133 = 0.3129;
        mc_t134 = 0.6277;
        mc_t135 = 1.0933;
        mc_t136 = 1.1093;
        mc_t131 = mc_horzcat(mc_t16, mc_t17, mc_t132, mc_t133, mc_t18, mc_t19, mc_t20, mc_t134, mc_t135, mc_t136);
        mc_t138 = 0.0774;
        mc_t139 = 1.5326;
        mc_t140 = 0.3714;
        mc_t141 = 1.1174;
        mc_t137 = mc_horzcat(mc_t21, mc_t138, mc_t22, mc_t23, mc_t24, mc_t139, mc_t25, mc_t140, mc_t26, mc_t141);
        mc_t143 = 0.0326;
        mc_t144 = 0.5525;
        mc_t145 = 1.1006;
        mc_t146 = 1.5442;
        mc_t147 = 0.0859;
        mc_t148 = 2.3505;
        mc_t142 = mc_horzcat(mc_t27, mc_t143, mc_t144, mc_t145, mc_t146, mc_t147, mc_t28, mc_t29, mc_t30, mc_t148);
        mc_t150 = 0.7481;
        mc_t151 = 0.8886;
        mc_t152 = 0.4882;
        mc_t149 = mc_horzcat(mc_t31, mc_t150, mc_t32, mc_t151, mc_t33, mc_t34, mc_t35, mc_t152, mc_t36, mc_t37);
        mc_t154 = 1.4193;
        mc_t155 = 0.2916;
        mc_t156 = 0.1978;
        mc_t157 = 1.5877;
        mc_t158 = 0.6966;
        mc_t159 = 0.8351;
        mc_t160 = 0.2157;
        mc_t153 = mc_horzcat(mc_t154, mc_t155, mc_t156, mc_t157, mc_t38, mc_t158, mc_t159, mc_t39, mc_t160, mc_t40);
        mc_t162 = 0.1049;
        mc_t163 = 0.7223;
        mc_t164 = 2.5855;
        mc_t165 = 0.1873;
        mc_t161 = mc_horzcat(mc_t41, mc_t162, mc_t163, mc_t164, mc_t42, mc_t165, mc_t43, mc_t44, mc_t45, mc_t46);
        A = mc_vertcat(mc_t103, mc_t111, mc_t118, mc_t126, mc_t131, mc_t137, mc_t142, mc_t149, mc_t153, mc_t161);
        mc_t166 = 0.888;
        mc_t47 = -mc_t166;
        mc_t167 = 0.5445;
        mc_t48 = -mc_t167;
        mc_t168 = 0.6003;
        mc_t49 = -mc_t168;
        mc_t169 = 0.1941;
        mc_t50 = -mc_t169;
        mc_t171 = 0.8404;
        mc_t172 = 0.1001;
        mc_t173 = 0.3035;
        mc_t174 = 0.49;
        mc_t175 = 0.7394;
        mc_t176 = 1.7119;
        y = mc_horzcat(mc_t171, mc_t47, mc_t172, mc_t48, mc_t173, mc_t49, mc_t174, mc_t175, mc_t176, mc_t50);
        z = babai(A, y);
        mc_t178 = 1;
        mc_t179 = 10;
        
        for (i = mc_t178; (i <= mc_t179); i = (i + 1)) {
            mc_t51 = z[(mc_t217 = ((i - 1) + (10 * (1 - 1))) , ((mc_t217 < 0) || (mc_t217 >= z["mj_numel"]())) ? mc_error("index out of bounds") : mc_t217)];
            mc_disp(mc_t51);
        }
    }
    return ;
}
