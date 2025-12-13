//begin step so alarms can run during the same frame

if !audio_is_playing(currentTrack){ //currently not using duration, may be oversight, worth thinking about
	//start next audio
	if array_length(musicQueue)==0{
		alarm[0]=1
	}
	else {
		var edgeTaken = array_shift(musicQueue)
		currentTrack = asset_get_index(edgeTaken.state.track)
		currentNode = edgeTaken.target
		if currentTrack!=-1 audio_play_sound(currentTrack,1,false,1)
		array_push(history,currentTrack)
		if array_length(history)>historySize array_shift(history)
	}
}

//set target state
