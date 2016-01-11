
function U=dirich(f1, f2, f3, f4, a, b, h, tol, max1)
%-----------------------------------------------------------------------
%
%	This function M-file finds the Dirichlet solution to
%	Laplace's equation
%
%			u  (x, y)+u  (x, y)=0,
%			 xx	   yy
%
%	with the boundary conditions
%
%		u(x, 0)=f1, u(x, b)=f2 for all 0 <= x <= a, and
%
%		u(0, y)=f3, u(a, y)=f4 for all 0 <= y <= b.
%
%	The subscripts xx and yy indicate the second partial
%	derivatives of u(x, y) with respect to x and y respectively.
%
%	Invocation:
%		>> U=dirich(f1, f2, f3, f4, a, b, h, tol, max1)
%
%		where
%
%		i. f1 is lower-edge boundary value,
%
%		i. f2 is the upper-edge boundary value,
%
%		i. f3 is the left-edge boundary value,
%
%		i. f4 is the right-edge boundary value,
%
%		i. a is the extent of the abscissa,
%
%		i. b is the extent of the ordinate,
%
%		i. h is the step size,
%
%		i. tol is the convergence tolerance,
%
%		i. max1 is the maximum number of iterations,
%
%		o. U is the solution matrix.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> U=dirich(20, 180, 80, 0, 4, 4, 0.1, 0.0001, 200)
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
%		Also part of the FALCON project.
%
%	Author:
%		John H. Mathews (mathews@fullerton.edu).
%
%	Date:
%		March 1995.
%
%-----------------------------------------------------------------------

n=fix(a/h)+1;
m=fix(b/h)+1;
ave=(a*(f1+f2)+b*(f3+f4))/(2*a+2*b);
U=ave*ones(n, m);
for l=1:m,
    U(1, l)=f3;
    U(n, l)=f4;
end;

for k=1:n,
    U(k, 1)=f1;
    U(k, m)=f2;
end;

U(1, 1)=(U(1, 2)+U(2, 1))/2;
U(1, m)=(U(1, m-1)+U(2, m))/2;
U(n, 1)=(U(n-1, 1)+U(n, 2))/2;
U(n, m)=(U(n-1, m)+U(n, m-1))/2;

w=4/(2+sqrt(4-(cos(pi/(n-1))+cos(pi/(m-1)))^2));
err=1;
cnt=0;

while ((err>tol) & (cnt<=max1)),
      err=0;
      for l=2:(m-1),
	  for k=2:(n-1),
	      relx=w*(U(k, l+1)+U(k, l-1)+ ...
	      U(k+1, l)+U(k-1, l)-4*U(k, l))/4;
	      U(k, l)=U(k, l)+relx;
	      if (err<=abs(relx)),
		 err=abs(relx);
	      end;
	  end;
      end;
cnt=cnt+1;
end;

end
