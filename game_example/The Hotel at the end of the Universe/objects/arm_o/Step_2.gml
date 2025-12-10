//aimMode=player_o.controlling
if aimMode{
	if shootkey[1] shooting = keyboard_check(shootkey[0])
	else shooting = mouse_check_button(shootkey[0])
	
	
	x=player_o.x-(drawXoff+drawRecoil/2)*dcos(player_o.drawAng)
	y=player_o.y+(drawXoff+drawRecoil/2)*dsin(player_o.drawAng)+3*(player_o.sliding)
	drawAng=blend_angles(drawAng,targAng,4*client_o.time_speed)

	if shooting{
		targAng=point_direction(x,y,mouse_x,mouse_y)
	}


	if recoil>0 recoil-=client_o.time_speed
	if recoil>10{
		recoil/=2
	}
	drawRecoil=lerp(drawRecoil,recoil/2 / (abs(player_o.flipping)+1),0.5*client_o.time_speed)

	if gun!=-1{
		with gun{
			x=other.x+(other.gunDrawDist-other.drawRecoil)*dcos(other.drawAng)
			y=other.y-(other.gunDrawDist-other.drawRecoil)*dsin(other.drawAng)
			drawAng=other.drawAng
		}
	}
}
else{
	drawAng=270+player_o.drawAng
	x=player_o.x-(drawXoff+drawRecoil/2+(player_o.image_xscale<0)-(drawXoff<0))*dcos(player_o.drawAng)
	y=player_o.y+(drawXoff+drawRecoil/2)*dsin(player_o.drawAng)
}