//generate path
musicQueue = pathGeneration(naiveEdgeValuation,naivePathValuation,currentNode,targetState,length,weightings,history)
//random to spread the load and prevent consistent stuttering for other consistent events aligning
alarm[0] = queueUpdateFreq+random_range(-queueUpdateVariance,queueUpdateVariance)