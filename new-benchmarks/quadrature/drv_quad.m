function drv_quad( scale )
%DRV_QUAD Summary of this function goes here
%   Detailed explanation goes here

a = 0.0;
b = 2.0;
n = scale;
%workers = 8;
%matlabpool('open','local',workers);
%tic
q = quad_par(a,b,n);
%matlabpool close
%toc
end

