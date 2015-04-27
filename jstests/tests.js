QUnit.test("mj_create", function(assert) {
    var scalar = mj_create(3, [1, 1]);
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var sq_mat = mj_create(new Float64Array([1, 2, 3, 4]), [2, 2]);

    assert.ok(typeof scalar === "number", "scalar is a number");

    assert.ok(typeof row_vec === "object", "row_vec is a typed array");
    assert.ok(row_vec.mj_length === 4, "row_vec.mj_length is 4");
    assert.ok(row_vec.mj_dims === 2, "row_vec.mj_dims is 2");
    assert.deepEqual(row_vec.mj_shape, [1, 4], "row_vec.mj_shape is [1, 4]");
    assert.deepEqual(row_vec.mj_stride, [1, 1], "row_vec.mj_stride is [1, 1]");

    assert.ok(typeof col_vec === "object", "col_vec is a typed array");
    assert.ok(col_vec.mj_length === 4, "col_vec.mj_length is 4");
    assert.ok(col_vec.mj_dims === 2, "col_vec.mj_dims is 2");
    assert.deepEqual(col_vec.mj_shape, [4, 1], "col_vec.mj_shape is [4, 1]");
    assert.deepEqual(col_vec.mj_stride, [1, 4], "col_vec.mj_stride is [1, 4]");
});

QUnit.test("mj_get", function(assert) {
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var mat1 = mj_create(new Float64Array([1, 3, 5, 2, 4, 6]), [3, 2]); // [1 2 ; 3 4 ; 5 6]
    var mat2 = mj_create(new Float64Array([1, 4, 2, 5, 3, 6]), [2, 3]); // [1 2 3 ; 4 5 6]

    // Linear access
    assert.equal(mj_get(row_vec, [0]), 1);
    assert.equal(mj_get(row_vec, [1]), 2);
    assert.equal(mj_get(row_vec, [2]), 3);
    assert.equal(mj_get(row_vec, [3]), 4);

    assert.equal(mj_get(col_vec, [0]), 1);
    assert.equal(mj_get(col_vec, [1]), 2);
    assert.equal(mj_get(col_vec, [2]), 3);
    assert.equal(mj_get(col_vec, [3]), 4);

    assert.equal(mj_get(mat1, [0]), 1);
    assert.equal(mj_get(mat1, [1]), 3);
    assert.equal(mj_get(mat1, [2]), 5);
    assert.equal(mj_get(mat1, [3]), 2);
    assert.equal(mj_get(mat1, [4]), 4);
    assert.equal(mj_get(mat1, [5]), 6);

    assert.equal(mj_get(mat2, [0]), 1);
    assert.equal(mj_get(mat2, [1]), 4);
    assert.equal(mj_get(mat2, [2]), 2);
    assert.equal(mj_get(mat2, [3]), 5);
    assert.equal(mj_get(mat2, [4]), 3);
    assert.equal(mj_get(mat2, [5]), 6);

    // Row+Col access
    assert.equal(mj_get(row_vec, [0, 0]), 1);
    assert.equal(mj_get(row_vec, [0, 1]), 2);
    assert.equal(mj_get(row_vec, [0, 2]), 3);
    assert.equal(mj_get(row_vec, [0, 3]), 4);

    assert.equal(mj_get(col_vec, [0, 0]), 1);
    assert.equal(mj_get(col_vec, [1, 0]), 2);
    assert.equal(mj_get(col_vec, [2, 0]), 3);
    assert.equal(mj_get(col_vec, [3, 0]), 4);

    assert.equal(mj_get(mat1, [0, 0]), 1);
    assert.equal(mj_get(mat1, [0, 1]), 2);
    assert.equal(mj_get(mat1, [1, 0]), 3);
    assert.equal(mj_get(mat1, [1, 1]), 4);
    assert.equal(mj_get(mat1, [2, 0]), 5);
    assert.equal(mj_get(mat1, [2, 1]), 6);

    assert.equal(mj_get(mat2, [0, 0]), 1);
    assert.equal(mj_get(mat2, [0, 1]), 2);
    assert.equal(mj_get(mat2, [0, 2]), 3);
    assert.equal(mj_get(mat2, [1, 0]), 4);
    assert.equal(mj_get(mat2, [1, 1]), 5);
    assert.equal(mj_get(mat2, [1, 2]), 6);
});
