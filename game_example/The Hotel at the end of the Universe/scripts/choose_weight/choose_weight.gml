function choose_weight(arrayInput){ //in form item,weight,item,weight
	var i, sum, randNum;
	sum = 0
	for (i=1;i<array_length(arrayInput);i+=2){
		sum += arrayInput[i]
	}
	//sum += arrayInput[array_length(arrayInput)-1] <<<pretty sure this breaks it lol
	randNum = irandom(sum)
	for (i=1;i<array_length(arrayInput);i+=2){
		randNum-=arrayInput[i]
		if randNum<=0 return arrayInput[i-1]
	}
	return arrayInput[array_length(arrayInput)-2]
}