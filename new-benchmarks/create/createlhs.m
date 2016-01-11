function sum_criterion = createlhs(X)

%A. Define inputs
rows = size(X, 1);
vars = size(X, 2);
max_rows = rows*(rows-1)/2;

%pre-allocate matrices
sq_dev = zeros(max_rows,vars);
new_sq_dev = zeros(max_rows,1);
sum_sq_dev = zeros(1,max_rows); % must be set at zeros for calculations
sqrt_sum = zeros(1,max_rows);

% C. INITIAL EFFICIENCY CALCULATION (1 TIME ONLY)
r = 1;
for i = 1 : rows -1
  for j = i+1 : rows
   for c = 1 : vars
     sq_dev(r, c) = X(i,c) - X(j,c) ^2;
   end
  r = r +1;
  end
end

sum_criterion = 0;
for r = 1:max_rows
 for c = 1:vars
   sum_sq_dev(r) = sum_sq_dev(r) + sq_dev(r,c);
 end
 sqrt_sum(r) = 1/ sqrt(sum_sq_dev(r));
 sum_criterion = sum_criterion + sqrt_sum(r);
end

% D. OPTIMIZE X
maxloop = rows;
keeps_improving = true;
while keeps_improving 
  % before entering optimization-loop, set nimproved to zero
  keeps_improving = false;

  for loop = 1:maxloop 
       
       % D1. select rows to swap (lowest integer first)
       x = [0;0];
       while x(1) == x(2)
         x = randi(rows,2,1);
         if x(1)>x(2)
          temp = x(1);
          x(1)=x(2);
          x(2)=temp;  
         end 
       end

       % D2. select column to swap in
       y = randi(vars);
       
       % D3. copy columns and efficiency criterion
       new_sq_dev = sq_dev(:,y);
       new_sum_sq_dev = sum_sq_dev;
       new_sqrt_sum = sqrt_sum;
       new_sum_criterion = sum_criterion;
       
       % D4.A determine first set of row_nrs to swap
       sigma = (x(1)-1)*rows -(x(1)-1)*(x(1)/2);
       i = x(1);
       for j=i+1:rows
        if j ~= x(2)
         % step 1. calculate row_nr
         row_nr1 =sigma + j-i;
       	 if x(2) < j
       	  row_nr2 = (x(2)-1)*rows -(x(2)-1)*(x(2)/2) + j-x(2);
       	 else
       	  % swap j & i
       	  row_nr2 = (j-1)*rows -(j-1)*(j/2)+ x(2)-j;
       	 end
		 
		 
         % step 2. swap sq_dev elements
       	 temp = new_sq_dev(row_nr1);
         new_sq_dev(row_nr1) = new_sq_dev(row_nr2);
         new_sq_dev(row_nr2) = temp;
       	 % step 3. update sum_sq_dev
       	 new_sum_sq_dev(row_nr1) = new_sum_sq_dev(row_nr1) - sq_dev(row_nr1,y) + new_sq_dev(row_nr1);
       	 new_sum_sq_dev(row_nr2) = new_sum_sq_dev(row_nr2) - sq_dev(row_nr2,y) + new_sq_dev(row_nr2);
       	 % step 4. update sqrt_sum
       	 new_sqrt_sum(row_nr1) = 1/ sqrt(new_sum_sq_dev(row_nr1));
       	 new_sqrt_sum(row_nr2) = 1/ sqrt(new_sum_sq_dev(row_nr2));
       	 % step 5. update sum_criterion
       	 new_sum_criterion = new_sum_criterion - sqrt_sum(row_nr1) + new_sqrt_sum(row_nr1);
         new_sum_criterion = new_sum_criterion - sqrt_sum(row_nr2) + new_sqrt_sum(row_nr2); 
        end
       end
	   
       % D4.B determine second set of row_nrs to swap
       j=x(1);
       for i=1:j-1
         % step 1. calculate row_nr
         row_nr1 = (i-1)*rows -(i-1)*(i/2) + j-i;
       	 if x(2) >i
       	  row_nr2 = (i-1)*rows -(i-1)*(i/2) + x(2)-i;
       	 else
       	  % swap j & i
       	  row_nr2 = (x(2)-1)*rows -(x(2)-1)*(x(2)/2)+ i-x(2);
       	 end
		 
		 
         % step 2. swap sq_dev elements
       	 temp = new_sq_dev(row_nr1);
         new_sq_dev(row_nr1) = new_sq_dev(row_nr2);
         new_sq_dev(row_nr2) = temp;
       	 % step 3. update sum_sq_dev
       	 new_sum_sq_dev(row_nr1) = new_sum_sq_dev(row_nr1) - sq_dev(row_nr1,y) + new_sq_dev(row_nr1);
       	 new_sum_sq_dev(row_nr2) = new_sum_sq_dev(row_nr2) - sq_dev(row_nr2,y) + new_sq_dev(row_nr2);
       	 % step 4. update sqrt_sum
       	 new_sqrt_sum(row_nr1) = 1/ sqrt(new_sum_sq_dev(row_nr1));
       	 new_sqrt_sum(row_nr2) = 1/ sqrt(new_sum_sq_dev(row_nr2));
       	 % step 5. update sum_criterion
       	 new_sum_criterion = new_sum_criterion - sqrt_sum(row_nr1) + new_sqrt_sum(row_nr1);
         new_sum_criterion = new_sum_criterion - sqrt_sum(row_nr2) + new_sqrt_sum(row_nr2);
       end
       
       % D5. update X if new_criterion < criterion
       if new_sum_criterion < sum_criterion 
        keeps_improving = true;
        % store adjustment in matrix X
        temp = X(x(1),y);
        X(x(1),y)=X(x(2),y);
        X(x(2),y)=temp;
       % update columns
        sq_dev(:,y) = new_sq_dev;
        sum_sq_dev = new_sum_sq_dev;
        sqrt_sum = new_sqrt_sum;
        sum_criterion = new_sum_criterion;
       end 
  end 

  %re-calculate criterion (to avoid compounded imprecission)
  sum_criterion = 0;

  for r = 1:max_rows
   sqrt_sum(r) = 1/ sqrt(sum_sq_dev(r));
   sum_criterion = sum_criterion + sqrt_sum(r);
  end

end
end
