follow = player_o
x = follow.x
y = follow.y
zoom = 1
tied = 0
hsp = 0
vsp = 0
camera = camera_create()
var vm = matrix_build_lookat(x,y,-10,x,y,0,0,1,0)
var pm = matrix_build_projection_ortho(350,288,1,10000)


camera_set_view_mat(camera,vm)
camera_set_proj_mat(camera,pm)
view_camera[0] = camera
xTo = x
yTo = y
image_speed = 0
image_index = 1