
function X=tridiagonal(A, D, C, B, n)
%-----------------------------------------------------------------------
%
%	This function M-file finds the solution of a tridiagonal
%	linear system. It is assumed that D and B have dimension
%	n, and that A and C have dimension n-1.
%
%	Invocation:
%		>> X=tridiagonal(A, D, C, B)
%
%		where
%
%		i. A is a subdiagonal row vector,
%
%		i. D is a diagonal row vector,
%
%		i. C is the superdiagonal row vector,
%
%		i. B is the right-hand side row vector,
%
%		o. X is the solution row vector.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> X=tridiagonal([1, 2, 3], [1, 2, 3, 4], ...
%		[1, 2, 3], [1, 2, 3, 4])
%
%	Source:
%		Numerical Methods: MATLAB Programs,
%		(c) John H. Mathews, 1995.
%
%		Accompanying text:
%		Numerical Methods for Mathematics, Science and
%		Engineering, 2nd Edition, 1992.
%
%		Prentice Hall, Englewood Cliffs,
%		New Jersey, 07632, USA.
%
%	Author:
%		John H. Mathews (mathews@fullerton.edu).
%
%	Date:
%		March 1995.
%
%-----------------------------------------------------------------------

% n=size(B, 2);

for k=2:n,
    mult=A(k-1)./D(k-1);
    D(k)=D(k)-mult*C(k-1);
    B(k)=B(k)-mult*B(k-1);
end;

X = zeros(1, n);
X(n)=B(n)./D(n);

for k=(n-1):-1:1,
    X(k)=(B(k)-C(k)*X(k+1))./D(k);
end;


