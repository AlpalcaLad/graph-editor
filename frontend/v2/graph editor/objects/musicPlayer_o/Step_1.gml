if currentWait<=0{
	//start next audio
	if array_length(musicQueue)==0{
		alarm[0]=1
	}
	else {
		var edgeTaken = array_shift(musicQueue)
		currentTrack = edgeTaken.track
		currentNode = edgeTaken.to
		if currentTrack!=-1 audio_play_sound(currentTrack,1,false,1)
		else show_error("couldnt find sound!",true)
		array_push(history,currentTrack)
		if array_length(history)>historySize array_shift(history)
	}
} else currentWait -- 