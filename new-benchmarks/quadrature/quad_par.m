function q = quad_par( a,b,n )
    % quad parfor.m
    % This program is taken from John Burkardt and Gene Cliff's presentation
    % http://people.sc.fsu.edu/~jburkardt/presentations/matlab_parallel.pdf
    q= 0.0;
%parfor
		for i = 1:n
        ai = ((n-i+1)*a+(i-1)*b)/n;
        bi = ((n-i)*a+i*b)/n;
        xi = (ai+bi)/2.0;
        q = q + fval(xi);
    end

    q = q*(b-a)/n;
    return
end

function f = fval(x)
    f = (4*x+1)*(11-4*x)/8;
    return
end



