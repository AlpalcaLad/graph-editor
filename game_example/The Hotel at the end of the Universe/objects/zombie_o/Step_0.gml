//r = keyboard_check(ord("D"))
//l = keyboard_check(ord("A"))
//u = keyboard_check(ord("W"))
var direcToPlayer = player_o.x-x
r=direcToPlayer>8 and (direcToPlayer<120 and (abs(player_o.y-y)<64 or r-l!=0) or hp!=hpMax)
l=direcToPlayer<-8 and (direcToPlayer>-120 and (abs(player_o.y-y)<64 or r-l!=0)or hp!=hpMax)
if (r-l)==0{
	r=wanderDirec>0
	l=wanderDirec<0
}
var lookahead=10
if r!=0 r*=position_meeting(x+lookahead,bbox_bottom+1,solidWall_o) or position_meeting(x+lookahead,bbox_bottom+17,solidWall_o) or position_meeting(x+lookahead,bbox_bottom+33,solidWall_o)
if l!=0 l*=position_meeting(x-lookahead,bbox_bottom+1,solidWall_o) or position_meeting(x-lookahead,bbox_bottom+17,solidWall_o) or position_meeting(x+lookahead,bbox_bottom+33,solidWall_o)

if player_o.cutscening{
	r=0
	l=0
}

var frict
if place_meeting(x,y+1,solidWall_o){
	onGround = true
	frict = frictGround
} else {
	onGround = false
	frict = frictAir
}
var onwall=false
var moveAm = (r-l)*walkspd*client_o.time_speed
hsp += moveAm
if (r-l)!=sign(hsp){
	hsp-= moveAm
	hsp+= moveAm/20
}
var grvTemp=grv
var vspMaxTemp=vspMax

vsp += grvTemp*client_o.time_speed*client_o.time_speed

if abs(hsp)<0.05*client_o.time_speed hsp=0

hsp /= power(frict,client_o.time_speed)
hsp=clamp(hsp,-hspMax,hspMax)
vsp=clamp(vsp,-vspMax,vspMaxTemp)

u=0
if place_meeting(x+hsp,y,solidWall_o){
	onwall=true
	u=1
}

if onGround and u{
	vsp=-jumpPower
	jumpAllowed=false
}
if !u jumpAllowed=true



//collision code

if hsp!=0 and place_meeting(x+hsp*client_o.time_speed,y,solidWall_o){
	while !place_meeting(x+sign(hsp),y,solidWall_o){
		x+=sign(hsp)
	}
	hsp=0
}
if vsp!=0 and place_meeting(x,y+vsp*client_o.time_speed,solidWall_o){
	if vsp>vspMax/2{
		for (var i=0;i<12;i++){
			var dust =instance_create_layer(random_range(bbox_left-3,bbox_right+3),bbox_bottom-random_range(-1,3),"particles",dust_o)
			dust.vspeed=random_range(-0.5,0)*client_o.time_speed
			dust.hspeed=random_range(-1,1)*client_o.time_speed
			dust.image_speed/=1.5
		}
	}
	while !place_meeting(x,y+sign(vsp),solidWall_o){
		y+=sign(vsp)
	}
	vsp=0
}
/*
if hsp!=0 and vsp!=0 and place_meeting(x+hsp,y+vsp,solidWall_o){
	var ang_vel=point_direction(0,0,hsp,vsp)
	var incr_x=dcos(ang_vel)
	var incr_y=dsin(ang_vel)
	while !place_meeting(x+incr_x,y+incr_y,solidWall_o){
		x+=incr_x
		y+=incr_y
	}
	hsp=0
	vsp=0
}
*/

x+=hsp*client_o.time_speed
if place_meeting(x,y,solidWall_o){
	if hsp==0 hsp=1
	while place_meeting(x,y,solidWall_o){
		x-=sign(hsp)
	}
	hsp=0
}

y+=vsp*client_o.time_speed
if place_meeting(x,y,solidWall_o){
	if vsp==0 vsp=1
	while place_meeting(x,y,solidWall_o){
		y-=sign(vsp)
	}
	vsp=0
}

if (r-l)!=0 image_xscale=sign(r-l)

//animations
if r-l != sign(hsp) and r-l != 0 and instance_number(dust_o)<8 and frict == frictGround{
	var dust=instance_create_layer(random_range(bbox_left,bbox_right),bbox_bottom,"particles",dust_o)
}
image_speed=0.5*client_o.time_speed

if onGround{
	if (hsp!=0 and (r-l)!=0) or abs(hsp)>0.5{
		image_speed=clamp(abs(hsp),0.5,1.5)*client_o.time_speed
		drawAng=blend_angles(drawAng,reformat_angle(-hsp*4),4*client_o.time_speed)
		stepCooldown-=1
		if stepCooldown<0{
			stepCooldown=stepCooldownMax*1.5/image_speed
			audio_play_sound(footstep_sound,1,false,0,0,random_range(0.5,1.5))
		}
	} else {
		if image_index<1 or image_index>image_number-1{
			image_speed=0
			image_index=0
		}
		drawAng=blend_angles(drawAng,0,4*client_o.time_speed)
	}
} else {
	image_speed=0
	image_index=0
}

hitTime=clamp(hitTime-1,-1,hitTimeMax)
if hitTime>0{
	image_blend=c_red
} else image_blend=c_white

if hp<0 instance_destroy()

if spawnPoof{
	spawnPoof=false
	for (var i=0; i<40; i++){
		var dust = instance_create_layer(irandom_range(bbox_left,bbox_right),irandom_range(bbox_top,bbox_bottom),"particles",dust_o)
		dust.hspeed=random_range(-0.5,0.5)
		dust.vspeed=random_range(-0.5,0.2)
	}
}