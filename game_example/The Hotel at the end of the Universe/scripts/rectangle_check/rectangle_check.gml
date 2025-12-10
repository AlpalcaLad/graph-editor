function rectangle_check(xIn,yIn,bLeft,bTop,bRight,bBottom){ // check if point in rect
	return (xIn> bLeft and xIn<bRight and yIn>bTop and yIn<bBottom)
}