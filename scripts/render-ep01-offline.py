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
 skin,hair,shirt=('#a96f50','#292824','#426d72') if name=='DARTO' else ('#d5a27e','#383534','#4b5966')
 if name=='ANAK': skin,hair,shirt='#d09a78','#302521','#9e6a67'
 if name=='PEMBELI': skin,hair,shirt='#c88e6a','#362a27','#736779'
 bob=round(math.sin(t*5+cx)*3)
 # legs and stable silhouette with articulated forearm/shoulder gestures
 hip=base-138+bob; d.line((cx-20,hip,cx-25,base-5),fill=INK,width=13);d.line((cx+18,hip,cx+25,base-5),fill=INK,width=13)
 d.ellipse((cx-35,base-14,cx-10,base-3),fill='#343b3e');d.ellipse((cx+12,base-14,cx+37,base-3),fill='#343b3e')
 rr(d,(cx-51,base-240+bob,cx+51,base-102+bob),22,shirt,INK,4)
 # neck and face
 d.rectangle((cx-12,base-261+bob,cx+12,base-230+bob),fill=skin)
 d.ellipse((cx-39,base-337+bob,cx+39,base-253+bob),fill=skin,outline=INK,width=4)
 d.pieslice((cx-42,base-345+bob,cx+42,base-265+bob),180,355,fill=hair,outline=INK,width=3)
 d.ellipse((cx-20,base-302+bob,cx-14,base-296+bob),fill=INK);d.ellipse((cx+13,base-302+bob,cx+19,base-296+bob),fill=INK)
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
 d.rectangle((0,0,W,150),fill='#ede6da');d.text((38,42),'STUDIO / FIKSI SATIR',font=F['small'],fill=MUTED);d.text((W-205,42),f"EP 01  ·  {shot['number']:02d}/06",font=F['small'],fill=MUTED)
 d.text((38,105),f"{int(sec//60):02d}:{int(sec%60):02d}  —  {shot['location'].upper()}",font=F['label'],fill=RUST)
 # scene panel, floor, set details
 top,bottom=190,760;d.rectangle((0,top,W,bottom),fill=wall);d.rectangle((0,top+int((bottom-top)*.73),W,bottom),fill=floor)
 d.rectangle((48,top+64,208,top+236),fill='#9cb6b2',outline='#a57e57',width=8);d.line((128,top+64,128,top+236),fill='#a57e57',width=5);d.line((48,top+150,208,top+150),fill='#a57e57',width=5)
 d.rectangle((536,top+121,663,top+313),fill='#a57e57');d.rectangle((0,bottom-8,W,bottom),fill='#87735e')
 # title block, keep typography clear, title animates to new shot via slight opacity-free placement
 d.text((38,178),episode['title'],font=F['big'],fill=INK)
 # character staging based on actual shot list
 names=shot['characters']; base=bottom-12
 if len(names)>=1: character(d,250,base,names[0].upper(),'speak' if local%duration<duration/2 else 'gesture',sec)
 if len(names)>=2: character(d,475,base,names[1].upper(),'listen',sec+.8)
 # central symbolic prop for this precise shot
 box=(278,top+112,444,top+274); rr(d,box,10,CREAM,'#283239',4)
 d.text((292,top+132),'INSERT / PROP',font=F['tiny'],fill=TEAL)
 lines=wrap(d,prop,F['label'],135)
 for j,line in enumerate(lines): d.text((292,top+166+j*24),line,font=F['label'],fill=INK)
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
