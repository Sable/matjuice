function drv_babai(scale)

for i = 1 : scale
	A=randn(10,10);
	y=randn(10,1);
	z=babai(A,y);
end

end
