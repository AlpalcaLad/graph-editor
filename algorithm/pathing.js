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
    resetIds(){
        this.nextEdgeId=-1;
        this.nextNodeId=-1;
    }
}
//constant reference to instance of manager class, to be accessed in other classes
const man=new manager(); 
//endregion

//region node
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
            this.label=man.getFreshNodeId();
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
        for (let i=0; i<keys.length; i++){
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
        let edgeIndex = this.edgesIn.indexOf(edgeToRemove);
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
        for (let i=0; i<this.edgesIn.length; i++){
            this.edgesIn[i].kill();
        }
        for (let i=0; i<this.edgesOut.length; i++){
            this.edgesOut[i].kill();
        }
    }
    //turns the state into a printable string {key1:val1,key2:val2...}
    stringifyState(){
        let str="{"
        this.state.forEach((value,key) => {
            str+=key+":"+value+","
        });
        return str+"}"
    }
    //turn edges into a printable string
    stringifyEdges(){
        let str="{"
        for (let i=0; i<this.edgesOut.length; i++){
            str+=this.edgesOut[i].target.label;
            if (i<this.edgesOut.length-1) str+=","
        }
        str+="}"
        return str
    }
    //console logs a nicer representation of the node
    print(){
        return `${this.label}, edges: ${this.stringifyEdges()}, state: ${this.stringifyState()}`;
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
        if (!source instanceof node) throw new Error("Source is not of type 'node'")
        source.addEdgeOut(this);

        this.target=target;
        if (!target instanceof node) throw new Error("Target is not of type 'node'")
        target.addEdgeIn(this);

        this.label=man.getFreshEdgeId();

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
        for (let i=0; i<keys.length; i++){
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
        return `${this.label}, connecting: (${this.source.label},${this.target.label}), state: ${this.stringifyState()}`;
    }
}
//endregion

//region Graph
class graph{
    constructor(verticies=[],edges=[]){
        this.verticies=verticies;
        this.edges=edges;
    }  
    printAll(){
        console.log("Graph Nodes:")
        for (let i=0; i<this.verticies.length; i++){
            console.log(this.verticies[i].print());
        }
        console.log("Graph Edges:")
        for (let i=0; i<this.edges.length; i++){
            console.log(this.edges[i].print());
        }
    }
}
//endregion


//region Functions
//find path (length>0) from source to target nodes
//return true if one exists, false otherwise
function isPathPossible(graph,node1,node2){ 
    //depth first search for node
    let unexplored=[node1];
    let explored=[];
    //two temporary node variables
    let n;
    let n2;
    //until we've explored every path
    while (unexplored.length>0){
        //get next node from stack
        n = unexplored.pop();
        //mark node as explored
        explored.push(n);
        //return out if target found
        if (n==node2) return true;
        //add each edge to the stack
        for (let i=0; i<n.edgesOut.length; i++){
            n2=n.edgesOut[i].target;
            //return out if target found
            if (n2==node2) return true;
            if (!explored.includes(n2) && !unexplored.includes(n2)) unexplored.push(n2);
        }
    }
    return false;
}
//map a boolean to -1 (false), 0 (undefined), 1 (true)
function booleanToInt(bool){
    if (bool === undefined) return 0
    if (bool) return 1
    else return -1
}
//find the difference between the states of node1 and node2, between 0 (identical), 1 (opposites)
//sqrt ( (1st diff)^2 + (2nd diff)^2 ... ), ie pythagorian distance
//this is safe for undefined states using booleanToInt, but all states must be of type boolean||undefined
function booleanDistance(node1,node2,weightings=new Map()){
    //Calculate the distance between two node's states
    let summedDistance=0;
    //create an array with all distinct keys in either node's state
    let allKeys = [...new Set([...node1.state.keys(), ...node2.state.keys()])] //SOURCE: https://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
    let tempWeight;
    if (allKeys.length==0) return 0
    for (let i=0; i<allKeys.length; i++){ //compare each key individually
        tempWeight = weightings.get(allKeys[i]) || 1
        summedDistance+=tempWeight*Math.pow((
            booleanToInt(node1.state.get(allKeys[i]))
            -booleanToInt(node2.state.get(allKeys[i]))
        ),2)
    }
    let unnormalizedDist = Math.sqrt(summedDistance)
    //normalize to be between 0,1 by dividing by the largest possible distance
    allKeys.forEach(value => {unnormalizedDist/=(2*(weightings.get(value) || 1))});
    return unnormalizedDist// / (2*Math.sqrt(allKeys.length))
}
//maps a value to be between -1,1
function mapToOne(val){
    if (typeof val == typeof true){
        return booleanToInt(val)
    } else { //assume int value in range 0..100
        if (val===undefined) return 0
        return (val/50)-1
    }
}
function generalDistance(node1,node2,weightings=new Map()){
//Calculate the distance between two node's states
    let summedDistance=0;
    //create an array with all distinct keys in either node's state
    let allKeys = [...new Set([...node1.state.keys(), ...node2.state.keys()])] //SOURCE: https://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
    let tempWeight;
    if (allKeys.length==0) return 0
    for (let i=0; i<allKeys.length; i++){ //compare each key individually
        tempWeight = weightings.get(allKeys[i]) || 1
        summedDistance+=tempWeight*Math.pow((
            mapToOne(node1.state.get(allKeys[i]))
            -mapToOne(node2.state.get(allKeys[i]))
        ),2)
    }
    let unnormalizedDist = Math.sqrt(summedDistance)
    //normalize to be between 0,1 by dividing by the largest possible distance
    allKeys.forEach(value => {unnormalizedDist/=(2*(weightings.get(value) || 1))}); //normalize distance by dividing by the biggest value this could obtain
    return unnormalizedDist// / (2*Math.sqrt(allKeys.length))
}
//find the state with the smallest boolean distance to the target
function closestBooleanState(nodes,target,returnIndex=false,weightings=new Map()){
    //safety check for empty node array
    if (nodes.length == 0) throw new Error("Empty nodes array, cannot compare");
    //initialise best tracker
    let bestValue=-1;
    let bestIndex=0;
    //initialise variable to hold the distance of each node
    let tempDist;
    for (let i=0; i<nodes.length; i++){ //check each node sequentially
        tempDist = booleanDistance(nodes[i],target,weightings);
        if (bestValue==-1 || bestValue>tempDist){ //if better (or first value, detected by bestValue==-1)
            //update to reflect new best distance found
            bestValue=tempDist;
            bestIndex=i;
        }
    }
    //returnIndex is an optional param to return the index in the array rather than the node
    if (returnIndex) return bestIndex;
    //by default return the node object
    else return nodes[bestIndex];
}
/*
Naive Path Valuation based on
Sum of path costs, sum of node distances along path, length, sum of path use counts

*/

//constants for naive path/edge valuation
const costWeight = 1/100
const distanceWeight = 1
const useWeight = 2 //weight uses higher

//need both path and edge valuation as in some metrics these may be different
//for example a metric may weight immediate states higher than future ones
function naivePathValuation(path, targetState=new node(label=-1),weightings=new Map(), history=[]){
    //calculate value factors
    //using source https://stackoverflow.com/questions/48606852/javascript-reduce-sum-array-with-undefined-values
    //length (naively assume number of edges)
    let length = path.length;
    if (length==0) return 0

    //average path cost (normalised assuming cost is between 0-100)
    let costs = path.reduce(function (s,v) {return s+v.state.get("cost") || 0}, 0)/length * (weightings.get("cost")||costWeight);

    //average node distance (normalised to be 0-1)
    let distances = path.reduce(function (s,v) {return s+generalDistance(v.target,targetState,weightings)}, 0)/length * (weightings.get("distance")||distanceWeight);

    let uses = 0
    //naive algorithm weights all edge uses equally
    for (edgeUsed of history){
        if (path.includes(edgeUsed)){
            uses += 1
        }
    }
    //normalize to be between 0,1
    uses /= history.length || 1 // ||1 to avoid division by 0
    //apply use weighting
    uses *= (weightings.get("uses") || useWeight)

    //apply formula (currently very naive)
    return 1-costs-distances-uses
}

function naiveEdgeValuation(edge,targetState = new node(label=-1),weightings=new Map(), history=[]){
    //average path cost (normalised assuming cost is between 0-100)
    let costs = (edge.state.get("cost") || 0) * (weightings.get("cost")||costWeight);

    //average node distance (normalised to be 0-1)
    let distances = generalDistance(edge.target,targetState,weightings)/length * (weightings.get("distance")||distanceWeight);

    let uses = 0
    //naive algorithm weights all edge uses equally
    for (edgeUsed of history){
        if (edgeUsed==edge){
            uses += 1
        }
    }
    //normalize to be between 0,1
    uses /= history.length || 1 // ||1 to avoid division by 0
    //apply use weighting
    uses *= (weightings.get("uses") || useWeight)

    //apply formula (currently very naive)
    return 1-costs-distances-uses
}

//Generate a path using given value functions
/*
if length is 1
    return the best edge to take
for each possible edge:
    call self on that edge's target with length reduced by 1
find which edge adds the most value
return [edge:path]
*/
function pathGeneration(edgeValuer, pathValuer, currentNode, targetState = new node(label=-1), length = 120, weightings=new Map(), history=[]){ //generate a maximal (based on valueFunction) path of preset length
    if (currentNode.edgesOut.length==0) return []; //if dead end just return an empty path
    //base case
    if (length <= 0){
        let bestEdge = undefined;
        let bestValue = undefined;
        let tempValue = undefined;
        for (let i=0; i<currentNode.edgesOut.length; i++){ // compare each possible edges value
            let e = currentNode.edgesOut[i];
            tempValue=edgeValuer(e,targetState,weightings, history);
            if (bestValue===undefined || tempValue>bestValue){ //we accept the first edge by default and then only take better options
                bestValue=tempValue;
                bestEdge=e;
            }
        }
        return [bestEdge]
    } else { //step case recurse deeper into each possible path
        let bestPath = undefined;
        let bestValue = undefined;
        let tempValue = undefined;
        let subPath = undefined;
        for (let i=0; i<currentNode.edgesOut.length; i++){ //for each edge, recurse to generate the best path assuming we use that edge
            let e = currentNode.edgesOut[i];
            subPath = pathGeneration(edgeValuer,pathValuer,e.target,targetState,length-(e.state.get("duration") || 0),weightings, history)
            subPath.unshift(e) //add edge to start of path array rather than end to order correctly
            tempValue=pathValuer(subPath,targetState,weightings, history);
            if (bestValue===undefined || tempValue>bestValue){ //we accept the first edge by default and then only take better options
                bestValue=tempValue;
                bestPath=subPath;
            }
        }
        return bestPath
    }
}

//endregion

const testNodes=[];
const testEdges=[];

//region Test Code
function testCode(){
    testNodes.length=0;
    testEdges.length=0;
    const g = new graph(testNodes,testEdges);
    function templateNode(inNodes=[],outNodes=[],stateKeys=[],stateVars=[],edges=[],label=-1){
        let n = new node(label=label);
        if (stateKeys.length>0 && stateKeys.length==stateVars.length) n.defineState(stateKeys,stateVars)
        testNodes.push(n);
        let e;
        for (let i=0; i<inNodes.length; i++){
            e = new edge(inNodes[i],n);
            testEdges.push(e);
            n.addEdgeIn(e);
        }
        for (let i=0; i<outNodes.length; i++){
            e = new edge(n,outNodes[i]);
            testEdges.push(e);
            n.addEdgeOut(e);
        }
        return n
    }
    templateNode();
    templateNode(inNodes=[testNodes[0]],outNodes=undefined,stateKeys=["isNearCliff","isDead"],stateVars=[true,false]);
    templateNode(inNodes=[testNodes[1]],outNodes=undefined,stateKeys=["isNearCliff","isCool"],stateVars=[true,true]);
    templateNode(inNodes=[testNodes[1]],outNodes=[testNodes[0]],stateKeys=["isNearCliff","isCool"],stateVars=[true,true]);
    g.printAll();
    console.log("Path valuation: ",pathValuation([testEdges[0],testEdges[1]],g,testNodes[0]));
    console.log("Path valuation: ",pathValuation([testEdges[0],testEdges[2],testEdges[3]],g,testNodes[0]));
    console.log(booleanDistance(testNodes[1],testNodes[2]))
}
//testCode();
//endregion


//region Sources
/*
https://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
https://stackoverflow.com/questions/48606852/javascript-reduce-sum-array-with-undefined-values
*/
//endregion