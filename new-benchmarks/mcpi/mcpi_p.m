function result = mcpi_p(N,P)
    result=0;
    %!parfor
    for (temp=1:P)
        myRes=0;
        for temp2 = 1:(N/P)
            x= rand(1);
            y= rand(1);
            if ((x*x + y*y )<=1)
                myRes=myRes+1;
            end
        end
        result=result+myRes;
    end
    result = result / N * 4;
end
