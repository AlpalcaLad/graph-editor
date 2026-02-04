x = mouse_x
y = mouse_y

var tempDrag = dragging
dragging = mouse_check_button(mb_middle)

if tempDrag != dragging and dragging{
	xGrab = device_mouse_x_to_gui(0)
	yGrab = device_mouse_y_to_gui(0)
}

if cornersDrag and !dragging and (device_mouse_x_to_gui(0) > w-borderSize or device_mouse_x_to_gui(0) < borderSize or device_mouse_y_to_gui(0) > h-borderSize or device_mouse_y_to_gui(0) < borderSize){
	var direc = point_direction(x,y,camera_o.x,camera_o.y)
	camera_o.x = camera_o.x - lengthdir_x(2,direc)
	camera_o.xTo = camera_o.xTo - lengthdir_x(2,direc)
	camera_o.y = camera_o.y - lengthdir_y(2,direc)
	camera_o.yTo = camera_o.yTo - lengthdir_y(2,direc)
}

if dragging{
	var xOff = xGrab-device_mouse_x_to_gui(0)
	var yOff = yGrab-device_mouse_y_to_gui(0)
	xGrab = device_mouse_x_to_gui(0)
	yGrab = device_mouse_y_to_gui(0)
	
	
	camera_o.x+=xOff*(w/room_width)*(camera_o.zoom*0.4)
	camera_o.y+=yOff*(h/room_height)*(camera_o.zoom*0.4)
	camera_o.xTo = camera_o.x
	camera_o.yTo = camera_o.y
}

if mouse_wheel_up(){
	camera_o.zoom -= 0.1
}
if mouse_wheel_down(){
	camera_o.zoom += 0.1
}
