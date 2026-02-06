nodes = []
edges = []

//TODO LOAD FILE
graphPath = "ende.graph"
var fileObj = file_text_open_read(graphPath)
reservedStates=["x","y"] //states to be ignored, used by frontend
while !file_text_eof(fileObj){
	//each node line string is kept in n
	var n = file_text_readln(fileObj)
	n = string_replace_all(n, "\u000A", ""); //remove new line chars
	n = string_replace_all(n, "\u000D", ""); //remove new line chars -- why do files even still use these??
	n = clean_text(n)
	//setup node struct
	var node = instance_create_layer(x,y,layer,node_o)
	//start of string sep process
	var nParts = string_split(n,"~")
	var stateParts = string_split(nParts[1],"|")
	var edgesParts = string_split(nParts[2],",")
	node.label=nParts[0]
	for (var i=0; i<array_length(stateParts); i++){
		var components = string_split(stateParts[i],">")
		if !array_contains(reservedStates,components[0]){
			variable_struct_set(node.state,components[0],processString(components[1]))
		}
	}
	for (var i=0; i<array_length(edgesParts); i++){
		var edge = instance_create_layer(x,y,layer,edge_o)
		edge.source=node
		array_push(node.edgesOut,edge)
		var edgeParts = string_split(edgesParts[i],"|")
		for (var j=0; j<array_length(edgeParts); j++){
			var components = string_split(edgeParts[j],">")
			if !array_contains(reservedStates,components[0]){
				variable_struct_set(edge.state,components[0],processString(components[1]))
			}
		}
		array_push(edges,edge)
	}
	array_push(nodes,node)
}
//second pass to repoint edges
for (var i=0; i<array_length(edges); i++){
	for (var j=0; j<array_length(nodes); j++){
		if variable_struct_get(edges[i].state,"target")==nodes[j].label{
			array_push(nodes[j].edgesIn,edges[i])
			edges[i].target = nodes[j]
			variable_struct_remove(edges[i].state,"target")
		}
	}
}

//no music system to use, delete self
if array_length(nodes)==0 instance_destroy()

currentNode = nodes[0]
musicQueue = []
currentTrack = noone

length = 600 //lookahead of algorithm
weightings = {killingSpawner:5} //weightings of variables used
history = [] //previous edges taken
historySize = 10 //max size of history stored

//optimisation
queueUpdateFreq = 10
queueUpdateVariance = 4

targetState = {state:{isNearSpawner:false, isVeryNearSpawner:false, intense:false, killingSpawner:false}}