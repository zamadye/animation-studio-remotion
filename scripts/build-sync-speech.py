"""Coarse text visemes gated by measured audio energy, NOT forced alignment."""
import array,json,math,re,subprocess
from pathlib import Path
import imageio_ffmpeg
FPS=24; RATE=24000
rows=[('darto-line','darto',180,'ep01-darto-02a.mp3','Motor itu buat cari kerja, Bu.'),('petugas-line','petugas',288,'ep01-petugas-02b.mp3','Sistemnya begitu.')]
result=[]
for id,speaker,start,file,text in rows:
 raw=subprocess.check_output([imageio_ffmpeg.get_ffmpeg_exe(),'-i',f'public/audio/{file}','-f','s16le','-ac','1','-ar',str(RATE),'-loglevel','error','-'])
 samples=array.array('h',raw);per=RATE//FPS
 rms=[math.sqrt(sum(v*v for v in samples[i:i+per])/max(1,len(samples[i:i+per]))) for i in range(0,len(samples),per)]
 active=[i for i,e in enumerate(rms) if e>max(rms)*.075]
 phonemes=[c for c in text.lower() if c in 'aeioubpmfvl'];keys=[]
 for i,energy in enumerate(rms):
  if i not in active:viseme='rest';opening=0
  else:
   rank=active.index(i)/max(1,len(active)-1);letter=phonemes[min(len(phonemes)-1,int(rank*len(phonemes)))];viseme={'a':'A','e':'E','i':'E','o':'O','u':'U','b':'MBP','p':'MBP','m':'MBP','f':'FV','v':'FV','l':'L'}[letter];opening=round(min(1,max(.35,energy/max(rms)*1.8)),3)
  keys.append({'start':i,'end':i+1,'viseme':viseme,'openness':opening})
 result.append({'id':id,'speaker':speaker,'start':start,'end':start+len(rms),'text':text,'audio':f'audio/{file}','alignment':'audio-energy-text-estimate','visemes':keys})
Path('src/story/examples/syncSpeech.json').write_text(json.dumps(result,indent=2)+'\n')
print([(c['speaker'],c['start'],c['end']) for c in result])
