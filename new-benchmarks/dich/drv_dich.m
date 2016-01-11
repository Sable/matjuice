function drv_dich(scale)
%%
%% Driver for the Dirichlet solution to Laplace's equation.
%%

a=4;
b=4;
h=0.03;
tol=10^-5;
max1=1000;

f1=20;
f2=180;
f3=80;
f4=0;

for time=1:scale
  U=dirich(f1, f2, f3, f4, a, b, h, tol, max1);
end

end
