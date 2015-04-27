function drv_matmul_p(scale)

%m = arr(1);
%k = arr(2);
%n = arr(3);

m=scale;
k=scale/2;
n=scale;

A = rand(m,k);
B = rand(k,n);

%tic
matmul_p(A,B,m,k,n);
%toc
end

