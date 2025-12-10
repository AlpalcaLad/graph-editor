var u = keyboard_check(ord("W")) || keyboard_check(vk_up)
var r = keyboard_check(ord("D")) || keyboard_check(vk_right)
var l = keyboard_check(ord("A")) || keyboard_check(vk_left)
var d = keyboard_check(ord("S")) || keyboard_check(vk_down)

hsp += (r-l)*walkSpd
vsp += grv

if place_meeting(x,y+1,wall_virtual){
	onGround = true
	hsp /= frictGround
	if abs(hsp)<0.1 hsp = 0
} else {
	onGround = false
	hsp /= frictAir
	if abs(hsp)<0.1 hsp = 0
}

if u && onGround{
	vsp -= jumpPower
}

//metal pushing
if mouse_check_button(mb_left){
	if place_meeting(mouse_x,mouse_y,wall_pushable){
		var collider = instance_place(mouse_x,mouse_y,wall_pushable)
		var pushAngle = point_direction(mouse_x,mouse_y,x,y)
		var pushForce = collider.amplification/power(E,0.05*point_distance(mouse_x,mouse_y,x,y)) //reduces over distance but at a diminishing rate
		if abs(hsp)<collider.amplification{
			if !onGround hsp+=lengthdir_x(pushForce,pushAngle)
			else hsp+=lengthdir_x(pushForce,pushAngle)/frictGround
		}
		if abs(vsp)<collider.amplification{
			vsp+=lengthdir_y(pushForce,pushAngle)
		}
	}
}

if knifeThrowDl>0 knifeThrowDl--;
if knives>0 && knifeThrowDl<=0 && mouse_check_button_pressed(mb_right){
	knifeThrowDl=knifeThrowDlMax
	knives--
	var knife = instance_create_layer(x,y,layer,thrownKnife_o)
	var throwAngle = point_direction(x,y,mouse_x,mouse_y)
	var throwForce = knifeThrowForce
	knife.direction = throwAngle
	knife.speed = throwForce
	audio_play_sound(throw_snd,1,false,random_range(0.8,1.2),0.1,random_range(0.8,1.2))
}
with thrownKnife_o{
	if !moving && distance_to_object(other)<other.pickupRange{
		direction = point_direction(x,y,other.x,other.y)
		speed = 4
		pickingUp=true
		if place_meeting(x,y,other){
			instance_destroy()
			other.knives++	
		}
	}
}

if place_meeting(x+hsp,y,wall_virtual){
	while !place_meeting(x+sign(hsp),y,wall_virtual){
		x += sign(hsp)
	}
	hsp = 0
}

if place_meeting(x,y+vsp,wall_virtual){
	while !place_meeting(x,y+sign(vsp),wall_virtual){
		y += sign(vsp)
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

// animation
if hsp!=0{
	image_xscale = sign(hsp)
	walkTime ++
	if (abs(hsp)>0.3) drawAng = blend_angles(drawAng,reformat_angle(walkAnimationSize*sin(walkTime*walkAnimationSpeed)),4)
	else drawAng = blend_angles(drawAng,0,4)
	
	if onGround{
		footstepDelay--
		if footstepDelay<0{
			footstepDelay=max(15-hsp,5)
			audio_play_sound(footstep_snd,1,false,1,0,random_range(0.8,1.2))
		}
	}
} else {
	walkTime = 0
	drawAng = blend_angles(drawAng,0,4)
}
if keyboard_check(ord("Q")){
	if !quackCooldown{
		audio_play_sound(quack_snd,1,false)
		quacking = true
		quackTime = 0
	}
	quackCooldown = true
	
	if quacking{
		quackTime ++ 
		if quackTime>=quackTimeMax quacking = false
		sprite_index = playerQuack_s
	} else {
		sprite_index = playerIdle_s	
	}
} else {
	sprite_index = playerIdle_s
	quackCooldown = false
}