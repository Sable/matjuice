function[] = matmul_p(A,B,m,k,n)
    
c=zeros(m,n);
%!parfor
for j = 1:n
    for h = 1:k
        for i = 1:m
            c(i,j) = c(i,j)+A(i,h)*B(h,j);
        end
    end
end

end
