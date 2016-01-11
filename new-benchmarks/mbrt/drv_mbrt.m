function drv_mbrt(scale)

% computes mandelbrot set

N=round(6000*sqrt(scale));
Nmax=round(10^3*sqrt(scale));

set=mandelbrot(N, Nmax);

end

