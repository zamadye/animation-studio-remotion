"""Measure real VO; generate review timing and energy-gated character-timestamp mouth cues.
Not phoneme forced alignment. Never edits the locked body catalog.
"""
import json,array,math,subprocess
from pathlib import Path
import imageio_ffmpeg
FPS=24;RATE=24000;ff=imageio_ffmpeg.get_ffmpeg_exe()
source=json.load(open('src/data/episodes.json'))[0];lines=json.load(open('src/episodes/ep01-lines.json'));result=[];report=[]
for shot in source['shots']:
 takes=[]
 for row in [r for r in lines if r['shot']==shot['number']]:
  take=json.load(open(f"public/audio/episode01-elevenlabs/{row['id']}.json"))
  raw=subprocess.check_output([ff,'-i','public/'+take['audio'],'-f','s16le','-ac','1','-ar',str(RATE),'-loglevel','error','-']);samples=array.array('h',raw)
  takes.append((row,take,samples))
 start=shot['startSeconds']*FPS;end=shot['endSeconds']*FPS;durations=[math.ceil(len(s)/RATE*FPS) for r,t,s in takes];budget=end-start
 if sum(durations)+12*(len(takes)+1)>budget:raise RuntimeError(f"Shot {shot['number']}: VO does not fit; re-author timing, never trim words")
 gap=min(28,(budget-sum(durations))//(len(takes)+1));cursor=start+gap
 for (row,take,samples),duration in zip(takes,durations):
  energies=[math.sqrt(sum(v*v for v in samples[i:i+1000])/max(1,len(samples[i:i+1000]))) for i in range(0,len(samples),1000)];peak=max(energies) or 1
  a=take['alignment'];chars=list(zip(a['characters'],a['character_start_times_seconds'],a['character_end_times_seconds']));keys=[]
  for f in range(duration):
   time=(f+.5)/FPS;char=next((c.lower() for c,s,e in chars if s<=time<e),'');energy=energies[f] if f<len(energies) else 0
   shape={'a':'A','e':'E','i':'E','o':'O','u':'U','b':'MBP','p':'MBP','m':'MBP','f':'FV','v':'FV','l':'L'}.get(char,'A' if char.isalpha() else 'rest')
   if energy<peak*.075:shape='rest'
   keys.append({'start':f,'end':f+1,'viseme':shape,'openness':round(min(1,energy/peak*1.8),3) if shape!='rest' else 0})
  result.append({**row,'start':cursor,'end':cursor+duration,'audio':take['audio'],'alignment':'audio-energy-text-estimate','timingSource':'elevenlabs-character-timestamps-plus-measured-energy','visemes':keys});cursor+=duration+gap
 report.append({'shot':shot['number'],'durationFrames':budget,'dialogueFrames':sum(durations),'gapFrames':gap,'endingHoldFrames':end-(cursor-gap)})
Path('src/episodes/ep01-timeline.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');Path('docs/episode01-audio-timing.json').write_text(json.dumps(report,indent=2)+'\n');print(report)
