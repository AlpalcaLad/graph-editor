hsp+=other.hspeed/2
vsp+=other.vspeed/2
instance_destroy(other)
hitTime=hitTimeMax
hp-=other.dmg
for (var i=0; i<5; i++){
	var blood = instance_create_layer(other.x-sign(hsp)*2,other.y+random_range(-1,1),"particles",redMist_o)
	blood.hspeed=-sign(hsp)*random_range(0.2,2)
	blood.vspeed=random_range(-0.5,0.5)
}