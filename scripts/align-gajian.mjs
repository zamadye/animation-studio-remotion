import fs from 'node:fs/promises';
const key=(process.env.ELEVENLABS_API_KEY||process.env.ELEVENLABS_KEY||'').trim();if(!key)throw new Error('Missing Actions key');
const script=JSON.parse(await fs.readFile('src/episodes/gajian/script.json','utf8'));
for(const scene of script.scenes){
 const dir='public/audio/gajian';try{await fs.access(`${dir}/${scene.id}-aligned.json`);continue;}catch{}
 const form=new FormData();form.append('file',new Blob([await fs.readFile(`${dir}/${scene.id}.mp3`)],{type:'audio/mpeg'}),`${scene.id}.mp3`);form.append('text',scene.lines.map(l=>l.text).join(' '));
 const res=await fetch('https://api.elevenlabs.io/v1/forced-alignment',{method:'POST',headers:{'xi-api-key':key},body:form,signal:AbortSignal.timeout(180000)});
 if(!res.ok){console.error(`::error::Forced alignment ${scene.id}: HTTP ${res.status}; no retry.`);process.exit(1);}
 const data=await res.json();if(!Array.isArray(data.characters)||!data.characters.length)throw new Error('Missing aligned characters');
 await fs.writeFile(`${dir}/${scene.id}-aligned.json`,JSON.stringify(data,null,2)+'\n');console.log(`Aligned ${scene.id}: ${data.words?.length} words.`);
}
