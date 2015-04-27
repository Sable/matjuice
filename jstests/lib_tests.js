QUnit.test("zeros", function(assert) {
    var zs1 = mc_zeros(10);
    var zs2 = mc_zeros(1, 10);
    var zs3 = mc_zeros(10, 1);
    var zs4 = mc_zeros(2, 4, 3); // three 2x4 matrices

    assert.equal(zs1.mj_numel(), 100);
    assert.equal(zs2.mj_numel(), 10);
    assert.equal(zs3.mj_numel(), 10);
    assert.equal(zs4.mj_numel(), 24);
    for (var i = 1; i <= 100; ++i) assert.equal(zs1.mj_get([i]), 0);
    for (var i = 1; i <= 10; ++i)  assert.equal(zs2.mj_get([i]), 0);
    for (var i = 1; i <= 10; ++i)  assert.equal(zs3.mj_get([i]), 0);
    for (var i = 1; i <= 24; ++i)  assert.equal(zs4.mj_get([i]), 0);

    assert.equal(mc_zeros(0).mj_numel(), 0);
    assert.equal(mc_zeros(-1).mj_numel(), 0);
});

QUnit.test("ones", function(assert) {
    var os1 = mc_ones(10);
    var os2 = mc_ones(1, 10);
    var os3 = mc_ones(10, 1);
    var os4 = mc_ones(2, 4, 3); // three 2x4 matrices

    assert.equal(os1.mj_numel(), 100);
    assert.equal(os2.mj_numel(), 10);
    assert.equal(os3.mj_numel(), 10);
    assert.equal(os4.mj_numel(), 24);
    for (var i = 1; i <= 100; ++i) assert.equal(os1.mj_get([i]), 1);
    for (var i = 1; i <= 10; ++i)  assert.equal(os2.mj_get([i]), 1);
    for (var i = 1; i <= 10; ++i)  assert.equal(os3.mj_get([i]), 1);
    for (var i = 1; i <= 24; ++i)  assert.equal(os4.mj_get([i]), 1);

    assert.equal(mc_ones(0).mj_numel(), 0);
    assert.equal(mc_ones(-1).mj_numel(), 0);
});


QUnit.test("mc_array_get", function(assert) {
    var row_vec = mj_create(new Float64Array([1,2,3,4]), [1, 4]);
    var col_vec = mj_create(new Float64Array([1,2,3,4]), [4, 1]);
    var mat = mj_create(new Float64Array([1,2,3,4,5,6]), [3, 2]);

    assert.equal(mc_array_get(row_vec, [1]), 1);
    assert.equal(mc_array_get(row_vec, [2]), 2);
    assert.equal(mc_array_get(row_vec, [3]), 3);
    assert.equal(mc_array_get(row_vec, [4]), 4);
    assert.equal(mc_array_get(row_vec, [1, 1]), 1);
    assert.equal(mc_array_get(row_vec, [1, 2]), 2);
    assert.equal(mc_array_get(row_vec, [1, 3]), 3);
    assert.equal(mc_array_get(row_vec, [1, 4]), 4);

    assert.equal(mc_array_get(col_vec, [1]), 1);
    assert.equal(mc_array_get(col_vec, [2]), 2);
    assert.equal(mc_array_get(col_vec, [3]), 3);
    assert.equal(mc_array_get(col_vec, [4]), 4);
    assert.equal(mc_array_get(col_vec, [1, 1]), 1);
    assert.equal(mc_array_get(col_vec, [2, 1]), 2);
    assert.equal(mc_array_get(col_vec, [3, 1]), 3);
    assert.equal(mc_array_get(col_vec, [4, 1]), 4);

    assert.equal(mc_array_get(mat, [1]), 1);
    assert.equal(mc_array_get(mat, [2]), 2);
    assert.equal(mc_array_get(mat, [3]), 3);
    assert.equal(mc_array_get(mat, [4]), 4);
    assert.equal(mc_array_get(mat, [5]), 5);
    assert.equal(mc_array_get(mat, [6]), 6);

    assert.equal(mc_array_get(mat, [1, 1]), 1);
    assert.equal(mc_array_get(mat, [2, 1]), 2);
    assert.equal(mc_array_get(mat, [3, 1]), 3);
    assert.equal(mc_array_get(mat, [1, 2]), 4);
    assert.equal(mc_array_get(mat, [2, 2]), 5);
    assert.equal(mc_array_get(mat, [3, 2]), 6);

    assert.throws(function() { mc_array_get(row_vec, [0]); });
    assert.throws(function() { mc_array_get(row_vec, [5]); });
    assert.throws(function() { mc_array_get(mat, [0, 0]); });
    assert.throws(function() { mc_array_get(mat, [0, 1]); });
    assert.throws(function() { mc_array_get(mat, [1, 0]); });
    assert.throws(function() { mc_array_get(mat, [3, 3]); });
    assert.throws(function() { mc_array_get(mat, [4, 2]); });
    assert.throws(function() { mc_array_get(mat, [5, 5]); });
});


function mj_array(elems) {
    return mj_create(new Float64Array(elems), [1, elems.length]);
}

QUnit.test("mc_colon", function(assert) {
    assert.deepEqual(mc_colon(0, 3), mj_array([0, 1, 2, 3]));
    assert.deepEqual(mc_colon(0, 1, 3), mj_array([0, 1, 2, 3]));
    assert.deepEqual(mc_colon(3, -1, 0), mj_array([3, 2, 1, 0]));
    assert.deepEqual(mc_colon(0, 3, 5), mj_array([0, 3]));
    assert.deepEqual(mc_colon(5, -3, 0), mj_array([5, 2]));
});
