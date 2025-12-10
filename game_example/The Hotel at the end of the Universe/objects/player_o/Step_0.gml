if rKey[1] r = keyboard_check(rKey[0])
else r = mouse_check_button(rKey[0])

if lKey[1] l = keyboard_check(lKey[0])
else l = mouse_check_button(lKey[0])

if uKey[1] u = keyboard_check(uKey[0])
else u = mouse_check_button(uKey[0])

if dKey[1] d = keyboard_check(dKey[0])
else d = mouse_check_button(dKey[0])
/*
l = keyboard_check(lKey[0])
u = keyboard_check(uKey[0])
d = keyboard_check(dKey[0])
*/


var frict
if place_meeting(x,y+1,solidWall_o){
	onGround = true
	frict = frictGround
	if groundControlReset>0 and !controlling and !cutscening{
		groundControlReset-=client_o.time_speed
		if groundControlReset==0{
			arm1.aimMode=true
			arm2.aimMode=true
			controlling=true
			image_angle=0
			while place_meeting(x,y,solidWall_o) y-=1
		}
	}
} else {
	onGround = false
	frict = frictAir
}
var onwall=false
if place_meeting(x+1,y,solidWall_o) or place_meeting(x-1,y,solidWall_o){
	onwall=true
}
if !d slideAllowed=true
if d and onGround and abs(hsp)>1 and (sliding or slideAllowed){
	if !sliding{
		hsp *= 1.5
		var vspContrib = (abs(vsp)*sign(hsp))
		if abs(vspContrib)>1 vspContrib=sign(vspContrib)
		hsp += vspContrib
	}
	sliding=true
	frict=frictSlide
	slideAllowed=false
	slideTime+=1
	if slideTime>slideTimeMax{
		sliding=false
		slideTime+=20
	}
} else {
	slideTime=clamp(slideTime-1,-1,slideTimeMax)
	if sliding and !place_meeting(x-3,y,solidWall_o) and (abs(hsp)<0.1 or (abs(hsp)<1 and !d)){
		sliding=false
	}
}

if controlling and !sliding hsp += (r-l)*walkspd*client_o.time_speed
var grvTemp=grv
var vspMaxTemp=vspMax
if !onGround and !u and vsp<0 grvTemp*=2
if onwall{
	//grvTemp/=1.5
	//vspMaxTemp/=8
}
//debug controls
if devMode{
	if u vsp=-2
	if d{
		grvTemp=0
		vsp=0
	}
}
vsp += grvTemp*client_o.time_speed*client_o.time_speed

if abs(hsp)<0.05*client_o.time_speed hsp=0

hsp /= power(frict,client_o.time_speed)
hsp=clamp(hsp,-hspMax,hspMax)
vsp=clamp(vsp,-vspMax,vspMaxTemp)


if onGround{
	jumps=jumpsMax
	flipping=false
}
if controlling and (onGround or place_meeting(x,y,ladder_o)) and u{
	vsp=-jumpPower
	jumpAllowed=false
}
if !u jumpAllowed=true
if controlling and jumps>0 and !onGround and jumpAllowed and u and !onwall{
	vsp=-jumpPower/doubleJumpWeakening
	jumps-=1
	jumpAllowed=false
	flipping=sign(hsp)
	if flipping==0 flipping=image_xscale
	for (var i=0;i<4;i++){
		instance_create_layer(random_range(bbox_left,bbox_right),bbox_bottom,"particles",dust_o).vspeed*=-1
	}
}


//collision code
if hsp!=0 and place_meeting(x+hsp*client_o.time_speed,y,solidWall_o){
	while !place_meeting(x+sign(hsp),y,solidWall_o){
		x+=sign(hsp)
	}
	hsp=0
	sliding=false
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

if hsp!=0 image_xscale=sign(hsp)

if controlling{
//animations
if r-l != sign(hsp) and r-l != 0 and instance_number(dust_o)<8 and frict == frictGround{
	var dust=instance_create_layer(random_range(bbox_left,bbox_right),bbox_bottom,"particles",dust_o)
}
image_speed=0.5*client_o.time_speed

if onGround{
	if (hsp!=0 and (r-l)!=0) or abs(hsp)>0.5{
		if sprite_index!=playerWalk_s stepCooldown=stepCooldownMax	
		sprite_index=playerWalk_s
		image_speed=clamp(abs(hsp),0.5,1.5)*client_o.time_speed
		drawAng=blend_angles(drawAng,reformat_angle(-hsp*4),4*client_o.time_speed)
		stepCooldown-=1
		if stepCooldown<0{
			stepCooldown=stepCooldownMax*1.5/image_speed
			audio_play_sound(footstep_sound,1,false,0.3,0,random_range(0.5,1.5)*client_o.time_speed)
		}
	} else {
		if image_index<1 or image_index>image_number-1{
			if sprite_index!=playerIdle_s image_index=0
			sprite_index=playerIdle_s
		}
		drawAng=blend_angles(drawAng,0,4*client_o.time_speed)
	}
} else {
	if vsp<0{
		sprite_index=playerJump_s	
	}
	else{
		sprite_index=playerFall_s
	}
	if flipping!=0{
		drawAng=blend_angles(drawAng,reformat_angle((drawAng-flipping*15*client_o.time_speed)),2/client_o.time_speed)
		with arm1{
			//targAng=blend_angles(targAng,reformat_angle((targAng-other.flipping*15)),2)
			targAng=blend_angles(targAng,reformat_angle(other.drawAng),2/client_o.time_speed)
		}
		with arm2{
			//targAng=blend_angles(targAng,reformat_angle((targAng-other.flipping*15)),2)
			targAng=blend_angles(targAng,reformat_angle(other.drawAng+180),2/client_o.time_speed)
		}
	}
}
}
if sliding {
	sprite_index=playerSlide_s
	slideDustDl-=client_o.time_speed
	if slideDustDl<=0{
		slideDustDl=slideDustDlMax
		for (var i=0; i<floor(abs(hsp)); i++){
			var dust=instance_create_layer(random_range(bbox_left,bbox_right),bbox_bottom,"particles",dust_o)
			dust.hspeed=abs(dust.hspeed)*-sign(hsp)
			dust.vspeed*=1.5
		}
	}
	
}
shootingNumber=0
with pistol_o{
	if shootDl>0 other.shootingNumber+=1
	if shootDl>0 and other.sprite_index==playerIdle_s{
		other.image_index=0
		other.image_speed=0
	}
}
if !controlling{
	if !cutscening{
		image_index=0
		image_speed=0
	} else {
		image_speed=1.5
		drawAng=blend_angles(drawAng,0,2*client_o.time_speed)
	}
}

//time slow mechanics
if timeSlowEnabled{
	if keyboard_check(vk_shift) client_o.time_speed_targ=0.4
	else{
		client_o.time_speed_targ=1
		//instance_destroy(playerAfterEffect_o)
	}
	if client_o.time_speed<1{
		client_o.afterImageDl-=1
		if client_o.afterImageDl<0{
			client_o.afterImageDl=client_o.afterImageFreq
			var effect = instance_create_layer(x,y,"backEffects",playerAfterEffect_o)
			effect.spritesToDraw=[ //[spr,subimage,x,y,xScale,yScale,rot]
				[sprite_index,image_index,x,y,image_xscale,image_yscale,drawAng],
				[arm1.sprite_index,arm1.image_index,arm1.x,arm1.y,arm1.image_xscale,arm1.image_yscale,arm1.drawAng],
				[arm2.sprite_index,arm2.image_index,arm2.x,arm2.y,arm2.image_xscale,arm2.image_yscale,arm2.drawAng],
				[arm1.gun.sprite_index,arm1.gun.image_index,arm1.gun.x,arm1.gun.y,arm1.gun.image_xscale,arm1.gun.image_yscale,arm1.gun.drawAng],
				[arm2.gun.sprite_index,arm2.gun.image_index,arm2.gun.x,arm2.gun.y,arm2.gun.image_xscale,arm2.gun.image_yscale,arm2.gun.drawAng],
			]
		}
	}
}
if cutscening invulnFrames=15
if invulnFrames>0 invulnFrames-=client_o.time_speed;
if invulnFrames<0 invulnFrames+=client_o.time_speed;
if hitTime>0{
	hitTime-=client_o.time_speed
	image_blend=c_red
	arm1.image_blend=c_red
	arm2.image_blend=c_red
} else {
	image_blend=c_white
	arm1.image_blend=c_white
	arm2.image_blend=c_white
}
if place_meeting(x,y,enemy_o){
	invulnFrames-=2*client_o.time_speed
	if invulnFrames<-10 and !sliding{
		hitTime+=15
		invulnFrames+=30
		var dustNum=60
		for (var i=1; i<dustNum; i++){
			var dust = instance_create_layer(x,y,"particles",dust_o)
			dust.direction=i*(360/dustNum)+random_range(-15,15)
			dust.speed=4+random_range(-1,1)
			dust.image_alpha=0.4
			dust.image_speed=1.5*client_o.time_speed
			dust.image_xscale=random_range(1,3)
			dust.image_yscale=dust.image_xscale
		}
		with enemy_o{
			var playerAng = point_direction(x,y,player_o.x,player_o.y)//blend_angles(point_direction(x,y,player_o.x,player_o.y),90,8)
			var playerDist = point_distance(x,y,player_o.x,player_o.y)
			var thrustPower=-25*(1/sqrt(clamp(playerDist,1,16)))
			hsp=thrustPower*dcos(playerAng)
			vsp=thrustPower*dsin(playerAng)
		}
		hp-=1
		if hp<0 room_restart()
	}
}