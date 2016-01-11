
function f=seidel(f, mask, n, m, na, mb)
%-----------------------------------------------------------------------
%
%	This function M-file makes one Seidel iteration.
%
%	Invocation:
%		>> g=seidel(f, mask, n, m, na, mb)
%
%		where
%
%		i. f is the potential array,
%
%		i. mask is the mask array,
%
%		i. n is the number of points along the x-axis,
%
%		i. m is the number of points along the height of
%		   the outer conductor,
%
%		i. na is the number of points along the width of
%		   the inner conductor,
%
%		i. mb is the number of points along the height of
%		   the inner conductor,
%
%		o. g is the updated potential array.
%
%	Requirements:
%		None.
%
%	Source:
%		Computational Electromagnetics - EEK 170 course at
%		http://www.elmagn.chalmers.se/courses/CEM/.
%
%-----------------------------------------------------------------------

for ii=2:n,
    for jj=2:m,
 	f(ii, jj)=f(ii, jj)+mask(ii, jj)*(0.25*(f(ii-1, jj)+f(ii+1, jj)+f(ii, jj-1)+f(ii, jj+1))-f(ii, jj));
    end;
end;

ii=1; % Symmetry on left boundary ii-1 -> ii+1.
for jj=2:m,
    f(ii, jj)=f(ii, jj)+mask(ii, jj)* ...
    (0.25*(f(ii+1, jj)+f(ii+1, jj)+f(ii, jj-1)+f(ii, jj+1))-f(ii, jj));
end;

jj=1; % Symmetry on lower boundary jj-1 -> jj+1.
for ii=2:n,
    f(ii, jj)=f(ii, jj)+mask(ii, jj)*(0.25*(f(ii-1, jj)+f(ii+1, jj)+f(ii, jj+1)+f(ii, jj+1))-f(ii, jj));
end;


