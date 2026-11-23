"""Energy-gated review timing from continuous dialogue. NOT forced phoneme alignment.
Provider voice-segment clocks are scaled to measured decoded durations and recorded explicitly.
"""
import json,array,math,subprocess
from pathlib import Path
import imageio_ffmpeg
source=json.load(open('src/episodes/gajian/script.json'));out=[];cursor=0
for si,scene in enumerate(source['scenes']):
 d=json.load(open('public/audio/gajian/'+scene['id']+'.json'));raw=subprocess.check_output([imageio_ffmpeg.get_ffmpeg_exe(),'-i','public/audio/gajian/'+scene['id']+'.mp3','-f','s16le','-ac','1','-ar','24000','-loglevel','error','-']);a=array.array('h',raw);duration=math.ceil(len(a)/1000);providerEnd=max(s['end_time_seconds'] for s in d['voice_segments']);ratio=(len(a)/24000)/providerEnd
 energy=[math.sqrt(sum(v*v for v in a[i:i+1000])/max(1,len(a[i:i+1000]))) for i in range(0,len(a),1000)];peak=max(energy) or 1;lines=[]
 for j,line in enumerate(scene['lines']):
  segs=[s for s in d['voice_segments'] if s['dialogue_input_index']==j];start=round(min(s['start_time_seconds'] for s in segs)*ratio*24);end=min(duration,round(max(s['end_time_seconds'] for s in segs)*ratio*24));keys=[]
  for f in range(start,max(start+1,end)):
   t=(f+.5)/24/ratio;char=next((c.lower() for c,s,e in zip(d['alignment']['characters'],d['alignment']['character_start_times_seconds'],d['alignment']['character_end_times_seconds']) if s<=t<e),'');en=energy[f] if f<len(energy) else 0;v={'a':'A','e':'E','i':'E','o':'O','u':'U','b':'MBP','p':'MBP','m':'MBP','f':'FV','v':'FV','l':'L'}.get(char,'A' if char.isalpha() else 'rest');v='rest' if en<peak*.07 else v;keys.append({'start':f-start,'end':f-start+1,'viseme':v,'openness':min(1,round(en/peak*1.6,3)) if v!='rest' else 0})
  lines.append({**line,'id':scene['id']+'-'+str(j),'start':start,'end':max(start+1,end),'visemes':keys,'alignment':'audio-energy-text-estimate'})
 out.append({'id':scene['id'],'start':cursor,'duration':duration,'clockScale':ratio,'audio':'audio/gajian/'+scene['id']+'.mp3','lines':lines});cursor+=duration
Path('src/episodes/gajian/timeline.json').write_text(json.dumps({'fps':24,'duration':max(2160,cursor),'scenes':out,'note':'Measured audio + globally scaled provider character clock; not forced alignment. Verify subtitle timing by listening.'},ensure_ascii=False,indent=2)+'\n');print('duration',cursor/24,'seconds',[(s['id'],s['duration']/24,s['clockScale']) for s in out])
