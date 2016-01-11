
function y=linspace(d1, d2, n)
%-----------------------------------------------------------------------
%LINSPACE Linearly spaced vector.
%   LINSPACE(x1, x2) generates a row vector of n linearly
%   equally spaced points between x1 and x2.
%
%   See also LOGSPACE, :.
%
%   Copyright 1984-2001 The MathWorks, Inc. 
%   $Revision: 5.11 $  $Date: 2001/04/15 12:02:30 $
%-----------------------------------------------------------------------

y=[d1+(0:n-2)*(d2-d1)/(n-1) d2];


