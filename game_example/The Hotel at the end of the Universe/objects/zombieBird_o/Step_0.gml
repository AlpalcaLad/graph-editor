switch aiMode{
	case 0: //idle
	if place_meeting(x,y,solidWall_o){
		y--;
	}
	sprite_index=weirdBird_s
	direction=0
	image_angle=0
	grv=0.01
	vsp += grv
	if y-0.1>targY or abs(x-targX)>0.1{
		image_speed=2
	}
	if round(image_index)==2 or vsp<0 or hsp!=0{
		vsp=clamp(targY-y,-2,2)
		hsp=clamp(targX-x,-2,2)
		if abs(hsp)>0.1 image_xscale=sign(hsp)
	}
	hsp /= frict
	if abs(frict)<0.025 hsp=0
	if abs(y-targY)<1 and abs(x-targX)<1 and distance_rough(x,y,player_o)<128+256*(hp!=hpMax){
		anger+=1
	} else anger = clamp(anger-1,-1,99)
	if anger>angerThreshold{
		anger=0
		aiMode=1
		vel=-0.1
		direction=point_direction(x,y,player_o.x,player_o.y)
	}
	
	break;
	case 1: //flying
		if vel<4 and abs(x-player_o.x)<64+256*(hp!=hpMax){
			image_xscale=1
			sprite_index=weirdBirdDive_s
			image_speed=3
			//var nextDir = point_direction(x,y,player_o.x,player_o.y)
			//if angle_difference(direction,nextDir)<45{
			//	direction=blend_angles(direction,nextDir,20)
			//}
			image_angle=direction+45
			vel+=0.1
			hsp = lengthdir_x(vel,direction)
			vsp = lengthdir_y(vel,direction)
		}
		else{
			if abs(vel)<0.1{
				aiMode=0
				vsp=0
				hsp=0
			} else {
				sprite_index=weirdBird_s
				image_speed=2
				direction=0
				image_angle=0
				vel/=1.5
				hsp = lengthdir_x(vel,direction)
				vsp = lengthdir_y(vel,direction)
			}
		}
	
	break;
	case 2: //dead
	image_blend=c_grey
	grv=0.2
	vsp += grv
	hsp/=frict
	if abs(hsp)<0.1 hsp=0
	image_index=0
	sprite_index=weirdBirdDive_s
	
	break;
	default:
	
	break;
}


//collision code

if hsp!=0 and place_meeting(x+hsp*client_o.time_speed,y,solidWall_o){
	while !place_meeting(x+sign(hsp),y,solidWall_o){
		x+=sign(hsp)
	}
	hsp=0
	if aiMode==1{
		aiMode=0
		vsp=0
	}
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
	if aiMode==1{
		aiMode=0
		hsp=0
	}
}

x+=hsp*client_o.time_speed

y+=vsp*client_o.time_speed


hitTime=clamp(hitTime-1,-1,hitTimeMax)
if hitTime>0{
	if aiMode==0 anger+=5
	image_blend=c_red
} else image_blend=c_white

if hp<0 instance_destroy()