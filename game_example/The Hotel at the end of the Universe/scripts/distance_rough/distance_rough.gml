
function distance_rough(xIn,yIn,obj){
	return round(sqrt( sqr(abs(xIn-obj.x)) + sqr(abs(yIn-obj.y))))
}