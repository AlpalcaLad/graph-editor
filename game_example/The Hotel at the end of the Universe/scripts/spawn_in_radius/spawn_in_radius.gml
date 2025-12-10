
function spawn_in_area(center_x,center_y,object,dist,attempts=8,layerIn="enemies",dropAcceptance=32,avoidObject=player_o,avoidDist=24){
	for (var i=0; i<attempts; i++){
		var xSpawn=center_x+irandom_range(-dist/2,dist/2)
		var ySpawn=center_y+irandom_range(-dist/2,dist/2)
		if point_distance(avoidObject.x,avoidObject.y,xSpawn,ySpawn)<avoidDist continue
		with instance_create_layer(xSpawn,ySpawn,layerIn,object){
			while place_meeting(x,y,solidWall_o) y--
			var moveAttempts=dropAcceptance
			while !place_meeting(x,y+1,solidWall_o) and attempts>0{
				y++
				moveAttempts-=1
			}
			if point_distance(avoidObject.x,avoidObject.y,x,y)<avoidDist{
				instance_destroy()
				continue
			}
			if attempts<=0 instance_destroy()
			else return id
		}
	}
	return noone
}