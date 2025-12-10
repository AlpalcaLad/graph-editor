if time_speed<1{
	draw_set_alpha((1-time_speed)/4)
	draw_set_color(c_blue)
	draw_rectangle(0,0,w,h,false)
	draw_set_color(c_white)
	draw_set_alpha(1)
}