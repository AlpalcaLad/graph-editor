function isNumeric(str){
	//SOURCE: https://forum.gamemaker.io/index.php?threads/check-if-string-is-number.61305/
	var s = str;
	var n = string_length(string_digits(s));
	return n && n == string_length(s) - (string_char_at(s, 1) == "-") - (string_pos(".", s) != 0);
}