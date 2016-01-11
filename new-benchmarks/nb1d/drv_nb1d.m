function drv_nb1d(scale)
%%
%% Driver for the N-body problem coded using 1d arrays for the
%% displacement vectors.
%%

seed=1;

n=round(scale^.4*30); %floor(28*rand);
dT=(.5)*0.0833;
T=(.5)*32.4362*sqrt(scale);
Rx=rand1(n, 1, .1)*1000.23;
Ry=rand1(n, 1, .4)*1000.23;
Rz=rand1(n, 1, .9)*1000.23;

m=rand1(n, 1, -.4)*345;

[Fx, Fy, Fz, Vx, Vy, Vz]=nbody1d(n, Rx, Ry, Rz, m, dT, T);

end
