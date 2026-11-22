import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const key=(process.env.ELEVENLABS_API_KEY||process.env.ELEVENLABS_KEY||'').trim();if(!key)throw new Error('Missing Actions key');
// IDs documented by the official ElevenLabs Python SDK README; auditions, not locked cast voices.
const voices={raka:process.env.RAKA_VOICE_ID||'JBFqnCBsd6RMkjVDRZzb',nisa:process.env.NISA_VOICE_ID||'21m00Tcm4TlvDq8ikWAM'};
const source=JSON.parse(await fs.readFile('src/episodes/gajian/script.json','utf8'));const dir='public/audio/gajian';await fs.mkdir(dir,{recursive:true});
for(const scene of source.scenes){
 const inputs=scene.lines.map(l=>({text:l.text,voice_id:voices[l.speaker]}));if(inputs.reduce((n,l)=>n+l.text.length,0)>2000)throw new Error('Dialogue scene exceeds SDK 2000-character guidance');
 const body={inputs,model_id:'eleven_v3',language_code:'id',settings:{stability:.5}};const fingerprint=crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
 try{const old=JSON.parse(await fs.readFile(`${dir}/${scene.id}.json`));await fs.access(`${dir}/${scene.id}.mp3`);if(old.fingerprint===fingerprint){console.log(`Reuse ${scene.id}`);continue;}}catch{}
 const res=await fetch('https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(240000)});
 if(!res.ok){let code='unclassified';try{const x=await res.json();if(['missing_permissions','invalid_api_key','quota_exceeded','model_not_found','voice_not_found','invalid_voice_id'].includes(x.detail?.status))code=x.detail.status;}catch{}console.error(`::error::Dialogue ${scene.id}: HTTP ${res.status}, code=${code}. No paid retry.`);process.exit(1);}
 const data=await res.json();if(!data.audio_base64||!Array.isArray(data.voice_segments)||!data.alignment)throw new Error('Missing dialogue audio/voice segment alignment');
 await fs.writeFile(`${dir}/${scene.id}.mp3`,Buffer.from(data.audio_base64,'base64'));
 await fs.writeFile(`${dir}/${scene.id}.json`,JSON.stringify({fingerprint,voices,model:'eleven_v3',lines:scene.lines,alignment:data.alignment,voice_segments:data.voice_segments},null,2)+'\n');console.log(`Saved ${scene.id}: continuous contextual dialogue, ${inputs.length} turns, two voices.`);
}
