if slowdownFalloff and client_o.time_speed==1 image_alpha-=0.02*falloffSpeed
else image_alpha-=0.0035*falloffSpeed
if image_alpha<=0 instance_destroy()