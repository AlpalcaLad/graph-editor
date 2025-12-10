if idling idleTime-=1
if idleTime<0{
	idleTime=idleTimeMax
	idling=false
	sprite_index = choose_weight([oldManidle_s,4,oldManTalking_s,4,oldManDrinking_s,4])
	image_speed=1
	image_index=0
}


//dialogue
if !instance_exists(oldManDialogue_o){
	diaDl --
	if diaDl<0 and distance_rough(x,y,player_o)<48{
		indic.image_speed = -1.5
		if keyboard_check(vk_enter) or keyboard_check(vk_space){
			
			var dia = instance_create_layer(x,y,"textBits",oldManDialogue_o)
			indic.image_index = indic.image_number-1
			indic.image_speed = 0
			player_o.stayStill = true
			camera_o.follow = self
			dia.targettedObject = id
			diaDl = 60
		}
	}
	else indic.image_speed = 1.5
}
else{
	indic.image_index = indic.image_number-1
	indic.image_speed = 0
}