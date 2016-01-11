function M=rand3(m,n,seed)
% making random deterministic
    seed=seed+m*n;
    M=zeros(m,n);
    for i=1:m
        for j=1:n
            M(i,j)=mod(seed,1);
            seed=seed+M(i,j)*sqrt(100)+sqrt(2);
        end 
    end
end
