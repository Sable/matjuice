
function [Fx, Fy, Fz, Vx, Vy, Vz]=nbody1d(n, Rx, Ry, Rz, m, dT, T)
%-----------------------------------------------------------------------
%
%	This function M-file simulates the gravitational movement
%	of a set of objects.
%
%	Invocation:
%		>> [Fx, Fy, Fz, Vx, Vy, Vz]=...
%		   nbody1d(n, Rx, Ry, Rz, m, dT, T)
%
%		where
%
%		i. n is the number of objects,
%
%		i. Rx is the n x 1 radius vector of x-components,
%
%		i. Ry is the n x 1 radius vector of y-components,
%
%		i. Rz is the n x 1 radius vector of z-components,
%
%		i. m is the n x 1 vector of object masses,
%
%		i. dT is the time increment of evolution,
%
%		i. T is the total time for evolution,
%
%		o. Fx is the n x 1 vector of net x-component forces,
%
%		o. Fy is the n x 1 vector of net y-component forces,
%
%		o. Fz is the n x 1 vector of net z-component forces,
%
%		o. Vx is the n x 1 vector of x-component velocities,
%
%		o. Vy is the n x 1 vector of y-component velocities,
%
%		o. Vz is the n x 1 vector of z-component velocities.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> [Fx, Fy, Fz, Vx, Vy, Vz]=...
%		   nbody1d(n, ...
%		   rand(n, 1)*1000.23, ...
%		   rand(n, 1)*1000.23, ...
%		   rand(n, 1)*1000.23, ...
%		   rand(n, 1)*345, 0.01, 20)
%
%	Source:
%		Quinn's "Otter" project.
%
%	Author:
%		Alexey Malishevsky (malishal@cs.orst.edu).
%
%-----------------------------------------------------------------------

Fx=zeros(n, 1);
Fy=zeros(n, 1);
Fz=zeros(n, 1);

Vx=zeros(n, 1);
Vy=zeros(n, 1);
Vz=zeros(n, 1);

G=1e-11; % Gravitational constant.

for t=1:dT:T,
    for k=1:n,

	% Find the displacement vector between all particles
	% and the kth particle.

	drx=Rx-Rx(k);
	dry=Ry-Ry(k);
	drz=Rz-Rz(k);

	% Find the squared distance between all particles
	% and the kth particle, adjusting "self distances" to 1.

	r=drx.*drx+dry.*dry+drz.*drz;
	r(k)=1.0;

	% Find the product of the kth particle's mass and
	% and every object's mass, adjusting "self products" to 0.

	M=m*m(k);
	M(k)=0.0;

	% Find the gravitational force.

	f=G*(M./r);

	% Find the unit direction vector.

	r=sqrt(r);
	drx=drx./r;
	dry=dry./r;
	drz=drz./r;

	% Find the resulting force.

	frx=f.*drx;
	fry=f.*dry;
	frz=f.*drz;

	Fx(k)=mean(frx)*n;
	Fy(k)=mean(fry)*n;
	Fz(k)=mean(frz)*n;

    end;

    % Find the acceleration.

    ax=Fx./m;
    ay=Fy./m;
    az=Fz./m;

    % Find the velocity.

    Vx=Vx+ax*dT;
    Vy=Vy+ay*dT;
    Vz=Vz+az*dT;

    % Find the radius vector.

    Rx=Rx+Vx*dT;
    Ry=Ry+Vy*dT;
    Rz=Rz+Vz*dT;

end;

end
