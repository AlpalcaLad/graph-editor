//begin step so alarms can run during the same frame

if !audio_is_playing(currentTrack){ //currently not using duration, may be oversight, worth thinking about
	//start next audio
	if array_length(musicQueue)==0{
		alarm[0]=1
	}
	else {
		var edgeTaken = array_shift(musicQueue)
		currentTrack = asset_get_index(variable_struct_get(edgeTaken.state,"track"))
		currentNode = edgeTaken.target
		if currentTrack!=-1 audio_play_sound(currentTrack,1,false,1)
		else show_error("couldnt find sound!",true)
		array_push(history,currentTrack)
		if array_length(history)>historySize array_shift(history)
	}
}

//set target state
with player_o{
	dist=-1
	with spawner_o{
		if active{
			var distanceTemp = point_distance(x,y,player_o.x,player_o.y)
			if other.dist==-1 || distanceTemp<other.dist other.dist=distanceTemp
		}
	}
	if dist == -1 dist = 999
	show_debug_message(dist)
	variable_struct_set(other.targetState.state,"isNearSpawner",dist<128)
	variable_struct_set(other.targetState.state,"isVeryNearSpawner",dist<64)
	variable_struct_set(other.targetState.state,"killingSpawner",cutscening)
}
targetState.state.intense = instance_number(enemy_o)>10
var playerNeedsFreeing = variable_struct_get(currentNode.state,"killingSpawner")
if playerNeedsFreeing==true player_o.readyToDestroy=true