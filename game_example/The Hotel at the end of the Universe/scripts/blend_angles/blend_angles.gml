
function blend_angles(ang1,ang2,value){ //in degrees please
	//safety for tiny values
	if value<0.5 value=0.5
	var angDif = min(abs(ang2-ang1),abs((min(ang2,ang1)+360)-max(ang2,ang1)))
	if abs(ang2-ang1)>180{
        if ang1<abs(ang1-360){
            return reformat_angle(ang1-angDif/value)
		}
        else{
            return reformat_angle(ang1+angDif/value)
		}
	}
    else{
        if ang1<ang2{
            return reformat_angle(ang1+angDif/value)
		}
        else{
            return reformat_angle(ang1-angDif/value)
		}
	}
}