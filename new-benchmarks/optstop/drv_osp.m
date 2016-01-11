function drv_osp( scale)
%DRV_OSP Summary of this function goes here
%   Detailed explanation goes here
n = scale;
t = 10*scale;
%tic
p = osp(n,t);
%toc
%plot (1:n,p,'b-');

end

