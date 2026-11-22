#!/usr/bin/env python3
"""Frame-deterministic, staged Episode 01 offline render. Dialogue remains subtitles; no VO is fabricated."""
import io,json,math,os,re,subprocess
from PIL import Image,ImageDraw,ImageFont
from episode01_actor import actor
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));W,H,FPS=540,960,30
EP=next(e for e in json.load(open(os.path.join(ROOT,'src/data/episodes.json'),encoding='utf8')) if e['id']=='01')
OUT=os.path.join(ROOT,'Episode-01-Orang-Miskin-Dilarang-Miskin-Cinematic.mp4');FF=os.path.join(ROOT,'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');FF=FF if os.path.exists(FF) else 'ffmpeg'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';F={'sub':ImageFont.truetype(BOLD,19),'speaker':ImageFont.truetype(BOLD,11),'tiny':ImageFont.truetype(FONT,10)}
INK='#263037';SKINS={'DARTO':'#a96f50','PETUGAS':'#d1a080','PEMBELI':'#c88e6a'};CLOTHES={'DARTO':'#426d72','PETUGAS':'#465866','PEMBELI':'#a27655'}

def lines(text,font,width):
 d=ImageDraw.Draw(Image.new('RGB',(1,1)));out=[];cur=''
 for w in text.split():
  test=(cur+' '+w).strip()
  if d.textbbox((0,0),test,font=font)[2]<=width:cur=test
  else:
   if cur:out.append(cur)
   cur=w
 if cur:out.append(cur)
 return out

def scene_bg(idx,frame):
 # Full-bleed sets, one environment per source scene; no decorative frame or persistent UI.
 pal=[('#e7ddcb','#a1805f'),('#e1e3da','#9e7956'),('#c6d1c5','#81715c'),('#e7ddcb','#a1805f'),('#e1e3da','#9e7956'),('#d9cdbb','#a18b72')];wall,floor=pal[idx]
 im=Image.new('RGB',(W,H),wall);d=ImageDraw.Draw(im);d.rectangle((0,600,W,H),fill=floor)
 if idx in (0,1,3,4):
  d.rectangle((32,112,207,397),fill='#896849');d.rectangle((42,122,197,386),fill='#a9c8c4');d.line((120,122,120,386),fill='#896849',width=7);d.line((42,255,197,255),fill='#896849',width=7)
  d.rectangle((376,125,505,360),fill='#a77d51');d.rectangle((388,138,493,345),fill='#d9cfb8')
  for y in (170,212,254,296):d.line((406,y,476,y),fill='#988873',width=4)
  d.rectangle((0,548,W,566),fill='#6d503b');d.rectangle((0,566,W,642),fill='#a27e5b')
 elif idx==2:
  d.rectangle((0,120,W,400),fill='#a7c5c3');d.ellipse((55+int(frame*.25)%420,175,205+int(frame*.25)%420,225),fill='#f9efd9')
  for x in range(-30,600,135):d.polygon([(x,505),(x+53,330),(x+145,505)],fill='#778975')
  d.rectangle((0,505,W,580),fill='#827562');d.line((0,545,W,545),fill='#eee2c8',width=4)
  # old motor: recognizable wheels, frame, seat, subtly sputters only on authored beat
  wobble=3*math.sin(frame*.8) if 850<=frame<=1060 else 0
  d.ellipse((296,486,365,555),outline=INK,width=6);d.ellipse((422,486,491,555),outline=INK,width=6)
  d.line((330,520,372,454+wobble,430,520,470,520),fill='#54736d',width=9);d.line((372,454+wobble,420,460+wobble),fill=INK,width=9);d.line((417,459,405,440),fill=INK,width=6)
 else:
  # quiet office porch, bench and door
  d.rectangle((390,125,515,505),fill='#886b50');d.rectangle((410,143,496,484),fill='#614a38');d.line((0,610,W,610),fill='#715a44',width=9);d.line((65,610,65,720),fill='#715a44',width=8);d.line((476,610,476,720),fill='#715a44',width=8)
 return im

def render_frame(frame):
 sec=frame/FPS;shot=next(s for s in EP['shots'] if s['startSeconds']<=sec<s['endSeconds']);idx=shot['number']-1;start=shot['startSeconds']*FPS;local=frame-start;duration=(shot['endSeconds']-shot['startSeconds'])*FPS
 raw=[x.strip() for x in shot['dialogue'].splitlines() if x.strip()]; per=duration/max(1,len(raw));line_index=min(len(raw)-1,int(local/per));line=raw[line_index] if raw else '';m=re.match(r'^([^:]{1,55}):\s*(.*)$',line);speaker,text=(m.group(1),m.group(2)) if m else ('',line);speaker=speaker.split('(')[0].strip().upper()
 cue=next((c for c in cues if c['startSeconds']<=sec<c['startSeconds']+c['durationSeconds']),None)
 if cue:speaker,text=cue['speaker'].split(' · ')[0],cue['text']
 im=scene_bg(idx,frame);d=ImageDraw.Draw(im);chars=list(shot['characters']);
 if idx==2 and 'PEMBELI' not in [c.upper() for c in chars]:chars.append('PEMBELI')
 if idx==5:chars=[c for c in chars if c.upper()!='ANAK']
 # Source-timed shot subbeats vary camera scale and actor blocking; explicit, deterministic cuts.
 if idx in (1,3):close=(line_index%2==0);scale=1.08 if close else .82
 elif idx==5:close=local<duration*.54;scale=1.25 if close else .78
 elif idx==2:close=(line_index==1);scale=1.03 if close else .79
 else:close=(line_index==2);scale=.96 if close else .81
 if close and len(chars)>1:
  active=next((c for c in chars if c.upper()==speaker),chars[0]);focus=active.upper()
  if focus=='ANAK':focus='DARTO'
  x=-12 if focus in ('DARTO','PEMBELI') else 245;y=130;s=1.24
  who=focus
  mood='suspicious' if who=='PETUGAS' and idx in (0,1,3) else 'confused' if who=='DARTO' and idx in (1,3) else 'sad' if idx==5 else 'plead'
  if idx==5 and who=='DARTO':mood='sad'
  acting='talk-plead' if speaker==who and who=='DARTO' and idx==0 else 'talk-gesture' if speaker==who and who=='DARTO' and idx in (3,4) else 'talk' if speaker==who else 'rest';a=actor(who,frame,mood,acting,-3 if who=='DARTO' else 2);a=a.resize((round(220*s),round(390*s)),Image.Resampling.LANCZOS);im.paste(a,(x,y),a)
 else:
  positions=[25,280] if len(chars)<=2 else [5,165,330]
  for j,name in enumerate(chars[:3]):
   nm=name.upper()
   if nm=='ANAK':continue
   active=nm==speaker;emotion='plead' if nm=='DARTO' and idx in (0,4) else 'tired' if nm=='DARTO' and idx==5 else 'suspicious' if nm=='PETUGAS' and idx in (1,3) else 'neutral'
   gesture=('talk-plead' if nm=='DARTO' and idx==0 else 'talk-gesture' if nm=='DARTO' and idx in (3,4) else 'talk') if active else 'plead' if nm=='DARTO' and idx==0 else 'rest'
   a=actor(nm,frame,emotion,gesture,3 if nm=='DARTO' else -3);s=.90 if len(chars)<=2 else .73;a=a.resize((round(220*s),round(390*s)),Image.Resampling.LANCZOS);im.paste(a,(positions[j],300),a)
 # Scene-specific practical prop, foregrounded and held in consistent eyeline geography.
 if idx in (0,1):d.polygon([(220,530),(304,510),(329,562),(244,578)],fill='#d6c69e',outline=INK,width=3);d.line((235,539,284,529),fill='#8d806b',width=2)
 elif idx==3:d.rounded_rectangle((235,520,300,558),radius=5,fill='#cfb565',outline=INK,width=3);d.text((248,531),'Rp',font=F['tiny'],fill=INK)
 elif idx==4:d.polygon([(224,525),(306,510),(330,562),(245,577)],fill='#e0d4bc',outline=INK,width=3);d.line((245,542,292,531),fill='#8d806b',width=2)
 elif idx==5:
  d.rounded_rectangle((408,500,465,606),radius=9,fill='#303c47',outline='#171f26',width=3);d.rectangle((415,511,458,584),fill='#b8cec7');d.line((420,594,450,594),fill='#ddd3bf',width=3)
 # Subtitle is only present while the line is spoken; no presentation card or playback UI.
 if text:
  wrapped=lines(text,F['sub'],W-58);base=H-74-len(wrapped)*25
  d.text((W//2,base-15),speaker,font=F['speaker'],fill='#f2ca91',anchor='mm',stroke_width=2,stroke_fill='#20272c')
  for j,t in enumerate(wrapped):d.text((W//2,base+j*25),t,font=F['sub'],fill='#fffdf5',anchor='mm',stroke_width=3,stroke_fill='#1d2529')
 # final fade-to-black is motivated by the source's unresolved ending
 if idx==5 and sec>87:
  alpha=min(190,int((sec-87)/3*190));overlay=Image.new('RGBA',(W,H),(0,0,0,alpha));im=Image.alpha_composite(im.convert('RGBA'),overlay).convert('RGB')
 # Small, motivated deterministic push-in during each beat; focal point tracks the active face or shared eyeline.
 zoom=1.0+(0.04 if idx in (0,4,5) else 0.025)*max(0,min(1,local/duration))
 if zoom>1:
  nw,nh=round(W*zoom),round(H*zoom);scaled=im.resize((nw,nh),Image.Resampling.LANCZOS)
  focus_x=(120 if speaker.startswith('DARTO') or speaker.startswith('PEMBELI') else 380) if close else 270
  left=max(0,min(nw-W,round(focus_x*zoom-focus_x)));top=max(0,min(nh-H,round(455*zoom-455)))
  im=scaled.crop((left,top,left+W,top+H))
 return im.resize((1080,1920),Image.Resampling.LANCZOS)

cues=json.load(open(os.path.join(ROOT,'audio/ep01-timeline.json'),encoding='utf8'))
cmd=[FF,'-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',str(FPS),'-i','-']
for cue in cues:cmd += ['-i',os.path.join(ROOT,'audio',cue['file'])]
cmd += ['-i',os.path.join(ROOT,'audio/ep01-roomtone-synthetic.wav'),'-i',os.path.join(ROOT,'audio/ep01-foley-synthetic.wav')]
parts=[]
for i,cue in enumerate(cues,1):
 delay=round(cue['startSeconds']*1000);speed=cue.get('speed',1.0);parts.append(f'[{i}:a]atempo={speed},adelay={delay}:all=1,volume=0.72[a{i}]')
parts.append(f'[{len(cues)+1}:a]volume=1[room]');parts.append(f'[{len(cues)+2}:a]volume=0.65[foley]');inputs=''.join(f'[a{i}]' for i in range(1,len(cues)+1))+'[room][foley]';parts.append(f'{inputs}amix=inputs={len(cues)+2}:duration=longest:normalize=0,volume=0.82,apad=pad_dur=90[aout]')
cmd += ['-filter_complex',';'.join(parts),'-map','0:v','-map','[aout]','-c:v','libx264','-preset','ultrafast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-t','90','-movflags','+faststart','-metadata',f"title={EP['title']} — cinematic staged animatic",'-metadata','comment=90 sec; 1080x1920; 30fps; generated dialogue tracks with approximate timing; vowel-class mouth animation, not phoneme-accurate.',OUT]
p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
try:
 for n in range(90*FPS):
  b=io.BytesIO();render_frame(n).save(b,format='PNG',compress_level=1);p.stdin.write(b.getvalue())
  if n%450==0:print(f'Frames {n}/2700 ({n//FPS}s)',flush=True)
 p.stdin.close();code=p.wait()
 if code:raise SystemExit(code)
except BrokenPipeError:raise SystemExit(p.wait())
print(f'Wrote {OUT} ({os.path.getsize(OUT)//1024} KiB, 90s, 30fps, 1080x1920, 18 line-timed dialogue cues, ambience, and synthetic foley).')
