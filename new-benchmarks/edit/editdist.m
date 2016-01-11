
function d=editdist(s1, s2)
%-----------------------------------------------------------------------
%
%	This function M-file finds the edit distance between the
%	source string s1 and the target string s2.
%
%	The "edit distance" is the minimum number of single-character
%	edit operations (deletions, insertions, replacements) that
%	would convert s1 into s2. Method based on dynamic programming.
%
%	Invocation:
%		>> d=editdist(s1, s2)
%
%		where
%
%		i. s1 is the source string,
%
%		i. s2 is the target string,
%
%		o. d is the edit distance.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> d=editdist('cow', 'horse')
%
%	Source:
%		MATLAB 5 user contributed M-Files at
%		http://www.mathworks.com/support/ftp/.
%		("Anything Not Otherwise Categorized" category).
%
%	Author:
%		Miguel A. Castro (talk2miguel@yahoo.com).
%
%	Date:
%		June 2000.
%
%-----------------------------------------------------------------------

DelCost=1; % Cost of a deletion.
InsCost=1; % Cost of an insertion.
ReplCost=1; % Cost of a replacement.

n1=size(s1, 2);
n2=size(s2, 2);

% Set up and initialize the dynamic programming table.
D=zeros(n1+1, n2+1);

for i1=1:n1,
    D(i1+1, 1)=D(i1, 1)+DelCost;
end;

for j1=1:n2,
    D(1, j1+1)=D(1, j1)+InsCost;
end;

for i1=1:n1,
    for j1=1:n2,
	if s1(i1) == s2(j1),
	   Repl=0;
	else
	   Repl=ReplCost;
	end;

	D(i1+1, j1+1)=min([D(i1, j1)+Repl,D(i1+1, j1)+DelCost,D(i1, j1+1)+InsCost]);
    end;
end;

d=D(n1+1, n2+1);

end
