
function B1=closure(N)
%-----------------------------------------------------------------------
%
%	This function M-file computes the transitive closure of a
%	directed graph. An adjacency matrix representation of the
%	directed graph is used, which is initialized arbitrarily.
%
%	Invocation:
%		>> [t2, B]=closure(N)
%
%		where
%
%		i. N is the number of nodes in the directed graph,
%
%		o. t2 is the elapsed time in seconds after
%		   initialization,
%
%		o. B is the transitive closure.
%
%	Requirements:
%		N is a positive integer.
%
%	Examples:
%		>> [t2, B]=closure(128)
%
%	Source:
%		Quinn's "Otter" project.
%
%	Author:
%		Yan Zhao (zhao@cs.orst.edu).
%
%	Date:
%		July 1997.
%
%	for testing, remove that t2.
%-----------------------------------------------------------------------

% Initialization.
A=zeros(N, N);
for ii=1:N,
    for jj=1:N,
	if ii*jj<N/2,
	   A(N-ii, ii+jj)=1;
	   A(ii, N-ii-jj)=1;
	end;
	if (ii==jj),
	   A(ii, jj)=1;
	end;
    end;
end;

B=A;

% Perform actual work.
%Rename ii1 to ii once VarRenameOnTypeCpnflict is Fixed
ii1=N/2;
while ii1>=1,
      B=B*B;
      ii1=ii1/2;
end;

% temporarily change B -> B1
B1=B>0;

end
