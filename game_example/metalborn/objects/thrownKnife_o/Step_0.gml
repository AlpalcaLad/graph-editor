if stuckIn!= noone && !instance_exists(stuckIn) stuckIn = noone

if !pickingUp{
	if stuckIn != noone{
		x = stuckIn.x + stuckIn.image_xscale * stuckOffsetX
		y = stuckIn.y + stuckOffsetY
		hspeed = 0
		vspeed = 0
	} else {
		if place_meeting(x+hspeed,y+vspeed,wall_virtual){
			while !place_meeting(x,y,wall_virtual){
				x+=lengthdir_x(sign(speed),direction)
				y+=lengthdir_y(sign(speed),direction)
			}
			x += 4 * lengthdir_x(sign(speed),direction)
			y += 4 * lengthdir_y(sign(speed),direction)
			hspeed = 0
			vspeed = 0
			moving=false
		} else {
			if !keyboard_check(vk_right){
				vspeed += 0.2
				hspeed /= 1.02
			} else {
				vspeed += 0.1
				hspeed /= 1.02
			}
		}
		if moving image_angle = direction
	}
}