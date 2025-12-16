# Overview
This project aims to take a new approach to horizontal adaptive music to attempt to abstract the work of coding away from the composer. <br>
It uses a graph based approach, where arrows between nodes represent musical phrases. Each of these nodes and edges contain a set of states which inform the behaviour of the program with regards to what transitions should occur.

# Getting Started
To run the graph editing frontend simply run the *index.html* file within the frontend folder on any local host.
This should work without needing to touch CORS, although this is a good first place to look if something goes wrong.
See the below section for advice on how to use this frontend tool.

To run the game example, please first install gamemaker from its website https://gamemaker.io/en/download
Then simply open the yyp file at *game_example\The Hotel at the end of the Universe\The Hotel at the end of the Universe.yyp*
the free version will allow you to run the project using the play button which will immediately launch the game into a procedural level.

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
Graph crashes when run: 