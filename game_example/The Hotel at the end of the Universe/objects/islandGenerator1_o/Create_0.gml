islandType=choose_weight(["roof",8,"noroof",4,"doubleroof",4,"litroof",3])


x=floor(x/16)*16
y=floor(y/16)*16
randomise()
var tile_layer=layer_get_id("generatedTiles")
var tilemap_id=layer_tilemap_get_id(tile_layer)
var decor_layer=layer_get_id("generatedTilesDecor")
var decor_id=layer_tilemap_get_id(decor_layer)
xInit=x
yInit=y
ladderCoord=[x-8,y+8]
//var island_left_offset = irandom_range(island_width/4,island_width/2)*tile_size
//x-=island_left_offset
var real_island_size=irandom_range(island_width/2,island_width)
var surface_points=[]
/* ATTEMPT 1: PERLIN NOISE
for (var i=0; i<real_island_size; i++){
	var newY=16*floor(y/16) + 2*16*floor((perlin_noise(x*0.005)*4)/16)
	array_push(surface_points,[x,newY])
	x += tile_size
}
random_set_seed(seed)
var last_y=surface_points[0][1]//16*floor(y/16)
var surface_point_num=array_length(surface_points)
var island_center = random_range(surface_point_num/4, surface_point_num*3/4)
for (var i=0; i<surface_point_num; i++){
	var depth_at_cur_y = island_depth * power(2.71828,-sqr(2*(i-island_center)/tile_size))
	for (var j=0; j<depth_at_cur_y; j++){
		tilemap_set_at_pixel(tilemap_id,11,surface_points[i][0],last_y+16*j)
	}
	var new_y=surface_points[i][1]
	if last_y!=new_y{
		while last_y!=new_y{
			tilemap_set_at_pixel(tilemap_id,2,surface_points[i][0],last_y)
			last_y+=16*sign(new_y-last_y)
		}
	}
	tilemap_set_at_pixel(tilemap_id,2,surface_points[i][0],new_y)
	last_y=new_y
}
*/
var last_y=16*floor(y/16)
var newY
var depthOfPoint
for (var i=0; i<real_island_size; i++){
	newY=last_y + 16*floor(random_range(0,heightVariation1)/heightVariation2)*(irandom_range(0,1)*2-1)*(i<real_island_size-2)
	depthOfPoint=(island_depth+irandom_range(0,3))*power(2.71,-abs((i-real_island_size/2)/sqrt(real_island_size)))
	last_y=newY
	array_push(surface_points,[x,newY,depthOfPoint])
	x += tile_size
}
last_y=surface_points[0][1]//16*floor(y/16)
var surface_point_num=array_length(surface_points)
var island_center = random_range(surface_point_num/4, surface_point_num*3/4)
var new_y
var max_y=last_y
var fenceNum=0
for (var i=0; i<surface_point_num; i++){
	new_y=surface_points[i][1]
	depthOfPoint=surface_points[i][2]
	for (var j=0; j<depthOfPoint; j++){
		tilemap_set_at_pixel(tilemap_id,11,surface_points[i][0],new_y+tile_size*j)
	}
	if last_y!=new_y{
		while last_y!=new_y{
			instance_create_layer(surface_points[i][0]+tile_size/2,last_y+tile_size/2,"virtualWalls",solidWall_o)
			tilemap_set_at_pixel(tilemap_id,2,surface_points[i][0],last_y)
			last_y+=16*sign(new_y-last_y)
		}
	}
	tilemap_set_at_pixel(tilemap_id,2,surface_points[i][0],new_y)
	instance_create_layer(surface_points[i][0]+tile_size/2,new_y+tile_size/2,"virtualWalls",solidWall_o)
	finalCoord=[surface_points[i][0]+tile_size/2,surface_points[i][1]+tile_size/2]
	last_y=new_y
	if max_y<last_y max_y=last_y
	if fenceNum>0{
		fenceNum-=1
		tilemap_set_at_pixel(decor_id,34,surface_points[i][0],new_y-16-16*(tilemap_get_at_pixel(tilemap_id,surface_points[i][0],new_y-16)!=0))
	} else if irandom(fenceChance)==1 fenceNum+=4
}
if islandType=="roof"{
	var roofheight=5
	for (var i=1; i<surface_point_num-1; i++){
		instance_create_layer(surface_points[i][0]+tile_size/2,max_y-tile_size*roofheight+tile_size/2,"virtualWalls",solidWall_o)
		tilemap_set_at_pixel(tilemap_id,3,surface_points[i][0],max_y-tile_size*roofheight)
		if i>1 and i<surface_point_num-2{
			for (var j=1; j<((surface_points[i][1])-(max_y-roofheight*tile_size))/16; j++){
				if tilemap_get_at_pixel(tilemap_id,surface_points[i][0],max_y-tile_size*roofheight+j*tile_size)==0{
					tilemap_set_at_pixel(tilemap_id,11,surface_points[i][0],max_y-tile_size*roofheight+j*tile_size)
				}
			}
		}
	}
}
if islandType=="litroof"{
	var roofheight=5
	var makeLight=true
	for (var i=1; i<surface_point_num-1; i++){
		instance_create_layer(surface_points[i][0]+tile_size/2,max_y-tile_size*roofheight+tile_size/2,"virtualWalls",solidWall_o)
		tilemap_set_at_pixel(tilemap_id,3,surface_points[i][0],max_y-tile_size*roofheight)
		if i>1 and i<surface_point_num-2{
			if i>2 and i<surface_point_num-3{
				if makeLight{
					makeLight=false
					instance_create_layer(surface_points[i][0]+tile_size/2,max_y-tile_size*(roofheight-1)+tile_size/2,"backEffects",xmasLighting_o)
				} else makeLight=true
			}
			for (var j=1; j<((surface_points[i][1])-(max_y-roofheight*tile_size))/16; j++){
				if tilemap_get_at_pixel(tilemap_id,surface_points[i][0],max_y-tile_size*roofheight+j*tile_size)==0{
					tilemap_set_at_pixel(tilemap_id,11,surface_points[i][0],max_y-tile_size*roofheight+j*tile_size)
				}
			}
		}
	}
}
if islandType=="doubleroof"{
	var roofheight=5
	var secondroofheight=8
	for (var i=1; i<surface_point_num-1; i++){
		instance_create_layer(surface_points[i][0]+tile_size/2,max_y-tile_size*roofheight+tile_size/2,"virtualWalls",solidWall_o)
		tilemap_set_at_pixel(tilemap_id,3,surface_points[i][0],max_y-tile_size*roofheight)
		
		if i>1 and i<surface_point_num-2{
			for (var j=1; j<((surface_points[i][1])-(max_y-roofheight*tile_size))/16; j++){
				if tilemap_get_at_pixel(tilemap_id,surface_points[i][0],max_y-tile_size*roofheight+j*tile_size)==0{
					tilemap_set_at_pixel(tilemap_id,11,surface_points[i][0],max_y-tile_size*roofheight+j*tile_size)
				}
			}
			
			instance_create_layer(surface_points[i][0]+tile_size/2,max_y-tile_size*secondroofheight+tile_size/2,"virtualWalls",solidWall_o)
			tilemap_set_at_pixel(tilemap_id,3,surface_points[i][0],max_y-tile_size*secondroofheight)
			if i>2 and i<surface_point_num-3{
				for (var j=1; j< secondroofheight-roofheight; j++){
					if tilemap_get_at_pixel(tilemap_id,surface_points[i][0],max_y-tile_size*secondroofheight+j*tile_size)==0{
						tilemap_set_at_pixel(tilemap_id,11,surface_points[i][0],max_y-tile_size*secondroofheight+j*tile_size)
					}
				}
			}
		}
	}
}
/*
if chainIslands>0{
	instance_create_layer(finalCoord[0]+16,finalCoord[1],layer,object_index)
}
*/
