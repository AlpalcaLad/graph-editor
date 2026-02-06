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