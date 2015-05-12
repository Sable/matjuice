function drv_bubble(ignored)
  size = 10000;
  A = rand(1, size);
  y = bubble(A);

  ok = 1;
  for i = 1:size-1
    if y(i) > y(i+1)
      ok = 0;
    end
  end
  disp(ok);
end
