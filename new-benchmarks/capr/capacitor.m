
function cap=capacitor(a, b, c, d, n, tol, rel)
%-----------------------------------------------------------------------
%
%	This function M-file computes the capacitance
%	per unit length of a coaxial pair of rectangles.
%
%	Invocation:
%		>> cap=capacitor(a, b, c, d, n, tol, rel)
%
%		where
%
%		i. a is the width of the inner conductor,
%
%		i. b is the height of the inner conductor,
%
%		i. c is the width of the outer conductor,
%
%		i. d is the height of the outer conductor,
%
%		i. n is the number of points along the x-axis,
%
%		i. tol is the tolerance,
%
%		i. rel is the relaxation parameter,
%
%		o. cap is the capacitance per unit length.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> cap=capacitor(1, 2, 2, 3, 50, 1e-9, 1.90)
%
%	Source:
%		Computational Electromagnetics - EEK 170 course at
%		http://www.elmagn.chalmers.se/courses/CEM/.
%
%-----------------------------------------------------------------------

h=0.5*c/n; % Grid size.

na=round(0.5*a/h);
x=linspace(0, 0.5*c, n+1);
m=round(0.5*d/h);
mb=round(0.5*b/h);
y=linspace(0, 0.5*d, m+1);

% Initialize potential and mask array.
f=zeros(n+1, m+1);
mask=ones(n+1, m+1)*rel;

for ii=1:na+1,
    for jj=1:mb+1,
	mask(ii, jj)=0;
	f(ii, jj)=1;
    end;
end;

oldcap=0;
for iter=1:1000,
    f=seidel(f, mask, n, m, na, mb);
    cap=gauss(n, m, h, f);
    if (abs(cap-oldcap)./cap<tol)
       break;
    else
       oldcap=cap;
    end;
end;

end
