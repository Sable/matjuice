QUnit.test("mj_create", function(assert) {
    var scalar = mj_create(3, [1, 1]);
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var sq_mat = mj_create(new Float64Array([1, 2, 3, 4]), [2, 2]);

    assert.ok(typeof scalar === "number", "scalar is a number");

    assert.ok(typeof row_vec === "object", "row_vec is a typed array");
    assert.ok(row_vec.mj_numel() === 4, "row_vec.mj_numel is 4");
    assert.ok(row_vec.mj_dims() === 2, "row_vec.mj_dims is 2");
    assert.deepEqual(row_vec.mj_size(), [1, 4], "row_vec.mj_size is [1, 4]");
    assert.deepEqual(row_vec.mj_stride(), [1, 1], "row_vec.mj_stride is [1, 1]");

    assert.ok(typeof col_vec === "object", "col_vec is a typed array");
    assert.ok(col_vec.mj_numel() === 4, "col_vec.mj_numel is 4");
    assert.ok(col_vec.mj_dims() === 2, "col_vec.mj_dims is 2");
    assert.deepEqual(col_vec.mj_size(), [4, 1], "col_vec.mj_size is [4, 1]");
    assert.deepEqual(col_vec.mj_stride(), [1, 4], "col_vec.mj_stride is [1, 4]");
});

QUnit.test("mj_utils", function(assert) {
    var scalar1 = mj_create(3, [1, 1]);
    var scalar2 = 4;
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var mat1 = mj_create(new Float64Array([1, 3, 5, 2, 4, 6]), [3, 2]); // [1 2 ; 3 4 ; 5 6]
    var mat2 = mj_create(new Float64Array([1, 4, 2, 5, 3, 6]), [2, 3]); // [1 2 3 ; 4 5 6]

    assert.equal(scalar1.mj_scalar(), true);
    assert.equal(scalar1.mj_numel(), 1);
    assert.deepEqual(scalar1.mj_size(), [1, 1]);
    assert.deepEqual(scalar1.mj_stride(), [1, 0]);
    assert.equal(scalar1.mj_dims(), 2);

    assert.equal(scalar2.mj_scalar(), true);
    assert.equal(scalar2.mj_numel(), 1);
    assert.deepEqual(scalar2.mj_size(), [1, 1]);
    assert.deepEqual(scalar2.mj_stride(), [1, 0]);
    assert.equal(scalar2.mj_dims(), 2);

    assert.equal(row_vec.mj_scalar(), false);
    assert.equal(row_vec.mj_numel(), 4);
    assert.deepEqual(row_vec.mj_size(), [1, 4]);
    assert.deepEqual(row_vec.mj_stride(), [1, 1]);
    assert.equal(row_vec.mj_dims(), 2);

    assert.equal(col_vec.mj_scalar(), false);
    assert.equal(col_vec.mj_numel(), 4);
    assert.deepEqual(col_vec.mj_size(), [4, 1]);
    assert.deepEqual(col_vec.mj_stride(), [1, 4]);
    assert.equal(col_vec.mj_dims(), 2);

    assert.equal(mat1.mj_scalar(), false);
    assert.equal(mat1.mj_numel(), 6);
    assert.deepEqual(mat1.mj_size(), [3, 2]);
    assert.deepEqual(mat1.mj_stride(), [1, 3]);
    assert.equal(mat1.mj_dims(), 2);

    assert.equal(mat2.mj_scalar(), false);
    assert.equal(mat2.mj_numel(), 6);
    assert.deepEqual(mat2.mj_size(), [2, 3]);
    assert.deepEqual(mat2.mj_stride(), [1, 2]);
    assert.equal(mat2.mj_dims(), 2);


});

QUnit.test("mj_get", function(assert) {
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var mat1 = mj_create(new Float64Array([1, 3, 5, 2, 4, 6]), [3, 2]); // [1 2 ; 3 4 ; 5 6]
    var mat2 = mj_create(new Float64Array([1, 4, 2, 5, 3, 6]), [2, 3]); // [1 2 3 ; 4 5 6]
    var scal = 42;

    // Linear access
    assert.equal(row_vec.mj_get([0]), undefined);
    assert.equal(row_vec.mj_get([1]), 1);
    assert.equal(row_vec.mj_get([2]), 2);
    assert.equal(row_vec.mj_get([3]), 3);
    assert.equal(row_vec.mj_get([4]), 4);
    assert.equal(row_vec.mj_get([5]), undefined);

    assert.equal(col_vec.mj_get([1]), 1);
    assert.equal(col_vec.mj_get([2]), 2);
    assert.equal(col_vec.mj_get([3]), 3);
    assert.equal(col_vec.mj_get([4]), 4);

    assert.equal(mat1.mj_get([1]), 1);
    assert.equal(mat1.mj_get([2]), 3);
    assert.equal(mat1.mj_get([3]), 5);
    assert.equal(mat1.mj_get([4]), 2);
    assert.equal(mat1.mj_get([5]), 4);
    assert.equal(mat1.mj_get([6]), 6);

    assert.equal(mat2.mj_get([1]), 1);
    assert.equal(mat2.mj_get([2]), 4);
    assert.equal(mat2.mj_get([3]), 2);
    assert.equal(mat2.mj_get([4]), 5);
    assert.equal(mat2.mj_get([5]), 3);
    assert.equal(mat2.mj_get([6]), 6);

    // Row+Col access
    assert.equal(row_vec.mj_get([0, 0]), undefined);
    assert.equal(row_vec.mj_get([0, 1]), undefined);
    assert.equal(row_vec.mj_get([1, 0]), undefined);
    assert.equal(row_vec.mj_get([1, 1]), 1);
    assert.equal(row_vec.mj_get([1, 2]), 2);
    assert.equal(row_vec.mj_get([1, 3]), 3);
    assert.equal(row_vec.mj_get([1, 4]), 4);
    assert.equal(row_vec.mj_get([5, 5]), undefined);
    assert.equal(row_vec.mj_get([5, 1]), undefined);
    assert.equal(row_vec.mj_get([1, 5]), undefined);

    assert.equal(col_vec.mj_get([1, 1]), 1);
    assert.equal(col_vec.mj_get([2, 1]), 2);
    assert.equal(col_vec.mj_get([3, 1]), 3);
    assert.equal(col_vec.mj_get([4, 1]), 4);

    assert.equal(mat1.mj_get([1, 1]), 1);
    assert.equal(mat1.mj_get([1, 2]), 2);
    assert.equal(mat1.mj_get([2, 1]), 3);
    assert.equal(mat1.mj_get([2, 2]), 4);
    assert.equal(mat1.mj_get([3, 1]), 5);
    assert.equal(mat1.mj_get([3, 2]), 6);

    assert.equal(mat2.mj_get([1, 1]), 1);
    assert.equal(mat2.mj_get([1, 2]), 2);
    assert.equal(mat2.mj_get([1, 3]), 3);
    assert.equal(mat2.mj_get([2, 1]), 4);
    assert.equal(mat2.mj_get([2, 2]), 5);
    assert.equal(mat2.mj_get([2, 3]), 6);

    assert.equal(scal.mj_get([0]), undefined);
    assert.equal(scal.mj_get([1]), 42);
    assert.equal(scal.mj_get([2]), undefined);
});


QUnit.test("mj_set linear", function(assert) {
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var mat1 = mj_create(new Float64Array([1, 2, 3, 4, 5, 6]), [3, 2]); // [1 4 ; 2 5 ; 3 6]

    assert.equal(row_vec.mj_get([1]), 1);
    row_vec.mj_set([1], 10);
    assert.equal(row_vec.mj_get([1]), 10);

    assert.equal(col_vec.mj_get([4]), 4);
    col_vec.mj_set([4], 40);
    assert.equal(col_vec.mj_get([4]), 40);

    for (var i = 1; i <= 6; ++i) {
        assert.equal(mat1.mj_get([i]), i);
        mat1.mj_set([i], i*10);
    }
    for (var i = 1; i <= 6; ++i) {
        assert.equal(mat1.mj_get([i]), i*10);
    }
});



QUnit.test("mj_set row+col", function(assert) {
    var row_vec = mj_create(new Float64Array([1, 2, 3, 4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1, 2, 3, 4]), [4, 1]);
    var mat1 = mj_create(new Float64Array([1, 2, 3, 4, 5, 6]), [3, 2]); // [1 4 ; 2 5 ; 3 6]

    assert.equal(row_vec.mj_get([1, 2]), 2);
    row_vec.mj_set([1, 2], 20);
    assert.equal(row_vec.mj_get([1, 2]), 20);

    assert.equal(col_vec.mj_get([4, 1]), 4);
    col_vec.mj_set([4, 1], 40);
    assert.equal(col_vec.mj_get([4, 1]), 40);

    var k = 1;
    for (var i = 1; i <= 3; ++i) {
        for (var j = 1; j < 2; ++j) {
            assert.equal(mat1.mj_get([i, j]), k);
            mat1.mj_set([i, j], k*10);
            k++;
        }
    }

    k = 10;
    for (var i = 1; i <= 3; ++i) {
        for (var j = 1; j < 2; ++j) {
            assert.equal(mat1.mj_get([i, j]), k);
            k += 10;
        }
    }
});
