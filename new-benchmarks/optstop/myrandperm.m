function res = myrandperm( n )
%RANDPERM Summary of this function goes here
%   Detailed explanation goes here
sorted = 1:n;
for i = 1:n
r = floor(1 + (n)*rand(1,n));
for j = 1:(n-1)
    t = sorted(r(j));
    sorted(r(j)) = sorted(r(j+1));
    sorted(r(j+1))=t;
end
end
res = sorted;

end

