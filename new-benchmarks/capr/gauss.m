
function cap=gauss(n, m, h, f)
%-----------------------------------------------------------------------
%
%	This function M-file computes capacitance from the
%	potential.
%
%	Invocation:
%		>> cap=gauss(n, m, h, f)
%
%		where
%
%		i. n is the number of points along the x-axis,
%
%		i. m is the number of points along the height of
%		   the outer conductor,
%
%		i. f is the potential array,
%
%		i. h is the grid size,
%
%		o. cap is the capacitance.
%
%	Requirements:
%		None.
%
%	Source:
%		Computational Electromagnetics - EEK 170 course at
%		http://www.elmagn.chalmers.se/courses/CEM/.
%
%-----------------------------------------------------------------------

q=0;
for ii=1:n,
    q=q+(f(ii, m)+f(ii+1, m))*0.5;
end;

for jj=1:m,
    q=q+(f(n, jj)+f(n, jj+1))*0.5;
end;

cap=q*4; % Four quadrants.
cap=cap*8.854187;


