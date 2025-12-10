vsp+=grv

if vsp!=0 and place_meeting(x,y+vsp*client_o.time_speed,solidWall_o){
	while !place_meeting(x,y+sign(vsp),solidWall_o){
		y+=sign(vsp)
	}
	vsp=0
}

y+=vsp*client_o.time_speed
if place_meeting(x,y,solidWall_o){
	if vsp==0 vsp=1
	while place_meeting(x,y,solidWall_o){
		y-=sign(vsp)
	}
	vsp=0
}