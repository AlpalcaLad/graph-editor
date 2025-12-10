draw_set_alpha(clamp(exist/10,0,1))
if targettedObject != noone{
	draw_set_color(c_red)
	var arrowOffset = dsin(arrowPeriod)*2
	draw_rectangle(
		targettedObject.x-1,
		targettedObject.bbox_top-2-arrowOffset,
		targettedObject.x+2,
		targettedObject.bbox_top-8-arrowOffset,
		false
	)
	draw_triangle(
		targettedObject.x-4,
		targettedObject.bbox_top-4-arrowOffset,
		targettedObject.x+4,
		targettedObject.bbox_top-4-arrowOffset,
		targettedObject.x,
		targettedObject.bbox_top-2-arrowOffset,
		false
	)
	draw_set_color(c_white)
}
draw_set_alpha(1)