function drv_matmul_p(scale)
    m=scale;
    k=scale/2;
    n=scale;

    A = rand(m,k);
    B = rand(k,n);

    matmul_p(A,B,m,k,n);
    disp(1);
end
