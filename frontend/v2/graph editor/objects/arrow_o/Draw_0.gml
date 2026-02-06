
if placed == 1{
	draw_set_color(arrowColour)
	draw_line_width(from.x,from.y,mouse_x,mouse_y,4)
}
if placed == 2{
	draw_set_color(arrowColour)
	draw_line_width(fromX,fromY,toX,toY,2)
	var direct = point_direction(fromX,fromY,toX,toY)
	draw_triangle(toX+lengthdir_x(arrowHeadLength,direct),toY+lengthdir_y(arrowHeadLength,direct),toX-lengthdir_x(arrowHeadLength,direct-arrowHeadWidth),toY-lengthdir_y(arrowHeadLength,direct-arrowHeadWidth),toX-lengthdir_x(arrowHeadLength,direct+arrowHeadWidth),toY-lengthdir_y(arrowHeadLength,direct+arrowHeadWidth),false)
	
	//draw_set_font(pixel)
	//draw_roundrect_ext(mean(fromX,toX)-24-(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)-12,mean(fromX,toX)+18+(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)+12,8,8,false)
	//draw_set_color(c_black)
	//var offset = 0.5*clamp(string_width(containedText)-8,0,999)
	
	//draw_text_transformed(mean(fromX,toX)-16-offset,mean(fromY,toY)-6,addToDraw+containedText+" <",1,1,0)
	if highlighted{
		var lines = array_length(containedText)
		bbox = [mean(fromX,toX)-20-(0.5*clamp(string_width(longestLength),0,999)),mean(fromY,toY)-8-5*lines,mean(fromX,toX)+6+(0.5*clamp(string_width(longestLength),0,999)),mean(fromY,toY)+2+5*lines]
		draw_set_color(arrowBoxColour)
		draw_roundrect_ext(bbox[0],bbox[1],bbox[2],bbox[3],8,8,false)
	
		draw_set_font(pixel)
		draw_set_colour(textColour)
		var offset = 0.5*clamp(string_width(longestLength)-8,0,999)
		longestLength = 0
		for (var i=0; i<array_length(containedText); i++){
			if i==selectedIndex{
				drawAndHighlight(mean(fromX,toX)-16-offset,mean(fromY,toY)-6+i*10-5*lines,containedText[i],1,1,0," <")
				if string_length(containedText[i])>string_length(longestLength) longestLength=containedText[i]
			}
			else{
				drawAndHighlight(mean(fromX,toX)-16-offset,mean(fromY,toY)-6+i*10-5*lines,containedText[i],1,1,0)
				if string_length(containedText[i])>string_length(longestLength) longestLength=containedText[i]
			}
		}
	} else {
		draw_set_color(arrowBoxColour)
		draw_roundrect_ext(mean(fromX,toX)-10,mean(fromY,toY)-8,mean(fromX,toX)+10,mean(fromY,toY)+8,8,8,false)
		draw_set_color(textColour)
		draw_text_transformed(mean(fromX,toX)-3,mean(fromY,toY)-10,"...",1,1,0)
	}
	
	draw_set_alpha(1)
}
