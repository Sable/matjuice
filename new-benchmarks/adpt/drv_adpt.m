function drv_adpt(scale)
%
% Driver for adaptive quadrature using Simpson's rule.
%

a=-1;
b=6;
sz_guess=1;
tol=4e-13;

for i = 1:scale
  [SRmat, quad, err] = adapt(a, b, sz_guess, tol);
end

end
