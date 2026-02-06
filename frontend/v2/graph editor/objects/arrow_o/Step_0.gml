if !mouse_check_button(mb_left) clickDl = false

x = mouse_x
y = mouse_y

if mouse_check_button(mb_left) and !clickDl and placed<2{
	clickDl = true
	placed++
	placed = clamp(placed,0,2)
	if placed == 1{
		with box_o{
			if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]){
				other.from = self
			}
		}

		
		if from == noone instance_destroy()
	}
	if placed == 2{
		with box_o{
			if point_in_rectangle(mouse_x,mouse_y,bbox[0],bbox[1],bbox[2],bbox[3]){
				other.to = self
			}
		}
		
		if from != noone and from.object_index == box_o{
			with arrow_o{
				if toX != 0 and (from == other.from){
					other.to = noone
					instance_destroy(other)
				}
			}
		}
		
		if to == noone or (to==from) instance_destroy()
	}
}

if placed == 2 and to != noone and from != noone{
	//draw_line_width(from.x,from.y,to.x,to.y,4)
	x = from.x
	y = from.y
	direction = point_direction(x,y,to.x,to.y)
	while point_in_rectangle(x,y,from.bbox[0],from.bbox[1],from.bbox[2],from.bbox[3]){
		x = x + lengthdir_x(1,direction)
		y = y + lengthdir_y(1,direction)
	}
	fromX = x
	fromY = y
	
	//show_debug_message("no crash yet")
	
	x = to.x
	y = to.y
	direction = point_direction(x,y,from.x,from.y)
	while point_in_rectangle(x,y,to.bbox[0],to.bbox[1],to.bbox[2],to.bbox[3]){
		x = x + lengthdir_x(1,direction)
		y = y + lengthdir_y(1,direction)
	}
	x = x + lengthdir_x(5,direction)
	y = y + lengthdir_y(5,direction)
	toX = x
	toY = y
	
}
draw_set_font(pixel)
//TODO: multiple lines
if !clickDl and placed == 2 and mouse_check_button(mb_left) and (point_in_rectangle(mouse_x,mouse_y,mean(fromX,toX)-24-(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)-12,mean(fromX,toX)+18+(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)+12)){
	clickDl = true
	highlighted = true
	keyboard_string = containedText[selectedIndex]
}
if !clickDl and placed == 2 and mouse_check_button(mb_left) and !(point_in_rectangle(mouse_x,mouse_y,mean(fromX,toX)-24-(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)-12,mean(fromX,toX)+18+(0.5*clamp(string_width(containedText),0,999)),mean(fromY,toY)+12)){
	highlighted = false
	clickDl = true
}
if !keyboard_check(vk_up) and !keyboard_check(vk_down) changeLnDl = false
if !keyboard_check(vk_enter) enterDl = false
if !keyboard_check(vk_backspace) deleteDl = false
if highlighted{
	if !changeLnDl{
		if keyboard_check(vk_down){
			if selectedIndex<array_length(containedText)-1{
				selectedIndex ++
				keyboard_string = containedText[selectedIndex]
			}
			changeLnDl = true
		}
		if keyboard_check(vk_up){
			if selectedIndex>0{
				selectedIndex --
				keyboard_string = containedText[selectedIndex]
			}
			changeLnDl = true
		}
	}
	if !enterDl and keyboard_check(vk_enter){
		keyboard_string = ""
		selectedIndex ++
		enterDl = true
	}
	containedText[selectedIndex] = keyboard_string
	if containedText[selectedIndex] == "" and keyboard_check(vk_backspace) and !deleteDl and selectedIndex>0{
		deleteDl = true
		array_delete(containedText,selectedIndex,1)
		selectedIndex --
		keyboard_string = containedText[selectedIndex]
	}
}