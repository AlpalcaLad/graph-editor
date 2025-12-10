/*
Camera_o:
smooth camera object that follows whatever the variable follow is set to
has functionality for walls that stop camera movement (commented out on step)
*/

follow = player_o
//x = follow.x
//y = follow.y
zoom = 0.75
tied = 0
hsp = 0
vsp = 0
freeZoom = false
targetZoom = zoom
zoomMax = 3
aimMoveScale=15
targetMoveAheadScale=8
screenShake=0 
screenShakeIntensity=0.15
screenShakeMult=2
screenShakeMax=15
screenShakeOffset1=0
screenShakeOffset2=0

//camera witchcraft
camera = camera_create()
var vm = matrix_build_lookat(x,y,-10,x,y,0,0,1,0)
var pm = matrix_build_projection_ortho(350,288,1,10000)
camera_set_view_mat(camera,vm)
camera_set_proj_mat(camera,pm)
view_camera[0] = camera

//other needed variables and hiding the cam sprite
xTo = x
yTo = y
image_speed = 0
image_index = 1