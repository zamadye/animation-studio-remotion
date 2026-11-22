#!/usr/bin/env python3
"""Cut alpha-backed visual-development artwork into experimental, hand-masked sprite layers.
Masks are authored polygons over generated concept drawings; expect paint cleanup at joints before final production.
"""
from PIL import Image, ImageDraw, ImageChops
import json, os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'public/assets/production-v3/rig')

def alpha_cutout(path, threshold=195):
 im=Image.open(path).convert('RGB');w,h=im.size;p=im.load();m=Image.new('L',(w,h));q=m.load()
 for y in range(h):
  for x in range(w):
   r,g,b=p[x,y];q[x,y]=255 if min(r,g,b)>threshold and max(r,g,b)-min(r,g,b)<50 else 0
 # Flood only pale, low-saturation regions connected to the image boundary.
 for x in range(w):
  for y in (0,h-1):
   if m.getpixel((x,y))==255:ImageDraw.floodfill(m,(x,y),128,thresh=0)
 for y in range(h):
  for x in (0,w-1):
   if m.getpixel((x,y))==255:ImageDraw.floodfill(m,(x,y),128,thresh=0)
 alpha=m.point(lambda v:0 if v==128 else 255)
 rgba=im.convert('RGBA');rgba.putalpha(alpha);bbox=alpha.getbbox()
 return rgba,bbox

def poly_mask(size, polys):
 m=Image.new('L',size,0);d=ImageDraw.Draw(m)
 for pts in polys:d.polygon(pts,fill=255)
 return m

def mapped_polygon(points,bbox,scale,ox,oy):
 return [(round(ox+(x-bbox[0])*scale),round(oy+(y-bbox[1])*scale)) for x,y in points]

def build(name, source, head_variants, source_masks, pivots, parent):
 src_path=os.path.join(ROOT,'public/assets/production-v3',source);src,bbox=alpha_cutout(src_path);sw,sh=src.size;bw=bbox[2]-bbox[0];bh=bbox[3]-bbox[1]
 scale=850/bh;ox=(480-bw*scale)/2;oy=25;size=(480,900)
 def to_stage(layer):
  part=Image.new('RGBA',src.size,(0,0,0,0));part.alpha_composite(src)
  mask=poly_mask((sw,sh),[source_masks[layer]]) if layer in source_masks else Image.new('L',(sw,sh),0)
  mask=ImageChops.multiply(mask,src.getchannel('A'));part.putalpha(mask)
  part=part.crop(bbox);resized=part.resize((round(bw*scale),round(bh*scale)),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',size,(0,0,0,0));canvas.alpha_composite(resized,(round(ox),round(oy)));return canvas
 target=os.path.join(OUT,name);os.makedirs(target,exist_ok=True)
 # Preserve the uncropped model artwork as an approved concept reference, and create cutout layers.
 full=Image.new('RGBA',src.size,(0,0,0,0));full.alpha_composite(src)
 full=full.crop(bbox);full.thumbnail((560,880),Image.Resampling.LANCZOS);full.save(os.path.join(target,'concept-cutout.png'))
 files={}
 for layer in source_masks:
  canvas=to_stage(layer);path=f'{layer}.png';canvas.save(os.path.join(target,path));files[layer]=path
 variants={}
 for key,path in head_variants.items():
  im,bb=alpha_cutout(os.path.join(ROOT,'public/assets/production-v3',path));
  # Use the same authored head matte on each expression drawing to keep a stable face/head silhouette.
  hm=poly_mask(im.size,[source_masks['head']]);hm=ImageChops.multiply(hm,im.getchannel('A'));im.putalpha(hm)
  # Normalize variants into the same 480×900 stage using the neutral head's anchor and source scale.
  resized=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',size,(0,0,0,0));canvas.alpha_composite(resized,(round(ox),round(oy)));vpath=f'head-{key}.png';canvas.save(os.path.join(target,vpath));variants[key]=vpath
 mapped={k:{'x':round(ox+(x-bbox[0])*scale,2),'y':round(oy+(y-bbox[1])*scale,2)} for k,(x,y) in pivots.items()}
 spec={'id':name,'viewBox':[0,0,*size],'sourceView':'front','sourceConcept':source,'canvas':'480x900','scaleFromSource':round(scale,6),'originOffset':[round(ox,2),round(oy,2)],'drawOrder':['foot_L','foot_R','shin_L','shin_R','thigh_L','thigh_R','pelvis','torso','upper_arm_L','upper_arm_R','forearm_L','forearm_R','hand_L','hand_R','head'],'pivot':mapped,'parent':parent,'layers':files,'headVariants':variants,'notes':['Experimental raster cutout using hand-authored masks over generated concept artwork.','Front-view source; joint overlap/paint cleanup and side-turn assets remain required before final production.']}
 json.dump(spec,open(os.path.join(target,'layers.json'),'w'),indent=2)
 return spec

# Polygons follow the illustrated body silhouettes. Neighboring layers overlap deliberately at joints.
darto_masks={
 'head':[(631,31),(773,31),(785,73),(782,151),(766,202),(748,240),(654,240),(630,202),(622,94)],
 'torso':[(646,160),(676,150),(695,164),(719,164),(741,151),(775,161),(800,191),(785,370),(765,400),(637,400),(615,370),(607,199)],
 'pelvis':[(634,364),(779,364),(786,468),(768,488),(642,488),(622,466)],
 'upper_arm_L':[(615,165),(651,168),(663,231),(651,291),(630,319),(606,304),(590,267),(597,202)],
 'forearm_L':[(604,279),(636,288),(628,393),(612,462),(592,485),(576,470),(580,408),(585,333)],
 'hand_L':[(581,451),(616,450),(629,491),(617,508),(585,502),(574,482)],
 'upper_arm_R':[(760,165),(793,177),(815,221),(823,272),(807,307),(786,296),(772,258),(752,216)],
 'forearm_R':[(782,278),(812,285),(827,348),(829,418),(819,474),(798,482),(784,454),(789,395)],
 'hand_R':[(798,454),(828,454),(840,483),(829,507),(803,503),(791,480)],
 'thigh_L':[(624,393),(706,400),(710,551),(687,573),(624,558),(614,500)],
 'shin_L':[(621,540),(683,548),(685,694),(666,711),(622,705),(609,680)],
 'foot_L':[(605,684),(668,684),(694,730),(690,751),(591,751),(586,729)],
 'thigh_R':[(704,400),(782,392),(798,499),(783,558),(720,573),(697,550)],
 'shin_R':[(716,548),(783,540),(795,678),(782,706),(735,712),(714,692)],
 'foot_R':[(733,684),(790,682),(824,723),(826,743),(723,750),(716,730)],
}
darto_pivots={'pelvis':(704,407),'head':(704,198),'upper_arm_L':(635,185),'elbow_L':(614,295),'wrist_L':(601,456),'upper_arm_R':(782,185),'elbow_R':(803,295),'wrist_R':(814,456),'hip_L':(662,432),'knee_L':(658,551),'ankle_L':(650,694),'hip_R':(744,432),'knee_R':(754,551),'ankle_R':(761,694)}

petugas_masks={
 'head':[(373,73),(544,73),(579,116),(574,226),(550,293),(526,329),(401,329),(374,294),(354,220),(355,123)],
 'torso':[(398,278),(435,263),(470,278),(500,262),(546,270),(590,309),(617,398),(599,652),(568,684),(381,682),(349,655),(337,393),(356,311)],
 'pelvis':[(378,634),(578,634),(584,896),(560,925),(396,923),(367,891)],
 'upper_arm_L':[(356,304),(391,292),(407,349),(395,440),(379,512),(352,541),(331,521),(339,445),(332,375)],
 'forearm_L':[(340,493),(375,502),(371,584),(357,660),(340,699),(320,693),(319,647),(328,574)],
 'hand_L':[(319,661),(356,661),(367,701),(356,727),(327,726),(310,701)],
 'upper_arm_R':[(556,295),(590,308),(612,365),(612,443),(597,513),(573,537),(552,516),(559,452),(546,376)],
 'forearm_R':[(574,491),(606,500),(612,579),(611,651),(599,698),(579,703),(566,676),(570,603)],
 'hand_R':[(578,663),(606,663),(620,697),(610,726),(581,728),(568,702)],
 'thigh_L':[(397,874),(475,875),(476,1006),(466,1041),(414,1042),(397,1003)],
 'shin_L':[(411,995),(467,1000),(473,1093),(455,1119),(415,1115),(405,1082)],
 'foot_L':[(390,1082),(457,1082),(476,1125),(468,1143),(379,1142),(369,1124)],
 'thigh_R':[(470,874),(550,874),(553,1004),(535,1043),(480,1041),(464,1005)],
 'shin_R':[(481,997),(537,997),(543,1094),(524,1118),(485,1118),(474,1086)],
 'foot_R':[(482,1080),(540,1080),(559,1121),(551,1143),(466,1143),(456,1121)],
}
petugas_pivots={'pelvis':(477,670),'head':(461,292),'upper_arm_L':(379,307),'elbow_L':(370,505),'wrist_L':(342,668),'upper_arm_R':(574,307),'elbow_R':(590,505),'wrist_R':(594,668),'hip_L':(436,876),'knee_L':(437,1007),'ankle_L':(437,1090),'hip_R':(512,876),'knee_R':(510,1007),'ankle_R':(513,1090)}

build('darto','darto-front.png',{'neutral':'darto-front.png','worried':'darto-application-rejection-pose.png'},darto_masks,darto_pivots,{'thigh_L':'pelvis','shin_L':'thigh_L','foot_L':'shin_L','thigh_R':'pelvis','shin_R':'thigh_R','foot_R':'shin_R','head':'torso','upper_arm_L':'torso','forearm_L':'upper_arm_L','hand_L':'forearm_L','upper_arm_R':'torso','forearm_R':'upper_arm_R','hand_R':'forearm_R'})
build('petugas','petugas-front.png',{'neutral':'petugas-front.png','refusal':'petugas-rejection-pose.png'},petugas_masks,petugas_pivots,{'thigh_L':'pelvis','shin_L':'thigh_L','foot_L':'shin_L','thigh_R':'pelvis','shin_R':'thigh_R','foot_R':'shin_R','head':'torso','upper_arm_L':'torso','forearm_L':'upper_arm_L','hand_L':'forearm_L','upper_arm_R':'torso','forearm_R':'upper_arm_R','hand_R':'forearm_R'})
print('Prepared experimental alpha sprites and 15 hand-masked layers per character; see layer notes for required cleanup.')
