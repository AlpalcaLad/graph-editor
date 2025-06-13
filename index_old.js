var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//var circCords = [50,150,35];
ctx.font = "30px Arial";
const pi = Math.PI;
const E = 2.71828;
const radsConvert = (2*pi/360);
var mb_left = 0;
var mb_right = 0;
var mouse_x = 0;
var mouse_y = 0;
var mouse_xRel = 0;
var mouse_yRel = 0;

//functions
function abs(value){
    return Math.abs(value);
}
function rads(value){
    return radsConvert*value;
}
function clamp(value,min,max){
    if (value<=min){return min;}
    if (value>=max){return max;}
    return value;
}
function sign(value){
    if (value<0){return -1;}
    if (value>0){return 1;}
    return 0;
}
function array_find(arrayIn,valueIn){
    for (var ind=0; ind<arrayIn.length; ind++){
        if (arrayIn[ind]===valueIn){
            return ind;
        }
    }
    return -1;
}
function max(values){
    maxCur = values[0];
    for (var l=1; l<values.length; l++){
        if (maxCur<values[l]){
            maxCur = values[l];
        }
    }
    return maxCur;
}
function min(values){
    minCur = values[0];
    for (var l=1; l<values.length; l++){
        if (minCur>values[l]){
            minCur = values[l];
        }
    }
    return minCur;
}
function rads_to_deg(value){
    return value*360/(2*pi);
}
function point_direction(x1,y1,x2,y2){
    if (y2<y1){
        return 2*pi+Math.atan2((y2-y1),(x2-x1));
    } else {
        return Math.atan2((y2-y1),(x2-x1));
    }
}
function point_direction_deg(x1,y1,x2,y2){
    if (y2<y1){
        return rads_to_deg(2*pi+Math.atan2((y2-y1),(x2-x1)));
    } else {
        return rads_to_deg(Math.atan2((y2-y1),(x2-x1)));
    }
}
function blend_angles(ang1,ang2,value){ //in degrees please
    //console.log(String(abs(ang2-ang1))+", "+String(abs((ang2-360)-ang1)));
    if (abs(ang2-ang1)<abs((ang2-360)-ang1)){
        return ang1+(ang2-ang1)/value;
    } else {
        return ang1+((ang2-360)-ang1)/value;
    }
}
function point_in_rect(xIn,yIn,left,top,right,bottom){
    return (xIn>left && xIn< right && yIn> top && yIn< bottom);
}

//classes
class gameHandler{
    constructor(){
        this.objects = [];
        this.stepRegistered = [];
        this.drawRegistered = [];
        this.solidRegistered = [];
        //keyboard inputs
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
        this.zKey = false;
        this.xKey = false;
        this.cKey = false;
        this.pKey = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }
    
    stepEvents(){

        //all object step events
        var i;
        for (i=0;i<this.stepRegistered.length;i++){
            this.stepRegistered[i].step_event();
        }
    }
    drawEvents(){
        var i;
        for (i=0;i<this.drawRegistered.length;i++){
            this.drawRegistered[i].draw_event();
        }
    }
}
var god = new gameHandler;

class camera{
    constructor(xIni,yIni){
        this.zoom = 1;
        this.zoomTarg = 1;
        this.scale = this.zoom/2;
        this.x = xIni;
        this.y = yIni;
        this.xTo = xIni-100;
        this.yTo = yIni-100;
        this.follow = -1;
        this.snapSpeed = 15;
        this.zoomMin = 0.25;
        this.zoomMax = 3;
        this.zoomSpd = 0.15;
        god.stepRegistered.push(this);
    }
    step_event(){
        mouse_x = (mouse_xRel-canvas.width/2)/this.zoom + this.x
        mouse_y = (mouse_yRel-canvas.height/2)/this.zoom + this.y
        //console.log("PLAYER " + String(player.x)+", " + String(player.y))
        //console.log("MOUSE " + String(mouse_x) + ", " + String(mouse_y))

        if (god.zKey || god.xKey){
            this.zoomTarg += (god.zKey-god.xKey)*this.zoomSpd;
            this.zoomTarg = clamp(this.zoomTarg,this.zoomMin,this.zoomMax);
        }
        if (god.cKey) {this.zoomTarg = 1;}
        this.zoom += (this.zoomTarg-this.zoom)/15;

        if (this.follow != -1){
            this.xTo = this.follow.x;
            this.yTo = this.follow.y;
        }

        if (abs(this.xTo-this.x)>2){
            this.x += (this.xTo-this.x)/this.snapSpeed;
        }
        if (abs(this.yTo-this.y)>2){
            this.y += (this.yTo-this.y)/this.snapSpeed;
        }
    }
}
var cam = new camera(100,100);

class sprite {
    constructor(typeIn,dataIn,bboxIn){
        /*
        typeIn: either b or i (atm only b)
        dataIn: gives either image path or just a string to say shape type
        bboxIn: array containing the boundary box coords relative to x,y
        */
        this.type = typeIn; //b:basic, i:image
        this.data = dataIn[0];
        this.colour = dataIn[1];
        this.bbox = bboxIn;
    }
    draw_self(xIn,yIn){
        if (this.type == "b"){
            ctx.fillStyle=this.colour;
            var box = [
                (xIn+this.bbox[0]-cam.x)/cam.zoom +canvas.width/2,
                (yIn+this.bbox[1]-cam.y)/cam.zoom +canvas.height/2,
                (this.bbox[2]-this.bbox[0])/cam.zoom,
                (this.bbox[3]-this.bbox[1])/cam.zoom
            ];
            //console.log(box)
            
            switch (this.data){
                case "rect":
                    ctx.fillRect(box[0],box[1],box[2],box[3]);
                break;
            }
        }
    }
}

class genObj {
    constructor(xIni,yIni,spriteIni){
        this.x = xIni;
        this.y = yIni;
        this.solid = false;
        this.sprite_index = spriteIni;
        this.visible = true;
        this.resistance = 0.5; //resistance when pushed by the player (90% sure this doenst do anything lol)
        this.hspToAdd = 0;
        if (this.sprite_index != -1){ //takes the boundary box from the sprite and stores it in the object as well for ease
            this.bbox = this.sprite_index.bbox;
            god.drawRegistered.push(this);
        }
    }
    draw_self(){ //allows you to call the draw self function from the object
        if (this.visible){
            this.sprite_index.draw_self(this.x,this.y);
        }
    }
    draw_event(){ //general draw event
        this.draw_self();
    }
    place_meeting(xIn,yIn,obj){ //checks overlap of rectangular boundary boxes
        if (obj != this){
            var box1 = [this.bbox[0]+xIn,this.bbox[1]+yIn,this.bbox[2]+xIn,this.bbox[3]+yIn]; //left top right bottom
            var box2 = [obj.bbox[0]+obj.x,obj.bbox[1]+obj.y,obj.bbox[2]+obj.x,obj.bbox[3]+obj.y]; 
            if (box1[3] < box2[1] || box2[3] < box1[1]) { //veritcal
                return false;
            }
            if (box1[2] < box2[0] || box2[2] < box1[0]) { //horizontal
                return false;
            }
            return true;
        }
    }
    handleCollisions(){ //need hsp, vsp etc defined
        //collisions with all registered solid objects
        var i;
        for (i=0;i<god.solidRegistered.length; i++){
            var obj = god.solidRegistered[i];
            if (obj != this){
                if (true){//redundant rn but dw about it
                    var flags = [false,false];
                    if (abs(this.x-obj.x)<1000+abs(this.hsp)){
                        flags[0]=true;
                        if (this.place_meeting(this.x+this.hsp,this.y,obj)){
                            while (!this.place_meeting(this.x+sign(this.hsp),this.y,obj)){
                                this.x += sign(this.hsp);
                            }
                            this.hsp = 0;
                        }
                    }
                    if (abs(this.y-obj.y)<1000+abs(this.vsp)){
                        flags[1]=true;
                        if (this.place_meeting(this.x,this.y+this.vsp,obj)){
                            while (!this.place_meeting(this.x,this.y+sign(this.vsp),obj)){
                                this.y += sign(this.vsp);
                            }
                            this.vsp = 0;
                        }
                    }
                    if (flags[0] && flags[1]){
                        if (this.place_meeting(this.x+this.hsp,this.y+this.vsp,obj)){
                            while (!this.place_meeting(this.x+sign(this.hsp),this.y+sign(this.vsp),obj)){
                                this.x += sign(this.hsp);
                                this.y += sign(this.vsp);
                            }
                            this.hsp = 0;
                            this.vsp = 0;
                        }
                    }
                }
            }
        }
    }
}

class Player extends genObj{
    constructor(xIni,yIni){
        var playerSprite = new sprite("b",["rect","#ead1dc"],[-70,-70,70,70]);
        super(xIni,yIni,playerSprite);
        cam.follow = this;
        god.stepRegistered.push(this);
        god.solidRegistered.push(this);
        this.hsp = 0;
        this.vsp = 0;
        this.grv = 0.8;
        this.moveSpd = 1;
        this.frictGround = 1.15;
        this.frictAir = 1.08;
        this.hspMax = 10;
        this.vspMax = 32;
        this.onGround = false;
        this.jumpPower = -16;
        this.canPush = [];
        this.holding = [];
    }
    step_event(){
        var i, frict;
        this.onGround = false;
        for (i=0;i<god.solidRegistered.length; i++){
            if (this.place_meeting(this.x,this.y+2,god.solidRegistered[i])){this.onGround = true;}
        }
        frict = this.onGround ? this.frictAir:this.frictGround; //friction based on whether on ground or not
        this.hsp /= frict;
        if (abs(this.hsp)<0.2){
            this.hsp = 0;
        }
        this.hsp += this.moveSpd*(god.d-god.a)
        this.vsp += this.grv;
        if (this.onGround && god.w){
            //jump
            this.vsp = this.jumpPower;
        }

        this.hsp = clamp(this.hsp,-this.hspMax,this.hspMax);
        this.vsp = clamp(this.vsp,-this.vspMax,this.vspMax);

        //box push
        var j = 0;
        var hspSave = 0;
        for (j=0; j<this.canPush.length; j++){
            var obj = this.canPush[j];
            if (this.hsp != 0 && this.place_meeting(this.x+this.hsp,this.y,obj)){
                var hspTemp;
                if (this.hsp>0){
                    //hspTemp = this.hsp+(this.bbox[0]-obj.bbox[2]);
                    var xRight = this.x+this.hsp+this.bbox[2];
                    var xLeft = obj.x+obj.bbox[0];
                    hspTemp = (xRight-xLeft)+1;
                } else {
                    //hspTemp = this.hsp+(this.bbox[2]-obj.bbox[0]);
                    var xLeft = this.x+this.hsp+this.bbox[0];
                    var xRight = obj.x+obj.bbox[2];
                    hspTemp = (xLeft-xRight)-1;
                }
                //obj.hsp = hspTemp;
                var xSave = obj.x
                obj.x += hspTemp;
                obj.hspToAdd = hspTemp;
                for (i=0;i<god.solidRegistered.length; i++){
                    var obj2 = god.solidRegistered[i];
                    if (obj2 != obj && obj.place_meeting(obj.x,obj.y,obj2)){
                        if (this.hsp!=0){
                            while (obj.place_meeting(obj.x,obj.y,obj2)){
                                obj.x -= sign(this.hsp);
                            }
                        } else {
                            while (obj.place_meeting(obj.x,obj.y,obj2)){
                                obj.x -= 1;
                            }
                        }
                    }
                }
                if (obj.place_meeting(obj.x,obj.y,this)){
                    obj.x = xSave
                }
            }
        }

        this.handleCollisions();

        this.y += this.vsp;
        //safe vertical movement
        for (i=0;i<god.solidRegistered.length; i++){
            var obj = god.solidRegistered[i];
            if (this.place_meeting(this.x,this.y,obj)){
                if (this.vsp!=0){
                    while (this.place_meeting(this.x,this.y,obj)){
                        this.y -= sign(this.vsp);
                    }
                } else {
                    while (this.place_meeting(this.x,this.y,obj)){
                        this.y -= 1;
                    }
                }
            }
        }

        this.x += this.hsp;
        //safe horizontal movement
        for (i=0;i<god.solidRegistered.length; i++){
            var obj = god.solidRegistered[i];
            if (this.place_meeting(this.x,this.y,obj)){
                if (this.hsp!=0){
                    while (this.place_meeting(this.x,this.y,obj)){
                        this.x -= sign(this.hsp);
                    }
                } else {
                    while (this.place_meeting(this.x,this.y,obj)){
                        this.x -= 1;
                    }
                }
            }
        }

        if (this.hsp == 0 && hspSave != 0){
            this.hsp = hspSave;
        }
    }
}

class box extends genObj{
    constructor(xIni,yIni){
        var boxSprite = new sprite("b",["rect","#4c3228"],[-70,-70,70,70]);
        super(xIni,yIni,boxSprite);
        god.stepRegistered.push(this);
        god.solidRegistered.push(this);
        this.hsp = 0;
        this.vsp = 0;
        this.grv = 0.8;
        this.frictGround = 1.15;
        this.frictAir = 1.08;
        this.hspMax = 10;
        this.vspMax = 32;
        this.resistance = 0.5;
        this.xTo = 0;
        this.yTo = 0;
        this.pickedUpBy = -1;
        this.pickAngle = 0;
        this.pickRadius = 200;
        this.p = -1;
        this.selectDl = true;
    }
    step_event(){
        var i, frict;
        this.onGround = false;
        for (i=0;i<god.solidRegistered.length; i++){
            if (this.place_meeting(this.x,this.y+2,god.solidRegistered[i])){this.onGround = true;}
        }
        frict = this.onGround ? this.frictAir:this.frictGround; //friction based on whether on ground or not
        this.hsp /= frict;
        if (abs(this.hsp)<0.2){
            this.hsp = 0;
        }
        this.vsp += this.grv;

        if (mb_left){
            if (!this.selectDl){
                if (mb_left && point_in_rect(mouse_x,mouse_y,this.x+this.bbox[0],this.y+this.bbox[1],this.x+this.bbox[2],this.y+this.bbox[3])){
                    this.pickedUpBy = this.p;
                } else {
                    if (mb_left){this.pickedUpBy = -1;}
                }
            }
            this.selectDl = true;
        } else {
            this.selectDl = false;
        }
        if (this.pickedUpBy != -1){
            
            
            
            if (abs(this.xTo-this.x)+abs(this.yTo-this.y)<30){
                this.pickAngle = blend_angles(this.pickAngle,90,5);
            }
            this.xTo = this.pickedUpBy.x+(2*(this.x>this.p.x)-1)*this.pickRadius*Math.cos(rads(this.pickAngle));
            this.yTo = this.pickedUpBy.y-this.pickRadius*Math.sin(rads(this.pickAngle)) + 40*(Math.cos(rads(this.pickAngle-90)**2)*(E**(-5*(rads(this.pickAngle-90)**2))));
            this.hsp = (this.xTo-this.x)/5;
            this.vsp = (this.yTo-this.y)/5+this.pickedUpBy.vsp;
        } else {
            if (this.pickAngle != 0){
                
                this.vsp = 1
                for (i=0;i<god.solidRegistered.length; i++){
                    var obj = god.solidRegistered[i];
                    if (this.place_meeting(this.x,this.y,obj)){
                        while (this.place_meeting(this.x,this.y,obj)){
                            this.y -= sign(this.vsp);
                        }
                    }
                }
            }
            this.pickAngle = 0;//blend_angles(this.pickAngle,180*(this.x<this.pickedUpBy.x));
            this.xTo = this.x;
            this.yTo = this.y;
        }

        this.hsp = clamp(this.hsp,-this.hspMax,this.hspMax);
        this.vsp = clamp(this.vsp,-this.vspMax,this.vspMax);
        
        this.handleCollisions();

        this.y += this.vsp;
        //safe vertical movement
        for (i=0;i<god.solidRegistered.length; i++){
            var obj = god.solidRegistered[i];
            if (this.place_meeting(this.x,this.y,obj)){
                while (this.place_meeting(this.x,this.y,obj)){
                    this.y -= sign(this.vsp);
                }
            }
        }

        this.x += this.hsp;
        //safe horizontal movement
        for (i=0;i<god.solidRegistered.length; i++){
            var obj = god.solidRegistered[i];
            if (this.place_meeting(this.x,this.y,obj)){
                while (this.place_meeting(this.x,this.y,obj)){
                    this.x -= sign(this.hsp);
                }
            }
        }
        if (abs(this.hsp)<abs(this.hspToAdd)){this.hsp = this.hspToAdd;}
        this.hspToAdd = 0;
    }
}

var player = new Player(340,100);
var box1 = new box(190,100);
var box2 = new box(-100,100);

player.canPush.push(box1);
box1.p = player;
player.canPush.push(box2);
box2.p = player;

class Floor extends genObj{ //just a static solid object
    constructor(xIni,yIni,bboxIn){
        var groundSprite = new sprite("b",["rect","#98ffcc"],bboxIn);
        super(xIni,yIni,groundSprite);
        god.solidRegistered.push(this);
        this.solid = true;
    }
}
//floor pieces
var floor = new Floor(200,270,[-400,0,400,500]);
var floor2 = new Floor(600,270,[0,-140,300,500]);

//draws every frame
function draw(){
    //clear canvas every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //step events
    god.stepEvents();

    //draw events
    god.drawEvents();

}


//keyboard inputs
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    switch (event.key.toLowerCase()) {
        case "w":
            god.w = true;
            break;
        case "a":
            god.a = true;
            break;
        case "s":
            god.s = true;
            break;
        case "d":
            god.d = true;
            break;
        case "z":
            god.zKey = true;
            break;
        case "x":
            god.xKey = true;
            break;
        case "c":
            god.cKey = true;
            break;
        case "p":
            god.pKey = true;
            break;

        default:
            return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);
window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
  
    switch (event.key.toLowerCase()) {
        case "w":
            god.w = false;
            break;
        case "a":
            god.a = false;
            break;
        case "s":
            god.s = false;
            break;
        case "d":
            god.d = false;
            break;
        case "z":
            god.zKey = false;
            break;
        case "x":
            god.xKey = false;
            break;
        case "c":
            god.cKey = false;
            break;
        case "p":
            god.pKey = false;
            break;

        default:
            return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);



// The proper game loop
window.requestAnimationFrame(gameLoop);

onmousemove = function(e){
    mouse_xRel = e.clientX;
    mouse_yRel = e.clientY;
}

onmousedown = function(e){
    switch (e.button){
        case 0:
            mb_left = true;
            break;
        case 2:
            mb_right = true;
            break;
        case 1:
            mb_middle = true;
            break;
    }
}
onmouseup = function(e){
    switch (e.button){
        case 0:
            mb_left = false;
            break;
        case 2:
            mb_right = false;
            break;
        case 1:
            mb_middle = false;
            break;
    }
}

var frameRate = 60/10;
var frameInd = 0;

function gameLoop() {
    /*
    frameInd ++;
    if (frameInd>frameRate){
        frameInd = 0;
        draw();
    }
    */
    draw();
    window.requestAnimationFrame(gameLoop);
}