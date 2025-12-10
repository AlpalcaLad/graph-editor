if distance_rough(x,y,player_o)>1024 instance_destroy()
speed = speedIn*sqrt(client_o.time_speed)*player_o.bulletSpeedFact

if player_o.weaponHoming!=0 and instance_exists(enemy_o){
	var en=instance_nearest(x,y,enemy_o)
	direction += player_o.weaponHoming * sign( angle_difference( point_direction(x,y,en.x, en.y), direction));	
	/*
	var effect= instance_create_layer(x,y,layer,generalisedAfterEffect_o)
	effect.spritesToDraw=[
		[sprite_index,image_index,x,y,image_xscale,image_yscale,0],
	]
	effect.falloffSpeed=25
	*/
}