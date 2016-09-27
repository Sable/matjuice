// Debugging helper functions
function zeroIndex(xs) {
    for (var i = 0; i < xs.length; ++i)
        if (xs[i] === 0)
            return i;
    return -1;
}

function nanIndex(xs) {
    for (var i = 0; i < xs.length; ++i)
        if (isNaN(xs[i]))
            return i;
    return -1;
}

var MC_COLON = {};
var MC_TICTOC = 0;

function mc_error(msg) {
    throw msg;
}

macro elemwise {
    rule { ( $out:ident <= $M:ident $op $x:expr ) } => {
        for (var i = 1, N = $M.mj_numel(); i <= N; ++i) {
            $out.mj_set($M.mj_get([i]) $op $x, [i]);
        }
    }

    rule { ( $out:ident <= $fn:expr $M:ident ) } => {
        for (var i = 1, N = $M.mj_numel(); i <= N; ++i) {
            $out.mj_set($fn($M.mj_get([i])), [i]);
        }
    }
}

macro pairwise {
    rule { ( $out:ident <= $M1:ident $op $M2:ident ) } => {
        var m1_length = $M1.mj_numel();
        var m2_length = $M2.mj_numel();
        if (m1_length !== m2_length) throw "array sizes differ";
        for (var i = 1, n = m1_length; i <= n; ++i) {
            var x = $M1.mj_get([i]);
            var y = $M2.mj_get([i]);
            $out.mj_set(x $op y, [i])
        }
    }

    rule { ( $out:ident <= $fn:expr $M1:ident $M2:ident ) } => {
        if ($M1.mj_numel() !== $M2.mj_numel()) throw "array sizes differ";
        for (var i = 1, n = $M1.mj_numel(); i <= n; ++i) {
            var x = $M1.mj_get([i]);
            var y = $M2.mj_get([i]);
            $out.mj_set($fn(x, y), [i]);
        }
    }
}


function mc_plus_SS(x, y) {
    return x+y;
}


function mc_plus_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m + x);
    return out;
}


function mc_plus_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m + x);
    return out;
}


function mc_plus_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 + m2);
    return out;
}


function mc_minus_SS(x, y) {
    return x-y;
}


function mc_minus_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m - x);
    return out;
}


function mc_minus_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m - x);
    return out;
}


function mc_minus_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 - m2);
    return out;
}



function mc_rem_SS(x, y) {
    return x % y;
}


function mc_rem_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m % x);
    return out;
}


function mc_rem_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m % x);
    return out;
}


function mc_rem_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 % m2);
    return out;
}


function mc_mod_SS(x, y) {
    var n = Math.floor(x / y);
    return x - n*y;
}

function mc_mod_SM(x, m) {
    var out = mj_new_from(m);
    for (var i = 1; i <= m.mj_numel(); ++i) {
        out.mj_set(mc_mod_SS(x, m.mj_get([i])), [i]);
    }
    return out;
}

function mc_mod_MS(x, m) {
    var out = mj_new_from(m);
    for (var i = 1; i <= m.mj_numel(); ++i) {
        out.mj_set(mc_mod_SS(m.mj_get([i]), x), [i]);
    }
    return out;
}

function mc_mod_MM(m1, m2) {
    var out = mj_new_from(m1);
    if (m1.mj_numel() !== m2.mj_numel()) {
        throw "matrix sizes differ";
    }
    for (var i = 1; i <= m.mj_numel(); ++i) {
        var a = m1.mj_get([i]);
        var b = m2.mj_get([i]);
        out.mj_set(mc_mod_SS(x, y), [i]);
    }
    return out;
}

function mc_mtimes_SS(x, y) {
    return x*y;
}


function mc_mtimes_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m * x);
    return out;
}


function mc_mtimes_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m * x);
    return out;
}


function mc_mtimes_MM(m1, m2) {
    var m1_rows = m1.mj_size()[0];
    var m1_cols = m1.mj_size()[1];
    var m2_rows = m2.mj_size()[0];
    var m2_cols = m2.mj_size()[1];
    if (m1_cols !== m2_rows) {
        throw 'Inner matrix dimensions must agree.';
    }

    var out = mc_zeros(m1_rows, m2_cols);
    for (var row = 1; row <= m1_rows; ++row) {
        for (var col = 1; col <= m2_cols; ++col) {
            var acc = 0;
            for (var k = 1; k <= m2_rows; ++k) {
                acc += m1.mj_get([row, k]) * m2.mj_get([k, col]);
            }
            out = out.mj_set(acc, [row, col]);
        }
    }
    return out;
}

function mc_times_SS(a, b) {
    return mc_mtimes_SS(a, b);
}

function mc_times_SM(a, b) {
    return mc_mtimes_SM(a, b);
}

function mc_times_MS(a, b) {
    return mc_mtimes_MS(a, b);
}

function mc_times_MM(a, b) {
    var out = mj_new_from(a);
    pairwise(out <= a * b);
    return out;
}


function mc_mrdivide_SS(x, y) {
    return x / y;
}


function mc_mrdivide_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m / x);
    return out;
}


function mc_mrdivide_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m / x);
    return out;
}


function mc_rdivide_SS(x, y) {
    return x / y;
}

function mc_rdivide_MS(m, d) {
    var out = mj_new_from(m);
    elemwise(out <= m / d);
    return out;
}

function mc_rdivide_SM(d, m) {
    var out = mj_new_from(m);
    elemwise(out <= d / m);
    return out;
}

function mc_rdivide_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 / m2);
    return out;
}

function mc_mrdivide_MM(m1, m2) {
    throw "mc_mrdivide_MM: not implemented";
}

function mc_lt_SS(x, y) {
    return x<y;
}


function mc_lt_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m < x);
    return out;
}


function mc_lt_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m < x);
    return out;
}


function mc_lt_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 < m2);
    return out;
}


function mc_gt_SS(x, y) {
    return x > y;
}


function mc_gt_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m > x);
    return out;
}


function mc_gt_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m > x);
    return out;
}


function mc_gt_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 > m2);
    return out;
}

function mc_le_SS(x, y) {
    return x <= y;
}


function mc_le_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m <= x);
    return out;
}


function mc_le_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m <= x);
    return out;
}


function mc_le_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 <= m2);
    return out;
}


function mc_ge_SS(x, y) {
    return x >= y;
}


function mc_ge_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m >= x);
    return out;
}


function mc_ge_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m >= x);
    return out;
}


function mc_ge_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 >= m2);
    return out;
}


function mc_eq_SS(x1, x2) {
    return x1 === x2;
}


function mc_eq_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m === x);
    return out;
}


function mc_eq_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m === x);
    return out;
}


function mc_eq_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 === m2);
    return out;
}

function mc_ne_SS(x1, x2) {
    return x1 !== x2;
}


function mc_ne_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= m !== x);
    return out;
}


function mc_ne_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= m !== x);
    return out;
}


function mc_ne_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 !== m2);
    return out;
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

function mc_floor_S(x) {
    return Math.floor(x);
}

function mc_floor_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.floor m);
    return out;
}

function mc_ceil_S(x) {
    return Math.ceil(x);
}

function mc_ceil_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.ceil m);
    return out;
}

function mc_sin_S(x) {
    return Math.sin(x);
}

function mc_sin_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.sin m);
    return out;
}

function mc_cos_S(x) {
    return Math.cos(x);
}

function mc_cos_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.cos m);
    return out;
}

function mc_tan_S(x) {
    return Math.tan(x);
}

function mc_tan_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.tan m);
    return out;
}

function mc_sqrt_S(x) {
    return Math.sqrt(x);
}

function mc_sqrt_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.sqrt m);
    return out;
}


function mc_uminus_S(x) {
    return -x;
}


function mc_uminus_M(m) {
    var out = mj_new_from(m);
    for (var i = 1; i <= m.mj_numel(); ++i)
        out.mj_set(-out.mj_get([i]), [i]);
    return out;
}

function mc_round_S(x) {
    return Math.round(x);
}

function mc_round_M(m) {
    out = mj_new_from(m);
    elemwise(out <= Math.round m);
    return m;
}


function mc_mpower_SS(a, b) {
    return Math.pow(a, b);
}

function mc_power_SS(a, b) {
    return Math.pow(a, b);
}

function mc_power_SM(a, b) {
    var out = mj_new_from(b);
    for (var i = 0; i < b.mj_numel(); ++i)
        out[i] = Math.pow(a, out[i]);
    return out;
}

function mc_power_MS(a, b) {
    var out = mj_new_from(a);
    for (var i = 0; i < a.mj_numel(); ++i) {
        out[i] = Math.pow(out[i], b);
    }
    return out;
}

function mc_true() {
    return true;
}

function mc_false() {
    return false;
}



// TODO: handle concatenating matrices of more than 2 dimensions
function mc_horzcat() {
    var num_rows = -1;
    var num_cols =  0;
    var len = 0;

    // Compute the length and number of columns of the result.
    // Also check that all arguments have the same number of rows.
    for (var i = 0; i < arguments.length; ++i) {
        if (num_rows == -1) {
            num_rows  = arguments[i].mj_size()[0];
        }
        else if (arguments[i].mj_size()[0] != num_rows) {
            throw "Dimensions of matrices being concatenated are not consistent.";

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
        }
        else {
            buf.set(arguments[i], offset);
        }
        offset += arguments[i].mj_numel();
    }
    return mj_create(buf, [num_rows, num_cols]);
}

// TODO: handle concatenating matrices
function mc_vertcat() {
    var num_rows =  0;
    var num_cols = -1;
    var len = 0;

    for (var i = 0; i < arguments.length; ++i) {
        if (num_cols == -1) {
            num_cols = arguments[i].mj_size()[1];
        }
        else if (arguments[i].mj_size()[1] != num_cols) {
            throw "Dimensions of matrices being concatenated are not consistent.";
        }
        num_rows += arguments[i].mj_size()[0];
        len += arguments[i].mj_numel();
    }
    var buf = new Float64Array(len);
    var offset = 0;
    for (var col = 1; col <= num_cols; ++col) {
        for (var arg_id = 0; arg_id < arguments.length; ++arg_id) {
            for (var row = 1; row <= arguments[arg_id].mj_size()[0]; ++row) {
                buf[offset] = arguments[arg_id].mj_get([row, col]);
                offset++;
            }
        }
    }
    return mj_create(buf, [num_rows, num_cols]);
}


function mc_compute_shape_length(arg) {
    var shape, length;

    if (arg.length === 0) {
        shape = [1, 1];
        length = 1;
    }
    else if (arg.length === 1) {
        var len = Math.max(arg[0], 0);
        shape = [len, len];
        length = len * len;
    }
    else {
        shape = arg;
        length = 1;
        for (var i = 0; i < shape.length; ++i)
            length *= arg[i];
    }

    return [shape, length];
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
    var mat = mj_create(buf, [rows, cols]);
    for (var i = 1; i <= rows; ++i) {
        mat.mj_set(1, [i, i]);
    }
    return mat;
}


function mc_exp_S(x) {
    return Math.exp(x);
}

function mc_exp_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.exp m);
    return out;
}

function mc_log_S(x) {
    return Math.log(x);
}

function mc_log_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.log m);
    return out;
}

function mc_abs_S(x) {
    return Math.abs(x);
}

function mc_abs_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= Math.abs m);
    return out;
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
        throw "invalid number of arguments";
    }

    var len = Math.floor((stop - start) / step) + 1;
    var buf = new Float64Array(len);
    var i = 0;
    var val = start;
    while (true) {
        if (start <= stop && val > stop) break;
        if (start  > stop && val < stop) break;
        buf[i] = val;
        val += step;
        i++;
    }
    return mj_create(buf, [1, len]);
}



function mc_transpose(matrix) {
    var new_matrix = mc_zeros(matrix.mj_size()[1], matrix.mj_size()[0]);
    for (var i = 1; i <= matrix.mj_size()[0]; ++i) {
        for (var j = 1; j <= matrix.mj_size()[1]; ++j) {
            new_matrix.mj_set(matrix.mj_get([i, j]), [j, i]);
        }
    }
    return new_matrix;
}


function mc_const_false() {
    return false;
}


function mc_disp(x) {
    console.log(x);
}


function mc_pi() {
    return Math.PI;
}

function mc_mean(m) {
    // TODO(vfoley): implement mean for matrices
    if (m.mj_dims() == 2 && (m.mj_size()[0] == 1 || m.mj_size()[1] == 1)) {
        var sum = 0;
        var n = m.mj_numel();
        for (var i = 1; i <= n; ++i)
            sum += m.mj_get([i]);
        return sum / n;
    }

    var rows = m.mj_size()[0];
    var cols = m.mj_size()[1];
    var out = mc_zeros(1, cols);
    for (var c = 0; c < cols; ++c) {
        for (var r = 0; r < rows; ++r) {
            out[c] += m.mj_get([r+1, c+1]);
        }
        out[c] /= rows;
    }
    return out;
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
    // new_index contains the 0-based index to assign to.
    var new_array = mj_create(new Float64Array(new_index + 1), array.mj_dims());
    new_array.set(array, 0);
    return new_array;
}


function loop_direction(from, step, to) {
    if (from < to) {
        if (step <= 0)
            return mc_const_false;
        else
            return mc_le_SS;
    }
    else if (from > to) {
        if (step >= 0)
            return mc_const_false;
        else
            return mc_ge_SS;
    }
    else {
        return mc_eq_SS;
    }
}

function mc_slice_get(m, indices) {
    var slice_indices = mj_convert_to_slices(m, indices);
    var shape = mj_compute_shape(slice_indices);

    var numel = 1;
    for (var i = 0; i < shape.length; ++i)
        numel *= shape[i];

    var buf = new Float64Array(numel);
    var it = new MJSliceIterator(slice_indices);
    var i = 0;

    while ((x = it.next()) !== null) {
        var y = m.mj_get(x);
        buf[i++] = y;
    }

    var out = mj_create(buf, shape);
    return out;
}

function mc_slice_set(m, values, indices) {
    var slice_indices = mj_convert_to_slices(m, indices);
    var i = 0;
    var it = new MJSliceIterator(slice_indices);

    while ((x = it.next()) !== null) {
        m.mj_set(values[i++], x);
    }
}

function mc_slice_set_scalar(m, scalar, indices) {
    var slice_indices = mj_convert_to_slices(m, indices);
    var it = new MJSliceIterator(slice_indices);

    while ((x = it.next()) !== null) {
        m.mj_set(scalar, x);
    }
}

function mc_size(m, dim) {
    if (dim === undefined) {
        var shape = m.mj_size();   
        return mj_create(new Float64Array(shape), [1, shape.length]);
    } else {
        var s = m.mj_size();
        if (dim > s.length)
            return 1;
        else
            return s[dim-1];
    }
}


function mc_any(m) {
    if (typeof(m) === "number")
        return m !== 0;
    for (var i = 0; i < m.length; ++i)
        if (m !== 0)
            return 1;
    return 0;
}

function mc_fix_S(x) {
    if (x < 0)
        return Math.ceil(x);
    else
        return Math.floor(x);
}

function mc_fix_M(m) {
    var out = mj_new_from(m);
    elemwise(out <= mc_fix_S m);
    return out;
}


function mc_and_SS(x, y) {
    return x && y;
}

function mc_and_SM(x, m) {
    var out = mj_new_from(m);
    elemwise(out <= x && m);
    return out;
}

function mc_and_MS(m, x) {
    var out = mj_new_from(m);
    elemwise(out <= x && m);
    return out;
}

function mc_and_MM(m1, m2) {
    var out = mj_new_from(m1);
    pairwise(out <= m1 && m2);
    return out;
}

function mc_sum(m, dim) {
    if (typeof(m) === "number") {
        return m
    } else if (m.mj_dims() !== 2) {
        throw new Error("Unimplemented 'sum' operator for n-dimensional arrays");
    } else if ((m.mj_size()[0] == 1 || m.mj_size()[1] == 1) && dim === undefined) {
        var sum = 0;
        var n = m.mj_numel();
        for (var i = 1; i <= n; ++i)
            sum += m.mj_get([i]);
        return sum;
    } else {
        if (dim < 0) {
            throw new Error(
                'Error using sum\n' + 
                'Dimension argument must be a positive integer scalar within indexing range.');
        } 
        throw new Error('sum: Unimplemented for matrices');
    }
}

function mc_assert(bool) {
    if (typeof bool !== 'number' && typeof bool !== 'boolean') {
        throw new Error('Error using assert\n' + 
        'The condition input argument must be a scalar logical.');
    }
    if (!bool) {
        throw new Error('assertion failed');
    }
}

function mc_isequal(v1, v2) {
    if (typeof v1 !== typeof v2) {
        return false;
    } else if (typeof v1 === 'number') {
        return v1 === v2; 
    } else if (!(v1 instanceof Float64Array && v2 instanceof Float64Array)) {
        throw new Error ('Unsupported isequal method for non-matrix ' + v1 + ' or ' + v2);
    } else {
        if (v1.mj_dims() !== v2.mj_dims()) {
            return false;
        } else if (v1.mj_numel() !== v2.mj_numel()) {
            return false;
        } else {
            var v1size = v1.mj_size();
            var v2size = v2.mj_size();
            for (var d = 0; d < v1.mj_dims(); ++d) {
                if (v1size[d] !== v2size[d]) {
                    return false;
                }
            }

            for (var i = 1; i <= v1.mj_numel(); ++i) {
                if (v1.mj_get([i]) !== v2.mj_get([i])) {
                    return false; 
                }
            }

            return true;
        }
    }
}

function mc_not(v) {
    if (typeof v == 'boolean') {
        return !v;
    } else if (typeof v === 'number') {
        if (v === 0) {
            return 1;
        } else {
            return 0;
        }
    } else if (v instanceof Float64Array) {
        var not_array = mj_new_from(v); 
        for (var i = 1; i < not_array.mj_numel(); ++i) {
            not_array.mj_set([i], mc_not(not_array.mj_get([i])));
        }
    } else {
        throw new Error("Unimplemented 'not' operation for " + v);
    }
}
