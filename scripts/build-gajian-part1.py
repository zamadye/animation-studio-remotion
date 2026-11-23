import re,json,subprocess,array,math,hashlib
import imageio_ffmpeg
from pathlib import Path
raw=Path('docs/gajian-part1/VO-PART-01.srt').read_text();cues=[]
def sec(s):
 h,m,s=s.replace(',','.').split(':');return int(h)*3600+int(m)*60+float(s)
for block in raw.strip().split('\n\n'):
 lines=block.splitlines();a,b=lines[1].split(' --> ');cues.append({'id':int(lines[0]),'start':sec(a),'end':sec(b),'sourceText':' '.join(lines[2:]).strip()})
audio=Path('public/audio/gajian-part1/VO-PART-01.mp3');pcm=subprocess.check_output([imageio_ffmpeg.get_ffmpeg_exe(),'-i',str(audio),'-f','s16le','-ac','1','-ar','24000','-loglevel','error','-']);a=array.array('h',pcm);energy=[math.sqrt(sum(v*v for v in a[i:i+1000])/max(1,len(a[i:i+1000]))) for i in range(0,len(a),1000)];peak=max(energy)
Path('src/episodes/gajian-part1/source.json').write_text(json.dumps({'fps':24,'duration':math.ceil(len(a)/1000),'audioSeconds':len(a)/24000,'audio':'audio/gajian-part1/VO-PART-01.mp3','sha256':hashlib.sha256(audio.read_bytes()).hexdigest(),'cues':cues,'energy':[round(min(1,e/peak*1.8),3) for e in energy],'sourceFolder':'1SVNzrYhk3WPaenkJNv0fOcowf69VHG-W','sourceAudio':'11EDdvJZAeDBHq3Nbup4NEqLtEFDwuJPF','sourceSrt':'1owEGc1KJPJlKbbJX9WSjDLz0YLUHzRB0','sourcePdf':'1WlV0HNdd_ITpbOEy6PzD68d5vebhIffk'},indent=2)+'\n');print('untouched audio',len(a)/24000,'seconds')
