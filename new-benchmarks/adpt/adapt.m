
function [SRmat, quad, err] = adapt(a, b, sz_guess, tol)
%-----------------------------------------------------------------------
%
%	This function M-file finds the adaptive quadrature using
%	Simpson's rule.
%
%	This MATLAB program is intended as a pedagogical example.
%
%	Invocation:
%		>> [SRmat, quad, err] = adapt(a, b, sz_guess, tol)
%
%		where
%
%		i. a is the left endpoint of [a, b],
%
%		i. b is the right endpoint of [a, b],
%
%		i. sz_guess is the number of rows in SRmat,
%
%		i. tol is the convergence tolerance,
%
%		o. SRmat is the matrix of adaptive Simpson
%		   quadrature values,
%
%		o. quad is the adaptive Simpson quadrature,
%
%		o. err is the error estimate.
%
%	Requirements:
%		a <= b.
%
%	Examples:
%		>> [SRmat, quad, err] = adapt(-1, 6, 1, 1.0000e-12)
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

SRmat=zeros(sz_guess, 6);
iterating=0;
done=1;

h=(b-a)/2; % The step size.
c=(a+b)/2; % The midpoint in the interval.

% The integrand is f(x) = 13.*(x-x.^2).*exp(-3.*x./2).

Fa=13.*(a-a.^2).*exp(-3.*a./2);
Fc=13.*(c-c.^2).*exp(-3.*c./2);
Fb=13.*(b-b.^2).*exp(-3.*b./2);

S=h*(Fa+4*Fc+Fb)/3; % Simpson's rule.

SRvec=[a, b, S, S, tol, tol];

SRmat(1, 1:6)=SRvec;
m=1;
state=iterating;
while (state==iterating),
      n=m;
      for l=n:-1:1,
	  p=l;
	  SR0vec=SRmat(p, :);
	  err=SR0vec(5);
	  tol=SR0vec(6);

	  if (tol<=err),
	     state=done;
	     SR1vec=SR0vec;
	     SR2vec=SR0vec;

	     a=SR0vec(1); % Left endpoint.
	     b=SR0vec(2); % Right endpoint.
	     c=(a+b)/2; % Midpoint.

	     err=SR0vec(5);
	     tol=SR0vec(6);
	     tol2=tol/2;

	     a0=a;
	     b0=c;
	     tol0=tol2;
	     h=(b0-a0)/2;
	     c0=(a0+b0)/2;

	     % The integrand is f(x) = 13.*(x-x.^2).*exp(-3.*x./2).

	     Fa=13.*(a0-a0.^2).*exp(-3.*a0./2);
	     Fc=13.*(c0-c0.^2).*exp(-3.*c0./2);
	     Fb=13.*(b0-b0.^2).*exp(-3.*b0./2);

	     S=h*(Fa+4*Fc+Fb)/3; % Simpson's rule.

	     SR1vec=[a0, b0, S, S, tol0, tol0];

	     a0=c;
	     b0=b;
	     tol0=tol2;
	     h=(b0-a0)/2;
	     c0=(a0+b0)/2;

	     % The integrand is f(x) = 13.*(x-x.^2).*exp(-3.*x./2).

	     Fa=13.*(a0-a0.^2).*exp(-3.*a0./2);
	     Fc=13.*(c0-c0.^2).*exp(-3.*c0./2);
	     Fb=13.*(b0-b0.^2).*exp(-3.*b0./2);

	     S=h*(Fa+4*Fc+Fb)/3; % Simpson's rule.

	     SR2vec=[a0, b0, S, S, tol0, tol0];

	     err=abs(SR0vec(3)-SR1vec(3)-SR2vec(3))/10;

	     if (err<tol),
		SRmat(p, :)=SR0vec;
		SRmat(p, 4)=SR1vec(3)+SR2vec(3);
		SRmat(p, 5)=err;
	     else
		SRmat(p+1:m+1, :)=SRmat(p:m, :);
		m=m+1;
		SRmat(p, :)=SR1vec;
		SRmat(p+1, :)=SR2vec;
		state=iterating;
	     end;
	  end;
      end;
end;

quad=sum(SRmat(:, 4));

err=sum(abs(SRmat(:, 5)));

SRmat=SRmat(1:m, 1:6);


end
