function drv_createlhs(scale)
%DRV_CREATELHS Summary of this function goes here
%   Detailed explanation goes here

for i=1:scale
    arr=randn(4,4)*10;
    sum_criterion=createlhs(arr);
end

end

