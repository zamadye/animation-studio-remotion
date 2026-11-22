import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {run} from './elevenlabs-vo.mjs';
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'vo-test-'));
const env={ELEVENLABS_API_KEY:'mock-only-not-a-key',VO_MODE:'probe'};
const voices={voices:[{voice_id:'test_premade',name:'Test',category:'premade'}]};let calls=[];
const request=async(url,opts)=>{calls.push({url,opts});return url.endsWith('/v1/voices')?new Response(JSON.stringify(voices),{headers:{'content-type':'application/json'}}):new Response(new Uint8Array(1024),{headers:{'content-type':'audio/mpeg'}});};
try{
 await assert.rejects(run({env:{},request,dir}),/Missing GitHub/);
 await assert.rejects(run({env:{...env,VO_TEXT:'x'.repeat(281)},request,dir}),/1–280/);
 await run({env:{...env,VO_MODE:'discover'},request,dir});assert.equal(calls.length,1);
 calls=[];await run({env,request,dir});assert.equal(calls.length,2);assert.equal(calls[1].opts.method,'POST');
 assert.equal(JSON.parse(calls[1].opts.body).model_id,'eleven_multilingual_v2');
 assert.equal((await fs.stat(path.join(dir,'vo-test-id.mp3'))).size,1024);
 assert.ok(!(await fs.readFile(path.join(dir,'take.json'),'utf8')).includes(env.ELEVENLABS_API_KEY));
 await assert.rejects(run({env,dir,request:async()=>new Response('',{status:401})}),/HTTP 401/);
 await assert.rejects(run({env,dir,request:async()=>new Response(JSON.stringify({voices:[{voice_id:'clone',category:'cloned'}]}))}),/No eligible voice/);
 console.log('ELEVENLABS CLIENT VALIDATED: mock only; discovery, one synthesis, no auto-clone, length limit, missing-secret/error handling and output metadata. No live API credit used.');
}finally{await fs.rm(dir,{recursive:true,force:true});}
