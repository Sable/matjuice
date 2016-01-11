
function U=finediff(a, b, c, n, m)
%-----------------------------------------------------------------------
%
%	This function M-file finds the finite-difference solution
%	to the wave equation
%
%			     2
%		u  (x, t)=c u  (x, t),
%		 tt	       xx
%
%	with the boundary conditions
%
%		u(0, t)=0, u(a, t)=0 for all 0 <= t <= b,
%
%		u(x, 0)=sin(pi*x)+sin(2*pi*x), for all 0 < x < a,
%
%		u (x, 0)=0 for all 0 < x < a.
%		 t
%
%	The subscripts t, tt and xx denote the first and second
%	partial derivatives of u(x, t) with respect to t and x.
%
%	Invocation:
%		>> U=finediff(a, b, c, n, m)
%
%		where
%
%		i. a is the displacement,
%
%		i. b is the time duration,
%
%		i. c is the square root of the
%		   constant in the wave equation,
%
%		i. n is the number of grid points over [0, a],
%
%		i. m is the number of grid points over [0, b],
%
%		o. U is the solution matrix.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> U=finediff(2.5, 1.5, 0.5, 451, 451)
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

h=a/(n-1);
k=b/(m-1);
r=c*k/h;
r2=r^2;
r22=r^2/2;
s1=1-r^2;
s2=2-2*r^2;
U=zeros(n, m);
for i1=2:n-1,
    U(i1, 1)=sin(pi*h*(i1-1))+sin(2*pi*h*(i1-1));
    U(i1, 2)=s1*(sin(pi*h*(i1-1))+sin(2*pi*h*(i1-1)))+r22*(sin(pi*h*i1)+sin(2*pi*h*i1)+sin(pi*h*(i1-2))+sin(2*pi*h*(i1-2)));
end;

for j1=3:m,
    for i1=2:n-1,
	U(i1, j1)=s2*U(i1, j1-1)+r2*(U(i1-1, j1-1)+U(i1+1, j1-1))-U(i1, j1-2);
    end;
end;

end
