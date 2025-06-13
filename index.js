//region Canvas setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
//endregion

//region Constants
ctx.font = "30px Arial";
const pi = Math.PI;
const E = 2.71828;
const radsConvert = (2*pi/360);
//end region

//region Scheduler
class scheduler{
    constructor(){
        //objects who have requested to be called during processing
        //NOT self managed, objects will need to implement a kill method
        //to remove themselves from these arrays
        this.step = [];
        this.draw = [];
        this.frameRate=60; //already handled by requestAnimation Frame
        //TODO update frameRate to reflect monitor refresh rate
        this.elapsed=0; //seconds elapsed in program
    }

    tick(){
        this.runStep();
        this.runDraw();
        window.requestAnimationFrame(this.tick) //reruns function at rate of monitor refresh rate/second
    }

    runStep(){
        //all object step events
        //to add an object, append its reference to the scheduler.step
        for (var i=0;i<this.step.length;i++){
            this.step[i].step_event();
        }
    }

    runDraw(){
        //all object draw events
        //to add an object, add its reference to the scheduler.draw
        for (var i=0;i<this.draw.length;i++){
            this.draw[i].step_event();
        }
    }
}
//endregion

//region Mouse
class mouse{
    constructor(){
        this.x=0;
        this.y=0;
        this.xRel=0;
        this.yRel=0;
        this.mb_left=0;
        this.mb_right=0;
        this.mb_middle=0;
    }
}
const m = mouse();
onmousemove = function(e){
    m.xRel = e.clientX;
    m.yRel = e.clientY;
}
onmousedown = function(e){
    switch (e.button){
        case 0:
            m.mb_left = true;
            break;
        case 2:
            m.mb_right = true;
            break;
        case 1:
            m.mb_middle = true;
            break;
    }
}
onmouseup = function(e){
    switch (e.button){
        case 0:
            m.mb_left = false;
            break;
        case 2:
            m.mb_right = false;
            break;
        case 1:
            m.mb_middle = false;
            break;
    }
}
//endregion

//region Camera
class camera{
    constructor(){
        this.x=0;
        this.y=0;
        this.targX=this.x;
        this.targY=this.y;
        this.zoom=1;
    }
    get(x,y){ //map coordinate to camera space
        return (x-this.x)/this.zoom,(y-this.y)/this.zoom;
    }
}
const c = camera();
//endregion

//region animation and sprites
// TODO
//endregion

//region objects 

//endregion

//region Static funcs

/*function abs(value):
INPUT: Any number
OUTPUT: The number's size but always positive
*/
function abs(value){
    return Math.abs(value);
}

/*function radians(value)
INPUT: An angle in degrees
OUTPUT: The angle in radians
*/
function radians(value){
    return radsConvert*value;
}

/*function clamp(value,min,max)
INPUT: 3 comparables (numbers)
OUTPUT: The value but capped at max, and at least min
*/
function clamp(value,min,max){
    if (value<=min){return min;}
    if (value>=max){return max;}
    return value;
}

/*function sign(value)
INPUT: A number
OUTPUT: if x is negative -1, if its positive 1, otherwise 0
*/
function sign(value){
    if (value<0){return -1;}
    if (value>0){return 1;}
    return 0;
}

/*function array_find(arrayIn,valueIn)
INPUT: An array, a value to find and whether types must be equal for comparison
OUTPUT: The value's first index or -1 if it's not found
*/
function array_find(arrayIn,valueIn,typeStrict=false){
    if (typeStrict){
        for (var ind=0; ind<arrayIn.length; ind++){
            if (arrayIn[ind]===valueIn){
                return ind;
            }
        }
    } else {
        for (var ind=0; ind<arrayIn.length; ind++){
            if (arrayIn[ind]==valueIn){
                return ind;
            }
        }
    }
    return -1;
}

/*function max(values)
INPUT: An array of comparables
OUTPUT: The first maximal value in the list
*/
function max(values){
    if (values.length==0){ //if empty list, return 0 as default value
        return 0
    }
    maxCur = values[0];
    for (var l=1; l<values.length; l++){
        if (maxCur<values[l]){
            maxCur = values[l];
        }
    }
    return maxCur;
}

/*function min(values)
INPUT: An array of comparables
OUTPUT: The first minimal value in the list
*/
function min(values){
    if (values.length==0){ //if empty list, return 0 as default value
        return 0
    }
    minCur = values[0];
    for (var l=1; l<values.length; l++){
        if (minCur>values[l]){
            minCur = values[l];
        }
    }
    return minCur;
}

/*function degrees(value)
INPUT: An angle in radians
OUTPUT: The angle in degrees
*/
function degrees(value){
    return value/radsConvert;
}

/*function point_direction(x1,y1,x2,y2)
INPUT: Two points specified by x and y coordinates
OUTPUT: The angle between them in radians (safe with delta x = 0)
*/
function point_direction(x1,y1,x2,y2){
    if (y2<y1){
        return 2*pi+Math.atan2((y2-y1),(x2-x1));
    } else {
        return Math.atan2((y2-y1),(x2-x1));
    }
}

/*function point_direction_deg(x1,y1,x2,y2)
INPUT: Two points specified by x and y coordinates
OUTPUT: The angle between them in degrees (safe with delta x = 0)
*/
function point_direction_deg(x1,y1,x2,y2){
    if (y2<y1){
        return degrees(2*pi+Math.atan2((y2-y1),(x2-x1)));
    } else {
        return degrees(Math.atan2((y2-y1),(x2-x1)));
    }
}

/*function blend_angles(ang1,ang2,value)
INPUT: two angles in degrees and a value to lerp by (>1 to get closer to second value)
a larger lerp value gets closer to ang2 by a smaller amount
OUTPUT: a new angle in degrees that is closer to ang2 based on value
*/
function blend_angles(ang1,ang2,value){ //works in degrees
    if (abs(ang2-ang1)<abs((ang2-360)-ang1)){
        return ang1+(ang2-ang1)/value;
    } else {
        return ang1+((ang2-360)-ang1)/value;
    }
}

/*function point_in_rect(xIn,yIn,left,top,right,bottom)
INPUT: a coordinate and a rectangles bounding box (real coordinates)
OUPUT: boolean whether the coodinate is within the bbox
*/
function point_in_rect(xIn,yIn,left,top,right,bottom){
    return (xIn>left && xIn< right && yIn> top && yIn< bottom);
}
//endregion