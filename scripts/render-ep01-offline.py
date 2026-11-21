#!/usr/bin/env python3
"""Render a source-timed silent 2D animatic for episode 01 without a browser.
Shot boundaries come directly from episodes.json. Dialogue is evenly distributed inside each source shot for preview only (not VO alignment)."""
import json, math, os, subprocess, sys, io
from PIL import Image, ImageDraw, ImageFont

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT,'src/data/episodes.json'),encoding='utf8') as f: episode=next(e for e in json.load(f) if e['id']=='01')
W,H,FPS=720,1280,15
OUT=os.path.join(ROOT,'Episode-01-Orang-Miskin-Dilarang-Miskin-Animatic.mp4')
FF=os.path.join(ROOT,'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg')
if not os.path.exists(FF): FF='ffmpeg'
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; mono='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
F={k:ImageFont.truetype(p,s) for k,(p,s) in {'small':(mono,14),'tiny':(mono,11),'label':(bold,13),'body':(font,21),'sub':(bold,27),'title':(bold,45),'big':(bold,30)}.items()}
RUST='#b64d37'; INK='#293238'; MUTED='#67716d'; PAPER='#f3eee4'; TEAL='#3b7772'; CREAM='#fffdf8'
# Discrete set palettes and focal prop motifs, mapped 1:1 to authored shot rows.
SCENES=[('#e8dfcf','#bd9f7b','KANTOR PELAYANAN','MAP LECEK'),('#e3e7e0','#a4aca5','MEJA PETUGAS','FORMULIR / ASET'),('#dddcd1','#8c9d92','PINGGIR JALAN','MOTOR TUA'),('#e8dfcf','#bd9f7b','KANTOR PELAYANAN','UANG HASIL JUAL'),('#e3e7e0','#a4aca5','KANTOR PELAYANAN','BUKTI USAHA'),('#e6dcca','#ad9478','TERAS KANTOR','PONSEL RETAK')]

def wrap(draw,text,font,maxw):
 words=text.split(); lines=[]; cur=''
 for word in words:
  test=(cur+' '+word).strip()
  if draw.textbbox((0,0),test,font=font)[2]<=maxw: cur=test
  else:
   if cur: lines.append(cur)
   cur=word
 if cur:lines.append(cur)
 return lines

def rr(d,box,r,fill,outline=None,width=1): d.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=width)

def character(d,cx,base,name,kind,t):
 if name=='DARTO': skin,hair,shirt,half,head,kindHair='#a96f50','#292824','#426d72',53,39,'short'
 elif name=='PETUGAS': skin,hair,shirt,half,head,kindHair='#d5a27e','#45413d','#4b5966',66,42,'sidepart'
 elif name=='PEMBELI': skin,hair,shirt,half,head,kindHair='#c88e6a','#362a27','#a27655',43,36,'curly'
 else: skin,hair,shirt,half,head,kindHair='#bc8062','#342724','#765d69',51,38,'bun'
 bob=round(math.sin(t*5+cx)*3)
 walk=kind=='walk'; step=math.sin(t*7+cx*.01) if walk else 0
 # Character silhouettes differ in shoulder width, head shape, leg length and wardrobe.
 hip=base-138+bob;legSwing=int(step*12)
 d.line((cx-20,hip,cx-25-legSwing,base-5),fill=INK,width=13);d.line((cx+18,hip,cx+25+legSwing,base-5),fill=INK,width=13)
 d.ellipse((cx-39-legSwing,base-14,cx-14-legSwing,base-3),fill='#343b3e');d.ellipse((cx+12+legSwing,base-14,cx+37+legSwing,base-3),fill='#343b3e')
 d.polygon([(cx-half+10,base-236+bob),(cx-half,base-211+bob),(cx-half+6,base-103),(cx+half-6,base-103),(cx+half,base-211+bob),(cx+half-10,base-236+bob)],fill=shirt,outline=INK)
 if name=='PETUGAS':
  d.polygon([(cx-12,base-230),(cx+12,base-230),(cx+22,base-104),(cx-22,base-104)],fill='#354452');d.line((cx,base-220,cx,base-117),fill='#d4c081',width=4)
 if name=='PEMBELI':d.line((cx,base-221,cx,base-109),fill='#d7b85e',width=5)
 # neck and individually shaped faces
 d.rectangle((cx-12,base-261+bob,cx+12,base-230+bob),fill=skin)
 d.ellipse((cx-head,base-337+bob,cx+head,base-253+bob),fill=skin,outline=INK,width=4)
 if kindHair=='curly':
  for hx,hy,hr in [(-29,-320,14),(-16,-345,16),(5,-350,17),(27,-329,15),(34,-306,12)]:d.ellipse((cx+hx-hr,base+hy+bob-hr,cx+hx+hr,base+hy+bob+hr),fill=hair,outline=INK,width=2)
 elif kindHair=='bun':
  d.ellipse((cx+25,base-339+bob,cx+61,base-302+bob),fill=hair,outline=INK,width=2);d.pieslice((cx-42,base-345+bob,cx+42,base-265+bob),180,355,fill=hair,outline=INK,width=3)
 elif kindHair=='sidepart':
  d.pieslice((cx-head-3,base-344+bob,cx+head+3,base-263+bob),180,350,fill=hair,outline=INK,width=3);d.line((cx-4,base-336+bob,cx+16,base-331+bob),fill='#b9aba0',width=4)
 else:d.pieslice((cx-head-3,base-345+bob,cx+head+3,base-265+bob),180,355,fill=hair,outline=INK,width=3)
 eye_y=base-302+bob;d.ellipse((cx-20,eye_y,cx-14,eye_y+7),fill=INK);d.ellipse((cx+13,eye_y,cx+19,eye_y+7),fill=INK)
 if name=='PETUGAS':d.arc((cx-25,eye_y-9,cx+25,eye_y+13),180,355,fill=INK,width=3);d.line((cx-5,eye_y,cx+5,eye_y),fill=INK,width=2)
 d.arc((cx-11,base-293+bob,cx+12,base-277+bob),15,160,fill='#613e38',width=3)
 # pose changes follow action beats, never random
 gesture=kind in ('gesture','speak') and int(t*2)%3==0
 if gesture:
  d.line((cx-43,base-215+bob,cx-77,base-181+bob,cx-104,base-213+bob),fill=shirt,width=16,joint='curve');d.ellipse((cx-111,base-221+bob,cx-96,base-206+bob),fill=skin)
 else:
  d.line((cx-43,base-215+bob,cx-62,base-145+bob),fill=shirt,width=16);d.ellipse((cx-71,base-154+bob,cx-56,base-139+bob),fill=skin)
 d.line((cx+42,base-215+bob,cx+62,base-145+bob),fill=shirt,width=16);d.ellipse((cx+54,base-154+bob,cx+70,base-139+bob),fill=skin)

def draw_frame(frame):
 sec=frame/FPS; shot=next((s for s in episode['shots'] if s['startSeconds']<=sec<s['endSeconds']),episode['shots'][-1]); idx=shot['number']-1; local=sec-shot['startSeconds']; duration=shot['endSeconds']-shot['startSeconds']
 wall,floor,loc,prop=SCENES[idx]; im=Image.new('RGB',(W,H),PAPER);d=ImageDraw.Draw(im)
 # paper grain is intentionally omitted to keep deterministic and lightweight
 # Full-bleed location, built as environmental planes rather than a framed illustration card.
 top,bottom=0,H;d.rectangle((0,top,W,bottom),fill=wall);d.rectangle((0,int(H*.62),W,H),fill=floor)
 outdoors=idx in (2,5)
 if outdoors:
  d.rectangle((0,top+150,W,top+415),fill='#a9c6bf');d.ellipse((500+int(math.sin(sec*.22)*14),top+65,580+int(math.sin(sec*.22)*14),top+145),fill='#e5c985')
  for i in range(4):
   x=(i*220+int(sec*10))%900-100;d.polygon([(x,top+410),(x+72,top+205),(x+155,top+410)],fill='#71856b');d.rectangle((x+61,top+375,x+92,top+500),fill='#69553d')
  d.rectangle((0,top+500,W,top+570),fill='#897d69');d.line((0,top+530,W,top+530),fill='#e9dec6',width=5)
 else:
  d.rectangle((42,top+78,220,top+345),fill='#9cb6b2',outline='#a57e57',width=9);d.line((131,top+78,131,top+345),fill='#a57e57',width=6);d.line((42,top+208,220,top+208),fill='#a57e57',width=6)
  d.rectangle((516,top+120,688,top+390),fill='#a57e57')
  # wall noticeboard, pinned sheets vary with each desk-facing shot
  d.rectangle((525,top+145,675,top+335),fill='#d8cba9',outline='#79634a',width=6)
  for row in range(4):
   yy=top+169+row*37;d.line((545,yy,650-(row%2)*20,yy),fill='#8e8778',width=4)
 # Header is a light overlay on the continuous environment, not a fixed scene card.
 rr(d,(24,22,696,139),14,'#f3eee4')
 d.text((38,42),'STUDIO / FIKSI SATIR',font=F['small'],fill=MUTED);d.text((W-205,42),f"EP 01  ·  {shot['number']:02d}/06",font=F['small'],fill=MUTED)
 d.text((38,105),f"{int(sec//60):02d}:{int(sec%60):02d}  —  {shot['location'].upper()}",font=F['label'],fill=RUST)
 # Roadside prop is on the background plane; keep faces fully readable in front of it.
 if idx==2:
  d.ellipse((390,top+620,492,top+722),outline=INK,width=9);d.ellipse((570,top+620,672,top+722),outline=INK,width=9);d.line((439,top+671,497,top+585,571,top+669,627,top+669),fill='#54736d',width=13);d.line((490,top+585,464,top+561),fill=INK,width=8)
 # Source-directed actor blocking changes by setup; Darto crosses the outdoor lane in shot 3.
 names=list(shot['characters']);
 if idx==2 and 'PEMBELI' not in [name.upper() for name in names]:names.append('PEMBELI')
 # Cast data marks Anak as a phone voice; keep that character off-screen in this shot.
 if idx==5:names=[name for name in names if name.upper()!='ANAK']
 base=875
 first_x=[210,155,260,190,165,335][idx];second_x=[515,545,500,530,545,510][idx]
 if idx==2:first_x=170+int(min(1,local/duration)*190)
 if len(names)>=1: character(d,first_x,base,names[0].upper(),'walk' if idx==2 else ('speak' if local%duration<duration/2 else 'gesture'),sec)
 if len(names)>=2: character(d,second_x,base,names[1].upper(),'speak' if idx==2 else 'listen',sec+.8)
 # Props are part of the place, not floating labels: counter/form, failing motor, cash and cracked phone.
 if idx in (0,1,3,4):
  d.rectangle((0,top+670,W,top+700),fill='#84654b');d.rectangle((28,top+700,692,top+735),fill='#aa8865');d.rectangle((52,top+735,70,top+790),fill='#765941');d.rectangle((650,top+735,669,top+790),fill='#765941')
  if idx in (0,1,4):
   d.polygon([(320,top+648),(380,top+636),(397,top+686),(337,top+694)],fill='#d6c69e',outline=INK);d.line((333,top+661,374,top+653),fill='#8d806b',width=3)
  if idx==3:
   d.rounded_rectangle((340,top+648,400,top+686),radius=5,fill='#cfb565',outline=INK,width=3);d.text((352,top+658),'Rp',font=F['tiny'],fill=INK)
 if idx==5:
  # the child is heard only over the cracked phone; no physically present child is invented.
  rr(d,(475,top+473,542,top+602),12,'#323d48',None);rr(d,(482,top+483,535,top+579),8,'#b4cdc5',None);d.text((489,top+508),'☎',font=F['big'],fill=TEAL)
  d.line((0,top+700,W,top+700),fill='#8b745d',width=10);d.line((72,top+700,72,top+760),fill='#765941',width=10);d.line((647,top+700,647,top+760),fill='#765941',width=10)
 # Title sits over the world plane; each setup reblocks actors and keeps the environment continuous.
 d.text((38,178),episode['title'],font=F['big'],fill=INK)
 # scene objective label
 rr(d,(38,786,682,842),9,'#e7e1d5');d.text((54,803),'AKSI',font=F['tiny'],fill=TEAL)
 obj=shot['objective']; ol=wrap(d,obj,F['label'],515)
 for j,line in enumerate(ol[:2]): d.text((112,799+j*18),line,font=F['label'],fill=INK)
 # dialogue timeline. Source gives shot-level bounds only: allocate authored lines evenly as explicit preview estimate.
 raw=[x.strip() for x in shot['dialogue'].splitlines() if x.strip()]; per=duration/max(1,len(raw)); line_index=min(len(raw)-1,int(local/per)); line=raw[line_index] if raw else 'Jeda dramatis.'
 match=__import__('re').match(r'^([^:]{1,55}):\s*(.*)$',line); speaker,text=(match.group(1),match.group(2)) if match else ('',line)
 rr(d,(34,872,686,1124),16,CREAM,'#d5cbbd',2)
 d.text((57,894),f"DIALOGUE ESTIMASI · {speaker}",font=F['small'],fill=TEAL)
 wrapped=wrap(d,text,F['sub'],570)
 for j,s in enumerate(wrapped[:4]): d.text((57,932+j*39),s,font=F['sub'],fill=INK)
 # camera and audio notes remain visible and faithful to source for production review
 rr(d,(34,1142,686,1217),9,'#e9e4d9')
 cam=wrap(d,'KAMERA · '+shot['camera'],F['tiny'],605)
 for j,s in enumerate(cam[:2]):d.text((50,1154+j*17),s,font=F['tiny'],fill=MUTED)
 # exact source-shot progress
 d.rectangle((38,1230,682,1235),fill='#d8cdbd');d.rectangle((38,1230,38+int(644*sec/90),1235),fill=RUST)
 d.text((38,1242),'SILENT ANIMATIC · DIALOG BELUM DI-VO / BUKAN LIP-SYNC',font=F['tiny'],fill=MUTED)
 return im

cmd=[FF,'-y','-f','image2pipe','-vcodec','png','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','ultrafast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-metadata',f"title={episode['title']} — silent animatic",'-metadata','comment=Shot timing from source; dialogue evenly previewed per shot and not VO aligned.',OUT]
proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
try:
 for frame in range(90*FPS):
  buf=io.BytesIO(); draw_frame(frame).save(buf,format='PNG',compress_level=1); proc.stdin.write(buf.getvalue())
  if frame%225==0: print(f'Rendered {frame//FPS:02d}s / 90s',flush=True)
 proc.stdin.close(); code=proc.wait()
 if code: raise SystemExit(code)
except BrokenPipeError: raise SystemExit(proc.wait())
print(f'Wrote {OUT} ({os.path.getsize(OUT)//1024} KiB, 90 sec, {FPS} fps, {W}x{H})')
