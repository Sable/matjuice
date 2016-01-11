function drv_lgdr(scale)
%DRV_PN_LEGENDRE_VECTN Summary of this function goes here
%   Detailed explanation goes here

x=[0 0.3 0.9 0.7 0.5];
n=5;
for i=1:scale
    PNa=PN_Legendre_vectN(x, n);
    PNxa=PNx_Legendre_vectN(x, n);
    PNxxa=PNxx_Legendre_vectN(x, n);
end

end
