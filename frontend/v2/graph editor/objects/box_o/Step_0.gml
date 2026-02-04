if !placed and mouse_check_button(mb_right) instance_destroy()
if !placed and !clickDl and mouse_check_button(mb_left) placed = true

if !mouse_check_button(mb_left) clickDl = false

with arrow_o{
	if placed < 2 other.clickDl = true
}

if !placed{
	x = mouse_x
	y = mouse_y
}
else{
	if mouse_check_button(mb_left) and !clickDl and point_in_rectangle(mouse_x,mouse_y,x-50,y-20,x+50,y+20){
		highlighted = true
		selectedIndex = 0
		clickDl = true	
		keyboard_string = containedText[selectedIndex]
	}
	if mouse_check_button(mb_left) and !clickDl and !point_in_rectangle(mouse_x,mouse_y,x-50,y-20,x+50,y+20){
		highlighted = false
		clickDl = true
	}
}

if highlighted and mouse_check_button(mb_left){
	x = mouse_x
	y = mouse_y
}

if !keyboard_check(vk_enter) enterDl = false
if !keyboard_check(vk_backspace) deleteDl = false

if !keyboard_check(vk_up) and !keyboard_check(vk_down) changeLnDl = false
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