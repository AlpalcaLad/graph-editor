if (follow != noone)
{
	if !onlyY xTo = follow.x
	yTo = follow.y
}

x += (xTo - x )/followspd

if abs(yTo-y) > 64 or alwaysTrack{followY = true}
if abs(yTo-y) <6 and !alwaysTrack{followY = false}

if followY{
	/*
	if !place_meeting(x,y+(yTo - y )/followspd,cameraBlock_o){
		y += (yTo - y )/followspd
	}
	*/
	y += (yTo - y )/followspd
}
/*
if zoomLock > -2{zoomLock -= 1}
if zoomLock < 0{
	if zoom > zoomNat{zoom -= 0.05}
	if zoom < zoomNat{zoom += 0.05}
}
*/
var vm = matrix_build_lookat(x,y,-10,x,y,0,0,1,0)
var pm = matrix_build_projection_ortho(525 *zoom,288*zoom,1,10000)


camera_set_view_mat(camera,vm)

camera_set_proj_mat(camera,pm)

if keyboard_check(vk_escape) game_end()