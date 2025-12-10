
var dist = distance_to_object(player_o)
if dist<playerFarRange{
	if dist<playerNearRange{
		direc = sign(x-player_o.x)
		image_xscale = sign(player_o.x-x)
	} else {
		direc = 0	
	}
} else {
	direc = 0
}

hsp/=frictGround

if direc != 0{
	hsp += walkSpd * direc
}

if !place_meeting(x+32*sign(hsp),y+5,wall_virtual){
	hsp -= walkSpd * direc //undo movement if a fall will happen
}

vsp += grv

if place_meeting(x+hsp,y,wall_virtual){
	if abs(hsp)>1{
		while !place_meeting(x+sign(hsp),y,wall_virtual){
			x += sign(hsp)
		}
	}
	hsp = 0
}

if place_meeting(x,y+vsp,wall_virtual){
	if abs(vsp)>1{
		while !place_meeting(x,y+sign(vsp),wall_virtual){
			y += sign(vsp)
		}
	}
	vsp = 0
}

if place_meeting(x+hsp,y+vsp,wall_virtual){
	moveDirec = point_direction(x,y,x+hsp,y+vsp)
	while !place_meeting(x+sign(hsp),y+sign(vsp),wall_virtual){
		x += lengthdir_x(1,moveDirec)
		y += lengthdir_y(1,moveDirec)
	}
	hsp = 0
	vsp = 0
}

x += hsp
y += vsp