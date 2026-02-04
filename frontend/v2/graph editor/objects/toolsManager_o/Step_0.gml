if !mouse_check_button(mb_left) clickDl = false

if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,25,w-25,75){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"boxes",box_o)
}
//draw_roundrect_ext(w-130,100,w-25,150,12,12,false)
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,100,w-25,150){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"arrows",arrow_o)
}
//draw_roundrect_ext(w-130,175,w-25,225,12,12,false)
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,175,w-25,225){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"boxes",redBox_o)
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,475,w-25,525){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"boxes",checkBox_o)
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,250,w-25,300){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"mouse",bin_o)
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,325,w-25,375){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"boxes",finishBox_o)
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,400,w-25,450){
	clickDl = true
	instance_destroy(bin_o)
	instance_create_layer(x,y,"boxes",emptyBox_o)
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,525,w-25,600) and getIndexTarget(1)!=-1{
	clickDl = true
	instance_destroy(bin_o)
	genTest_o.runDia = true
	genTest_o.currentIndex = getIndexTarget(1)
	if genTest_o.currentIndex.object_index == checkBox_o or genTest_o.currentIndex.object_index == emptyBox_o{
		genTest_o.nextDiaDl = 0
	}
	
	genTest_o.drawText = genTest_o.currentIndex.containedText
	genTest_o.getInput = (genTest_o.currentIndex.object_index==redBox_o)
	
	genTest_o.fancyTypeIndex = 0
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,625,w-25,675){
	instance_destroy(genTest_o)
	instance_create_layer(w/2,h/2,"meta",genTest_o)
	clickDl = true
}
if !clickDl and mouse_check_button(mb_left) and point_in_rectangle(device_mouse_x_to_gui(0),device_mouse_y_to_gui(0),w-130,700,w-25,750){
	file = get_save_filename("generatedCode|*.txt","generatedCode.txt")
	textFile = file_text_open_write(file)
	//writtenTargets = []
	for (i=1; i<=(instance_number(box_o)+instance_number(emptyBox_o)+instance_number(redBox_o)+instance_number(finishBox_o)); i++){
		with getIndexTarget(i){
			accountedFor = false
			if object_index == checkBox_o{
				file_text_write_string(toolsManager_o.textFile,"if currentIndex == " + string(index) + "{" + " //This is the index the code is currently at")
				file_text_writeln(toolsManager_o.textFile)
			}
			if 1==1{
				with arrow_o{
					if placed==2 and from==other and other.object_index != finishBox_o and !other.accountedFor and other.object_index == checkBox_o{
						file_text_write_string(toolsManager_o.textFile,"	if " + other.containedText[0] + " " + containedText + " {currentIndex = " + string(to.index) + "}")
						
						file_text_writeln(toolsManager_o.textFile)
					}
					if placed==2 and from==other and other.object_index != finishBox_o and !other.accountedFor and other.object_index != checkBox_o{
						file_text_write_string(toolsManager_o.textFile,"if currentIndex == " + string(other.index) + "{" + " //This is the index the code is currently at")
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	getInput = " + string(other.object_index == redBox_o))
						file_text_writeln(toolsManager_o.textFile)
						optionTextArrow = []
						optionGoalArrow = []
						if other.object_index == redBox_o{
							other.accountedFor = true
							with arrow_o{
								if placed == 2 and from == other.from{
									array_push(other.optionTextArrow,containedText)
									array_push(other.optionGoalArrow,to.index)
								}
							}
						}
						else{
							optionGoalArrow = "["+string(getArrowTarget(other).index)+"]"
						}
						file_text_write_string(toolsManager_o.textFile,"	optionText = "+string(optionTextArrow))
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	optionGoals = "+string(optionGoalArrow))
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	drawText = " + string(other.containedText))
						file_text_writeln(toolsManager_o.textFile)
						if other.object_index == emptyBox_o{
							file_text_write_string(toolsManager_o.textFile,"	nextDiaDl = clamp(nextDiaDl,-999,2)")
							file_text_writeln(toolsManager_o.textFile)
						}
						file_text_write_string(toolsManager_o.textFile,"}")
						file_text_writeln(toolsManager_o.textFile)
					}
					if placed==2 and from==other and to.object_index == finishBox_o{
						file_text_write_string(toolsManager_o.textFile,"if currentIndex == " + string(to.index) + "{" + " //This is where dialogue ends")
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	getInput=false")
						file_text_writeln(toolsManager_o.textFile)
						optionTextArrow = []
						optionGoalArrow = []
						if to.object_index == redBox_o{
							with arrow_o{
								if placed == 2 and from == other.to{
									array_push(other.optionTextArrow,containedText)
									array_push(other.optionGoalArrow,to.index)
								}
							}
						}
						file_text_write_string(toolsManager_o.textFile,"	optionText = []")
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	optionGoals = []")
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	drawText = []")
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"	instance_destroy()")
						file_text_writeln(toolsManager_o.textFile)
						file_text_write_string(toolsManager_o.textFile,"}")
						file_text_writeln(toolsManager_o.textFile)
					}
				}
			}
			if object_index == checkBox_o{
				file_text_write_string(toolsManager_o.textFile,"}")
				file_text_writeln(toolsManager_o.textFile)
			}
		}
	}
	clickDl = true
	file_text_close(textFile)
}

/*
				if object_index==redBox_o{
					connectedArrowTexts = []
					connectedArrowGoals = []
					with arrow_o{
						if placed == 2 and from == other{
							array_push(other.connectedArrowTexts,containedText)
							array_push(other.connectedArrowGoals,to.index)
						}
					}
					genTest_o.optionText = connectedArrowTexts
					genTest_o.optionGoals = connectedArrowGoals
				}
	if currentIndex == 1{
		getInput = false
		optionText = []
		optionGoals = []
		drawText = [""]
	}
*/