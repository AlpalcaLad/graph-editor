// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information
function reformat_angle(ang){
	while (ang<0){ang = 360+ang}
	while (ang>360){ang-=360}
	return ang
}