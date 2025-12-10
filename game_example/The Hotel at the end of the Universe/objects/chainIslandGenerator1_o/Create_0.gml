var xSpawn=x
var ySpawn=y
var lastWasIsland=false
while chainLength>0{
	chainLength--
	var newTerrain = instance_create_layer(xSpawn,ySpawn,layer,terrainGenerator_o)
	xSpawn=newTerrain.finalCoord[0]+16
	ySpawn=newTerrain.finalCoord[1]
	if newTerrain.islandType!="double roof" && !lastWasIsland and irandom(10)<7{
		lastWasIsland=true
		var island = instance_create_layer(xSpawn,ySpawn-128,layer,islandGenerator1_o)
		ladderCoord=island.ladderCoord
		if !place_meeting(ladderCoord[0],ladderCoord[1],solid_o) and !place_meeting(ladderCoord[0],ladderCoord[1]+16,solid_o){
			for (var i=0; i<20; i++){
				if place_meeting(ladderCoord[0],ladderCoord[1],solid_o) break
				else{
					instance_create_layer(ladderCoord[0],ladderCoord[1],"backEffects",ladder_o)
					ladderCoord[1]+=16
				}
			}
		}
	} else lastWasIsland=false
}
instance_destroy()