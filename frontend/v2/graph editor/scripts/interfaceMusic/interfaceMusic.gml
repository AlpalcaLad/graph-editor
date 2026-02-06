/**
 * @function getUploadedMusic
 * @description Returns the file path to a music file, chosen by a user
 * @returns {String} The file path chosen by the user
 */
function getUploadedMusic(){ //allow player to upload music
	var fname = get_open_filename("music|*.mp3;*.wav","")
	return fname
}

