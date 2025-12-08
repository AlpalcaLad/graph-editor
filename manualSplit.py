from pydub import AudioSegment
from pydub.utils import make_chunks
import sys
import numpy as np

## requires winget install ffmpeg

def manualSplit(audioPath : str, sepPoints: list) -> list:
    #granularity is how many sub tracks to create before merging
    audioObject = AudioSegment.from_file(audioPath,audioPath.split(".")[-1])
    filePath = ".".join(audioPath.split(".")[:-1])
    generated = 0
    lastP = 0
    for p in sepPoints:
        p = int(float(p) * 1000)
        target = audioObject[lastP:p]
        generated+=1
        target.export(filePath+"_"+str(generated)+".mp3")
        lastP=p

manualSplit(sys.argv[1],sys.argv[2:])