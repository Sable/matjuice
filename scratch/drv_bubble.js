function drv_bubble(size) {
    var A;
    var y;
    A = randn(1, size);
    A = mc_times(100, A);
    y = bubble(A);
}
