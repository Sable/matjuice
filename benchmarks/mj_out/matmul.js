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
function mc_floor_S(x$2) {
    return Math.floor(x$2);
}
function mc_floor_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.floor(m$2.mj_get([i])));
    }
    ;
    return out$2;
}
function mc_ceil_S(x$2) {
    return Math.ceil(x$2);
}
function mc_ceil_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.ceil(m$2.mj_get([i])));
    }
    ;
    return out$2;
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
function mc_cos_S(x$2) {
    return Math.cos(x$2);
}
function mc_cos_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.cos(m$2.mj_get([i])));
    }
    ;
    return out$2;
}
function mc_tan_S(x$2) {
    return Math.tan(x$2);
}
function mc_tan_M(m$2) {
    var out$2 = m$2.mj_clone();
    for (var i = 1, N = m$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set([i], Math.tan(m$2.mj_get([i])));
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
function mc_array_set(m$2, indices, value) {
    return m$2.mj_set(indices, value);
}
function mc_horzcat() {
    var num_rows = -1;
    var num_cols = 0;
    var len = 0;
    for (// Compute the length and number of columns of the result.
        // Also check that all arguments have the same number of rows.
        var i = 0; i < arguments.length; ++i) {
        if (num_rows == -1) {
            num_rows = arguments[i].mj_size()[0];
        } else if (arguments[i].mj_size()[0] != num_rows) {
            throw 'Dimensions of matrices being concatenated are not consistent.';
        }
        num_cols += arguments[i].mj_size()[1];
        len += arguments[i].mj_numel();
    }
    var // Create the result array buffer and populate it by just putting
    // all the arguments back-to-back.
    buf = new Float64Array(len);
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
function mc_slice_get(a, indices) {
    var // Compute shape and length of resulting array
    slice_indices = mj_convert_to_slices(a, indices);
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
function mc_transpose(matrix) {
    var new_matrix = mc_zeros(matrix.mj_size()[1], matrix.mj_size()[0]);
    for (var i = 1; i <= matrix.mj_size()[0]; ++i) {
        for (var j = 1; j <= matrix.mj_size()[1]; ++j) {
            mc_array_set(new_matrix, [
                j,
                i
            ], mc_array_get(matrix, [
                i,
                j
            ]));
        }
    }
    return new_matrix;
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
    if (// TODO(vfoley): implement mean for matrices
        m$2.mj_dims() == 2 && (m$2.mj_size()[0] == 1 || m$2.mj_size()[1] == 1)) {
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
    MC_TICTOC = Date.now();
}
function mc_toc() {
    var elapsed = Date.now() - MC_TICTOC;
    return elapsed / 1000;
}
function mc_resize(array, new_index) {
    var // new_index contains the 0-based index to assign to.
    new_array = mj_create(new Float64Array(new_index + 1), array.mj_dims());
    new_array.set(array, 0);
    return new_array;
}
function loop_direction(from, step, to) {
    if (from < to) {
        if (step <= 0)
            return mc_const_false;
        else
            return mc_le_SS;
    } else if (from > to) {
        if (step >= 0)
            return mc_const_false;
        else
            return mc_ge_SS;
    } else {
        return mc_eq_SS;
    }
}


// BEGINNING OF PROGRAM

function matmul(A, B, m, k, n){
    var C = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t10 = 0;
    var mc_t32 = 0;
    var mc_t11 = 0;
    var mc_t33 = 0;
    var mc_t12 = 0;
    var mc_t34 = 0;
    var mc_t13 = 0;
    var mc_t35 = 0;
    var mc_t14 = 0;
    var mc_t36 = 0;
    var mc_t15 = 0;
    var mc_t37 = 0;
    var mc_t16 = 0;
    var mc_t38 = 0;
    var mc_t17 = 0;
    var mc_t39 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t20 = 0;
    var mc_t42 = 0;
    var mc_t21 = 0;
    var mc_t43 = 0;
    var mc_t22 = 0;
    var mc_t44 = 0;
    var mc_t23 = 0;
    var mc_t45 = 0;
    var mc_t24 = 0;
    var mc_t46 = 0;
    var mc_t25 = 0;
    var mc_t47 = 0;
    var mc_t26 = 0;
    var mc_t48 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    C = mc_zeros(m, n);
    mc_t17 = 1;
    for (j = mc_t17; j<=n; j = j+1) {
        mc_t16 = 1;
        for (h = mc_t16; h<=k; h = h+1) {
            mc_t15 = 1;
            for (i = mc_t15; i<=m; i = i+1) {
                mc_t19 = 1;
                mc_t18 = 0;
                mc_t20 = i - 1;
                mc_t20 = mc_t20 * mc_t19;
                mc_t18 = mc_t18 + mc_t20;
                mc_t19 = mc_t19 * 1;
                mc_t20 = j - 1;
                mc_t20 = mc_t20 * mc_t19;
                mc_t18 = mc_t18 + mc_t20;
                mc_t19 = mc_t19 * 1;
                mc_t23 = C.mj_numel();
                mc_t21 = mc_t18 < 0;
                mc_t24 = mc_t18 >= mc_t23;
                mc_t25 = mc_t21 || mc_t24;
                if (mc_t25) {
                    mc_error("index out of bounds");
                }
                mc_t11 = C[mc_t18];
                mc_t27 = 1;
                mc_t26 = 0;
                mc_t28 = i - 1;
                mc_t28 = mc_t28 * mc_t27;
                mc_t26 = mc_t26 + mc_t28;
                mc_t27 = mc_t27 * 1;
                mc_t28 = h - 1;
                mc_t28 = mc_t28 * mc_t27;
                mc_t26 = mc_t26 + mc_t28;
                mc_t27 = mc_t27 * 1;
                mc_t31 = A.mj_numel();
                mc_t29 = mc_t26 < 0;
                mc_t32 = mc_t26 >= mc_t31;
                mc_t33 = mc_t29 || mc_t32;
                if (mc_t33) {
                    mc_error("index out of bounds");
                }
                mc_t13 = A[mc_t26];
                mc_t35 = 1;
                mc_t34 = 0;
                mc_t36 = h - 1;
                mc_t36 = mc_t36 * mc_t35;
                mc_t34 = mc_t34 + mc_t36;
                mc_t35 = mc_t35 * 1;
                mc_t36 = j - 1;
                mc_t36 = mc_t36 * mc_t35;
                mc_t34 = mc_t34 + mc_t36;
                mc_t35 = mc_t35 * 1;
                mc_t39 = B.mj_numel();
                mc_t37 = mc_t34 < 0;
                mc_t40 = mc_t34 >= mc_t39;
                mc_t41 = mc_t37 || mc_t40;
                if (mc_t41) {
                    mc_error("index out of bounds");
                }
                mc_t14 = B[mc_t34];
                mc_t12 = mc_t13 * mc_t14;
                mc_t10 = mc_t11 + mc_t12;
                mc_t43 = 1;
                mc_t42 = 0;
                mc_t44 = i - 1;
                mc_t44 = mc_t44 * mc_t43;
                mc_t42 = mc_t42 + mc_t44;
                mc_t43 = mc_t43 * 1;
                mc_t44 = j - 1;
                mc_t44 = mc_t44 * mc_t43;
                mc_t42 = mc_t42 + mc_t44;
                mc_t43 = mc_t43 * 1;
                mc_t47 = C.mj_numel();
                mc_t45 = mc_t42 < 0;
                if (mc_t45) {
                    mc_error("index out of bounds");
                }
                mc_t48 = mc_t42 >= mc_t47;
                if (mc_t48) {
                    C = mc_resize(C, mc_t42);
                }
                C[mc_t42] = mc_t10;
            }
        }
    }

    return C;
}

function main(size){
    var A = 0;
    var B = 0;
    var mc_t8 = 0;
    var t = 0;
    var mc_t6 = 0;
    var mc_t4 = 0;
    var mc_t0 = 0;
    var k = 0;
    var m = 0;
    var n = 0;
    m = size;
    mc_t0 = 2;
    k = size / mc_t0;
    n = size;

    A = mc_rand(m, k);
    B = mc_rand(k, n);

    mc_tic();
    matmul(A, B, m, k, n);
    t = mc_toc();

    mc_t4 = "OUT";
    mc_disp(mc_t4);
    mc_t6 = 1;
    mc_disp(mc_t6);
    mc_t8 = "TIME";
    mc_disp(mc_t8);
    mc_disp(t);
    return;
}
main(1000);
