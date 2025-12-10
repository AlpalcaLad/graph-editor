for (var i=0; i<array_length(created); i++){
	if !instance_exists(created[i]) array_delete(created,i,1)
}
alarm[0]=4