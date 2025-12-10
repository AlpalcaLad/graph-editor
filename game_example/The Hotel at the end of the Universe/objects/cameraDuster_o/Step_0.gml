if irandom(frequency)==1{
	instance_create_layer(
		irandom_range(camera_o.x-500,camera_o.x+500),
		irandom_range(camera_o.y-300,camera_o.y+300),
		"particles",
		cameraDust_o
	)
}