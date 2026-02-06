if !mouse_check_button(mb_left) clickDl = false

var mx = device_mouse_x_to_gui(0)
var my = device_mouse_y_to_gui(0)
for (var i=0; i<array_length(buttons); i++){
	if (!clickDl and mouse_check_button(mb_left) and point_in_rectangle(mx,my,w-130,25+75*i,w-25,75*(i+1))){
		clickDl = true
		buttons[i].onClick()
	}
}