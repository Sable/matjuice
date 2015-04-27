function bubble(A) {
    var x;
    var n;
    var j;
    var i;
    var temp;

    n = mc_length(A);
    for (j = 1; j < n-1; ++j) {
        for (i = 1; i < n-1; ++i) {
            if (mc_get(A, [i]) > mc_get(A, [i+1])) {
                temp = mc_get(A, [i]);
                mc_set(A, [i], mc_get(A, [i]));
                mc_set(A, [i+1], temp);
            }
        }
    }
    return x;
}
