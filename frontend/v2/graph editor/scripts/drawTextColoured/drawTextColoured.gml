function drawTextColoured(x,y,stringArray,xscale,yscale,angle){ //naively assumes angle to be 0 out of laziness
	var curX = x
	for (var i=0; i<array_length(stringArray); i++){
		var oldCol = draw_get_colour()
		draw_set_colour(stringArray[i][1])
		draw_text_transformed(curX,y,stringArray[i][0],xscale,yscale,angle)
		draw_set_colour(oldCol)
		curX += string_width(stringArray[i][0])
	}
}