//region Canvas setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
const cw = ctx.canvas.width;
const ch = ctx.canvas.height;
const centerx=cw/2
const centery=ch/2
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

    orderDrawers(){ //orders anything in the draw array based on its z (higher z draws later)
        this.draw.sort((a,b) => a.z-b.z)
    }

    tick(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.runStep();
        this.runDraw();
        window.requestAnimationFrame(this.tick) //reruns function at rate of monitor refresh rate/second
    }

    runStep(){
        //all object step events
        //to add an object, append its reference to the scheduler.step
        for (var i=0;i<this.step.length;i++){
            this.step[i].step();
        }
    }

    runDraw(){
        //all object draw events
        //to add an object, add its reference to the scheduler.draw
        for (var i=0;i<this.draw.length;i++){
            this.draw[i].draw();
        }
    }
}
const s = new scheduler();
s.tick=function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    s.runStep();
    s.runDraw();
    window.requestAnimationFrame(s.tick) //reruns function at rate of monitor refresh rate/second
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
        this.grabPoint = undefined;
        //frame old x and y, to calculate delta x and y for the mouse
        this.ox=undefined;
        this.oy=undefined;
        this.selected=undefined;
        /*If true will cycle the z values of the clickable elements to bring
        the selected object to the front*/
        this.raiseSelected=true;
        //append object reference to this to listen for clicks
        //object reference MUST implement the method onClick()
        //object MUST contain variables this.x,this.y.this.bbox
        this.leftclickListeners=[] 
    }
    get(x,y){
        return [(x-c.x)/c.zoom,(y-c.y)/c.zoom]
    }
    orderClickers(){
        //order clickers based on z (the closest thing to view gets selected first)
        this.leftclickListeners.sort((a,b) => b.z-a.z) 
    }
    raiseClicker(i){ //pass index to leftClickListeners
        let tempStore=this.leftclickListeners[0].z;
        for (let j=i-1; j>-1; j--){
            this.leftclickListeners[j].z=this.leftclickListeners[j+1].z;
        }
        this.leftclickListeners[i].z=tempStore;
        this.orderClickers();
    }
    onClick(){
        let listenersLen=this.leftclickListeners.length
        for (let i=0; i<listenersLen; i++){
            const obj=this.leftclickListeners[i]
            if (obj.bbox.length==1){ //circle
                if (Math.sqrt(Math.pow(obj.x-this.x,2)+Math.pow(obj.y-this.y,2)) < obj.bbox[0]){
                    if (obj.onClick()) { //call on click and if true, mouse event captured
                        //if raiseSelected on, will bring selected element to the front
                        //and move the rest back accordingly
                        if (this.raiseSelected && listenersLen>1){this.raiseClicker(i)}
                        break //mouse event captured, stop looking
                    }
                }
            }
        }
    }
}
const m = new mouse();
onmousemove = function(e){
    m.xRel = e.clientX;
    m.yRel = e.clientY;
    m.x = (m.xRel)/c.zoom + c.x;
    m.y = (m.yRel)/c.zoom + c.y;
    if (m.mb_middle){
        if (m.ox!=m.x || m.oy!=m.y){
            c.x-=(m.xRel-m.ox)/c.zoom
            c.y-=(m.yRel-m.oy)/c.zoom
            m.ox=m.xRel
            m.oy=m.yRel
        }
    }
}
onmousedown = function(e){
    switch (e.button){
        case 0:
            m.mb_left = true;
            m.onClick();
            break;
        case 2:
            m.mb_right = true;
            break;
        case 1:
            m.mb_middle = true;
            m.grabPoint = [m.xRel,m.yRel];
            m.ox=m.xRel;
            m.oy=m.yRel;
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
        return [(x-this.x)*this.zoom,(y-this.y)*this.zoom];
    }
    zoomTo(delta){
        // Mouse coordinate before zoom
        const bx = m.xRel / c.zoom + c.x;
        const by = m.yRel / c.zoom + c.y;
        // Apply zoom
        c.zoom/=Math.pow(1.1,delta);
        c.zoom=clamp(c.zoom,0.1,10);
        // Mouse coordinate after zoom
        const ax = m.xRel / c.zoom + c.x;
        const ay = m.yRel / c.zoom + c.y;
        // Adjust camera position to compensate
        c.x += bx - ax;
        c.y += by - ay;
    }
}
const c = new camera();
//endregion

//region sprites
class sprite {
    constructor(type,bbox,parent=this,colour="#FF0000",x=150,y=150,z=0){
        this.type=type;
        this.colour=colour;
        this.bbox=bbox;
        this.parent=parent;
        this.z=z;
        this.x=x;
        this.y=y;
        s.draw.push(this);
        s.orderDrawers();
    }
    draw(){ //draws circle at parent position
        if (this.type == "c"){ //circle
            ctx.fillStyle=this.colour;
            ctx.beginPath();
            let [x,y]=c.get(this.parent.x,this.parent.y);
            ctx.arc(x,y,this.bbox[0]*c.zoom, 0, 2 * Math.PI);
            ctx.fillStyle = this.colour;
            ctx.fill();
        }
    }
    kill(){
        //remove self from the draw registered objects
        drawInd=s.draw.indexOf(this)
        if (drawInd!=-1) s.splice(drawInd,1)
    }
}
//endregion

//region objects 
class node{
    constructor(x=0,y=0,radius=50,colour="#FF0000",z=0){
        this.spr = new sprite("c",[radius],this,colour,x,y,z);
        this.x=x;
        this.y=y;
        this.z=z;
        this.bbox=[radius];
        s.step.push(this);
        m.leftclickListeners.push(this);
        m.orderClickers();
        this.grabOffset=[0,0];
        this.grabbed=false;
    }
    step(){
        if (this.grabbed){
            if (!m.mb_left){
                this.grabbed=false;
            } else {
                this.x=m.x+this.grabOffset[0];
                this.y=m.y+this.grabOffset[1];
            }
        }
        //move sprite to self in case moved
        if (this.spr.z!=this.z){
            this.spr.z=this.z;
            s.orderDrawers();
        }
        this.spr.x=this.x;
        this.spr.y=this.y;
    }
    onClick(){
        this.grabbed=true;
        this.grabOffset = [this.x-m.x,this.y-m.y];
        return true; //capture input- only one node grabbed at a time
    }
}
//endregion

//region Static funcs

/*abs(value):
INPUT: Any number
OUTPUT: The number's size but always positive
*/
function abs(value){
    return Math.abs(value);
}

/*radians(value)
INPUT: An angle in degrees
OUTPUT: The angle in radians
*/
function radians(value){
    return radsConvert*value;
}

/*clamp(value,min,max)
INPUT: 3 comparables (numbers)
OUTPUT: The value but capped at max, and at least min
*/
function clamp(value,min,max){
    if (value<=min){return min;}
    if (value>=max){return max;}
    return value;
}

/*sign(value)
INPUT: A number
OUTPUT: if x is negative -1, if its positive 1, otherwise 0
*/
function sign(value){
    if (value<0){return -1;}
    if (value>0){return 1;}
    return 0;
}

/*array_find(arrayIn,valueIn)
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

/*max(values)
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

/*min(values)
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

/*degrees(value)
INPUT: An angle in radians
OUTPUT: The angle in degrees
*/
function degrees(value){
    return value/radsConvert;
}

/*point_direction(x1,y1,x2,y2)
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

/*point_direction_deg(x1,y1,x2,y2)
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

/*blend_angles(ang1,ang2,value)
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

/*point_in_rect(xIn,yIn,left,top,right,bottom)
INPUT: a coordinate and a rectangles bounding box (real coordinates)
OUPUT: boolean whether the coodinate is within the bbox
*/
function point_in_rect(xIn,yIn,left,top,right,bottom){
    return (xIn>left && xIn< right && yIn> top && yIn< bottom);
}

function point_in_circle(xIn,yIn,xC,yC,radius){
    return Math.sqrt(Math.pow(xIn-xC,2)+Math.pow(yIn-yC,2))<=radius
}

/*hex_to_dec(hexString)
INPUT: a string of form "#FF00FF" that represents a colour. Uppercase/lowercase is irrelevant
OUTPUT: an array of the r,g and b values of the colour
*/
const hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]
function hex_to_dec(hexString){ //this only works for 6 character hex codes because thats all i need it for
    hexString = hexString.toLowerCase().replaceAll("#","");
    var value = [];
    for (let i=0; i<hexString.length; i++){
        value.push(hexDigits.indexOf(hexString.charAt(i)));
    }
    return [16*value[0]+value[1],16*value[2]+value[3],16*value[4]+value[5]];
}

/*dec_to_hex(decimalArray)
INPUT: An array of length 3 of integers from 0-255 representing r,g and b values of a colour
OUTPUT: The hex value of the colour in form "#ff00ff". Characters are returned lowercase
*/
function dec_to_hex(decimalArray){
    var value = "#";
    value += hexDigits[Math.floor(decimalArray[0]/16)]+hexDigits[Math.floor(decimalArray[0]%16)]
    value += hexDigits[Math.floor(decimalArray[1]/16)]+hexDigits[Math.floor(decimalArray[1]%16)]
    value += hexDigits[Math.floor(decimalArray[2]/16)]+hexDigits[Math.floor(decimalArray[2]%16)]
    return value
}

/*random_colour()
OUTPUT: A random hex colour string of form "#ff00ff"
*/
function random_colour(){
    return dec_to_hex(
        [Math.floor(Math.random()*255),
        Math.floor(Math.random()*255),
        Math.floor(Math.random()*255)]
    )
}
//endregion

//region listeners
window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    c.zoomTo(delta)
});

//region Test code
let n1 =new node(200,200,50,random_colour(),1)
let n2 =new node(250,200,50,random_colour(),2)
let n3 =new node(250,200,50,random_colour(),3)
let n4 =new node(250,200,50,random_colour(),3)

//region Setup
s.tick();