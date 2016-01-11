function p = osp( n,t )
%OSP Summary of this function goes here
%   Detailed explanation goes here
%parfor
for k = 1:n
    p(k) = high_card_estimated(n,k,t);
end
return;
end
