if createDl>-1 createDl--
if active and createDl<0 and array_length(created)<maxEnemies and point_distance(x,y,player_o.x,player_o.y)<500{
	createDl=spawnDelay
	var newCreature = spawn_in_area(x,y,monster,48,6)
	if newCreature!=noone{
		newCreature.spawnPoof=true
		array_push(created,newCreature)
	}
}
if position_meeting(x,y-16,player_o) and active{
	active=false
	sprite_index=monsterSpawnerDestroyed_s
	player_o.cutscening=true
	player_o.controlling=false
	player_o.hsp=0
	player_o.vsp=0
	player_o.sprite_index=playerDestroySpawnerTop_s
	camera_o.follow=self
	camera_o.targetZoom=0.4
}
if sprite_index==monsterSpawnerDestroyed_s and image_speed!=0{
	var dust=instance_create_layer(irandom_range(bbox_left,bbox_right),bbox_bottom,"particles",dust_o)
	dust.hspeed=random_range(-0.4,0.4)
	dust.vspeed=random_range(-0.3,-0.1)
}