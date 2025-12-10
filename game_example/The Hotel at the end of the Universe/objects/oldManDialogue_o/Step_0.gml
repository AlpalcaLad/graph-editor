//Copy the code the flowchart dialogue builder (should be saved as generatedCode.txt)
//Paste it directly below these comments
//To run code at certain dialogue stages, add it within the statement starting with "if currentIndex == X" 

if currentIndex == 1{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [2]
	drawText = [ "" ]
	nextDiaDl = clamp(nextDiaDl,-999,2)
}
if currentIndex == 2{ //This is the index the code is currently at
	getInput = 1
	optionText = [ "nothing.","rumours?","what's happening?" ]
	optionGoals = [ 3,4,5 ]
	drawText = [ "What do you want?" ]
}
if currentIndex == 3{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [14]
	drawText = [ "Strange Person" ]
}
if currentIndex == 14{ //This is where dialogue ends
	getInput=false
	optionText = []
	optionGoals = []
	drawText = []
	instance_destroy()
}
if currentIndex == 4{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [14]
	drawText = [ "I heard a rumour that","you're annoying" ]
}
if currentIndex == 14{ //This is where dialogue ends
	getInput=false
	optionText = []
	optionGoals = []
	drawText = []
	instance_destroy()
}
if currentIndex == 5{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [6]
	drawText = [ "If you're here that means","you're dead. Probably..." ]
}
if currentIndex == 6{ //This is the index the code is currently at
	getInput = 1
	optionText = [ "probably?","why?","used?","for what?" ]
	optionGoals = [ 10,9,8,7 ]
	drawText = [ "That's what this place","used to be for" ]
}
if currentIndex == 7{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [11]
	drawText = [ "Time was, all the dead passed","through here on their journey." ]
}
if currentIndex == 8{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [11]
	drawText = [ "There's strange monsters infesting","the hotel now. Could be why you're here" ]
}
if currentIndex == 9{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [11]
	drawText = [ "Cosmic gift? Orderly queue to hell?","Your guess is as good as mine" ]
}
if currentIndex == 10{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [11]
	drawText = [ "The hotel isn't what it used","to be. Can't say for sure" ]
}
if currentIndex == 11{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [12]
	drawText = [ "" ]
	nextDiaDl = clamp(nextDiaDl,-999,2)
}
if currentIndex == 12{ //This is the index the code is currently at
	getInput = 1
	optionText = [ "no","yes" ]
	optionGoals = [ 13,15 ]
	drawText = [ "Any more questions?" ]
}
if currentIndex == 13{ //This is where dialogue ends
	getInput=false
	optionText = []
	optionGoals = []
	drawText = []
	instance_destroy()
}
if currentIndex == 15{ //This is the index the code is currently at
	getInput = 0
	optionText = [  ]
	optionGoals = [2]
	drawText = [ "Go on then" ]
}


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