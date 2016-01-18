
function U=crnich(a, b, c, n, m)
%-----------------------------------------------------------------------
%
%	This function M-file finds the Crank-Nicholson solution
%	to the one-dimensional heat equation
%
%				    2
%			u (x, t)=c u  (x, t).
%			 t	      xx
%
%	The function u(x, t) denotes the temperature in a
%	one-dimensional metal rod as a function of both the
%	displacement x and the time t. The expression c^2 is the
%	thermal conductivity constant. The subscript t indicates
%	the partial derivative of u(x, t) with respect to time.
%	The subscript xx indicates the second partial derivative of
%	u(x, t) with respect to displacement.
%
%	The one-dimensional heat equation can be solved under a
%	variety of boundary conditions. This program considers
%	the following:
%
%		u(x, 0)=sin(pi*x)+sin(3*pi*x) for 0 < x < a,
%
%		u(0, t)=0, and u(a, t)=0 for 0 <= t <= b,
%
%	where a is the length of the rod, and b is the time duration.
%
%	For a concise background on the one-dimensional heat equation,
%	see "Modelling: Derivation of the Heat Equation" at
%	http://www-solar.mcs.st-and.ac.uk/~alan/MT2003/PDE/node20.html.
%
%	Invocation:
%		>> U=crnich(a, b, c, n, m)
%
%		where
%
%		i. a is the length of the metal rod,
%
%		i. b is the time duration,
%
%		i. c is the square root of the thermal
%		   conductivity constant in the heat equation,
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
%		>> U=crnich(2.5, 1.5, 2, 321, 321)
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
r=c^2*k/h^2;
s1=2+2/r;
s2=2/r-2;
U=zeros(n, m);
for i1=2:(n-1),
    % u(x, 0)=sin(pi*x)+sin(3*pi*x).
    U(i1, 1)=sin(pi*h*(i1-1))+sin(3*pi*h*(i1-1));
end;

Vd=s1*ones(1, n);
Vd(1)=1;
Vd(n)=1;
Va=-ones(1, n-1);
Va(n-1)=0;
Vc=-ones(1, n-1);
Vc(1)=0;
Vb=zeros(1, n);
Vb(1)=0;
Vb(n)=0;

for j1=2:m,
    for i1=2:(n-1),
	Vb(i1)=U(i1-1, j1-1)+U(i1+1, j1-1)+s2*U(i1, j1-1);
    end;
    X=tridiagonal(Va, Vd, Vc, Vb, n);
    U(1:n, j1)=X';
end;

end
