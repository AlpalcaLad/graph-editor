x = mouse_x+8
y = mouse_y+8

if mouse_check_button(mb_right) instance_destroy()
if mouse_check_button(mb_left){
	with box_o{
		if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]) instance_destroy()
	}
	with redBox_o{
		if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]) instance_destroy()
	}
	with finishBox_o{
		if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]) instance_destroy()
	}
	with emptyBox_o{
		if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]) instance_destroy()
	}
	with checkBox_o{
		if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]) instance_destroy()
	}
	with arrow_o{
		if (point_in_rectangle(mouse_x,mouse_y,mean(fromX,toX)-24-(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)-12,mean(fromX,toX)+18+(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)+12)) instance_destroy()
		if collision_line(fromX,fromY,toX,toY,other,false,true) instance_destroy()
	}
}