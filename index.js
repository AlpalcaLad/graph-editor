//region Canvas setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth-25;
ctx.canvas.height = window.innerHeight-25;
const cw = ctx.canvas.width;
const ch = ctx.canvas.height;
const centerx=cw/2
const centery=ch/2
//endregion

//region Constants
const mainFont = "30px Arial";
ctx.font=mainFont;
const pi = Math.PI;
const E = 2.71828;
const radsConvert = (2*pi/360);
//end region

//region Debugger
//tool that keeps track of fps (max 1000fps)
//currently fps is too good to be measured lol
class debuggingTool{
    constructor(){
        this.timer=new Date(); //create date object to get times

        this.frameTimes=[];
        this.frameTimesLength=60;

        this.stepTimes=[];
        this.stepTimesLength=60;
        this.stepStart=this.timer.getTime();

        this.drawTimes=[];
        this.drawTimesLength=60;
        this.drawStart=this.stepStart;
        this.z=1000 //ui elements draw very far forwards (should replace with post draw soon)
    }
    startStep(){this.stepStart=this.timer.getTime()} //before step events
    endStep(){ //after step events
        this.stepTimes.push(this.timer.getTime()-this.stepStart)
        //if >60 values, remove oldest one
        if (this.stepTimes.length>this.stepTimesLength){this.stepTimes.splice(0,1)}
    }
    startDraw(){this.drawStart=this.timer.getTime()} //before draw events
    endDraw(){ //after draw events
        this.drawTimes.push(this.timer.getTime()-this.drawStart)
        //if >60 values, remove oldest one
        if (this.drawTimes.length>this.drawTimesLength){this.drawTimes.splice(0,1)}
    }
    draw(){ //calculate average of last 60 steps and draws
        ctx.font = "15px Arial"; //use smaller font for this
        ctx.fillStyle="#000000"
        if (this.stepTimes.length>0){
            ctx.fillText("Step Length (ms): "+average(this.stepTimes),10,20);
        } if (this.drawTimes.length>0){
            ctx.fillText("Draw Length (ms): "+average(this.drawTimes),10,40);
        }
    }
}

//region Scheduler
/*This object manages the scheduling of nodes etc.
It operates using two arrays: step and draw. These are not self managed,
Objects that wish to be ran must:
    -append themselves
    -remove themselves when destroyed.
All step events are ran each tick, followed by all draw events
*/

class scheduler{
    constructor(){
        //objects who have requested to be called during processing
        //NOT self managed, objects will need to implement a kill method
        //to remove themselves from these arrays
        this.prestep=[];
        this.step = [];
        this.draw = [];
        this.frameRate=60; //already handled by requestAnimation Frame
        //TODO update frameRate to reflect monitor refresh rate
        this.elapsed=0; //seconds elapsed in program
        this.debugMode=true;
        this.debugger=undefined;
        if (this.debugMode){
            this.debugger=new debuggingTool();
            this.draw.push(this.debugger);
        }
    }

    //orders anything in the draw array based on its z (higher z draws later)
    orderDrawers(){ 
        this.draw.sort((a,b) => a.z-b.z)
    }

    //every animation frame, clear canvas, run steps, run draws and schedule self
    tick(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.runStep();
        this.runDraw();
        window.requestAnimationFrame(this.tick) //reruns function at rate of monitor refresh rate/second
    }

    runStep(){
        //all object step events
        //to add an object, append its reference to the scheduler.step
        if (this.debugMode){this.debugger.startStep();}
        //loop through all objects that registered themselves to prestep and step
        for (var i=0;i<this.prestep.length;i++){
            this.prestep[i].prestep();
        }
        for (var i=0;i<this.step.length;i++){
            this.step[i].step();
        }
        if (this.debugMode){this.debugger.endStep();}
    }

    runDraw(){
        //all object draw events
        //to add an object, add its reference to the scheduler.draw
        if (this.debugMode){this.debugger.startDraw();}
        //loop through all objects that registered themselves to draw
        for (var i=0;i<this.draw.length;i++){
            this.draw[i].draw();
        }
        if (this.debugMode){this.debugger.endDraw();}
    }
}
const s = new scheduler(); //create a single scheduler to handle game
//redefine tick to use the constant pointer rather than a hanging 'this'
//this is needed as the requestAnimationFrame cannot provide arguments
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
    get(x,y){ //get coordinate relative to camera (redundant-> TODO remove this)
        return [(x-c.x)/c.zoom,(y-c.y)/c.zoom]
    }
    orderClickers(){
        //order clickers based on z (the closest thing to view gets selected first)
        this.leftclickListeners.sort((a,b) => b.z-a.z) 
    }
    //raises the specified element to the top of the canvas (relative to other clickables)
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
const m = new mouse(); //instantiate static mouse object
//the below are predefined javascript functions that capture mouse movement and clicks
onmousemove = function(e){
    m.xRel = e.clientX;
    m.yRel = e.clientY;
    //calculate new mouse position relative to camera
    m.x = (m.xRel)/c.zoom + c.x;
    m.y = (m.yRel)/c.zoom + c.y;
    if (m.mb_middle){ //if mouse moved and is dragging, adjust camera view based on new position
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
        case 0: //left click
            m.mb_left = true;
            m.onClick();
            break;
        case 2: //right click
            m.mb_right = true;
            break;
        case 1: //middle click
            m.mb_middle = true;
            m.grabPoint = [m.xRel,m.yRel];
            m.ox=m.xRel;
            m.oy=m.yRel;
            break;
    }
}
onmouseup = function(e){
    switch (e.button){
        case 0: //left click stopped
            m.mb_left = false;
            break;
        case 2: //right click stopped
            m.mb_right = false;
            break;
        case 1: //middle click stopped
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
        //a larger zoom means a closer view
        this.zoomMax=10;
        this.zoomMin=0.1;
    }
    get(x,y){ //map coordinate to camera space
        return [(x-this.x)*this.zoom,(y-this.y)*this.zoom];
    }
    zoomTo(delta){
        // Mouse coordinate before zoom 
        //(equivilent to mouse.get but i chose to just do it statically)
        const bx = m.xRel / c.zoom + c.x;
        const by = m.yRel / c.zoom + c.y;
        // Apply zoom
        c.zoom/=Math.pow(1.1,delta);
        c.zoom=clamp(c.zoom,this.zoomMin,this.zoomMax);
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
        s.draw.push(this); //register self to draw
        s.orderDrawers(); //sort drawers now theres a new element
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

//region node base class 
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
//region physics node
const physicsNodes=[]
const doGravity = false; //whether nodes should process gravity
const G = 5 //gravitational constant
const collisionRepulsion=1;
class physicsNode extends node{
    constructor(x=0,y=0,radius=50,colour="#FF0000",z=0,mass=1,elasticity=0.5){
        super(x,y,radius,colour,z);
        this.m=mass;
        this.e=elasticity;
        this.r=radius
        physicsNodes.push(this);
        s.prestep.push(this);
        this.vsp=0
        this.hsp=0
        this.frict=1.05
    }
    prestep(){ //do all gravity and repulsion before anything moves
        if (doGravity){
            for (let i=0; i<physicsNodes.length; i++){
                let n = physicsNodes[i]
                if (n!=this && this.dist(n)>(n.r+this.r+2)){
                    this.force( //GMm/r^2
                        G*this.m*n.m/Math.pow(this.dist(n),2),
                        [n.x-this.x,n.y-this.y]
                    )
                }
            }
        }
    }
    step(){
        if (this.grabbed){
            if (!m.mb_left){
                this.grabbed=false;
            } else {
                this.hsp=((m.x+this.grabOffset[0])-this.x)/5;
                this.vsp=((m.y+this.grabOffset[1])-this.y)/5;
            }
        }
        this.hsp/=this.frict
        this.vsp/=this.frict
        if (this.place_meeting(this.x+this.hsp,this.y+this.vsp)){
            let collidingObjects=this.colliders(this.x+this.hsp,this.y+this.vsp);
            //let center = this.center_of_mass(collidingObjects);
            for (let i=0; i<collidingObjects.length; i++){
                let n = collidingObjects[i]
                //if already colliding perform repulsion
                if (this.node_collision(this.x,this.y,n)){
                    this.force(-collisionRepulsion,[n.x-this.x,n.y-this.y]);
                } else { //otherwise do elastic collision
                    let vec = normalize([this.hsp,this.vsp]) //step in direction until collision
                    while (!this.place_meeting(this.x+vec[0],this.y+vec[1])){
                        this.x+=vec[0]
                        this.y+=vec[1]
                    }
                    inelastic_collision(this,n)
                }
            } 
        }

        //movement
        this.x+=this.hsp
        this.y+=this.vsp
        //move sprite to self in case moved
        if (this.spr.z!=this.z){
            this.spr.z=this.z;
            s.orderDrawers();
        }
        this.spr.x=this.x;
        this.spr.y=this.y;
    }
    force(magnitude,direction){
        normalize(direction);
        this.hsp+=direction[0]*magnitude/this.m
        this.vsp+=direction[1]*magnitude/this.m
    }
    center_of_mass(nodes){
        let xSum=0
        let ySum=0
        let massSum=0
        for (let i=0; i<nodes.length; i++){
            xSum+=nodes[i].x*nodes[i].m;
            ySum+=nodes[i].y*nodes[i].m;
            massSum+=nodes[i].m;
        }
        if (massSum==0){return [this.x,this.y]}
        return [xSum/massSum,ySum/massSum];
    }
    dist(n){ //distance to node
        return Math.sqrt(Math.pow(this.x-n.x,2)+Math.pow(this.y-n.y,2))
    }
    colliders(x,y){ //returns list of objects that would collide with self at x,y
        let collidingObjects=[];
        for (let i=0; i<physicsNodes.length; i++){
            if (physicsNodes[i]!=this){
                if (this.node_collision(x,y,physicsNodes[i])){collidingObjects.push(physicsNodes[i])}
            }
        }
        return collidingObjects;
    }
    place_meeting(x,y){ //returns whether any objects would collide with self at x,y
        for (let i=0; i<physicsNodes.length; i++){
            if (physicsNodes[i]!=this){
                if (this.node_collision(x,y,physicsNodes[i])){return true;}
            }
        }
    }
    place_meeting_nodes(x,y,nodes){ //returns whether any objects in nodes would collide with self at x,y
        for (let i=0; i<nodes.length; i++){
            if (nodes[i]!=this){
                if (this.node_collision(x,y,nodes[i])){return true;}
            }
        }
    }
    node_collision(x,y,n){ //returns whether node would collide with self at x,y
        let colliding=(Math.sqrt(Math.pow(n.x-x,2)+Math.pow(n.y-y,2))<n.r+this.r)
        return colliding
    }
}
//endregion

//region Static funcs

/* average(array)
INPUT: An array of numbers
OUTPUT: It's average value
*/
const average = array => array.reduce((a, b) => a + b) / array.length;

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

/*point_in_circle(xIn,yIn,xC,yC,radius)
INPUT: a coordinate, the circles center coordinate and its radius (real coordinates)
OUPUT: boolean whether the coodinate is within the bbox
*/
function point_in_circle(xIn,yIn,xC,yC,radius){
    return Math.sqrt(Math.pow(xIn-xC,2)+Math.pow(yIn-yC,2))<=radius
}

/*normalize(array)
INPUT: a vector like array
OUTPUT: the array normalized as if it was a vector
*/
function normalize(array){
    //if no direction- randomize
    if (array[0]==0 && array[1]==0){array=[Math.random(),Math.random()]}
    total=0
    for (let i=0; i<array.length; i++){total+=abs(array[i]);}
    for (let i=0; i<array.length; i++){array[i]/=total;}
    return array
}

/*inelastic_collision(o1,o2)
INPUT: two physics objects that implement hsp,vsp,m and e
OUTPUT: void, the resulting velocities are applied to the objects
*/
function inelastic_collision(o1,o2){
    //SOURCE: https://en.wikipedia.org/wiki/Elastic_collision
    //unpack objects into variables
    let el = (o1.e+o2.e)/2 //naive approximation of elasticity
    let [mA,mB] = [o1.m,o2.m]
    let [uA,uB] = [normalize([o1.hsp,o1.vsp]),normalize([o2.hsp,o2.vsp])]
    const heVcom=((mA*uA[0]+mB*uB[0])/(mA+mB)) * (1+el) 
    const veVcom=((mA*uA[1]+mB*uB[1])/(mA+mB)) * (1+el)
    o1.hsp=heVcom-el*uA[0]
    o1.vsp=veVcom-el*uA[1]
    o2.hsp=heVcom-el*uB[0]
    o2.vsp=veVcom-el*uB[1]
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

//region Listeners
window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    c.zoomTo(delta)
});

//region Test code
const nodeCount = 2 //pre gen this many nodes
const nodeSeparation=250
for (let i=0; i<nodeCount; i++){
    let size = Math.random()*30+20
    new physicsNode(500+Math.random()*nodeSeparation-nodeSeparation,500+Math.random()*nodeSeparation-nodeSeparation,size,random_colour(),i,size,undefined)
}
//region Setup
s.tick();