//Copy the code the flowchart dialogue builder (should be saved as generatedCode.txt)
//Paste it directly below these comments
//To run code at certain dialogue stages, add it within the statement starting with "if currentIndex == X" 



//Standard code- avoid editing
if exist<60 exist ++
arrowPeriod++
if arrowPeriod>360 arrowPeriod-=360
if nextDiaDl > -2 nextDiaDl--
if !getInput and nextDiaDl<0 or ((keyboard_check(vk_enter) or keyboard_check(vk_space)) and !enterDl){
	enterDl = true
	fancyTypeIndex = 0
	nextDiaDl = maxDiaDl
	currentIndex = optionGoals[0]
}
if chosenGoal != 0 {
	currentIndex = chosenGoal
	enterDl = true
	fancyTypeIndex = 0
	nextDiaDl = maxDiaDl
	chosenGoal = 0
}
if fancyType fancyTypeIndex += 0.5
if !keyboard_check(vk_enter) and !keyboard_check(vk_space) enterDl=false
if !mouse_check_button(mb_left) clickDl = false
longestLength = ""
for (i=0; i<array_length(drawText); i++){
	if i != array_length(drawText)-1{
		if string_length(drawText[i])>string_length(longestLength) longestLength=drawText[i]
	}
	else{
		if string_length(drawText[i])>string_length(longestLength) longestLength=drawText[i]
	}
}

if targettedObject != noone and (abs(targettedObject.x-player_o.x)>64 or abs(targettedObject.y-player_o.y)>64){
	instance_destroy()
}

with player_o.arm1{
	if gun!=-1 gun.shootDl=gun.shootDlMax
}
with player_o.arm2{
	if gun!=-1 gun.shootDl=gun.shootDlMax
}