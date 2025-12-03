from pydub import AudioSegment
from pydub.utils import make_chunks
import sys

def smartSplit(audioPath : str, trackCount : int = 10, granularity : int = 250) -> list:
    #granularity is how many sub tracks to create before merging
    audioObject = AudioSegment.from_file(audioPath,audioPath.split(".")[-1])
    #make {granularity} chunks of equal length
    chunks = make_chunks(audioObject,int(len(audioObject)/granularity)) 

    '''
    TODO: 
    chunks should be merged into trackCount many of roughly equal sizes
    but importantly the final mini chunk in each track should have 
    a minimal or at least small amplitude

    start at equal points spaced
    scan from that point +- 0.25*audiolength/trackcount
    value of choice is 1/xdistance/amplitude
    '''

    amplitudes = [chunk.max for chunk in chunks]
    biggerChunks = [AudioSegment.empty() for x in range(trackCount)]
    borderSize = int(granularity/trackCount/4)
    lastIndex = 0
    for i in range(trackCount):
        centerPoint = (i/trackCount)*granularity
        leftPoint = centerPoint-borderSize
        rightPoint = centerPoint+borderSize
        bestValue = 0
        bestIndex = 0
        for j in range(leftPoint,rightPoint):
            value = 1 / (abs(centerPoint-j)/abs(centerPoint-leftPoint)) / (amplitudes[j].max/audioObject.max)
            if value>bestValue:
                bestIndex=j
                bestValue=value
        for j in range(lastIndex,bestIndex):
            biggerChunks[i] += chunks[j]
        lastIndex = bestIndex
    print(biggerChunks)

if len(sys.argv==2):
    smartSplit(sys.argv[1])
elif len(sys.argv==3):
    smartSplit(sys.argv[1],sys.argv[2])
elif len(sys.argv==4):
    smartSplit(sys.argv[1],sys.argv[2],sys.argv[3])