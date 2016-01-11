function drv_spqr(scale)
% This is a test script for spqr.  Given m and n, it constructs an mxn
% matrix A with singular values 1, ..., 10^-svalmin.  It the singular
% values numbered gp, ..., p (p = min([m,n])) are multiplied by gapfac to
% create a gap.  It then runs spqr with values in the workspace for its
% arguments.
%
% Input to testspqr:
%
% m, n:     The size of the matrix svalmin:  Used a described above to
% compute the singular values of
%           A
% gappos:   The position of the gap.  What is acutally used is
%           gp = min([gappos, m, n])
% gapfac:   The factor by which singular values gp, ..., p is
%           multiplied.  Set to 1 for no gap.
%
% Coded by G. W. (Pete) Stewart Jun 23 2004

% Set up the matrix.
m = 10;
n = 20;
A = randn(m, n); % U*S*V';

tol = 1e-4;
maxcols = n;

for i=1:scale
    % Call spqr
    [ncols, R, colx, norms] = spqr(A, tol, maxcols);
end

end
