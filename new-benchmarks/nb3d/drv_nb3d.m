function drv_nb3d(scale)
%%
%% Driver for the N-body problem coded using 3d arrays for the
%% displacement vectors.
%%

n=round(scale^.4*30); %floor(28*rand);
dT=(.5)*0.0833;
T=(.5)*32.4362*sqrt(scale);

R=rand3(n, 3,.1)*1000.23;

m=rand3(n, 1,.9)*345;

[F, V]=nbody3d(n, R, m, dT, T);

end

