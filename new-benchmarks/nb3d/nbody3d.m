
function [F, V]=nbody3d(n, R, m, dT, T)
%-----------------------------------------------------------------------
%
%	This function M-file simulates the gravitational movement
%	of a set of objects.
%
%	Invocation:
%		>> [F, V]=nbody3d(n, R, m, dT, T)
%
%		where
%
%		i. n is the number of objects,
%
%		i. R is the n x 3 matrix of radius vectors,
%
%		i. m is the n x 1 vector of object masses,
%
%		i. dT is the time increment of evolution,
%
%		i. T is the total time for evolution,
%
%		o. F is the n x 3 matrix of net forces,
%
%		o. V is the n x 3 matrix of velocities.
%
%	Requirements:
%		None.
%
%	Examples:
%		>> [F, V]=nbody3d(n, rand(n, 3)*1000.23, ...
%		   rand(n, 1)*345, 0.01, 20)
%
%-----------------------------------------------------------------------

F=zeros(n, 3);

V=zeros(n, 3);

G=1e-11; % Gravitational constant.

vno=1:n;
vnt=vno';

ii=vno(ones(n, 1), :); % ii=ones(n, 1)*(1:n);
jj=vnt(:, ones(n, 1)); % jj=(1:n)'*ones(1, n);
kk=(1:n:n*n)+(0:n-1);

dr=zeros(n, n, 3);
fr=zeros(n, n, 3);

a=zeros(n, 3);

for t=1:dT:T,

    % Find the displacement vector between all particles.

    dr(:)=R(jj, :)-R(ii, :);
    % dr is the n x n x 3 array of displacements.
    % Find the squared distance between all particles,
    % adjusting "self distances" to 1.

    r1=dr.*dr;
    r=r1(:, :, 1)+r1(:, :, 2)+r1(:, :, 3);
    r(kk)=1.0;
    % r is the n x n squared distances matrix.

    % Find the mass products of all particle pairs,
    % adjusting "self products" to 0.0.

    MM=m*m';
    MM(kk)=0.0;
    % MM is the n x n mass products matrix.

    % Find the gravitational force.

    f=G*(MM./r);
    % f is the n x n force matrix.

    % Find the unit direction vector.

    r=sqrt(r);
    dr(:, :, 1)=dr(:, :, 1)./r;
    dr(:, :, 2)=dr(:, :, 2)./r;
    dr(:, :, 3)=dr(:, :, 3)./r;

    % Find the resulting force.

    fr(:, :, 1)=f.*dr(:, :, 1);
    fr(:, :, 2)=f.*dr(:, :, 2);
    fr(:, :, 3)=f.*dr(:, :, 3);

    F(:)=mean(fr)*n;

    % Find the acceleration.

    a(:, 1)=F(:, 1)./m;
    a(:, 2)=F(:, 2)./m;
    a(:, 3)=F(:, 3)./m;

    % Find the velocity.

    V=V+a*dT;
    % V is the n x 3 matrix of velocities.

    % Find the radius vector.

    R=R+V*dT;
end;

end
