var MC_COLON = {};

function mc_error(msg) {
    throw msg;
}

macro elemwise {
    rule { ( $out:ident <= $M:ident $op $x:expr ) } => {
        for (var i = 1, N = $M.mj_numel(); i <= N; ++i) {
            $out.mj_set([i], $M.mj_get([i]) $op $x);
        }
    }

    rule { ( $out:ident <= $fn:expr $M:ident ) } => {
        for (var i = 1, N = $M.mj_numel(); i <= N; ++i) {
            $out.mj_set([i], $fn($M.mj_get([i])));
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
            $out.mj_set([i], x $op y)
        }
    }

    rule { ( $out:ident <= $fn:expr $M1:ident $M2:ident ) } => {
        if ($M1.mj_numel() !== $M2.mj_numel()) throw "array sizes differ";
        for (var i = 1, n = $M1.mj_numel(); i <= n; ++i) {
            var x = $M1.mj_get([i]);
            var y = $M2.mj_get([i]);
            $out.mj_set([i], $fn(x, y));
        }
    }
}


function mc_plus_SS(x, y) {
    return x+y;
}


function mc_plus_SM(x, m) {
    var out = m.mj_clone()
    elemwise(out <= m + x);
    return out;
}


function mc_plus_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m + x);
    return out;
}


function mc_plus_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 + m2);
    return out;
}


function mc_minus_SS(x, y) {
    return x-y;
}


function mc_minus_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m - x);
    return out;
}


function mc_minus_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m - x);
    return out;
}


function mc_minus_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 - m2);
    return out;
}



function mc_rem_SS(x, y) {
    return x % y;
}


function mc_rem_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m % x);
    return out;
}


function mc_rem_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m % x);
    return out;
}


function mc_rem_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 % m2);
    return out;
}


function mc_mod_SS(x, y) {
    var n = Math.floor(x / y);
    return x - n*y;
}

function mc_mod_SM(x, m) {
    var out = m.mj_clone();
    for (var i = 1; i <= m.mj_numel(); ++i) {
        out.mj_set([i], mc_mod_SS(x, m.mj_get([i])));
    }
    return out;
}

function mc_mod_MS(x, m) {
    var out = m.mj_clone();
    for (var i = 1; i <= m.mj_numel(); ++i) {
        out.mj_set([i], mc_mod_SS(m.mj_get([i]), x));
    }
    return out;
}

function mc_mod_MM(m1, m2) {
    var out = m1.mj_clone();
    if (m1.mj_numel() !== m2.mj_numel()) {
        throw "matrix sizes differ";
    }
    for (var i = 1; i <= m.mj_numel(); ++i) {
        var a = m1.mj_get([i]);
        var b = m2.mj_get([i]);
        out.mj_set([i], mc_mod_SS(x, y));
    }
    return out;
}


function mc_mtimes_SS(x, y) {
    return x*y;
}


function mc_mtimes_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m * x);
    return out;
}


function mc_mtimes_MS(m, x) {
    var out = m.mj_clone();
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
                acc += mc_array_get(m1, [row, k]) * mc_array_get(m2, [k, col]);
            }
            out = mc_array_set(out, [row, col], acc);
        }
    }
    return out;
}


function mc_mrdivide_SS(x, y) {
    return x / y;
}


function mc_mrdivide_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m / x);
    return out;
}


function mc_mrdivide_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m / x);
    return out;
}


function mc_rdivide_SS(x, y) {
    return x / y;
}

function mc_rdivide_MS(m, d) {
    var out = m.mj_clone();
    elemwise(out <= m / d);
    return out;
}

function mc_rdivide_SM(d, m) {
    var out = m.mj_clone();
    elemwise(out <= d / m);
    return out;
}

function mc_rdivide_MM(m1, m2) {
    var out = m1.mj_clone();
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
    var out = m.mj_clone();
    elemwise(out <= m < x);
    return out;
}


function mc_lt_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m < x);
    return out;
}


function mc_lt_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 < m2);
    return out;
}


function mc_gt_SS(x, y) {
    return x > y;
}


function mc_gt_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m > x);
    return out;
}


function mc_gt_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m > x);
    return out;
}


function mc_gt_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 > m2);
    return out;
}

function mc_le_SS(x, y) {
    return x <= y;
}


function mc_le_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m <= x);
    return out;
}


function mc_le_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m <= x);
    return out;
}


function mc_le_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 <= m2);
    return out;
}


function mc_ge_SS(x, y) {
    return x >= y;
}


function mc_ge_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m >= x);
    return out;
}


function mc_ge_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m >= x);
    return out;
}


function mc_ge_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 >= m2);
    return out;
}


function mc_eq_SS(x1, x2) {
    return x1 === x2;
}


function mc_eq_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m === x);
    return out;
}


function mc_eq_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m === x);
    return out;
}


function mc_eq_MM(m1, m2) {
    var out = m1.mj_clone();
    pairwise(out <= m1 === m2);
    return out;
}

function mc_ne_SS(x1, x2) {
    return x1 !== x2;
}


function mc_ne_SM(x, m) {
    var out = m.mj_clone();
    elemwise(out <= m !== x);
    return out;
}


function mc_ne_MS(m, x) {
    var out = m.mj_clone();
    elemwise(out <= m !== x);
    return out;
}


function mc_ne_MM(m1, m2) {
    var out = m1.mj_clone();
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


function mc_sin_S(x) {
    return Math.sin(x);
}


function mc_sin_M(m) {
    var out = m.mj_clone();
    elemwise(out <= Math.sin m);
    return out;
}

function mc_sqrt_S(x) {
    return Math.sqrt(x);
}

function mc_sqrt_M(x) {
    var out = m.mj_clone();
    elemwise(out <= Math.sqrt m);
    return out;
}


function mc_uminus_S(x) {
    return -x;
}


function mc_uminus_M(m) {
    var out = m.mj_clone();
    for (var i = 0; i < m.mj_numel(); ++i)
        out.mj_set([i], -out.mj_get([i]));
    return out;
}

function mc_round_S(x) {
    return Math.round(x);
}

function mc_round_M(m) {
    out = m.mj_clone();
    elemwise(out <= Math.round m);
    return m;
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


function mc_array_get(m, indices) {
    var value = m.mj_get(indices);
    if (value === undefined)
        throw "index out of bounds";
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
        mat.mj_set([i, i], 1);
    }
    return mat;
}


function mc_exp_S(x) {
    return Math.exp(x);
}

function mc_exp_M(m) {
    var out = m.mj_clone();
    elemwise(out <= Math.exp m);
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

function mc_array_slice_static_1(m, result_length, result_dims, dimensions, indices) {
    if (indices[0] === MC_COLON) indices[0] = mc_colon(1, result_length);
    var buf = new Float64Array(result_length);
    var k = 0;
    for (var i = 1; i <= indices[0].mj_numel(); ++i) {
        var index = indices[0].mj_get([i]);
        buf[k] = m.mj_get([index]);
        k++;
    }
    return mj_create(buf, dimensions);
}

function mc_array_slice_static_2(m, result_length, result_dims, dimensions, indices) {
    if (indices[0] === MC_COLON) indices[0] = mc_colon(1, dimensions[0]);
    if (indices[1] === MC_COLON) indices[1] = mc_colon(1, dimensions[1]);

    var buf = new Float64Array(result_length);
    var k = 0;
    for (var j = 1; j <= indices[1].mj_numel(); ++j) {
        for (var i = 1; i <= indices[0].mj_numel(); ++i) {
            var row = indices[0].mj_get([i]);
            var col = indices[1].mj_get([j]);
            buf[k] = m.mj_get([row, col]);
            k++;
        }
    }
    return mj_create(buf, dimensions);
}


function mc_array_slice_dynamic_1(m, dimensions, indices) {
    if (dimensions[0] === null) dimensions[0] = indices[0].mj_numel();
    if (dimensions[1] === null) dimensions[1] = indices[0].mj_numel();

    var result_length = 1;
    for (var i = 0; i < dimensions.length; ++i)
        result_length *= dimensions[i];

    return mc_array_slice_static_1(m, result_length, dimensions.length, dimensions, indices);
}


function mc_array_slice_dynamic_2(m, dimensions, indices) {
    if (dimensions[0] === null) dimensions[0] = indices[0].mj_numel();
    if (dimensions[1] === null) dimensions[1] = indices[1].mj_numel();

    var result_length = 1;
    for (var i = 0; i < dimensions.length; ++i)
        result_length *= dimensions[i];

    return mc_array_slice_static_2(m, result_length, dimensions.length, dimensions, indices);
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
            sum += mc_array_get(m, [i]);
        return sum / n;
    }
    throw "mc_mean: not implemented for matrices";
}

function mc_max(a, b) {
    return Math.max(a, b);
}

function mc_min(a, b) {
    return Math.min(a, b);
}
