function [x] = bubble(A)

n=length(A);
for j=1:n-1
	% comparing each number with the next and swapping
	for i=1:n-1
		if A(i)>A(i+1)
			temp=A(i);
			A(i)=A(i+1);
			A(i+1)=temp;
		end
	end
end
x=A;

end
