//IMPORTANT
//This code doesn't need to be replaced/altered
//If you change the below code it may break the dialogue

draw_set_alpha(clamp(exist/10,0,1))

if !getInput and (keyboard_check(vk_tab) or runDia){
	draw_set_color(drawColor)
	draw_set_font(font)
	
	if style == "bubble"{
		draw_roundrect_ext(mean(0,w)-0.2*string_width(longestLength)-60,h-90+25*(array_length(drawText)),mean(0,w)+0.2*string_width(longestLength)+60,h-130-30*(array_length(drawText)),12,12,false)
		draw_set_color(c_white)
		for (i=0; i<array_length(drawText); i++){
			draw_text_transformed(mean(0,w)-0.2*string_width(drawText[i]),(h-130-30*(array_length(drawText)))+20+60*i,drawText[i],0.4,0.4,0)
		}
	}
	if style == "cinematic"{
		draw_set_color(c_black)
		
		draw_rectangle(0,0,w,40,false)
		draw_rectangle(0,h,w,h-60-40*array_length(drawText),false)
		draw_set_color(c_white)
		if fancyType var totalChars = round(fancyTypeIndex)
		
		for (i=0; i<array_length(drawText); i++){
			var tempDraw = drawText[i]
			if fancyType and totalChars<string_length(drawText[i]){
				tempDraw = string_copy(drawText[i],1,totalChars)
			}
			draw_text_transformed(w/2-2*string_width(drawText[i]),(h-80-40*(array_length(drawText)))+40+40*i,tempDraw,4,4,0)
			if fancyType{
				totalChars -= string_length(drawText[i])
				totalChars = clamp(totalChars,0,999)
			}
		}
	}
}	

if getInput and (keyboard_check(vk_tab) or runDia){
	draw_set_color(drawColor)
	draw_set_font(font)
	
	if style == "bubble"{
		//question box
		draw_roundrect_ext(mean(0,w)-0.2*string_width(longestLength)-60,h-150+25*(array_length(drawText)),mean(0,w)+0.2*string_width(longestLength)+60,h-190-30*(array_length(drawText)),12,12,false)
		draw_set_color(c_white)
		for (i=0; i<array_length(drawText); i++){
			draw_text_transformed(mean(0,w)-0.2*string_width(drawText[i]),(h-190-30*(array_length(drawText)))+20+60*i,drawText[i],0.4,0.4,0)
		}
		
		//choices
		var strLen = 0
		for (i=0; i<array_length(optionText); i++){
			strLen += 0.4*string_width(optionText[i])+80
		}
		var currentX = w/2-strLen/2
		
		for (i=0; i<array_length(optionText); i++){
			draw_set_color(drawColor)
			draw_roundrect_ext(currentX,h-20,currentX+0.4*string_width(optionText[i])+40,h-110,12,12,false)
			draw_set_color(c_grey)
			if point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),currentX,h-110,currentX+0.4*string_width(optionText[i])+40,h-20) draw_set_color(c_white)
			
			draw_text_transformed(currentX+20,h-100,optionText[i],0.4,0.4,0)
			currentX += 0.4*string_width(optionText[i])+80
			if draw_get_color() == c_white and mouse_check_button(mb_left) and !clickDl {chosenGoal = optionGoals[i]; clickDl = true}
		}
	}
	
	if style == "cinematic"{
		draw_set_color(c_black)
		draw_rectangle(0,0,w,40,false)
		draw_rectangle(0,h,w,h-60-40*(array_length(drawText)+1),false)
		draw_set_color(c_white)
		if fancyType var totalChars = round(fancyTypeIndex)
		for (i=0; i<array_length(drawText); i++){
			var tempDraw = drawText[i]
			if fancyType and totalChars<string_length(drawText[i]) tempDraw = string_copy(drawText[i],1,totalChars)
			draw_text_transformed(w/2-2*string_width(drawText[i]),(h-80-40*(array_length(drawText)+1))+40+40*i,tempDraw,4,4,0)
			if fancyType{
				totalChars -= string_length(drawText[i])
				totalChars = clamp(totalChars,0,999)
			}
		}
		var strLen = 0
		
		for (v=0; v<array_length(optionText); v++){
			strLen += 4*string_width(optionText[v])+40
		}
		
		var currentX = w/2-strLen/2
		for (v=0; v<array_length(optionText);v++){
			draw_set_color(c_grey)
			if point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),currentX,h-70,currentX+4*string_width(optionText[v])+40,h-20) draw_set_color(c_white)
			draw_text_transformed(currentX,(h-70),optionText[v],4,4,0)
			currentX += 4*string_width(optionText[v])+80
			if draw_get_color() == c_white and mouse_check_button(mb_left) and !clickDl {chosenGoal = optionGoals[v]; clickDl = true}
		}
	}
}
draw_set_alpha(1)