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
function drawAndHighlight(x,y,str,xscale,yscale,angle,suffix=""){
	if string_count(":",str)==1{
		var slicedString = string_split(str,":")
		var secondCol = c_red
		if slicedString[1]=="false" or slicedString[1]=="true" secondCol=c_orange
		else if isNumeric(slicedString[1]) secondCol=c_green
		drawTextColoured(x,y,[[slicedString[0],c_teal],[":",c_black],[slicedString[1],secondCol],[suffix,c_black]],xscale,yscale,angle)
	} else draw_text_transformed(x,y,str+suffix,xscale,yscale,angle)
}