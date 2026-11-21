from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
import json,re
SOURCE=Path('unpacked/satir-cartoon-8-episode-docs')
OUTPUT=Path('src/data/episodes.json')
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
LABELS={'AKSI':'objective','DIALOG / VO':'dialogue','KAMERA / KOMPOSISI':'camera','REKOMENDASI ANIMASI':'animation','SFX / AUDIO':'audio'}
def seconds(value):
 return sum(int(part)*60**i for i,part in enumerate(reversed(value.split(':'))))
def extract_paragraphs(path):
 with ZipFile(path) as doc:
  root=ET.fromstring(doc.read('word/document.xml'))
 return [''.join(node.text or '' for node in p.findall('.//w:t',NS)).strip() for p in root.findall('.//w:p',NS)]
episodes=[]
for path in sorted(SOURCE.glob('*.docx')):
 paras=[p for p in extract_paragraphs(path) if p]
 title=next(p for p in paras if p.startswith('EPISODE '))
 episode_num=int(re.search(r'\d+',title).group())
 premise_line=next((p for p in paras if p.startswith('Tema:')), '')
 theme=re.search(r'Tema:\s*(.*?)\s*Logline:',premise_line)
 logline=re.search(r'Logline:\s*(.*?)(?=\s*Karakter:|$)',premise_line)
 chars=re.search(r'Karakter:\s*(.*)$',premise_line)
 characters=[]
 if chars:
  for item in chars.group(1).split(';'):
   if '|' in item:
    name,role=item.split('|',1);characters.append({'name':name.strip(),'role':role.strip()})
 episode={'id':f'{episode_num:02d}','title':title.split('—',1)[-1].strip(),'format':next((p.split(':',1)[1].strip() for p in paras if p.startswith('FORMAT:')),''),'premise':logline.group(1).strip() if logline else '', 'theme':theme.group(1).strip() if theme else '', 'editorialNote':next((p for p in paras if p.startswith('Catatan editorial:')),''),'source':path.as_posix(),'characters':characters,'shots':[],'productionNotes':[]}
 starts=[i for i,p in enumerate(paras) if re.match(r'SHOT \d+ \|',p)]
 for idx,start in enumerate(starts):
  end=starts[idx+1] if idx+1<len(starts) else next((j for j in range(start+1,len(paras)) if paras[j].startswith('Panduan produksi animasi')),len(paras))
  block=paras[start:end]
  match=re.match(r'SHOT (\d+) \| ([0-9:]+)–([0-9:]+) \| (.*)',block[0])
  if not match: raise ValueError(f'Unparsed shot heading {block[0]} in {path.name}')
  shot={'id':f'{episode["id"]}-{int(match.group(1)):02d}','number':int(match.group(1)),'start':match.group(2),'end':match.group(3),'location':match.group(4),'objective':'','dialogue':'','camera':'','animation':'','audio':''}
  current=None; lines=[]
  def flush():
   if current is not None:shot[current]='\n'.join(lines).strip()
  for line in block[1:]:
   labelled=re.match(r'^(AKSI|DIALOG / VO|KAMERA / KOMPOSISI|REKOMENDASI ANIMASI|SFX / AUDIO):\s*(.*)$',line)
   if labelled:
    flush();current=LABELS[labelled.group(1)];lines=[labelled.group(2)] if labelled.group(2) else []
   elif current is not None:lines.append(line)
  flush()
  shot['startSeconds']=seconds(shot['start']);shot['endSeconds']=seconds(shot['end'])
  episode['shots'].append(shot)
 guide=next((i for i,p in enumerate(paras) if p.startswith('Panduan produksi animasi')),len(paras))
 episode['productionNotes']=paras[guide+1:]
 if len(episode['shots'])!=6:raise ValueError(f'{path.name} expected 6 source shots, got {len(episode["shots"])}')
 episodes.append(episode)
OUTPUT.write_text(json.dumps(episodes,ensure_ascii=False,indent=2)+'\n')
print(f'Extracted {len(episodes)} DOCX / {sum(len(e["shots"]) for e in episodes)} shots with labeled dialogue and camera fields.')
