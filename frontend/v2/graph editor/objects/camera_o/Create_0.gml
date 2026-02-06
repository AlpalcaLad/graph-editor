follow = noone

zoom = 1
zoomNat = zoom
followspd = 25
zoomLock = 0

followY = true
alwaysTrack = true //whether camera is always tracking player or not
onlyY = false


camera = camera_create()
var vm = matrix_build_lookat(x,y,-10,x,y,0,0,1,0)
var pm = matrix_build_projection_ortho(350,288,1,10000)


camera_set_view_mat(camera,vm)
camera_set_proj_mat(camera,pm)
view_camera[0] = camera
xTo = x
yTo = y

window_set_fullscreen(false)