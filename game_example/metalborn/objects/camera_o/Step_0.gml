if (follow != noone)
{
	xTo = follow.x
	yTo = follow.y
}
hsp = (xTo - x )/25
vsp = (yTo - y )/25

if client_o.blockCamera{
	with cameraBlock_o{
		if distance_rough(x,y,other)<400{
			with other{
				/*
				if place_meeting(x+hsp,y,other) and ((rightPlayer and xTo>other.x+sign(x-other.x)*abs(bbox_right-bbox_left)/2) or (!rightPlayer and xTo<other.x+sign(x-other.x)*abs(bbox_right-bbox_left)/2)){
					var tempxTo=other.x-sign(x-other.x)*abs(bbox_right-bbox_left)/2
					hsp = (tempxTo - x )/25
				}
				*/
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
			
				/*
				if place_meeting(x,y+vsp,other) and ((abovePlayer and yTo<other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2) or (!abovePlayer and yTo>other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2)){
					var tempyTo=other.y+sign(y-other.y)*abs(bbox_bottom-bbox_top)/2
					vsp = (tempyTo - y )/25
				}
				*/
			}
		}
	}
}

if player_o.devMode{
	if mouse_wheel_up() zoom -= 0.1
	if mouse_wheel_down() zoom += 0.1
	if mouse_check_button(mb_middle) zoom = 1
}

x += hsp
y += vsp


var vm = matrix_build_lookat(x,y,-10,x,y,0,0,1,0)
var pm = matrix_build_projection_ortho(525 *zoom,288*zoom,1,10000)


camera_set_view_mat(camera,vm)

camera_set_proj_mat(camera,pm)
