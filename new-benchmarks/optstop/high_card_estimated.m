function p = high_card_estimated(n,k,t)    
h =0;    
for j = 1:t
    cards = myrandperm(n);
    margin = max (cards(1:k-1));
    for i = k:n
        if (margin < cards(i))
            if (cards(i) ==n)
                h = h+1;
            end
            break;
        end
    end
end
p = h/t;
end




