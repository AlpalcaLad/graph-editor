
function draw_rectangle_width(x1,y1,x2,y2,width){
	draw_line_width(x1,y1,x2,y1,width)
	draw_line_width(x2,y1,x2,y2,width)
	draw_line_width(x1,y2,x2,y2,width)
	draw_line_width(x1,y1,x1,y2,width)
}