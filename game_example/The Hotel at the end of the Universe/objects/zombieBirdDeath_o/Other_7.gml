for (var i=0; i<40; i++){
	var dust = instance_create_layer(irandom_range(bbox_left,bbox_right),irandom_range(bbox_top,bbox_bottom),"particles",dust_o)
	dust.hspeed=random_range(-0.5,0.5)
	dust.vspeed=random_range(-0.5,0.2)
}
instance_destroy()