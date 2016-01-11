function out=iterations(x,max)
  c=x;
  i=0;
  while(abs(x)<2 & i<max)
    x=x*x+c;
    i=i+1;
  end
  out=i;
end
