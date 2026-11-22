import fs from 'node:fs/promises';
const key=(process.env.ELEVENLABS_API_KEY||process.env.ELEVENLABS_KEY||'').trim();
if(!key)throw new Error('Missing ElevenLabs Actions secret');
const voice='ojz6ro9PB1xDu44lymdM'; // Confirmed technical voice; review dub, not locked character casting.
const lines=JSON.parse(await fs.readFile('src/episodes/ep01-lines.json','utf8'));
if(lines.length!==18||lines.reduce((sum,l)=>sum+l.text.length,0)>5000)throw new Error('Episode VO budget exceeded');
const dir='public/audio/episode01-elevenlabs';await fs.mkdir(dir,{recursive:true});
const takes=[];
for(const line of lines){
 const file=`${dir}/${line.id}.mp3`,meta=`${dir}/${line.id}.json`;
 try{const old=JSON.parse(await fs.readFile(meta,'utf8'));await fs.access(file);if(old.text===line.text&&old.voice_id===voice){takes.push(old);continue;}}catch{}
 const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({text:line.text,model_id:'eleven_multilingual_v2',language_code:'id',voice_settings:{stability:line.speaker==='PETUGAS'?.7:.5,similarity_boost:.75}}),signal:AbortSignal.timeout(120000)});
 if(!response.ok){let status='unknown';try{const d=await response.json();if(['missing_permissions','invalid_api_key','quota_exceeded'].includes(d.detail?.status))status=d.detail.status;}catch{}console.error(`::error::TTS ${line.id}: HTTP ${response.status}, code=${status}. Stopped, no paid retry.`);process.exit(1);}
 const data=await response.json();if(typeof data.audio_base64!=='string'||!data.alignment?.characters)throw new Error('Missing audio/alignment');
 const bytes=Buffer.from(data.audio_base64,'base64');if(bytes.length<100)throw new Error('Invalid TTS audio');
 const take={...line,voice_id:voice,model:'eleven_multilingual_v2',alignment:data.alignment,audio:file.replace('public/',''),bytes:bytes.length,note:'Single-voice review dub; not final per-character voice casting. Character alignment is not phoneme forced alignment.'};
 await fs.writeFile(file,bytes);await fs.writeFile(meta,JSON.stringify(take,null,2)+'\n');takes.push(take);console.log(`Saved ${line.id}, ${bytes.length} bytes`);
}
console.log(`Saved ${takes.length} episode dialogue takes; no voice-list permission required.`);
