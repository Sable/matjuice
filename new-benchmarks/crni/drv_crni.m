function drv_crni(scale)
%%
%% Driver for the Crank-Nicholson solution to the
%% one-dimensional heexitat equation.
%%

%t1=clock;

a=2.5; % a=rand*3;
b=1.5; % b=1.5;
c=5; % c=2;
m=2300; %321; % n=floor(rand*1389);
n=2300; %321; % n=floor(rand*529);

for time=1:scale
  U=crnich(a, b, c, n, m);
end

end

