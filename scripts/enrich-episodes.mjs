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
  const speakers=dialogueLines.map(x=>x.match(/^\s*([^:]{1,45}):/)?.[1]?.trim()).filter(Boolean);
  const named=e.characters.map(x=>x.name).filter(n=>speakers.some(sp=>sp.toLowerCase()===n.toLowerCase()||sp.toLowerCase().includes(n.toLowerCase())||n.toLowerCase().includes(sp.toLowerCase())));
  s.characters=[...new Set(named.length?named:e.characters.slice(0,2).map(x=>x.name))];
  s.poses=/menangis|lapar|kehilangan|sendirian|menunduk|maaf|sedih|kosong/i.test(words)?['concern','held']:/kaget|terjebak|ditunda|menolak/i.test(words)?['surprise','reaction-hold']:/mengangkat|menyerahkan|menarik|menunjuk|membawa|membuka|menekan/i.test(words)?['anticipate','gesture','settle']:['listen','speak','hold'];
 }
}
fs.writeFileSync(path,JSON.stringify(episodes,null,2)+'\n');
console.log(`Enriched ${episodes.length} episodes, ${episodes.reduce((n,e)=>n+e.shots.length,0)} scene schemas`);
