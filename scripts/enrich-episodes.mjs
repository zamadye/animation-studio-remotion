import fs from 'node:fs';
const path='src/data/episodes.json';const episodes=JSON.parse(fs.readFileSync(path,'utf8'));
for(const e of episodes){
 const raw=e.premise;const marker=raw.indexOf('Karakter:');
 const castBlock=marker>=0?raw.slice(marker+'Karakter:'.length):'';
 e.premise=(marker>=0?raw.slice(0,marker):raw).replace(/[.;\s]+$/,'').trim();
 e.characters=marker>=0?[...castBlock.matchAll(/([^;|]+?)\|([^;]+?)(?=;|$)/g)].map((m)=>({name:m[1].trim(),role:m[2].trim()})):(e.characters??[]);
 for(const s of e.shots){
  const words=`${s.objective} ${s.dialogue} ${s.camera}`.toLowerCase();
  const message=/ponsel|telepon|pesan|grup|voice note|kamera ponsel|status|notifikasi|layar chat/.test(words);
  const evidence=/insert|formulir|dokumen|peta|angka|saldo|uang|cctv|close-up|layar|label|tiket|poster|foto|kamera/.test(words);
  s.templateId=s.number===1?'CARTOON-STAGE-DIALOGUE':message?'CARTOON-MESSAGE-POV':evidence?'CARTOON-EVIDENCE-INSERT':'CARTOON-STAGE-DIALOGUE';
  const dialogueLines=s.dialogue.split('\n').filter(Boolean);
  const speakers=dialogueLines.map(x=>x.match(/^\s*([^:]{1,55}):/)?.[1]?.trim()).filter(Boolean);
  const onstageSpeakers=speakers.filter(sp=>!/(telepon|pesan suara|voice note|pengeras suara|suara|off.?screen)/i.test(sp));
  const normalize=(value)=>value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const known=e.characters.filter(c=>onstageSpeakers.some(sp=>normalize(sp)===normalize(c.name)||normalize(sp).startsWith(`${normalize(c.name)} `)||normalize(c.name).startsWith(`${normalize(sp)} `))).map(c=>c.name);
  const inferred=onstageSpeakers.filter(sp=>!e.characters.some(c=>normalize(sp)===normalize(c.name)||normalize(sp).startsWith(`${normalize(c.name)} `)||normalize(c.name).startsWith(`${normalize(sp)} `)));
  const sceneCast=[...known,...inferred];
  s.characters=[...new Set(sceneCast.length?sceneCast:e.characters.filter(c=>!/(telepon|pesan suara|voice note|suara)/i.test(`${c.name} ${c.role}`)).slice(0,2).map(c=>c.name))];
  s.poses=/menangis|lapar|kehilangan|sendirian|menunduk|maaf|sedih|kosong/i.test(words)?['concern','held']:/kaget|terjebak|ditunda|menolak/i.test(words)?['surprise','reaction-hold']:/mengangkat|menyerahkan|menarik|menunjuk|membawa|membuka|menekan/i.test(words)?['anticipate','gesture','settle']:['listen','speak','hold'];
 }
}
fs.writeFileSync(path,JSON.stringify(episodes,null,2)+'\n');
console.log(`Enriched ${episodes.length} episodes, ${episodes.reduce((n,e)=>n+e.shots.length,0)} scene schemas`);
