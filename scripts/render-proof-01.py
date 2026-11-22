#!/usr/bin/env python3
"""Render a 13s/30fps animated proof scene from episode 01 using source-timed dialogue and generated character VO."""
import io,json,math,os,re,subprocess
from PIL import Image,ImageDraw,ImageFont,ImageFilter
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));W,H,FPS=540,960,30;DURATION=13;OUT=os.path.join(ROOT,'Proof-01-Cinematic-Acting.mp4')
FF=os.path.join(ROOT,'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');
if not os.path.exists(FF):FF='ffmpeg'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
F={'subtitle':ImageFont.truetype(BOLD,24),'speaker':ImageFont.truetype(MONO,12),'detail':ImageFont.truetype(BOLD,14),'small':ImageFont.truetype(MONO,10)}
INK='#263037';PAPER='#f0e8d9';RUST='#b64d37';
with open(os.path.join(ROOT,'src/data/episodes.json'),encoding='utf8') as f:EP=next(e for e in json.load(f) if e['id']=='01')
LINES=[s['dialogue'].splitlines() for s in EP['shots'][:1]]
UTTERANCES=[{'start':0,'end':192,'speaker':'DARTO','text':'Bu, saya mau daftar bantuan. Tiga hari ini dapur kami nggak ngebul.','audio':'public/audio/proof-darto-01.mp3'}, {'start':192,'end':244,'speaker':'PETUGAS','text':'Kendaraan ada?','audio':'public/audio/proof-petugas-01.mp3'}, {'start':244,'end':375,'speaker':'DARTO','text':'Motor tua. Kalau hujan, dia ikut mogok.','audio':'public/audio/proof-darto-02.mp3'}]

def roundrect(d,box,r,fill,outline=None,width=1):d.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=width)
def pathline(d,points,fill,width):d.line(points,fill=fill,width=width,joint='curve')
def wrap(draw,text,font,maxw):
 words=text.split();out=[];line=''
 for word in words:
  test=(line+' '+word).strip()
  if draw.textbbox((0,0),test,font=font)[2]<=maxw:line=test
  else:
   if line:out.append(line)
   line=word
 if line:out.append(line)
 return out

def make_office(frame):
 im=Image.new('RGB',(W,H));px=im.load()
 # Soft warm top light rolls into a cooler office floor.
 for y in range(H):
  u=y/H
  if u<.70:
   q=u/.70;a=(232,222,205);b=(204,190,168);c=tuple(int(a[i]*(1-q)+b[i]*q) for i in range(3))
  else:
   q=(u-.70)/.30;a=(156,126,93);b=(112,84,61);c=tuple(int(a[i]*(1-q)+b[i]*q) for i in range(3))
  for x in range(W):px[x,y]=c
 d=ImageDraw.Draw(im)
 # Tall service-office window, recess, moving cloud-light parallax.
 roundrect(d,(28,94,221,365),6,'#795b40');d.rectangle((40,106,209,353),fill='#a9c8c4')
 cloud=(frame*.7)%220-110
 d.ellipse((70+cloud,155,155+cloud,180),fill='#f8eed8');d.ellipse((120+cloud,146,202+cloud,173),fill='#f8eed8')
 d.line((40,240,209,240),fill='#896d4e',width=8);d.line((125,106,125,353),fill='#896d4e',width=8)
 # Service window signage / stamped queue slips; no UI frame.
 roundrect(d,(376,100,511,291),8,'#9b7652');d.rectangle((388,112,499,278),fill='#d3c7ad');d.text((402,129),'LAYANAN',font=F['small'],fill='#48565a')
 for yy in (160,188,216,244):d.line((405,yy,480-(yy%2)*10,yy),fill='#938774',width=4)
 # Noticeboard, coat hook, shadowed door in perspective.
 d.polygon([(441,320),(528,305),(528,577),(441,592)],fill='#aa8055');d.polygon([(453,333),(514,322),(514,555),(453,566)],fill='#765a42')
 d.ellipse((328,368,355,395),fill='#67513d');d.line((341,388,341,430),fill='#67513d',width=5)
 # Counter in foreground, with a light bevel and grounded folder resting on it.
 d.polygon([(0,548),(540,548),(540,573),(0,573)],fill='#584332');d.rectangle((0,574,540,665),fill='#987453');d.line((0,578,540,578),fill='#c09a6c',width=5)
 d.rectangle((18,665,32,850),fill='#6f533b');d.rectangle((508,665,522,850),fill='#6f533b')
 # A couple of papers and a capped stamp make the counter physically legible.
 d.polygon([(227,531),(281,521),(309,558),(252,567)],fill='#dfcca0',outline='#514432');d.line((242,542,275,536),fill='#9b8864',width=2)
 roundrect(d,(335,531,363,556),5,'#b64d37','#503d32',2);d.rectangle((342,520,356,534),fill='#665544')
 # ambient edge shadows / floor seam
 d.line((0,853,540,853),fill='#6e5740',width=5)
 return im

def figure_image(name,frame,expression='neutral',gesture='listen',talk=False,look=0):
 im=Image.new('RGBA',(300,540),(0,0,0,0));d=ImageDraw.Draw(im)
 if name=='DARTO':skin='#a96f50';hair='#292724';shirt='#426d72';accent='#c88b4e';shape='average'
 else:skin='#d1a080';hair='#39312d';shirt='#465866';accent='#cfb36c';shape='broad'
 t=frame/FPS;breath=math.sin(t*1.25+(0 if name=='DARTO' else .7))*2.2
 shoulder=245+breath;headx=150+look*2;heady=143+breath;lean=0
 if expression in ('pleading','exhausted'):lean=-5
 if expression in ('suspicious','confused'):lean=3
 # silhouette shadow and legs; articulated hip/knee/ankle parts with pose offsets
 d.ellipse((51,498,252,523),fill=(30,34,34,45))
 gait=math.sin(t*8+(0 if name=='DARTO' else 1));walk=gesture=='walk';leftHip=gait*13 if walk else 0;rightHip=-gait*13 if walk else 0
 pathline(d,[(116,395),(112+leftHip,449),(111+leftHip,496)],INK,32);pathline(d,[(185,395),(190+rightHip,449),(194+rightHip,496)],INK,32)
 # work trousers and separate cuffs/shoes
 d.polygon([(98,399),(145,408),(136+leftHip,486),(105+leftHip,486)],fill='#343b3e');d.polygon([(154,408),(202,398),(207+rightHip,486),(177+rightHip,486)],fill='#343b3e')
 d.ellipse((86+leftHip,485,144+leftHip,512),fill='#292d30');d.ellipse((174+rightHip,485,232+rightHip,512),fill='#292d30')
 # body profile, shoulder width and wardrobe detail distinct per character
 hw=83 if shape=='average' else 95
 d.polygon([(150-hw,shoulder),(150-61,shoulder-30),(150+60,shoulder-30),(150+hw,shoulder),(218,405),(83,405)],fill=shirt,outline=INK)
 if name=='PETUGAS':
  d.polygon([(137,shoulder-14),(163,shoulder-14),(172,400),(128,400)],fill='#354655');d.line((150,shoulder-5,150,394),fill=accent,width=4);roundrect(d,(190,shoulder+26,213,shoulder+49),4,'#d1bb7a','#4b4b3f',2)
 else:
  d.polygon([(121,shoulder+18),(179,shoulder+18),(192,405),(108,405)],fill='#577b78');d.line((123,shoulder+43,176,shoulder+43),fill='#345b59',width=4)
 # neck and ears
 d.rectangle((134,heady+59,166,heady+107),fill=skin)
 d.ellipse((headx-61,heady+37,headx-39,heady+76),fill=skin,outline=INK,width=3);d.ellipse((headx+39,heady+37,headx+61,heady+76),fill=skin,outline=INK,width=3)
 # head deliberately oval, angular jaw, cheeks, nose bridge, chin
 d.ellipse((headx-56,heady-35,headx+56,heady+100),fill=skin,outline=INK,width=4)
 # cheek planes to give facial volume
 d.ellipse((headx-45,heady+38,headx-16,heady+66),fill='#bd8062' if name=='DARTO' else '#dcae8d')
 d.ellipse((headx+16,heady+38,headx+45,heady+66),fill='#bd8062' if name=='DARTO' else '#dcae8d')
 # hair silhouette: swept short cut for Darto, side part and neat temple for officer
 if name=='DARTO':
  d.pieslice((headx-61,heady-53,headx+62,heady+45),180,355,fill=hair,outline=INK,width=3);d.polygon([(headx-52,heady+8),(headx-22,heady-28),(headx+6,heady-23),(headx+39,heady-46),(headx+55,heady+2)],fill=hair)
 else:
  d.pieslice((headx-59,heady-54,headx+59,heady+52),180,355,fill=hair,outline=INK,width=3);d.polygon([(headx-44,heady-5),(headx-18,heady-40),(headx+28,heady-43),(headx+50,heady-18),(headx+13,heady-21)],fill=hair)
 # eye rigs: brow angle and pupil direction change with the reaction beat
 eyeY=heady+28;direction=look
 eyeOpen=1.34 if expression=='surprised' else .76 if expression in ('exhausted','defeated') else 1
 if expression in ('pleading','confused'):browY=-5
 elif expression in ('suspicious','angry'):browY=6
 elif expression=='embarrassed':browY=-2
 else:browY=0
 for side in (-1,1):
  ex=headx+side*23;d.ellipse((ex-12,eyeY-12,ex+12,eyeY+12),fill='#f5edda',outline='#382f2a',width=2)
  d.ellipse((ex-5+direction,eyeY-6*eyeOpen,ex+5+direction,eyeY+7*eyeOpen),fill='#262729')
  d.ellipse((ex-2+direction,eyeY-4*eyeOpen,ex+1+direction,eyeY-1*eyeOpen),fill='#fff8e7')
  if name=='DARTO':
   d.line((ex-12,eyeY-19+browY,ex+10,eyeY-22+browY),fill=hair,width=5)
  else:
   d.line((ex-12,eyeY-20+browY,ex+11,eyeY-16+browY),fill=hair,width=5)
 # nose, smile lines and expression wrinkles
 d.line((headx,eyeY+3,headx-3,eyeY+24,headx+5,eyeY+27),fill='#875d49',width=3)
 # Lip shapes generated from Indonesian vowel nuclei with coarticulation; expressions layer independently.
 duration={ 'DARTO':192 if frame<192 else 131,'PETUGAS':52}[name]
 speaker=(name=='DARTO' and ((frame<192) or (244<=frame<375))) or (name=='PETUGAS' and 192<=frame<244)
 text=UTTERANCES[0]['text'] if name=='DARTO' and frame<192 else UTTERANCES[2]['text'] if name=='DARTO' else UTTERANCES[1]['text']
 start=0 if name=='DARTO' and frame<192 else 244 if name=='DARTO' else 192
 local=max(0,frame-start);mouth='closed'
 if speaker:
  syllables=re.findall(r'[aeiou]+',text.lower());idx=min(len(syllables)-1,int(local/max(1,duration)*len(syllables))) if syllables else 0;v=syllables[idx][0] if syllables else 'a';mouth='round' if v in 'ou' else 'wide' if v=='a' else 'open'
 if not speaker: mouth='round' if expression=='surprised' else 'closed' if expression in ('suspicious','exhausted','defeated') else 'rest'
 mx=headx;my=heady+66
 if mouth=='wide':d.ellipse((mx-13,my-5,mx+13,my+8),fill='#6b3935');d.arc((mx-14,my-4,mx+14,my+9),0,180,fill='#452f2e',width=2)
 elif mouth=='open':d.ellipse((mx-9,my-6,mx+9,my+10),fill='#593634')
 elif mouth=='round':d.ellipse((mx-6,my-8,mx+6,my+8),fill='#593634',outline='#452f2e',width=2)
 else:
  smirk=4 if expression in ('pleading','embarrassed') else 0
  d.arc((mx-14,my-7-smirk,mx+14,my+9),12,168,fill='#613e38',width=3)
 if expression=='embarrassed':
  d.ellipse((headx-44,heady+53,headx-27,heady+61),fill='#c67c6c');d.ellipse((headx+27,heady+53,headx+44,heady+61),fill='#c67c6c')
 # articulated shoulders/upper arms/forearms/hands: listen rests, pleading reaches toward folder
 upper=shirt
 if name=='DARTO' and gesture=='pleading':
  pathline(d,[(83,shoulder+3),(67,shoulder+60),(115,shoulder+105)],upper,25);pathline(d,[(115,shoulder+105),(153,shoulder+123)],upper,19);d.ellipse((144,shoulder+115,163,shoulder+134),fill=skin)
  pathline(d,[(214,shoulder+2),(229,shoulder+52),(230,shoulder+82)],upper,24);d.ellipse((221,shoulder+75,239,shoulder+94),fill=skin)
 elif name=='DARTO' and gesture=='dry-joke':
  pathline(d,[(84,shoulder+5),(66,shoulder+55),(91,shoulder+104)],upper,25);pathline(d,[(91,shoulder+104),(112,shoulder+117)],upper,19);d.ellipse((105,shoulder+108,125,shoulder+127),fill=skin)
  pathline(d,[(214,shoulder+4),(224,shoulder+54),(213,shoulder+84)],upper,24);d.ellipse((204,shoulder+76,222,shoulder+95),fill=skin)
 else:
  # Petugas rests palms on counter with slight finger tap; Darto's off beat hand keeps hold of map.
  pathline(d,[(82,shoulder+6),(70,shoulder+73),(75,shoulder+125)],upper,25);pathline(d,[(75,shoulder+125),(113,shoulder+126)],upper,18);d.ellipse((108,shoulder+118,129,shoulder+137),fill=skin)
  pathline(d,[(216,shoulder+6),(229,shoulder+69),(218,shoulder+120)],upper,25);pathline(d,[(218,shoulder+120),(188,shoulder+126)],upper,18);d.ellipse((177,shoulder+117,199,shoulder+138),fill=skin)
 # uniform seam, collar and stitch detail
 if name=='DARTO':
  d.line((150,shoulder+27,150,396),fill='#c38a50',width=4);d.polygon([(135,shoulder+2),(150,shoulder+29),(165,shoulder+2)],fill='#e0d2b3')
 else:
  d.polygon([(132,shoulder-4),(150,shoulder+26),(168,shoulder-4)],fill='#d3c9b4');d.line((150,shoulder+26,150,394),fill='#d0b66e',width=4)
 return im

def place_character(world,name,x,origin_y,scale,frame,expression,gesture,look=0):
 layer=figure_image(name,frame,expression,gesture,True,look);rw,rh=round(300*scale),round(540*scale);layer=layer.resize((rw,rh),Image.Resampling.LANCZOS);world.paste(layer,(int(x),int(origin_y)),layer)

def scene_world(frame):
 world=make_office(frame).convert('RGBA');sec=frame/FPS
 if frame<192 or frame>=375:
  # Medium/two-shot: meaningful negative space and readable opposing eyelines.
  mood='pleading' if frame<192 else 'embarrassed';gesture='pleading' if frame<192 else 'dry-joke'
  place_character(world,'DARTO',14,282,.88,frame,mood,gesture,look=2 if frame<150 else -5)
  pet='listening' if frame<192 else 'suspicious';place_character(world,'PETUGAS',290,282,.88,frame,pet,'listen',look=-2)
  # Folder handoff point is between their hands, not an overlay card.
  d=ImageDraw.Draw(world);d.ellipse((224,550,313,568),fill=(40,33,27,68))
 elif frame<244:
  # Petugas reaction close-up: brow lifts, eyes hold on Darto before the question.
  # Slight head movement into the frame is a motivated push, not ambient shake.
  local=frame-192;origin=int(48+local*.15);place_character(world,'PETUGAS',origin,38,1.78,frame,'suspicious','listen',look=-10)
  d=ImageDraw.Draw(world);d.rectangle((0,0,W,70),fill=(57,45,35,30))
 else:
  # Darto close-up: averted eyeline, breath held, then the dry, embarrassed punchline.
  local=frame-244;place_character(world,'DARTO',-79,35,1.82,frame,'confused' if local<35 else 'embarrassed','dry-joke',look=-12 if local<50 else 7)
  # Folded folder edge on counter anchors the joke back to the application.
  d=ImageDraw.Draw(world);d.line((396,713,518,692),fill='#ddc997',width=12);d.line((396,713,423,778),fill='#ab8f61',width=9)
 # camera push/reaction pull authored as explicit shot spans
 if frame<192:zoom=1+.075*max(0,min(1,frame/192))
 elif frame<244:zoom=1.05+.06*max(0,min(1,(frame-192)/52))
 elif frame<375:zoom=1+.06*max(0,min(1,(frame-244)/131))
 else:zoom=1.10-.10*max(0,min(1,(frame-375)/15))
 new=world.resize((round(W*zoom),round(H*zoom)),Image.Resampling.LANCZOS)
 # focal point intentionally follows the active face: pair center, officer, then Darto.
 fx=.52 if frame<192 or frame>=375 else .72 if frame<244 else .30;fy=.50 if frame<192 or frame>=375 else .39
 left=max(0,min(new.width-W,round(fx*new.width-fx*W)));top=max(0,min(new.height-H,round(fy*new.height-fy*H)))
 world=new.crop((left,top,left+W,top+H)).convert('RGB')
 return world

def draw_frame(frame):
 im=scene_world(frame);d=ImageDraw.Draw(im)
 u=next((x for x in UTTERANCES if x['start']<=frame<x['end']),None)
 if u:
  textlines=wrap(d,u['text'],F['subtitle'],W-64);speaker='DARTO' if u['speaker']=='DARTO' else 'PETUGAS'
  y=H-105-len(textlines)*31
  d.text((W//2,y-21),speaker,font=F['speaker'],fill='#f1c88d',anchor='mm',stroke_width=2,stroke_fill='#262c30')
  for j,line in enumerate(textlines):d.text((W//2,y+j*31),line,font=F['subtitle'],fill='#fffdf5',anchor='mm',stroke_width=3,stroke_fill='#1d2529')
 # Tiny fictional disclosure at top left; no decorative player chrome or permanent progress UI.
 d.text((20,20),'CERITA FIKSI · ANIMATIC PROOF',font=F['small'],fill='#fcf3e4',stroke_width=2,stroke_fill='#283038')
 return im.resize((W*2,H*2),Image.Resampling.LANCZOS)

cmd=[FF,'-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',str(FPS),'-i','-','-i',os.path.join(ROOT,UTTERANCES[0]['audio']),'-i',os.path.join(ROOT,UTTERANCES[1]['audio']),'-i',os.path.join(ROOT,UTTERANCES[2]['audio']),'-filter_complex','[1:a]adelay=0:all=1[a0];[2:a]adelay=6400:all=1[a1];[3:a]adelay=8133:all=1[a2];[a0][a1][a2]amix=inputs=3:duration=longest:normalize=0,apad=pad_dur=0.49[a]','-map','0:v','-map','[a]','-vf','scale=1080:1920:flags=lanczos','-r',str(FPS),'-t',str(DURATION),'-c:v','libx264','-preset','ultrafast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-metadata','title=Episode 01 — cinematic acting proof','-metadata','comment=13s 30fps 1080x1920; generated Indonesian character dialogue; 3 dramatic cuts; approximate vowel-nucleus lip sync.','-shortest',OUT]
proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
try:
 for n in range(DURATION*FPS):
  buf=io.BytesIO();draw_frame(n).save(buf,format='PNG',compress_level=1);proc.stdin.write(buf.getvalue())
  if n%90==0:print(f'Proof frames {n}/{DURATION*FPS}',flush=True)
 proc.stdin.close();code=proc.wait()
 if code:raise SystemExit(code)
except BrokenPipeError:raise SystemExit(proc.wait())
print(f'Wrote {OUT} ({os.path.getsize(OUT)//1024} KiB, 13s, 30fps, 1080x1920, 3 speech clips).')
