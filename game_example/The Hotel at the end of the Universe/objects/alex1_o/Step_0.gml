idleDl --
if idleDl<0 {idleDl = 350+irandom(400); image_speed = 1; image_index = 0; sprite_index = idleSprites[irandom(array_length(idleSprites)-1)]}
depth = player_o.depth-1 + 2*(player_o.bbox_bottom>bbox_bottom)

if !instance_exists(alex1Dialogue_o) and !player_o.stayStill{
	diaDl --
	if diaDl<0 and distance_rough(x,y,player_o)<48{
		indic.image_speed = -1.5
		if keyboard_check(vk_enter) or keyboard_check(vk_space){
			
			var dia = instance_create_layer(x,y,"textBits",alex1Dialogue_o)
			indic.image_index = indic.image_number-1
			indic.image_speed = 0
			player_o.stayStill = true
			camera_o.follow = self
			dia.targettedObject = self
			diaDl = 60
			if spoken >= 1 alex1Dialogue_o.currentIndex = 10
			spoken++
		}
	}
	else indic.image_speed = 1.5
}
else{
	indic.image_index = indic.image_number-1
	indic.image_speed = 0
}