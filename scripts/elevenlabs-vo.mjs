import fs from 'node:fs/promises';
import path from 'node:path';
export const DEFAULT_TEXT='Pak Darto, besok wawancara pukul sembilan pagi. Jangan lupa membawa KTP dan surat lamaran. Baik, Bu. Terima kasih atas informasinya.';
export async function run({env=process.env,request=fetch,dir='artifacts/elevenlabs'}={}){
 const key=(env.ELEVENLABS_API_KEY||env.ELEVENLABS_KEY||'').trim();if(!key)throw new Error('Missing GitHub Actions secret ELEVENLABS_API_KEY. Add it in repository Settings > Secrets and variables > Actions.');
 const mode=env.VO_MODE||'probe';if(!['discover','probe'].includes(mode))throw new Error('VO_MODE must be discover or probe');
 const text=env.VO_TEXT||DEFAULT_TEXT;if(text.length>280||!text.trim())throw new Error('VO text must contain 1–280 characters');
 const api=async(endpoint,options={})=>{
  const response=await request(`https://api.elevenlabs.io${endpoint}`,{...options,headers:{'xi-api-key':key,Accept:'application/json',...options.headers},signal:AbortSignal.timeout(90000)});
  if(!response.ok){
   // Read structured error codes, not raw bodies: HTTP 401 also covers missing permissions.
   let detail;try{detail=(await response.json()).detail;}catch{}
   const known=new Set(['invalid_api_key','missing_permissions','quota_exceeded','voice_not_found','unauthorized','unusual_activity_detected','detected_unusual_activity','invalid_authorization_header','insufficient_credits','invalid_request','invalid_api_key_permissions']);
   const code=known.has(detail?.status)?detail.status:'unclassified';
   const hints={invalid_api_key:'Credential rejected by provider.',missing_permissions:'This endpoint requires a permission not granted to this key.',unusual_activity_detected:'Provider account/network security restriction; not proof of a bad key.',detected_unusual_activity:'Provider account/network security restriction; not proof of a bad key.',quota_exceeded:'Provider quota exhausted.'};
   throw new Error(`ElevenLabs HTTP ${response.status} at ${endpoint.split('?')[0]}; code=${code}. ${hints[code]??'Check provider account/endpoint access.'} No automatic paid retry.`);
  }
  return response;
 };
 let voices=[],metadataError;
 try{
  const response=await api('/v1/voices');const data=await response.json();
  if(!Array.isArray(data.voices))throw new Error('Invalid voices response');
  voices=data.voices.map(v=>({voice_id:v.voice_id,name:v.name,category:v.category,labels:v.labels??{},preview_url:v.preview_url??null}));
 }catch(error){
  // As in the reference repo: metadata is not a prerequisite for explicit-ID TTS.
  if(mode==='discover'||!env.ELEVENLABS_VOICE_ID)throw error;
  metadataError=error.message;console.log(`::warning::${metadataError} Trying the explicitly configured voice only.`);
 }
 await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'voices.json'),JSON.stringify(voices,null,2));
 console.log(`Retrieved ${voices.length} voice entries. See voices.json artifact for names and IDs.`);
 if(mode==='discover')return {voices};
 const explicitId=(env.ELEVENLABS_VOICE_ID||'').trim();
 const voice=explicitId?(voices.find(v=>v.voice_id===explicitId)??{voice_id:explicitId,name:'Explicit voice (metadata unavailable)'}):voices.find(v=>v.category==='premade');
 if(!voice)throw new Error('No eligible voice. Select a voice ID from voices.json; auto-selection only uses premade voices, never personal clones.');
 if(!/^[A-Za-z0-9_-]+$/.test(voice.voice_id))throw new Error('Invalid voice ID');
 const audio=await api(`/v1/text-to-speech/${encodeURIComponent(voice.voice_id)}?output_format=mp3_44100_128`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text,model_id:'eleven_multilingual_v2',language_code:'id',voice_settings:{stability:.5,similarity_boost:.75}})});
 if(!(audio.headers.get('content-type')??'').startsWith('audio/'))throw new Error('Expected audio content from TTS');
 const bytes=Buffer.from(await audio.arrayBuffer());if(bytes.length<100)throw new Error('Empty/truncated TTS response');
 await fs.writeFile(path.join(dir,'vo-test-id.mp3'),bytes);
 await fs.writeFile(path.join(dir,'take.json'),JSON.stringify({voice_id:voice.voice_id,name:voice.name,model:'eleven_multilingual_v2',language:'id',text,bytes:bytes.length,selection:env.ELEVENLABS_VOICE_ID?'explicit':'first-premade-review-only',note:'Audio test only; not a locked cast voice or approved phoneme alignment.'},null,2));
 console.log('Saved vo-test-id.mp3 and take.json. Audition before assigning this voice to a character.');return {voices,voice};
}
if(path.basename(process.argv[1]??'')==='elevenlabs-vo.mjs')run().catch(error=>{console.error(`::error::${error.message}`);process.exitCode=1;});
