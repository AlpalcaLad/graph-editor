//TODO 
/*
- save/load graphs from text file
- test conversion accuracy
*/

//default weightings of each part of the formula, can be overriden
#macro costWeight 1/100
#macro distanceWeight 1
#macro useWeight 2 //weight uses higher


//maps a value to be between -1,1
function processString(str){
	if (str=="false") return false
	if (str=="true") return true
	
	var n = string_length(string_digits(str));
	if n && n == string_length(str) - (string_char_at(str, 1) == "-") - (string_pos(".", str) != 0) return real(str)

	return str
}
function mapToOne(val){
	if is_undefined(val) return 0
	
	if is_bool(val){
		return val*2-1
	} else {//assume int value in range 0..100
		return (val/50)-1
	}
}
function generalDistance(node1,node2,weightings={}){
//Calculate the distance between two node's states
    var summedDistance=0;
    //create an array with all distinct keys in either node's state
    var allKeys = array_union(variable_struct_get_names(node1.state),variable_struct_get_names(node2.state))
	var tempWeight;
	var length = array_length(allKeys)
    if length==0 return 0
    for (var i=0; i<length; i++){ //compare each key individually
		if variable_struct_exists(weightings,allKeys[i]) tempWeight = variable_struct_get(weightings,allKeys[i])
		else tempWeight = 1
        summedDistance+=tempWeight*power((
            mapToOne(variable_struct_get(node1.state,allKeys[i]))
            -mapToOne(variable_struct_get(node2.state,allKeys[i]))
        ),2)
    }
    var unnormalizedDist = sqrt(summedDistance)
    //normalize to be between 0,1 by dividing by the largest possible distance
	//for (var i=0; i<length; i++){
	//	if variable_struct_exists(weightings,allKeys[i]) tempWeight = variable_struct_get(weightings,allKeys[i])
	//	else tempWeight = 1
	//	unnormalizedDist/=2*tempWeight
	//}
    return unnormalizedDist
}


//need both path and edge valuation as in some metrics these may be different
//for example a metric may weight immediate states higher than future ones
function naivePathValuation(path, targetState={}, weightings={}, history=[]){
    //calculate value factors
    //using source https://stackoverflow.com/questions/48606852/javascript-reduce-sum-array-with-undefined-values
    //length (naively assume number of edges)
    var length = array_length(path);
    if (length==0) return 0

    //average path cost (normalised assuming cost is between 0-100)
    var avCost = 0
	for (var i=0; i<length; i++){
		if (variable_struct_exists(path[i],"cost")) avCost+=variable_struct_get(path[i],"cost")
	}
	avCost/=length
	if variable_struct_exists(weightings,"cost") avCost*=variable_struct_get(weightings,"cost")
	else avCost*=costWeight

    //average node distance (normalised to be 0-1)
    var avDist = 0
	for (var i=0; i<length; i++){
		avDist+=generalDistance(path[i].target,targetState,weightings)
	}
	avDist/=length
	if variable_struct_exists(weightings,"distance") avDist*=variable_struct_get(weightings,"distance")
	else avDist*=distanceWeight
	
    var uses = 0
    //naive algorithm weights all edge uses equally
    for (var i=0; i<array_length(history); i++){
        if (array_contains(path,history[i])){
            uses += 1
        }
    }
    //normalize to be between 0,1
    uses /= clamp(length,1,length+1) //clamp to avoid div by 0
    //apply use weighting
    if variable_struct_exists(weightings,"uses") uses*=variable_struct_get(weightings,"uses")
	else uses*=useWeight

    //apply formula (currently very naive)
    return 1-avCost-avDist-uses
}

function naiveEdgeValuation(edge, targetState={}, weightings={}, history=[]){
    //edge cost (normalised assuming cost is between 0-100)
	var costs
	if variable_struct_exists(edge.state,"cost"){
		costs = variable_struct_get(edge.state,"cost")
		if variable_struct_exists(weightings,"cost") costs *= variable_struct_get(weightings,"cost")
		else costs *= costWeight
	}
	else costs = 0

	var distance = generalDistance(edge.target,targetState,weightings)

    var uses = 0
    //naive algorithm weights all edge uses equally
    for (var i=0; i<array_length(history); i++){
        if (history[i]==edge){
            uses += 1
        }
    }
    //apply use weighting
    if variable_struct_exists(weightings,"uses") uses*=variable_struct_get(weightings,"uses")
	else uses*=useWeight

    //apply formula (currently very naive)
    return 1-costs-distance-uses
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
function pathGeneration(edgeValuer, pathValuer, currentNode, targetState = {}, length = 120, weightings={}, history=[]){ //generate a maximal (based on valueFunction) path of preset length
    var optionCount = array_length(currentNode.edgesOut)
	if (optionCount==0) return []; //if dead end just return an empty path
    //base case
    if (length <= 0){
        var bestEdge = noone;
        var bestValue=noone;
        var tempValue;
        for (var i=0; i<optionCount; i++){ // compare each possible edges value
            var e = currentNode.edgesOut[i];
            tempValue=edgeValuer(e,targetState,weightings, history);
            if (bestValue==noone || tempValue>bestValue){ //we accept the first edge by default and then only take better options
                bestValue=tempValue;
                bestEdge=e;
            }
        }
        return [bestEdge]
    } else { //step case recurse deeper into each possible path
        var bestPath = [];
        var bestValue = noone;
        var tempValue;
        var subPath;
        for (var i=0; i<optionCount; i++){ //for each edge, recurse to generate the best path assuming we use that edge
            var e = currentNode.edgesOut[i];
			var edgeDuration = 0
			if variable_struct_exists(e.state,"duration") edgeDuration = variable_struct_get(e.state,"duration")
            subPath = pathGeneration(edgeValuer,pathValuer,e.target,targetState,length-edgeDuration,weightings, history)
			array_insert(subPath,0,e) //add edge to start of path array rather than end to order correctly
            tempValue=pathValuer(subPath,targetState,weightings, history);
            if (bestValue==noone || tempValue>bestValue){ //we accept the first edge by default and then only take better options
                bestValue=tempValue;
                bestPath=subPath;
            }
        }
        return bestPath
    }
}