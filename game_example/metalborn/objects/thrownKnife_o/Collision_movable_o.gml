if moving{
	stuckIn=other

	stuckOffsetX = other.image_xscale*(x-other.x)
	stuckOffsetY = y-other.y

	moving = false

	topLeftX = other.x-other.sprite_width/2
	topLeftY = other.y-other.sprite_height/2

	hitX = clamp(floor(5*((x-topLeftX)/other.sprite_width)),0,4)
	hitY = clamp(floor(5*((y-topLeftY)/other.sprite_height)),0,4)
	other.hits[hitX*5+hitY] = 1
	
	if (other.hitEffect != noone){
		for (i=0; i<bloodCount; i++){
			with instance_create_layer(x,y,"effects",other.hitEffect){
				direction = reformat_angle(other.direction+random_range(-45,45))
				speed = random_range(0.5,1)
				x+=lengthdir_x(random_range(0,speed),direction)
				y+=lengthdir_y(random_range(0,speed),direction)
			}
		}
	}
}