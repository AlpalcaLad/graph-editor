function array_find(arrayIn,value){
	var flag = is_array(value)
	if flag{ //needs to use array_equals not a normal comparison
		for (var j=0; j<array_length(arrayIn); j++){
			if array_equals(arrayIn[j],value) return j
		}
	} else {
		for (var j=0; j<array_length(arrayIn); j++){
			if (arrayIn[j]==value) return j
		}
	} 
	return -1
}