/*
This code will clamp the camera to within the view:

xTo = clamp(xTo,-room_width+edgeBorder*zoom,2*room_width-edgeBorder*zoom)
yTo = clamp(yTo,-room_height+edgeBorder*zoom,2*room_height-edgeBorder*zoom)
*/
if !freeZoom zoom = max(zoom,0.15)
if abs(targetZoom-zoom)>0.02 zoom += (targetZoom-zoom)/5

if (follow != noone)
{
	xTo = follow.x
	yTo = follow.y
}
if aimMoveScale!=-1{
	xTo+=(mouse_x-x)/aimMoveScale
	yTo+=(mouse_y-y)/aimMoveScale
}
if targetMoveAheadScale!=-1 and follow==player_o{
	xTo+=follow.hsp*targetMoveAheadScale
}

if screenShake>0{
	screenShake-=client_o.time_speed
	if screenShake==screenShakeMax{
		screenShakeOffset1=random.randrange(-3,3)
        screenShakeOffset2=random.randrange(-3,3)
	}
	x += client_o.time_speed*(screenShakeIntensity*screenShake)*cos((screenShake+screenShakeOffset1)/screenShakeMult)
	y += client_o.time_speed*(screenShakeIntensity*screenShake)*sin((screenShake+screenShakeOffset1)/screenShakeMult)
	//xTo+=cos(screenShake*random_range(0,5))*random_range(0,5)*screenShake
	//yTo+=sin(screenShake*random_range(0,5))*random_range(0,5)*screenShake
}

xTo = clamp(xTo,525*zoom/2,room_width-525*zoom/2)
yTo = clamp(yTo,288*zoom/2,room_height-288*zoom/2)
x = clamp(x,525*zoom/2,room_width-525*zoom/2)
y = clamp(y,288*zoom/2,room_height-288*zoom/2)

hsp = (xTo - x )/25
vsp = (yTo - y )/25
/* THIS CAN HANDLE WALLS THAT STOP THE CAMERA MOVING
if client_o.blockCamera{
	with cameraBlock_o{
		if distance_rough(x,y,other)<400{
			with other{
				/
				if place_meeting(x+hsp,y,other) and ((rightPlayer and xTo>other.x+sign(x-other.x)*abs(bbox_right-bbox_left)/2) or (!rightPlayer and xTo<other.x+sign(x-other.x)*abs(bbox_right-bbox_left)/2)){
					var tempxTo=other.x-sign(x-other.x)*abs(bbox_right-bbox_left)/2
					hsp = (tempxTo - x )/25
				}
				/
				if place_meeting(x,y+vsp,other) and ((other.abovePlayer and yTo>other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2) or (!other.abovePlayer and yTo<other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2)){
					var tempyTo=other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2
					vsp = (tempyTo - y )/25
				}
			
			}
		}
	}
	with cameraBlockH_o{
		if distance_rough(x,y,other)<400{
			with other{
			
				if place_meeting(x+hsp,y,other) and ( (!other.rightPlayer and xTo<other.x+abs(bbox_right-bbox_left)/2)){
					var tempxTo=other.x-(other.rightPlayer*2-1)*abs(bbox_right-bbox_left)/2
					hsp = (tempxTo - x )/25
				}
				else{
					if place_meeting(x+hsp,y,other) and ( (other.rightPlayer and xTo>other.x-abs(bbox_right-bbox_left)/2)){
						var tempxTo=other.x-(other.rightPlayer*2-1)*abs(bbox_right-bbox_left)/2
						hsp = (tempxTo - x )/25
					}
				}
			
				/
				if place_meeting(x,y+vsp,other) and ((abovePlayer and yTo<other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2) or (!abovePlayer and yTo>other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2)){
					var tempyTo=other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2
					vsp = (tempyTo - y )/25
				}
				/
			}
		}
	}
}
*/


//moving the camera
x += (hsp)
y += (vsp)

//update camera perspective
var vm = matrix_build_lookat(x,y,-10,x,y,0,0,1,0)
var pm = matrix_build_projection_ortho(525 *zoom,288*zoom,1,10000)
camera_set_view_mat(camera,vm)
camera_set_proj_mat(camera,pm)
