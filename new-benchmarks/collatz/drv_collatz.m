function drv_collatz(scale)
    max_length = 0;
    max_num = 0;
    for i = 1:scale
        length = collatz(i);
        if length > max_length
            max_length = length;
            max_num = i;
        end
    end
end
