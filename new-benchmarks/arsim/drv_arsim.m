function drv_arsim(scale)
%DRV_ARSIM Summary of this function goes here
%   Detailed explanation goes here

% choosing the parameters
w=[0.25; 0.1];
% for the intercept vector,
A1=[0.4 1.2; 0.3 0.7];
% and
A2=[0.35 -0.3; -0.4 -0.5];
% for the noise covariance matrix. The two 2x2 matrices A1 and A2 are
% assembled into a single 2x4 coefficient matrix:
A=[A1 A2];
% for the AR coefficient matrices, and 
% C=[1.00 0.50; 0.50 1.50];
% R = chol(C)
R=[1.00 0.50; 0.00 1.118];
ndisc = 10^3;

for i=1:scale
    % We use the module ARSIM to simulate 200 observations of this AR
    % process:
    v = arsim(w, A, R, 200, ndisc);
end

end

