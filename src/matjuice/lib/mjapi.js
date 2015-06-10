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
    var slice_indices = [];
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
