draw_set_font(pixel)
image_alpha = 0.5+0.25*(placed)+0.25*highlighted
draw_set_alpha(image_alpha)
bbox = [x-50,y-20,x+50+clamp(string_width(longestLength)-80,0,999),y+(string_height(longestLength)-4)*array_length(containedText)-4]

draw_set_color(c_white)
draw_roundrect(x-50,y-20,x+50+clamp(string_width(longestLength)-80,0,999),y+(string_height(longestLength)-4)*array_length(containedText)-4,false)
draw_set_alpha(1)

draw_set_color(c_black)
draw_set_font(spartan)
draw_text_transformed(x-48,y-18,index,0.075,0.075,0)

draw_set_font(pixel)
longestLength = 0
for (var i=0; i<array_length(containedText); i++){
	/*
	if i != array_length(containedText)-1{
		draw_text_transformed(x-45,y-12+i*10,containedText[i],1,1,0)
		if string_length(containedText[i])>string_length(longestLength) longestLength=containedText[i]
	}
	else{
		draw_text_transformed(x-45,y-12+i*10,containedText[i] + " <",1,1,0)
		if string_length(containedText[i])>string_length(longestLength) longestLength=containedText[i]
	}
	*/
	if i==selectedIndex{
		if string_count(":",containedText[i])==1{
			var slicedString = string_split(containedText[i],":")
			var secondCol = c_red
			if slicedString[1]=="false" or slicedString[1]=="true" secondCol=c_orange
			else if isNumeric(slicedString[1]) secondCol=c_green
			drawTextColoured(x-45,y-12+i*10,[[slicedString[0],c_teal],[":",c_black],[slicedString[1],secondCol],[" <",c_black]],1,1,0)
		} else draw_text_transformed(x-45,y-12+i*10,containedText[i]+" <",1,1,0)
		if string_length(containedText[i])>string_length(longestLength) longestLength=containedText[i]
	}
	else{
		if string_count(":",containedText[i])==1{
			var slicedString = string_split(containedText[i],":")
			var secondCol = c_red
			if slicedString[1]=="false" or slicedString[1]=="true" secondCol=c_orange
			else if isNumeric(slicedString[1]) secondCol=c_green
			drawTextColoured(x-45,y-12+i*10,[[slicedString[0],c_teal],[":",c_black],[slicedString[1],secondCol]],1,1,0)
		} else draw_text_transformed(x-45,y-12+i*10,containedText[i],1,1,0)
		if string_length(containedText[i])>string_length(longestLength) longestLength=containedText[i]
	}
}

