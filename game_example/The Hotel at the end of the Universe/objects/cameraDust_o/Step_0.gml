x+=camera_o.hsp*radius/30
y+=camera_o.vsp*radius/30
image_alpha_targ-=0.0001
image_alpha=lerp(image_alpha,image_alpha_targ,0.001)
if image_alpha_targ<=0 instance_destroy()