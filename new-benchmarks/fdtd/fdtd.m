
function [Ex, Ey, Ez, Hx, Hy, Hz, Ets]=fdtd(Lx, Ly, Lz, ...
					 Nx, Ny, Nz, nrm, Nt)
%-----------------------------------------------------------------------
%
%	This function M-file applies the Finite Difference
%	Time Domain (FDTD) technique on a hexahedral cavity
%	with conducting walls. FDTD is a powerful tool for
%	transient electromagnetic analysis. 
%
%	Invocation:
%		>> [Ex, Ey, Ez, Hx, Hy, Hz, Ets]=...
%		   fdtd(Lx, Ly, Lz, Nx, Ny, Nz)
%
%		where
%
%		i. Lx is the cavity dimension in meters along the
%		   x-axis,
%
%		i. Ly is the cavity dimension in meters along the
%		   y-axis,
%
%		i. Lz is the cavity dimension in meters along the
%		   z-axis,
%
%		i. Nx is the number of cells along the x-axis,
%
%		i. Ny is the number of cells along the y-axis,
%
%		i. Nz is the number of cells along the z-axis,
%
%		i. nrm is norm([Nx/Lx Ny/Ly Nz/Lz]),
%
%		i. Nt is the number of time steps,
%
%		o. Ex is the x-component of the electric field.
%
%		o. Ey is the y-component of the electric field.
%
%		o. Ez is the z-component of the electric field.
%
%		o. Hx is the x-component of the magnetic field.
%
%		o. Hy is the y-component of the magnetic field.
%
%		o. Hz is the z-component of the magnetic field.
%
%		o. Ets is the time signal array.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> [Ex, Ey, Ez, Hx, Hy, Hz, Ets]=...
%		   fdtd(.05, .04, .03, 25, 20, 15)
%
%	Source:
%		Computational Electromagnetics - EEK 170 course at
%		http://www.elmagn.chalmers.se/courses/CEM/.
%
%-----------------------------------------------------------------------

% Physical constants.
eps0=8.8541878e-12; % Permittivity of vacuum.
mu0=4e-7*pi; % Permeability of vacuum.
c0=299792458; % Speed of light in vacuum.

Cx=Nx/Lx; Cy=Ny/Ly; Cz=Nz/Lz; % Inverse cell dimensions.

Dt=1/(c0*nrm); % Time step.

% Allocate field arrays.
Ex=zeros(Nx, Ny+1, Nz+1);
Ey=zeros(Nx+1, Ny, Nz+1);
Ez=zeros(Nx+1, Ny+1, Nz);
Hx=zeros(Nx+1, Ny, Nz);
Hy=zeros(Nx, Ny+1, Nz);
Hz=zeros(Nx, Ny, Nz+1);

% Allocate time signals.
Ets=zeros(Nt, 3);

% Initialize fields (near but not on the boundary).
Ex(1, 2, 2)=1;
Ey(2, 1, 2)=2;
Ez(2, 2, 1)=3;

% Time stepping.
for n=1:Nt,
    % Update H everywhere.
    Hx=Hx+(Dt/mu0)*((Ey(:, :, 2:Nz+1)-Ey(:, :, 1:Nz))*Cz-(Ez(:, 2:Ny+1, :)-Ez(:, 1:Ny, :))*Cy);
    Hy=Hy+(Dt/mu0)*((Ez(2:Nx+1, :, :)-Ez(1:Nx, :, :))*Cx-(Ex(:, :, 2:Nz+1)-Ex(:, :, 1:Nz))*Cz);
    Hz=Hz+(Dt/mu0)*((Ex(:, 2:Ny+1, :)-Ex(:, 1:Ny, :))*Cy-(Ey(2:Nx+1, :, :)-Ey(1:Nx, :, :))*Cx);

    % Update E everywhere except on boundary.
    Ex(:, 2:Ny, 2:Nz)=Ex(:, 2:Ny, 2:Nz)+(Dt/eps0)*((Hz(:, 2:Ny, 2:Nz)-Hz(:, 1:Ny-1, 2:Nz))*Cy-(Hy(:, 2:Ny, 2:Nz)-Hy(:, 2:Ny, 1:Nz-1))*Cz);
    Ey(2:Nx, :, 2:Nz)=Ey(2:Nx, :, 2:Nz)+(Dt/eps0)*((Hx(2:Nx, :, 2:Nz)-Hx(2:Nx, :, 1:Nz-1))*Cz-(Hz(2:Nx, :, 2:Nz)-Hz(1:Nx-1, :, 2:Nz))*Cx);
    Ez(2:Nx, 2:Ny, :)=Ez(2:Nx, 2:Ny, :)+(Dt/eps0)*((Hy(2:Nx, 2:Ny, :)-Hy(1:Nx-1, 2:Ny, :))*Cx-(Hx(2:Nx, 2:Ny, :)-Hx(2:Nx, 1:Ny-1, :))*Cy);

    % Sample the electric field at chosen points.
    Ets(n, :)=[Ex(4, 4, 4), Ey(4, 4, 4), Ez(4, 4, 4)];
end;

end
