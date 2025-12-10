//IMPORTANT
//This code doesn't need to be replaced/altered
//If you change the below code it may break the dialogue

w = display_get_gui_width()
h = display_get_gui_height()

currentIndex = 1 //current dialogue position
changeDl = 20 //delay between going to next stage
drawText = [""]
optionText = ["",""]
optionGoals = [1,1]
chosenGoal = 0
getInput = false
drawSprite = noone
targettedObject = noone
arrowPeriod = 0
style = "cinematic" //options are "bubble", "cinematic"
fancyType = true //types characters one at a time rather than them all appearing at once
fancyTypeIndex = 0
exist = 0

//FONTS ARE SET HERE
//cinematic is the default text style 
//bubble doesnt current support fancy typing
if style == "bubble" font = spartan
if style == "cinematic" font = pixel

drawColor = make_color_rgb(21,18,23)

//run dialogue variables
runDia = true
maxDiaDl = 250
nextDiaDl = maxDiaDl
enterDl = false
clickDl = false

