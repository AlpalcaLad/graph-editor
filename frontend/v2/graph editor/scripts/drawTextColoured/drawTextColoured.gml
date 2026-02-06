/**
 * @function drawTextColoured
 * @description Draws an array of tuples (string,colour) as if it were one string
 * @param {Real} x initial x coord
 * @param {Real} y initial y coord
 * @param {Array} stringArray an array of tuples (string,colour)
 * @param {Real} xscale scale of text in x direction
 * @param {Real} yscale scale of text in y direction
 * @param {Real} angle angle of text (not well tested)
 */
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

/**
 * @function drawAndHighlight
 * @description Draws text to the screen, with syntax highlighting
 * @param {Real} x initial x coord
 * @param {Real} y initial y coord
 * @param {String} str string to draw highlighted
 * @param {Real} xscale scale of text in x direction
 * @param {Real} yscale scale of text in y direction
 * @param {Real} angle angle of text (not well tested)
 * @param {String} suffix string to be written as post text (e.g. " <")
 */
function drawAndHighlight(x,y,str,xscale,yscale,angle,suffix=""){
	var colons = string_count(":",str)
	if colons>0{
		var slicedString = string_split(str,":",false,1)
		var secondCol = stringColour
		if colons > 1 secondCol = fileColour
		else if slicedString[1]=="false" or slicedString[1]=="true" secondCol= booleanColour
		else if isNumeric(slicedString[1]) secondCol=numberColour
		drawTextColoured(x,y,[[slicedString[0],variableColour],[":",textColour],[slicedString[1],secondCol],[suffix,textColour]],xscale,yscale,angle)
	} else draw_text_transformed(x,y,str+suffix,xscale,yscale,angle)
}