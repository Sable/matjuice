function [ncols, R, colx, norms] = spqr(A, tol, maxcols)
%SPQR computes a pivoted semi-QR  decomposition of an mxn matrix A.
%    It is especially suited for computing low-rank approximations to a
%    sparse matrix.
%
%    BACKGROUND.  A pivoted QR (PQR) decomposition of an mxn matrix A is a
%    factorization of the form
%
%       A*P = Q*R
%
%    where P is a permutation matrix, Q is an orthonormal matrix, and R is
%    an upper triangular matrix.  The permutation P is chosen so that
%    R(k,k)^2 >= norm(R(:,k:j),'fro')^2, (j=k:n).  This tends to make the
%    initial columns of AP well-conditioned and the trailing principal
%    submatrix of R small.  In particular, if we partition the
%    decomposition B = A*P = Q*R in the form
%
%       [B1 B2] = [Q1 Q2]*[R11 R12;                      (*)
%                           0  R22]
%
%    and R22 is small, then AP can be approximated by Q1*[R11 R12]. The
%    Frobenius norm of the difference is NORM(R22, 'fro').
%
%    A semi-PQR (SPQR) approximation consists of P, R11 and R12. Since Q1 =
%    B1*inv(R11) the action of Q1 on a vector can be calculated by
%    operations involving B1 and Q1.  For example,
%
%       Q1'*x = R'\(B'*x)                                 (**)
%
%    SPQR computes a SPQR approximation using a quasi-Gram-Schmidt
%    algorithm that takes advantage of (**) (and its equivalents) to avoid
%    storing Q.  This means that the algorithm's only operations involving
%    A are matrix-vector products.  The only storage requirements are for
%    R11, R12 and a few work vectors of lengths m and n.  Thus SPQR is
%    ideally suited for the approximating sparse matrices.
%
%    THE FUNCTION SPQR. The statement
%
%       [ncols, R, colx, colnrm] = spqr(A, tol, maxcols)
%
%    returns
%
%       ncols    : the number of columns in B1 of (*).
%
%
%       R        : The matrix  [R11 R12] or R11 depending on fullR.
%
%       colx(n)  : The permutation P. Specifically, AP = A(:,colx)
%                  and B1 = A(:,colx(1:ncols)).
%
%       norms(n) : If norms are to be computed, norms contains
%                  the following information.  For j<=ncols, norms(j) is
%                  the norm of R22 for the decomposition (*), where R11 is
%                  jxj.  For j>ncols, norms(j) is the norm of R22(:,j) in
%                  (*), where R11 is ncols x ncols. If norms are not
%                  computed, norms=[].
%
%    The input arguments are
%
%       A       : The matrix whose SPQR approximation is to be
%                 computed.
%
%       tol     : The reduction stops when norm(R22,'fro) < tol.
%                
%       maxcols : Stops the reduction when ncols = maxcols.
%
%    WARNING. The accuracy of the the approximation decreases as
%    norm(R22,'fro') decreases.  As a rule of thumb, if the norms of the
%    columns of A are approximately equal, tol should be greater than
%    10^-8*norm(A,'fro').
%
%    If tol.leq.0, SPQR will stop only when ncols is equal to colmax.
%    
%    When R12 is too large to store, a second application of SPQR gives the
%    wherewithal to compute a sparse C-R approximation of the form
%
%       A = XTY'
%
%    where X consists of columns of A and Y' consists of rows of A.  See
%    SCRA.
%
%    Author: G. W. (Pete) Stewart, Jun 24 2004
%

% Determine the maximum number of columns in the result.
m = size(A, 1);
n = size(A, 2);
q = zeros(m, 1);

ncols = min([m, n, maxcols]);

% Initialize arrays.
colx = 1:n;
norms = zeros(1, n);
for j = 1:n
    norms(j) = norm(A(:,j));
end

R = zeros(ncols, n);
rrk = zeros(1, n);

% Loop bringing columns of A into the decomposition.
for k = 1:ncols
   % Get column k and incorporate it into the decomposition.
   a = A(:,colx(k));

   if k == 1
      % Special action for the first column
      R(1,1) = norm(a);
      q = a/R(1,1);
   elseif k == 2
      %  Perform a quasi-Gram-Schmidt step with reorthogonalization.     
      b = a'*A(:,colx(1));
      r = (b/R(1,1))';
      c = R(1,1)\r;
      q = a - A(:,colx(1))*c;
      b = q'*A(:,colx(1));
      rr = (b/R(1,1))';
      c = R(1,1)\rr;
      q  = q - A(:,colx(1))*c;
      % Update R.
      r = r + rr;
      rho = norm(q);
      R(1,2) = r;
      R(2,2) = rho;
      % Compute the kth column of Q.
      c = R(1,1)\r;
      q = (a - A(:,colx(1))*c)/rho;
   end

   % Update norms and compute norm(R22,'fro')
   if k+1 <= n
       % Compute the k-th row of R.  Note: For large matrices
       % this step dominates the computation.
       rrk(k+1:n) = q'*A(:,colx(k+1:n));
       R(k,k+1:n) = rrk(k+1:n);
       
       % Downdate the column norms and compute norm(R22,'fro').
       norms(k+1:n) = norms(k+1:n).^2 - rrk(k+1:n).^2;
       for i = k+1:n
           if (norms(i) < 0)
               norms(i) = 0;
           end
       end
       norms(k) = sqrt(sum(norms(k+1:n)));
       norms(k+1:n) = sqrt(norms(k+1:n));
       
       % Check the stopping criterion.
       if (norms(k) < tol)
           break;
       end
   else
       norms(k)=0;
   end
end
