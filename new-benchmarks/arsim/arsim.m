function [v]=arsim(w,A,R,n,ndisc)
%ARSIM	Simulation of AR process.
%
%  v=ARSIM(w,A,C,n) simulates n time steps of the AR(p) process
%
%     v(k,:)' = w' + A1*v(k-1,:)' +...+ Ap*v(k-p,:)' + eta(k,:)',
%
%  where A=[A1 ... Ap] is the coefficient matrix, and w is a vector of
%  intercept terms that is included to allow for a nonzero mean of the
%  process. The vectors eta(k,:) are independent Gaussian noise vectors
%  with mean zero and covariance matrix C.
%
%  The p vectors of initial values for the simulation are taken to be equal
%  to the mean value of the process. (The process mean is calculated from
%  the parameters A and w.) To avoid spin-up effects, the first 10^3 time
%  steps are discarded. Alternatively, ARSIM(w,A,C,n,ndisc) discards the
%  first ndisc time steps.

%  Modified 13-Oct-00 Author: Tapio Schneider
%          tapio@cims.nyu.edu

m=size(R,1);
% dimension of state vectors 
p=size(A,2)/m;
% order of process

wt=w';
% force w to be row vector wt

% Compute Cholesky factor of covariance matrix C
% R=chol(C);
% R is upper triangular

% Get ndisc+n independent Gaussian pseudo-random vectors with 
% covariance matrix C=R'*R
randvec=randn(ndisc+n,m)*R;

% Add intercept vector to random vectors
randvec=randvec+ones(ndisc+n,1)*wt;

% Get transpose of system matrix A (use transpose in simulation because 
% we want to obtain the states as row vectors)
AT=A';

% Take the p initial values of the simulation to equal the process mean, 
% which is calculated from the parameters A and wt
if any(wt)
    B=eye(m);
    for j=1:p
        B=B-A(:, (j-1)*m+1:j*m);
    end
    % Get mean value of process
    mval=wt/B';
    % The optimal forecast of the next state given the p previous
    % states is stored in the vector x. The vector x is initialized
    % with the process mean.
    x=ones(p,1)*mval;
else
    % Process has zero mean
    x=zeros(p,m);
end

% Initialize state vectors
u=[x; zeros(ndisc+n,m)];

% Simulate n+ndisc observations. In order to be able to make use of
% Matlab's vectorization capabilities, the cases p=1 and p>1 must be
% treated separately.
if p==1
    for k=2:ndisc+n+1;
        x(1,:)=u(k-1,:)*AT;
        u(k,:)=x(1, :)+randvec(k-1,:);
    end
else
    for k=p+1:ndisc+n+p;
        for j=1:p;
            x(j,:)=u(k-j,:)*AT((j-1)*m+1:j*m,:);
        end
        u(k,:)=sum(x)+randvec(k-p,:);
    end
end

% return only the last n simulated state vectors
v = u(ndisc+p+1:ndisc+n+p,:);

end
