//region Canvas setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d", {alpha:false});
ctx.canvas.width  = window.innerWidth-25;
ctx.canvas.height = window.innerHeight-100;
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

//region Debugger
class debuggingTool{
    constructor(){
        //creates new date object to be used to get time
        this.timer=new Date();
        //frames/second: not currently calculated
        this.frameTimes=[];
        this.frameTimesLength=60;
        //ms to run step events
        this.stepTimes=[];
        this.stepTimesLength=60;
        this.stepStart=this.timer.getTime();
        //ms to run draw events
        this.drawTimes=[];
        this.drawTimesLength=60;
        this.drawStart=this.stepStart;
        //draw above everything: TODO move to post draw event
        this.z=1000
    }
    //to be run before step events
    startStep(){this.stepStart=this.timer.getTime()}
    //to be run after all step events
    endStep(){
        this.stepTimes.push(this.timer.getTime()-this.stepStart)
        if (this.stepTimes.length>this.stepTimesLength){this.stepTimes.splice(0,1)}
    }
    //to be run before draw events
    startDraw(){this.drawStart=this.timer.getTime()}
    //to be run after all draw events
    endDraw(){
        this.drawTimes.push(this.timer.getTime()-this.drawStart)
        if (this.drawTimes.length>this.drawTimesLength){this.drawTimes.splice(0,1)}
    }
    draw(){
        // this.frameTimes.push(this.timer.getTime())
        // if (this.frameTimes.length>this.frameTimesLength){this.frameTimes.splice(0,1)}
        ctx.font = "15px Arial";
        ctx.fillStyle="#000000"
        if (this.stepTimes.length>0){
            ctx.fillText("Step Length (ms): "+average(this.stepTimes),10,20);
        } if (this.drawTimes.length>0){
            ctx.fillText("Draw Length (ms): "+average(this.drawTimes),10,40);
        } 
        // if (this.frameTimes.length>0){
        //     ctx.fillText("Frame Time (ms): "+(this.frameTimes[this.frameTimes.length-1]-this.frameTimes[0]).toString(),10,60);
        // }
    }
}

//region File Manager
/*.graph file format:
on each line '~' seperated:
    NodeLabel~state~arrows
NodeLabel: String, should be unique ID
NodeInfo: variableName > value all separated by |
TODO change arrows to name>value format
arrows: collection of arrow, separated by ,
arrow: variableName > value all separated by |
targetNodeLabel: String
soundFile: String
soundWeight: Numbe
states: collection of state separated by |
state: variableName > value

Example:
0~x>100|y>100~~
1~x>250|y>250~0>test.mp4>14~
2~x>450|y>350~1>test.mp4>14|0>test.mp4>14~
3~x>350|y>650~0>test.mp4>14~
*/
const loadedNodes=[];
const loadedArrows=[];
class fileManager{
    constructor(){}
    save(filename){
        //get text to save to file as a string
        let text = this.getFileContent()
        //create download element and simulate a click
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    getFileContent(){
        let text = ""
        let nodesDrawn=false
        for (const n of physicsNodes){ //each node is a line in the output
            nodesDrawn=true
            text+=n.label+"~" // "label~"
            //using Math.round to prevent excessive saving of floats
            text+="x>"+Math.round(n.x).toString() // "x>?
            text+="|y>"+Math.round(n.y).toString() // "|y>?"
            function writeElement(value, key, map) {
                text+="|"+key+">"+value.toString()
            }
            if (n.state!==undefined){
                n.state.forEach(writeElement);
            }
            text+="~" // "/"
            // "label/x>?|y>?/"
            let arrowsDrawn=false
            //draw text for each state of the selected object
            for (const a of loadedArrows){ //loop through all arrows to find relevant ones
                if (a.parent==n){
                    arrowsDrawn=true
                    text+="target>"+a.target.label
                    if (a.state!==undefined){
                        a.state.forEach(writeElement);
                    }
                    text+=","
                }
            }
            if (arrowsDrawn) text=text.slice(0,-1) //remove final , character
            text+="\n"
        }
        if (nodesDrawn) text=text.slice(0,-1) //remove final \n character
        return text
    }
    load(){
        killAll() //remove all current nodes before loading file
        const file = inputElement.files[0]
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            () => {
                f.process(reader.result);
            },
            false,
        );
        if (file) {
            reader.readAsText(file);
        }
    }
    process(text){
        //two passes: load all nodes, then assign arrows to their targets
        //first pass
        loadedNodes.length=0 //keep track of loaded nodes
        const loadedNodeLabels=[] //keep track of those labels (to repoint arrows later)
        loadedArrows.length=0 //keep track of all the arrows that need repointing
        let row = []
        let nodeInfo = []
        text=text.replaceAll("\r","\n") //get rid of carridge returns bc what are they doing in my text file??
        for (const n of text.split("\n")){
            if (n=="") continue
            row = n.split("~")
            nodeInfo = row[1].split("|")
            let x = 0
            let y = 0
            let state;
            state = new Map();
            for (const variable of nodeInfo){
                const toSet = variable.split(">");
                if (toSet[0]=="x") x=parseInt(toSet[1]);
                else if (toSet[0]=="y") y=parseInt(toSet[1]);
                else{
                    if (toSet[1]=="true") {toSet[1]==true;}
                    if (toSet[1]=="false") {toSet[1]==false;}
                    state.set(toSet[0],toSet[1]);
                }
            }
            const generatedNode=new physicsNode(x,y,50,random_colour(),loadedNodes.length,50,undefined,row[0],state);
            loadedNodes.push(generatedNode);
            loadedNodeLabels.push(row[0]);
            for (const a of row[2].split(",")){
                if (a.length==0){continue;}
                let target=undefined;
                state = new Map();
                for (const aInfo of a.split("|")){
                    const variableToSet = aInfo.split(">");
                    if (variableToSet[0]=="target"){
                        target=variableToSet[1];
                    } else {
                        if (variableToSet[1]=="true") {variableToSet[1]==true;}
                        if (variableToSet[1]=="false") {variableToSet[1]==false;}
                        state.set(variableToSet[0],variableToSet[1]);
                    }
                }
                if (target==undefined) continue
                new arrow(generatedNode,target,undefined,true,state);
                //console.log(loadedArrows[loadedArrows.length-1])
            }
        }
        //second pass
        let found=false
        for (const a of loadedArrows){
            found=false
            for (let i=0; i<loadedNodeLabels.length; i++){
                if (loadedNodeLabels[i]===a.target){
                    a.target=loadedNodes[i];
                    found=true
                }
            }
            if (!found){ //couldn't find target node, make arrow reflexive
                a.target=a.parent
            }
        }
        //for (const x of physicsNodes){console.log(x)}
    }
}
const f = new fileManager()

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
        this.step = [];
        this.draw = [];
        this.frameRate=60; //already handled by requestAnimation Frame
        //TODO update frameRate to reflect monitor refresh rate
        this.elapsed=0; //seconds elapsed in program
        this.debugMode=true;
        this.debugger=undefined;
        if (this.debugMode){ //create debugger if debug mode enabled
            this.debugger=new debuggingTool();
            this.draw.push(this.debugger);
        }
    }

    orderDrawers(){ //orders anything in the draw array based on its z (higher z draws later)
        this.draw.sort((a,b) => a.z-b.z)
    }

    tick(){ //every frame
        //reset canvas (js uses quick drying pixels)
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF"; // without alpha
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //run all step events
        this.runStep();
        //run all draw events
        this.runDraw();
        //schedule this for next frame
        window.requestAnimationFrame(this.tick) //reruns function at rate of monitor refresh rate/second
    }

    runStep(){
        //all object step events
        //to add an object, append its reference to the scheduler.step
        if (this.debugMode){this.debugger.startStep();}
        for (var i=0;i<this.step.length;i++){
            this.step[i].step();
        }
        if (this.debugMode){this.debugger.endStep();}
    }

    runDraw(){
        //all object draw events
        //to add an object, add its reference to the scheduler.draw
        if (this.debugMode){this.debugger.startDraw();}
        for (var i=0;i<this.draw.length;i++){
            this.draw[i].draw();
        }
        if (this.debugMode){this.debugger.endDraw();}
        ctx.fillStyle = "#000000";
    }
}
//create static reference to a scheduler object
const s = new scheduler();
//redefine that object's tick to point to the static reference
//not quite sure why, but this prevents a crash
s.tick=function(){
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF"; // without alpha
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        this.mouseOffset=[-5,-60] //force mouse position to be top left of cursor
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
        //single click detection
        this.r=0 //for arrow holding
        this.arrowHeld=undefined
        this.singleClicking=false
        this.lmbTime=0
        this.lmbTimeMax=20
        s.step.push(this)
    }
    step(){
        if (this.mb_left){
            this.lmbTime++
            if (this.lmbTime>this.lmbTimeMax){
                this.singleClicking=false;
            }
        }
    }
    get(x=this.x,y=this.y){
        return [(x-c.x)*c.zoom,(y-c.y)*c.zoom]
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
        //set single click- if still true when stop clicking
        //single click was performed, make an arrow
        this.singleClicking=true;
        this.lmbTime=0;
        for (let i=0; i<listenersLen; i++){
            const obj=this.leftclickListeners[i]
            if (obj.bbox.length==1){ //circle
                if (Math.sqrt(Math.pow(obj.x-this.x,2)+Math.pow(obj.y-this.y,2)) < obj.bbox[0]){
                    if (obj.onClick()) { //call on click and if true, mouse event captured
                        //if raiseSelected on, will bring selected element to the front
                        //and move the rest back accordingly
                        this.selected=this.leftclickListeners[i] //selecting object
                        if (this.arrowHeld!==undefined){ //if holding arrow, repoint to target
                            this.arrowHeld.target=this.selected
                            this.arrowHeld=undefined
                            //arrow attached, don't allow object to be dragged
                            this.selected=undefined
                            break
                        }
                        if (this.raiseSelected && listenersLen>1){this.raiseClicker(i)}
                        break //mouse event captured, stop looking
                    }
                }
            }
        }
        if (this.arrowHeld!==undefined){ //if holding arrow without claimant, kill it
            this.arrowHeld.kill()
            this.arrowHeld=undefined
        }
    }
    onStopClicking(){
        if (this.singleClicking){
            if (this.selected !== undefined){
                this.arrowHeld=new arrow(this.selected,this,undefined,true)
            }
        }
        this.selected=undefined
    }
}
//define static pointer to a mouse object 
const m = new mouse();
onmousemove = function(e){
    //xRel,yRel are screen relative
    m.xRel = e.clientX+m.mouseOffset[0];
    m.yRel = e.clientY+m.mouseOffset[1];
    //if middle clicking, move camera based on the mouse's position delta
    if (m.mb_middle){
        if (m.ox!=m.xRel || m.oy!=m.yRel){
            c.x-=(m.xRel-m.ox)/c.zoom
            c.y-=(m.yRel-m.oy)/c.zoom
            m.ox=m.xRel
            m.oy=m.yRel
        }
    } 
    //x,y are world space coordinates
    m.x = (m.xRel)/c.zoom + c.x;
    m.y = (m.yRel)/c.zoom + c.y;
}
onmousedown = function(e){
    switch (e.button){
        case 0: //LMB
            m.mb_left = true;
            m.onClick();
            break;
        case 2: //RMB
            m.mb_right = true;
            break;
        case 1: //MMB
            m.mb_middle = true;
            m.grabPoint = [m.xRel,m.yRel];
            m.ox=m.xRel;
            m.oy=m.yRel;
            break;
    }
}
onmouseup = function(e){
    switch (e.button){
        case 0: //LMB
            m.onStopClicking();
            m.mb_left = false;
            break;
        case 2: //RMB
            m.mb_right = false;
            break;
        case 1: //MMB
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
        let drawInd=s.draw.indexOf(this)
        if (drawInd!=-1) s.draw.splice(drawInd,1)
        delete this;
    }
}
//endregion

//region node base class 
class nodeBase{
    constructor(x=0,y=0,radius=50,colour="#FF0000",z=0,state=new Map()){
        this.spr = new sprite("c",[radius],this,colour,x,y,z);
        this.x=x;
        this.y=y;
        this.z=z;
        this.bbox=[radius];
        s.step.push(this);
        m.leftclickListeners.push(this);
        m.orderClickers(); //sort draw list based on z coordinates
        this.grabOffset=[0,0];
        this.grabbed=false;
        this.state=state;
    }
    kill(){
        let ind = m.leftclickListeners.indexOf(this)
        if (ind!=-1){
            m.leftclickListeners.splice(ind,1)
        }
        ind = m.leftclickListeners.indexOf(this)
        if (ind!=-1){
            m.leftclickListeners.splice(ind,1)
        }
        this.spr.kill()
        delete this
    }
    step(){
        //if being dragged by mouse, perform this logic first
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
const drawLabels = true
class physicsNode extends nodeBase{
    constructor(x=0,y=0,radius=50,colour="#FF0000",z=0,mass=1,elasticity=0.5,label=undefined,state=undefined){
        super(x,y,radius,colour,z-1,state);
        this.m=mass;
        //elasticity currently unused
        //would inform inelastic collisions
        this.e=elasticity;
        this.r=radius
        physicsNodes.push(this);
        if (drawLabels) s.draw.push(this);
        //vertical and horizontal speed
        this.vsp=0
        this.hsp=0
        //velocity is divided by this each step to simulate friction
        this.frict=1.05
        if (label===undefined) this.label=physicsNodes.indexOf(this)
        else this.label=label
    }
    kill(){
        let ind = physicsNodes.indexOf(this)
        if (ind!=-1){
            physicsNodes.splice(ind,1)
        }
        ind = s.draw.indexOf(this)
        if (ind!=-1){
            s.draw.splice(ind,1)
        }
        for (let i=0; i<loadedArrows.length; i++){
            if (loadedArrows[i].target===this || loadedArrows[i].parent===this){
                loadedArrows[i].kill()
                i-=1
            }
        }
        super.kill()
    }
    setColour(col){
        this.spr.colour=col;
    }
    draw(){
        ctx.font = "15px Arial";
        ctx.fillStyle=appropriate_text_color(this.spr.colour)
        let [x,y]=c.get(this.x,this.y)
        ctx.fillText(this.label,x,y);
    }
    //step is completely overwritten- base node logic not used
    step(){ //each frame
        //if being dragged by mouse, perform this logic first
        if (this.grabbed){
            if (!m.mb_left){
                this.grabbed=false;
            } else {
                this.hsp=((m.x+this.grabOffset[0])-this.x)/5;
                this.vsp=((m.y+this.grabOffset[1])-this.y)/5;
            }
        }
        //adjust speed based on friction
        //if (abs(this.x)+abs(this.y)>10000) console.log(this.x,this.y)
        this.hsp/=this.frict
        this.vsp/=this.frict
        if (abs(this.hsp)<0.05) this.hsp=0
        if (abs(this.vsp)<0.05) this.vsp=0

        //collision and movement
        if (this.place_meeting(this.x+this.hsp,this.y+this.vsp)){
            let collidingObjects=this.colliders(this.x+this.hsp,this.y+this.vsp);
            let center = this.center_of_mass(collidingObjects);
            this.force(-15,[center[0]-this.x,center[1]-this.y]);
        }
        this.x+=this.hsp
        this.y+=this.vsp
        //move sprite to self in case moved
        if (this.spr.z!=this.z){
            this.spr.z=this.z-1;
            s.orderDrawers();
        }
        this.spr.x=this.x;
        this.spr.y=this.y;
    }
    //applies a force in a direction 
    force(magnitude,direction){
        normalize(direction);
        this.hsp+=direction[0]*magnitude/this.m
        this.vsp+=direction[1]*magnitude/this.m
    }
    //gets the center of a collection of nodes
    //currently unused
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
    //returns a collection of objects that would collide
    //if this was at position x,y
    colliders(x,y){
        let collidingObjects=[];
        for (let i=0; i<physicsNodes.length; i++){
            if (physicsNodes[i]!=this){
                if (this.node_collision(x,y,physicsNodes[i])){collidingObjects.push(physicsNodes[i])}
            }
        }
        return collidingObjects;
    }
    //returns a boolean as to whether this would touch another node at x,y
    //choses nodes from the constant physicsNodes list
    place_meeting(x,y){
        for (let i=0; i<physicsNodes.length; i++){
            if (physicsNodes[i]!=this){
                if (this.node_collision(x,y,physicsNodes[i])){return true;}
            }
        }
        return false;
    }
    //returns a boolean as to whether this would touch another node at x,y
    //choses nodes from a provided collection
    place_meeting_nodes(x,y,nodes){
        for (let i=0; i<nodes.length; i++){
            if (nodes[i]!=this){
                if (this.node_collision(x,y,nodes[i])){return true;}
            }
        }
    }
    //returns whether this would collide with a specific node at x,y
    node_collision(x,y,n){
        let colliding=(Math.sqrt(Math.pow(n.x-this.x,2)+Math.pow(n.y-this.y,2))<n.r+this.r)
        return colliding
    }
    //returns the euclidian distance between this and a provided node
    dist(n){
        return Math.sqrt(Math.pow(n.x-this.x,2)+Math.pow(n.y-this.y,2))
    }
}
//endregion

//region selected screen
//this adds a rectangular view to the right of the screen which shows which object is selected (using key 's')
//this is also used for showing states and editing them
class selectionScreen{
    constructor(){
        this.visible = false;
        this.bbox = [-125,-300,125,300]
        this.padding = 5;
        this.x=ctx.canvas.width-150;
        this.y=350;
        s.draw.push(this);
        this.z = 10000;
        this.borderColour = "#000000"
        this.backColour = "#FFFFFF"
        this.selected = undefined;
        this.targetNode = undefined;
        this.currentNode = undefined;
    }
    selectNode(isTarget=false){
        if (isTarget){this.targetNode = this.selected}
        else {this.currentNode = this.selected}
    }
    draw(){
        if (this.visible){
            ctx.fillStyle=this.borderColour;
            ctx.fillRect(this.x+this.bbox[0],this.y+this.bbox[1],this.bbox[2]-this.bbox[0],this.bbox[3]-this.bbox[1]);
            ctx.fillStyle=this.backColour;
            ctx.fillRect(this.x+this.bbox[0]+this.padding,this.y+this.bbox[1]+this.padding,this.bbox[2]-this.bbox[0]-2*this.padding,this.bbox[3]-this.bbox[1]-2*this.padding);
            if (this.selected !== undefined){ //draw icon for selected object
                if (this.selected instanceof nodeBase){
                    ctx.fillStyle=this.selected.spr.colour;
                    ctx.beginPath();
                    let [x,y]=[this.x,this.y+this.bbox[1]+75];
                    ctx.arc(x,y,40, 0, 2 * Math.PI);
                    ctx.fillStyle = this.selected.spr.colour;
                    ctx.fill();
                    ctx.font = "15px Arial";
                    ctx.fillStyle=appropriate_text_color(this.selected.spr.colour)
                    ctx.fillText(this.selected.label,x,y);

                    //draw text for each state of the selected object
                    if (this.selected.state!==undefined){
                        let statesWritten = 0
                        function logMapElements(value, key, map) {
                            ctx.fillText(`${key}: ${value}`,x-ctx.measureText(`${key}: ${value}`).width/2,y+75+25*statesWritten);
                            statesWritten++
                        }
                        ctx.fillStyle="#000000"
                        this.selected.state.forEach(logMapElements);
                    }
                } else if (this.selected instanceof arrow){

                    //draw arrow parent
                    ctx.fillStyle=this.selected.parent.spr.colour;
                    ctx.beginPath();
                    let [x1,y1]=[this.x-60,this.y+this.bbox[1]+75];
                    ctx.arc(x1,y1,35, 0, 2 * Math.PI);
                    ctx.fillStyle = this.selected.parent.spr.colour;
                    ctx.fill();
                    ctx.font = "15px Arial";
                    ctx.fillStyle=appropriate_text_color(this.selected.parent.spr.colour)
                    ctx.fillText(this.selected.parent.label,x1,y1);

                    //draw arrow target
                    ctx.fillStyle=this.selected.target.spr.colour;
                    ctx.beginPath();
                    let [x2,y2]=[this.x+60,this.y+this.bbox[1]+75];
                    ctx.arc(x2,y2,35, 0, 2 * Math.PI);
                    ctx.fillStyle = this.selected.target.spr.colour;
                    ctx.fill();
                    ctx.font = "15px Arial";
                    ctx.fillStyle=appropriate_text_color(this.selected.target.spr.colour)
                    ctx.fillText(this.selected.target.label,x2,y2);
                    
                    //draw arrow between the two
                    //TODO abstract arrow drawing into function
                    ctx.fillStyle=this.colour;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    [x1,y1] = [x1+35,y1]
                    ctx.moveTo(x1,y1);
                    [x2,y2] = [x2-35,y2]
                    ctx.lineTo(x2-20,y2);
                    ctx.stroke();
                    //SOURCE: https://stackoverflow.com/questions/808826/drawing-an-arrow-using-html-canvas
                    //starting a new path from the head of the arrow to one of the sides of the point
                    ctx.beginPath();
                    ctx.fillStyle="#000000";
                    let angle = 0 //using same formula as for arrow class but with angle 0
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2-headLength*Math.cos(angle-Math.PI/headWidth),y2-headLength*Math.sin(angle-Math.PI/headWidth));
                    //path from the side point of the arrow, to the other side point
                    ctx.lineTo(x2-headLength*Math.cos(angle+Math.PI/headWidth),y2-headLength*Math.sin(angle+Math.PI/headWidth));
                    //path from the side point back to the tip of the arrow, and then again to the opposite side point
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x2-headLength*Math.cos(angle-Math.PI/headWidth),y2-headLength*Math.sin(angle-Math.PI/headWidth));
                    ctx.fill();

                    let [x,y] = [(x1+x2)/2,(y1+y2)/2];

                    //draw text for each state of the selected object
                    if (this.selected.state!==undefined){
                        let statesWritten = 0
                        function logMapElements(value, key, map) {
                            ctx.fillText(`${key}: ${value}`,x-ctx.measureText(`${key}: ${value}`).width/2,y+75+25*statesWritten);
                            statesWritten++
                        }
                        ctx.fillStyle="#000000"
                        this.selected.state.forEach(logMapElements);
                    }
                }
            }
        }
    }
    onChange(obj){
        if (obj === undefined) this.visible = false
        else {
            this.visible = true
            this.selected = obj;
        }
    }
    update(stateString){
        let sepArray = stateString.split(":")
        if (this.selected!==undefined && sepArray.length==2){
            if (sepArray[1]=="true"){
                this.selected.state.set(sepArray[0],true) //boolean
            } else if (sepArray[1]=="false"){
                this.selected.state.set(sepArray[0],false) //boolean
            } else {
                if (!isNaN(+sepArray[1])){
                    this.selected.state.set(sepArray[0],+sepArray[1]) //number
                } else{
                    this.selected.state.set(sepArray[0],sepArray[1]) //string
                }
            }
        }
    }
}
const selection = new selectionScreen()
//endregion

//region arrows
const minArrowLength=8
const arrowFromNodeDist=4
const headLength = 20;
const headWidth = 6;
class arrow{
    constructor(parent,target=parent,colour="#000000",directed=true,state=new Map()){
        this.parent=parent;
        this.target=target;
        this.colour=colour;
        s.draw.push(this);
        loadedArrows.push(this)
        this.z=-50; //arrows for now are just fixed depth
        this.directed=directed; //whether arrow should have a head
        this.state=state;
    }

    center(){
        if (this.parent==this.target){
            return [
                this.parent.x+this.parent.r,
                this.parent.y-this.parent.r
            ]
        } else {
            return [
                (this.parent.x+this.target.x)/2,
                (this.parent.y+this.target.y)/2
            ]
        }
    }

    draw(){
        if (this.parent===undefined || this.target===undefined){this.kill()}
        if (this.parent==this.target){ //node points to itself
            ctx.fillStyle=this.colour;
            ctx.beginPath();
            ctx.lineWidth=4;
            let [x,y]=c.get(this.parent.x,this.parent.y-this.parent.r);
            ctx.moveTo(x, y);
            let [x2,y2]=c.get(this.parent.x+this.parent.r,this.parent.y);
            let [x3,y3]=c.get(this.parent.x+0.5*this.parent.r,this.parent.y-2.5*this.parent.r);
            let [x4,y4]=c.get(this.parent.x+2.5*this.parent.r,this.parent.y-0.5*this.parent.r);
            ctx.bezierCurveTo(x3,y3,x4,y4,x2,y2);
            ctx.stroke();
            ctx.beginPath();

            let angle = 90
            ctx.moveTo(x, y);
            ctx.lineTo(x-headLength*Math.cos(angle-Math.PI/headWidth),y-headLength*Math.sin(angle-Math.PI/headWidth));
            
            //path from the side point of the arrow, to the other side point
            ctx.lineTo(x-headLength*Math.cos(angle+Math.PI/headWidth),y-headLength*Math.sin(angle+Math.PI/headWidth));
            
            //path from the side point back to the tip of the arrow, and then again to the opposite side point
            ctx.lineTo(x, y);
            ctx.lineTo(x-headLength*Math.cos(angle-Math.PI/headWidth),y-headLength*Math.sin(angle-Math.PI/headWidth));
            ctx.fill();
        } else { //node points to another node
            let dist = this.parent.dist(this.target);
            if (dist>this.parent.r+this.target.r+minArrowLength){
                let vec = normalize([this.target.x-this.parent.x,this.target.y-this.parent.y])
                //console.log(vec,Math.sqrt(Math.pow(vec[0],2)+Math.pow(vec[1],2)))
                ctx.fillStyle=this.colour;
                ctx.lineWidth = 4;
                ctx.beginPath();
                let [x1,y1] = c.get(this.parent.x+vec[0]*(this.parent.r+arrowFromNodeDist),this.parent.y+vec[1]*(this.parent.r+arrowFromNodeDist))
                ctx.moveTo(x1,y1);
                let [x2,y2] = c.get(this.target.x-vec[0]*(this.target.r+arrowFromNodeDist),this.target.y-vec[1]*(this.target.r+arrowFromNodeDist))
                if (!this.directed){ctx.lineTo(x2,y2);} 
                else {//if directed, line shouldn't go quite as far
                    let x3 = x2-vec[0]*headLength;
                    let y3 = y2-vec[1]*headLength;
                    ctx.lineTo(x3,y3);
                }
                ctx.stroke();

                if (this.directed){
                    //SOURCE: https://stackoverflow.com/questions/808826/drawing-an-arrow-using-html-canvas
                    //starting a new path from the head of the arrow to one of the sides of the point
                    ctx.beginPath();
                    let angle = point_direction(x1,y1,x2,y2)
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2-headLength*Math.cos(angle-Math.PI/headWidth),y2-headLength*Math.sin(angle-Math.PI/headWidth));
                    
                    //path from the side point of the arrow, to the other side point
                    ctx.lineTo(x2-headLength*Math.cos(angle+Math.PI/headWidth),y2-headLength*Math.sin(angle+Math.PI/headWidth));
                    
                    //path from the side point back to the tip of the arrow, and then again to the opposite side point
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x2-headLength*Math.cos(angle-Math.PI/headWidth),y2-headLength*Math.sin(angle-Math.PI/headWidth));
                    ctx.fill();
                }
            }
        }
    }

    kill(){
        let ind = s.draw.indexOf(this)
        if (ind!=-1){
            s.draw.splice(ind,1)
        }
        ind = loadedArrows.indexOf(this)
        if (ind!=-1){
            loadedArrows.splice(ind,1)
        }
        delete this
    }
}

//region Static funcs

/*killAll()
Removes all physics nodes and attached arrows
*/
function killAll(){
    while (physicsNodes.length>0){
        physicsNodes[0].kill()
    }
}

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
    if (array[0]==0 && array[1]==0){return normalize([Math.random(),Math.random()])}
    total=0
    for (let i=0; i<array.length; i++){total+=Math.pow(array[i],2);}
    total=Math.sqrt(total)
    for (let i=0; i<array.length; i++){array[i]/=total;}
    return array
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

/*appropriate_text_color(backgroundHex)
INPUT: the hex code of a colour
OUTPUT: black or white depending on which would look clearer
*/
function appropriate_text_color(backgroundHex){
    const col = hex_to_dec(backgroundHex)
    const brightness = (col[0]+col[1]+col[2])/3
    if (brightness>150) return "#000000"
    else return "#FFFFFF"
}
//endregion

function point_distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
}

function nearestObjectToMouse(){
    let bestObject;
    let bestDistance=-1;
    let tempDist;
    let mPos = [m.x,m.y];
    for (let n in loadedNodes){
        tempDist = point_distance(mPos[0],mPos[1],loadedNodes[n].x,loadedNodes[n].y);
        if (bestDistance==-1 || tempDist<bestDistance){
            bestObject = loadedNodes[n];
            bestDistance=tempDist;
        }
    }
    for (let n in loadedArrows){
        let [x,y] = loadedArrows[n].center()
        tempDist = point_distance(mPos[0],mPos[1],x,y);
        if (bestDistance==-1 || tempDist<bestDistance || (tempDist==bestDistance && bestObject==selection.selected)){
            bestObject = loadedArrows[n];
            bestDistance=tempDist;
        }
    }
    return bestObject;
}

//region Listeners
window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    c.zoomTo(delta)
});

window.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    return false;
}, false);

//keyboard inputs
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented || document.getElementById("downloadTarget")==document.activeElement || document.getElementById("stateSelection")==document.activeElement) {
        return; // Do nothing if the event was already processed
    }
    switch (event.key.toLowerCase()) {
        case "s":
            selection.onChange(nearestObjectToMouse())
            break;
        case "d":
            selection.onChange(undefined)
            break;
        case "n":
            let size = 45//Math.random()*20+30
            loadedNodes.push(new physicsNode(m.x,m.y,size,random_colour(),physicsNodes.length,size,undefined,undefined))
            break;
        case "r":
            killAll()
            break;
        case "x":
            if (selection.selected !== undefined){
                selection.selected.kill();
            }
            break;

        default:
            return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);

const inputElement = document.getElementById("input");
inputElement.addEventListener("change", f.load, false);

//region Test code
const nodeCount = 5 //pre gen this many nodes
const nodeSeparation=50
for (let i=0; i<nodeCount; i++){
    let size = 45//Math.random()*30+20
    loadedNodes.push(new physicsNode(500+Math.random()*nodeSeparation-nodeSeparation,500+Math.random()*nodeSeparation-nodeSeparation,size,random_colour(),i,size,undefined,undefined))
}
//region Setup
s.tick();
//endregion

const algoNodes=[];
const algoEdges=[];
let runner;
//region Algorithm
function processAlgorithm(){
    if (runner!==undefined){
        runner.kill();
    }
    runner=new algoRunner();
}
//endregion

//region live algorithm
/*
constructing an algoRunner will load the frontend into the algorithm format and then start itself running every frame
it has a lookahead of 5 by default and uses the naive path generation algorithms
*/
class algoRunner{
    constructor(){
        this.nodes=[]
        this.edges=[]
        this.graph;
        this.currentNode;
        this.targetNode;
        this.mapping = new Map(); //find frontend node from graph node for highlighting
        this.waitTime = 0;
        //path generation parameters
        this.lookahead = 5;
        this.pathValuer = naivePathValuation;
        this.edgeValuer = naiveEdgeValuation;
        //start runner and load graph
        s.step.push(this); //run every frame
        this.prepare();
        this.weightings = new Map();
    }
    //kill all children and stop running (used when resetting the runner)
    kill(){
        for (let i=0; i<this.nodes.length; i++){
            this.nodes[i].kill();
        }
        let ind = s.step.indexOf(this)
        if (ind!=-1){
            s.step.splice(ind,1)
        }
    }
    prepare(){
        this.nodes.length=0;
        this.edges.length=0;
        man.resetIds();
        let tempNode;
        let tempEdge;
        let currentNode;
        let targetNode;
        for (let i=0; i<loadedNodes.length; i++){
            loadedNodes[i].setColour("#999999")
            tempNode = new node(-1)
            if (loadedNodes[i].state) tempNode.state=loadedNodes[i].state;
            this.nodes.push(tempNode)
            this.mapping.set(tempNode,loadedNodes[i]);
            if (loadedNodes[i]==selection.currentNode){
                currentNode=tempNode
            }
            if (loadedNodes[i]==selection.targetNode){
                targetNode=tempNode
            }
        }
        for (let i=0; i<loadedArrows.length; i++){
            let src = loadedNodes.indexOf(loadedArrows[i].parent)
            let trg = loadedNodes.indexOf(loadedArrows[i].target)
            tempEdge = new edge(
                this.nodes[src],
                this.nodes[trg]
            )
            if (loadedArrows[i].state) tempEdge.state=loadedArrows[i].state
            this.nodes.push(tempEdge)
        }
        this.graph = new graph(this.nodes,algoEdges);
        if (this.currentNode===undefined) this.currentNode=this.nodes[0]
        if (this.targetNode===undefined) this.targetNode=this.nodes[0]
        console.log(this.graph.printAll())

    }
    setupWeightings(){ //hardcoded values
        this.weightings = new Map([
            ["isDead",10],
            [],
            []
        ])
    }
    step(){
        this.waitTime--;
        if (this.waitTime<=0){
            this.bestPath = pathGeneration(this.edgeValuer,this.pathValuer,this.currentNode,this.targetNode,this.lookahead,this.weightings);
            if (this.bestPath.length>0){
                let frontendNode = this.mapping.get(this.currentNode)
                frontendNode.setColour("#999999")
                this.currentNode=this.bestPath[0].target;
                frontendNode = this.mapping.get(this.currentNode)
                frontendNode.setColour("#ffff00")
                this.waitTime=this.bestPath[0].state.get("duration")||30
                for (let [key, value] of this.mapping.entries()){
                    if (value==selection.targetNode){
                        this.targetNode=key
                    }
                }
            }
        }
    }
}
//endregion