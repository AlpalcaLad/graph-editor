//region Manager
/*
constant object to provide fresh labels and IDs to verticies and edges
*/
class manager{
    constructor(){
        this.nextNodeId=-1;
        this.nextEdgeId=-1;
    }
    getFreshNodeId(){
        this.nextNodeId++;
        return 'V'+this.nextNodeId; //'V0', 'V1', 'V2'...
    }
    getFreshEdgeId(){
        this.nextEdgeId++;
        return 'E'+this.nextEdgeId; //'E0', 'E1', 'E2'...
    }
}
//constant reference to instance of manager class, to be accessed in other classes
const m=new manager(); 
//endregion

//region Node
/*
node class for verticies of graph. Optional argument label to force a specific name for a vertex, otherwise uses getFreshNodeId
These labels should be unique but this is not enforced by code.
*/
class node{
    constructor(label=-1){
        //initialise node edges to be empty arrays
        this.edgesIn=[];
        this.edgesOut=[];

        if (label==-1){
            this.label=m.getFreshNodeId();
        } else {
            this.label=label;
        }
        //state is a dictionary of key value pairs
        //currently these must be booleans or specific pre defined values
        this.state = new Map();
    } 
    //if length mismatch this could lead to an array out of bounds exception
    defineState(keys=[],values=[]){
        if (keys.length!=values.length){throw new Error("Keys do not match values");}
        for (i=0; i<keys.length; i++){
            this.state.set(keys[i],values[i]);
        }
    }
    //returns the merged list of edgesIn and edgesOut
    //there is no in-code force to prevent duplicates
    getAllEdges(){
        return this.edgesIn.concat(this.edgesOut);
    }
    //add edge to edgesIn, this is so that restrictions can later be added if needed
    addEdgeIn(edgeToAdd){
        this.edgesIn.push(edgeToAdd);
    }
    //add edge to edgesOut, this is so that restrictions can later be added if needed
    addEdgeOut(edgeToAdd){
        this.edgesOut.push(edgeToAdd);
    }
    //find if an edge is in either array and remove it if so.
    //safe for edges that arent present in either array
    removeEdge(edgeToRemove){
        edgeIndex = this.edgesIn.indexOf(edgeToRemove);
        if (edgeIndex!=-1){
            this.edgesIn.splice(edgeIndex,1);
            return
        }
        edgeIndex = this.edgesOut.indexOf(edgeToRemove);
        if (edgeIndex!=-1){
            this.edgesOut.splice(edgeIndex,1);
            return
        }
    }
    //remove node and destroy any connected edges
    kill(){
        for (i=0; i<this.edgesIn.length; i++){
            this.edgesIn[i].kill();
        }
        for (i=0; i<this.edgesOut.length; i++){
            this.edgesOut[i].kill();
        }
    }
    //turns the state into a printable string {key1:val1,key2:val2...}
    stringifyState(){
        let str="{"
        this.state.forEach((key,value) => {
            str+=key+":"+value+","
        });
        return str+"}"
    }
    //console logs a nicer representation of the node
    print(){
        console.log( `${this.label}, state: ${this.stringifyState(this.state)}` );
    }
}
//endregion

//region Edge
/*
edge class for edges of graph connecting verticies. These cannot be given a unique name and use getFreshEdgeId
*/
class edge{
    constructor(source,target){
        this.source=source;
        source.addEdgeOut(this);

        this.target=target;
        target.addEdgeIn(this);

        this.label=m.getFreshEdgeId();

        this.state = new Map();
    }
    //remove node from graph
    kill(){
        this.source.removeEdge(this);
        this.target.removeEdge(this);
    }
    //set state based on key value inputs
    defineState(keys=[],values=[]){
        //if length mismatch this could lead to an array out of bounds exception
        if (keys.length!=values.length){throw new Error("Keys do not match values");}
        for (i=0; i<keys.length; i++){
            this.state.set(keys[i],values[i]);
        }
    }
    //turns the state into a printable string {key1:val1,key2:val2...}
    stringifyState(){
        let str="{"
        this.state.forEach((key,value) => {
            str+=key+":"+value+","
        });
        return str+"}"
    }
    //console logs a nicer representation of the edge
    print(){
        console.log( `${this.label}, connecting: (${this.source.label},${this.target.label}), state: ${this.stringifyState(this.state)}` );
    }
}
//endregion

//region Graph
class graph{
    constructor(verticies=[],edges=[]){
        this.verticies=verticies;
        this.edges=edges;
    }  
}
//endregion


//region Functions

//endregion


//region Test Code
testNodes=[
    new node(),
    new node(),
    new node()
];
testEdges=[
    new edge(testNodes[0],testNodes[1]),
    new edge(testNodes[1],testNodes[2])
];

testNodes[0].print();
//endregion