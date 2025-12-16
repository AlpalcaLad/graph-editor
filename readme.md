# Overview
This project aims to take a new approach to horizontal adaptive music to attempt to abstract the work of coding away from the composer. <br>
It uses a graph based approach, where arrows between nodes represent musical phrases. Each of these nodes and edges contain a set of states which inform the behaviour of the program with regards to what transitions should occur.<br>
Please note that this is still an internal project and as such is liable to not function when used incorrectly

# Getting Started
To run the graph editing frontend simply run the *index.html* file within the frontend folder on any local host.
This should work without needing to touch CORS, although this is a good first place to look if something goes wrong.
See the below section for advice on how to use this frontend tool. <br>

To run the game example, please first install gamemaker from its website https://gamemaker.io/en/download
Then simply open the yyp file at *game_example\The Hotel at the end of the Universe\The Hotel at the end of the Universe.yyp*
the free version will allow you to run the project using the play button which will immediately launch the game into a procedural level. <br>

To edit the game music, add new sound objects to gamemaker where their name matches the track variable of your states of your graph.
Drag and drop your graph into gamemaker to add it to the included files and change the graphPath variable in musicRunner_o<br>

To use the algorithm in your own gamemaker game: use "add existing" to add algorithm_scripts, edge_o, musicRunner_o, node_o. Then place musicRunner_o in your room and it will run on room start. Note you will need to change the code in beginStep after the comment "set target state" to reflect your game situation

# Provided Tools

## frontend editor
### Controls
**Middle click**:   drag camera <br>
**Left single click**:   create / connect arrow <br>
**Left held click**:   drag node <br>
**n**:   create new blank node at mouse pointer
**s**:   select nearest arrow/nodeand open sidebar <br>
**x**:   delete selected node <br>
**d**:   deselect <br>
### Toolbar
**Choose File**:   Select a .graph file to load its contents <br>
**Download**:   Saves the graph to your downloads folder <br>
**Reset 0 duration edges**:   Sets all edges without a duration to 30 (0.5s) to avoid cycles (needed for test data) <br>
**Test Algo**:   Start running the algorithm on the graph, using node 0 if none has been selected <br>
**Pause**:   Pause the path generation after the current transition has finished<br>
**Update**:   set the state of a selected object. Use format *variableName:value*. *variableName:* will reset the content of a state <br>
**Set Current Node**:   make test algo start with the selected node <br>
**Set Target Node**:   algo will use the selected node's state as its target <br>
### Playing Music and States
Custom states can be given the values true/false or an integer between 0..100 e.g. isDead:true or intensity:10<br>
Please note the following states are reserved and should not be used for custom states: x,y,target,track,duration<br>
If an edge has the state track defined it will attempt to use the provided value as a file path. For example setting track:../music/example1/simple_chords_1.mp3 <br>
When the algorithm is run and the music is loaded, the duration state will be automatically set for the edge<br>
Outside of a hardcoded weightings array in index.js for the frontend, states are considered equally<br>
the current weighting code can be seen below<br>
```
let tempWeightings = [ //these just give weighting to some labels an example graph may use
    //ideally in future a composer would pick these but for now they are hardcoded
    ["isDead",10], //death weighted highly
    ["isNearDeath",1], //near death weighted lower but still non zero
    ["track",0], //don't think about the music track when doing distance
    ["duration",0], //equally dont consider duration of an edge
    ["urgent",10], //urgent label as alternative to isDead
    ["variation",4], //stronger weighted label to try force variation
    ["useLess",0.01] //avoid but not at the cost of other states being wrong
]
```

## audio splitters
The project contains a few python programs to segment an mp3 file for ease. (It should also accept wavs but this is untested) <br>
Please also note the py may differ on your system and could be python or python3 <br> <br>
**Manual Splitter**: Provide seconds to split at <br>
```py -m manualSplit audioPath splitAtSecond1 splitAtSecond2 ...``` <br>
```e.g. py -m manualSplit music/midi/bassAndChords.mp3 1 1.75 2.25 2.75 4```
<br><br>
**Auto Splitter**: Attempts to automatically segment into trackCount number of clips of roughly equal length<br>
```py -m autoAudioSplitter audioPath trackCount(optional) granularity(optional)```<br>
```e.g. py -m autoAudioSplitter D:/GitHub/graph-editor/music/example1/simple_chords.mp3 10 250```<br>
```e.g. py -m autoAudioSplitter D:/GitHub/graph-editor/music/example1/simple_chords.mp3```<br>
I recommend just using manual splitter where possible

# Frequent problems and fixes
**Graph crashes when run**:<br>
There should be output viewable through inspect element. If it mentions call stack there is likely a 0 cost loop and Reset 0 duration edges should be used <br>
**The game crashes with the error "music cannot be found"**: <br>
There is likely an error with the file encoding. Previously I identified carriage returns but other special characters may have found their way in.
Let me know if this is happening and I can attempt to debug