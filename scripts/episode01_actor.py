"""Deterministic, role-specific paper-cutout character designs for the offline EP01 render."""
import math
from PIL import Image, ImageDraw
FPS=30
INK='#263038';DARK='#2c302f'
PALETTES={
 'DARTO':{'skin':'#a96f50','hair':'#242321','shirt':'#35636b','shirtLight':'#49747a','accent':'#c38a4d','pants':'#343538','shoe':'#282b2d'},
 'PETUGAS':{'skin':'#d1a080','hair':'#332e2b','shirt':'#465969','shirtLight':'#5d7180','accent':'#d0b66f','pants':'#333b43','shoe':'#292d32'},
 'PEMBELI':{'skin':'#c88e6a','hair':'#352a26','shirt':'#9a7351','shirtLight':'#b28b64','accent':'#dbc18a','pants':'#51463b','shoe':'#302d2b'},
}

def actor(name,frame,emotion='neutral',gesture='rest',look=0):
 name=name.upper();p=PALETTES.get(name,PALETTES['DARTO']);skin,hair,shirt=p['skin'],p['hair'],p['shirt'];shirt2,accent,pants,shoe=p['shirtLight'],p['accent'],p['pants'],p['shoe']
 im=Image.new('RGBA',(220,390),(0,0,0,0));d=ImageDraw.Draw(im);t=frame/FPS
 breath=math.sin(t*1.15+(0 if name=='DARTO' else .8 if name=='PETUGAS' else 1.4))*1.35
 if name=='DARTO':
  # Lean working-class male: broad, slightly slumped shoulders, square jaw, rough short crop.
  cx=110;face=(57,37+round(breath),163,160+round(breath));shoulders=[(44,157),(77,143),(144,143),(180,158),(192,278),(28,278)]
 elif name=='PETUGAS':
  # Female service clerk, explicit in the script's address "Bu": narrower jaw/waist, bun, tailored uniform and skirt.
  cx=110;face=(66,37+round(breath),154,158+round(breath));shoulders=[(53,157),(83,146),(137,146),(168,157),(165,278),(55,278)]
 else:
  # Stocky male roadside buyer, curly crop and earth-toned overshirt distinguish him from Darto.
  cx=110;face=(55,38+round(breath),165,160+round(breath));shoulders=[(34,154),(72,139),(150,139),(186,155),(198,278),(22,278)]
 # Ground contact shadow, trouser legs, articulated knees/cuffs and footwear.
 d.ellipse((34,361,187,382),fill=(28,30,30,40))
 if name=='PETUGAS':
  d.line((88,276,86,325),fill=pants,width=23);d.line((132,276,135,325),fill=pants,width=23)
  d.line((86,322,84,350),fill=pants,width=16);d.line((135,322,139,350),fill=pants,width=16)
  d.polygon([(63,348),(99,348),(104,359),(59,359)],fill=shoe,outline=INK);d.polygon([(125,348),(158,348),(164,359),(123,359)],fill=shoe,outline=INK)
  d.line((58,359,105,359),fill='#161a1c',width=3);d.line((122,359,166,359),fill='#161a1c',width=3)
 else:
  swing=math.sin(frame*.22+(0 if name=='DARTO' else 1.3))*4 if gesture=='walk' else 0
  d.polygon([(75,270),(108,276),(104+swing,347),(75+swing,349)],fill=pants,outline=INK);d.polygon([(115,276),(151,269),(153-swing,349),(124-swing,347)],fill=pants,outline=INK)
  d.line((77+swing,334,104+swing,334),fill='#6f6657',width=3);d.line((125-swing,334,152-swing,334),fill='#6f6657',width=3)
  # Heavy, practical shoes with sole, toe and lace detail.
  d.rounded_rectangle((58+swing,344,108+swing,366),radius=7,fill=shoe,outline=INK,width=2);d.rounded_rectangle((117-swing,344,169-swing,366),radius=7,fill=shoe,outline=INK,width=2)
  d.line((60+swing,363,106+swing,363),fill='#171b1d',width=3);d.line((120-swing,363,167-swing,363),fill='#171b1d',width=3)
  for x in (82+swing,141-swing):
   d.line((x-7,351,x+6,355),fill='#8b8b80',width=2);d.line((x-7,356,x+6,360),fill='#8b8b80',width=2)
 # Distinct garments: rumpled work shirt, fitted official blouse with skirt, and canvas buyer overshirt.
 if name=='DARTO':
  d.polygon(shoulders,fill=shirt,outline=INK);d.polygon([(44,158),(76,147),(87,158),(79,279),(28,278)],fill=shirt2);d.polygon([(144,147),(180,158),(192,278),(143,279)],fill=shirt)
  # folded collar, open neck, placket, buttons, patched chest pocket, seam stitching and rolled sleeves
  d.polygon([(82,145),(110,164),(137,145),(129,179),(110,190),(90,177)],fill='#e1d4b8',outline=INK);d.polygon([(94,146),(110,167),(126,146),(117,160),(110,166),(102,159)],fill='#294e55')
  d.line((110,183,110,270),fill='#d4a263',width=4);d.polygon([(125,198),(153,194),(155,231),(124,232)],fill='#416f75',outline='#294b51');d.line((126,204,152,201),fill='#88a19b',width=2);d.line((130,235,151,234),fill='#294b51',width=2)
  for y in (199,219,240,258):d.ellipse((106,y,111,y+5),fill='#ead2a0')
  d.polygon([(46,197),(68,204),(63,220),(41,214)],fill='#719098',outline=INK);d.line((37,220,57,226),fill='#c38a4d',width=3)
  d.line((49,250,76,259),fill='#2d555c',width=2);d.line((147,269,185,266),fill='#2d555c',width=2)
 elif name=='PETUGAS':
  d.polygon(shoulders,fill=shirt,outline=INK)
  # fitted blouse waist darts, white collar, button placket, shoulder boards, name badge and pocket
  d.polygon([(81,146),(101,161),(110,164),(120,161),(140,146),(150,164),(141,203),(146,278),(74,278),(79,203),(68,164)],fill=shirt2,outline=INK)
  d.polygon([(87,146),(108,162),(102,178),(83,160)],fill='#e6ddca',outline=INK);d.polygon([(133,146),(112,162),(118,178),(137,160)],fill='#e6ddca',outline=INK)
  d.line((110,178,110,272),fill=accent,width=3)
  for y in (190,208,226,244,262):d.ellipse((107,y,112,y+5),fill='#e7dfc8')
  d.line((72,157,92,160),fill=accent,width=5);d.line((128,160,148,157),fill=accent,width=5)
  d.rounded_rectangle((124,185,147,199),radius=2,fill='#e2d5b5',outline='#28333b',width=2);d.line((128,190,142,190),fill='#51606b',width=2)
  d.rectangle((78,195,96,220),fill='#3c5260',outline='#26323b',width=2);d.line((81,201,93,201),fill='#d6c38c',width=2)
  d.line((86,247,90,274),fill='#31414d',width=2);d.line((134,247,130,274),fill='#31414d',width=2)
  # modest knee-length straight skirt, seams and pleats over the hips
  d.polygon([(73,264),(147,264),(161,326),(59,326)],fill='#394a58',outline=INK);d.line((110,268,110,323),fill='#687b87',width=2);d.line((88,277,83,319),fill='#526572',width=2);d.line((133,277,138,319),fill='#526572',width=2)
 else:
  d.polygon(shoulders,fill=shirt,outline=INK);d.polygon([(76,145),(109,165),(145,142),(153,278),(65,278)],fill=shirt2)
  d.polygon([(77,146),(109,166),(94,184),(74,165)],fill='#e4d3b1',outline=INK);d.polygon([(145,144),(111,166),(126,184),(150,164)],fill='#e4d3b1',outline=INK)
  d.line((110,182,110,274),fill=accent,width=4);d.rounded_rectangle((126,198,155,232),radius=3,fill='#8b6848',outline=INK,width=2);d.line((131,205,150,205),fill='#dbc18a',width=2)
  d.line((38,242,70,249),fill='#765a40',width=3);d.line((153,253,190,247),fill='#765a40',width=3)
 # articulated arms and forearms, with visible wrist/hand posing.
 reach=gesture in ('plead','offer','gesture') or gesture.startswith('talk-');dip=gesture=='withdraw'
 if name=='PETUGAS':shoulderL=(62,165);shoulderR=(158,165);width1=17;width2=14
 else:shoulderL=(48,165);shoulderR=(172,165);width1=20;width2=16
 if reach:leftElbow=(42,225);leftHand=(68,249)
 else:leftElbow=(48,235);leftHand=(67,270)
 d.line((*shoulderL,*leftElbow),fill=shirt,width=width1);d.line((*leftElbow,*leftHand),fill=shirt,width=width2);d.ellipse((leftHand[0]-8,leftHand[1]-7,leftHand[0]+8,leftHand[1]+8),fill=skin,outline=INK,width=1)
 if reach and name=='DARTO':rightElbow=(188,197);rightHand=(211,225)
 else:rightElbow=(177,230 if dip else 239);rightHand=(166,260 if dip else 271)
 d.line((*shoulderR,*rightElbow),fill=shirt,width=width1);d.line((*rightElbow,*rightHand),fill=shirt,width=width2)
 if reach and name=='DARTO':
  d.line((rightElbow[0]+3,rightElbow[1]+4,rightHand[0]-2,rightHand[1]-2),fill=skin,width=5);d.ellipse((rightHand[0]-10,rightHand[1]-7,rightHand[0]+10,rightHand[1]+8),fill=skin,outline=INK,width=1)
  for f in range(3):d.line((rightHand[0]+4+f*2,rightHand[1]-1,rightHand[0]+8+f*2,rightHand[1]-6),fill=skin,width=2)
 else:d.ellipse((rightHand[0]-8,rightHand[1]-7,rightHand[0]+8,rightHand[1]+8),fill=skin,outline=INK,width=1)
 # Hair lies behind head. The clerk has a clearly visible bun; buyer has curls; Darto has an uneven crop.
 if name=='PETUGAS':
  d.ellipse((137,28,174,69),fill=hair,outline=INK,width=2);d.ellipse((146,23,168,47),fill='#443a35')
 # Neck and role-specific jaw/cheek shape.
 neckW=16 if name=='PETUGAS' else 22;d.rectangle((110-neckW//2,127,110+neckW//2,163),fill=skin)
 if name=='PETUGAS':d.ellipse((66,37+round(breath),154,158+round(breath)),fill=skin,outline=INK,width=3);d.polygon([(73,118),(84,146),(109,160),(136,146),(147,118)],fill=skin)
 else:d.ellipse((57,37+round(breath),163,160+round(breath)),fill=skin,outline=INK,width=3)
 # Hair silhouette: textured short crop, swept bun fringe, and separate curls for the buyer.
 dy=round(breath)
 if name=='DARTO':
  d.pieslice((53,19+dy,167,104+dy),180,356,fill=hair,outline=INK,width=3);d.polygon([(57,77+dy),(67,47+dy),(85,34+dy),(101,43+dy),(119,29+dy),(143,43+dy),(163,69+dy),(160,88+dy),(145,70+dy),(125,75+dy),(108,62+dy),(86,77+dy),(68,94+dy)],fill=hair)
 elif name=='PETUGAS':
  d.pieslice((66,22+dy,157,101+dy),180,356,fill=hair,outline=INK,width=3);d.polygon([(68,75+dy),(78,48+dy),(96,33+dy),(116,40+dy),(136,30+dy),(153,57+dy),(151,82+dy),(135,69+dy),(118,73+dy),(101,63+dy),(83,80+dy)],fill=hair)
 else:
  for x,y,r in ((69,60,18),(83,37,17),(106,28,18),(129,31,18),(151,49,17),(158,67,13),(72,77,13)):
   d.ellipse((x-r,y-r+dy,x+r,y+r+dy),fill=hair,outline=INK,width=2)
 # Facial structure: eye bags and pores on Darto; soft brows/lashes and muted lip on the clerk; buyer moustache.
 eyeY=94+dy;direction=max(-6,min(6,look));openH=9 if emotion=='surprised' else 5 if emotion in ('tired','sad') else 7
 eyeXs=(86,135) if name=='PETUGAS' else (82,138)
 for side,x in enumerate(eyeXs):
  eyeW=9 if name=='PETUGAS' else 10
  d.ellipse((x-eyeW,eyeY-openH,x+eyeW,eyeY+openH),fill='#f5eddf',outline='#453b35',width=2)
  pupil=x+direction;d.ellipse((pupil-4,eyeY-4,pupil+4,eyeY+5),fill='#262729');d.ellipse((pupil-2,eyeY-3,pupil,eyeY-1),fill='#fff9eb')
  tilt=5 if emotion in ('stern','suspicious','angry') else -4 if emotion in ('plead','confused','sad') else 0
  if name=='PETUGAS':
   d.arc((x-12,eyeY-20+min(tilt,0),x+11,eyeY-12+max(tilt,0)),185,350,fill=hair,width=3);d.line((x-eyeW,eyeY-9,x-eyeW-3,eyeY-14),fill=hair,width=1);d.line((x+eyeW,eyeY-9,x+eyeW+3,eyeY-14),fill=hair,width=1)
  else:d.line((x-11,eyeY-17+tilt,x+10,eyeY-17-tilt),fill=hair,width=4)
  if name=='DARTO':
   d.arc((x-12,eyeY+8,x+12,eyeY+19),200,340,fill='#805947',width=2)
 # Nose bridge, nostril, cheek planes and age/role detail.
 d.line((110,100+dy,105,119+dy,112,122+dy),fill='#805a48',width=2)
 d.ellipse((108,120+dy,112,123+dy),fill='#79513f')
 if name=='DARTO':
  for x,y in ((73,126),(81,133),(92,137),(129,136),(141,132),(149,125),(103,143),(116,144),(86,119),(137,119)):
   d.ellipse((x,y+dy,x+2,y+2+dy),fill='#7f5744')
  d.line((71,114+dy,82,116+dy),fill='#885c48',width=2);d.line((139,114+dy,149,111+dy),fill='#885c48',width=2)
 elif name=='PETUGAS':
  d.ellipse((72,111+dy,86,117+dy),fill='#c7836d');d.ellipse((135,111+dy,149,117+dy),fill='#c7836d')
 # Mouth: restrained expression silhouette or deterministic vowel-class pose while speaking.
 mouthY=139+dy;talk=gesture.startswith('talk')
 if talk:
  shape=int(frame/4)%4
  if shape==0:d.ellipse((101,mouthY-3,119,mouthY+7),fill='#643b39')
  elif shape==1:d.ellipse((97,mouthY-2,123,mouthY+10),fill='#573431')
  elif shape==2:d.ellipse((103,mouthY-5,117,mouthY+8),fill='#573431')
  else:d.line((99,mouthY+2,121,mouthY+2),fill='#653d39',width=3)
 elif emotion in ('stern','suspicious'):
  d.line((97,mouthY+3,110,mouthY,124,mouthY+3),fill='#623c38',width=3)
 elif emotion in ('sad','tired'):
  d.arc((97,mouthY-2,124,mouthY+13),195,342,fill='#653d39',width=3)
 elif name=='PETUGAS':
  d.arc((98,mouthY-1,123,mouthY+10),15,165,fill='#945e59',width=3)
 else:d.arc((97,mouthY-2,124,mouthY+10),15,165,fill='#653d39',width=3)
 if name=='PEMBELI':
  d.arc((98,127+dy,122,139+dy),190,350,fill='#382c28',width=4)
 # Small stable specular accents, costume stitching, labels and personal props keep roles readable at phone size.
 if name=='DARTO':
  d.line((69,169,82,175),fill='#83a09c',width=2);d.line((138,169,154,165),fill='#83a09c',width=2);d.line((41,240,60,247),fill='#294f56',width=2)
 elif name=='PETUGAS':
  d.line((80,168,95,174),fill='#f1ead9',width=2);d.line((125,174,140,168),fill='#f1ead9',width=2)
 return im
