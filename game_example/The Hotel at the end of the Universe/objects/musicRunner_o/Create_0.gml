nodes = []
edges = []

//TODO LOAD FILE


currentNode = nodes[0]
musicQueue = []
currentTrack = noone

length = 120 //lookahead of algorithm
weightings = {} //weightings of variables used
history = [] //previous edges taken
historySize = 10 //max size of history stored

//optimisation
queueUpdateFreq = 10
queueUpdateVariance = 4

targetState = {}