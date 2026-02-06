//preload audio streams
streams = {}
with arrow_o{
	if track != noone and !variable_struct_exists(streams,track){
		try{
			variable_struct_set(streams,track,audio_create_stream(track))
		} catch (_exception){
			show_error("ERROR: file not accessible",true)
		}
	}
}

//initialise variables needed to run graph
currentNode = instance_nearest(x,y,box_o) //default pick arbitrary box
currentTrack = -1 //current audio object being played
currentWait = 0 //how long the program is waiting before selecting next edge
history = [] //previous edges taken
historySize = 25 //how long the algorithm will remember having taken an edge
musicQueue = [] //predicted next tracks