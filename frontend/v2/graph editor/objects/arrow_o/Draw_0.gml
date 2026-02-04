
if placed == 1{
	draw_set_color(c_white)
	draw_line_width(from.x,from.y,mouse_x,mouse_y,4)
}
if placed == 2{
	draw_set_color(c_white)
	draw_line_width(fromX,fromY,toX,toY,2)
	var direct = point_direction(fromX,fromY,toX,toY)
	draw_triangle(toX+lengthdir_x(arrowHeadLength,direct),toY+lengthdir_y(arrowHeadLength,direct),toX-lengthdir_x(arrowHeadLength,direct-arrowHeadWidth),toY-lengthdir_y(arrowHeadLength,direct-arrowHeadWidth),toX-lengthdir_x(arrowHeadLength,direct+arrowHeadWidth),toY-lengthdir_y(arrowHeadLength,direct+arrowHeadWidth),false)
	var drawCol = draw_get_color()
	if drawCol == c_redish or drawCol == c_teal{
		var addToDraw = ""
		if !highlighted and drawCol == c_redish draw_set_color(c_dullred)
		if !highlighted and drawCol = c_teal {draw_set_color(c_dullteal)}
		draw_set_font(pixel)
		draw_roundrect_ext(mean(fromX,toX)-24-(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)-12,mean(fromX,toX)+18+(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)+12,8,8,false)
		draw_set_color(c_black)
		var offset = 0.5*clamp(string_width(containedText)-8,0,999)
		draw_text_transformed(mean(fromX,toX)-16-offset,mean(fromY,toY)-6,addToDraw+containedText+" <",1,1,0)
		draw_set_alpha(1)
	}
}
