import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{p=path.resolve(p);if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;if(cache.has(p))return cache.get(p);let code=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(p,url);return url;};
const {episodeLines,episodeScenes,shotTimes,shotLocations,application,rejection,receipt,call,savings}=await import(load('src/episodes/episode01.ts'));
const {evaluateActor}=await import(load('src/story/evaluate.ts'));
const {resolveWorld}=await import(load('src/world/registry.ts'));
const {validateContent}=await import(load('src/props/types.ts'));
const source=JSON.parse(fs.readFileSync('src/data/episodes.json','utf8'))[0];
const expected=source.shots.flatMap(s=>s.dialogue.split('\n').map(line=>line.split(':').slice(1).join(':').trim()));
assert.deepEqual(episodeLines.map(l=>l.text),expected);assert.equal(episodeLines.length,18);assert.equal(shotTimes.at(-1),90*24);
let end=0;
for(const l of episodeLines){assert.ok(l.start>=end&&l.end>l.start);end=l.end;assert.ok(fs.existsSync(`public/${l.audio}`));const i=l.shot-1;assert.ok(l.start>=shotTimes[i]&&l.end<=shotTimes[i+1]);const alignment=JSON.parse(fs.readFileSync(`public/audio/episode01-elevenlabs/${l.id}.json`,'utf8'));assert.equal(alignment.text,l.text);assert.equal(alignment.voice_id,'ojz6ro9PB1xDu44lymdM');assert.equal(alignment.alignment.characters.length,alignment.alignment.character_start_times_seconds.length);}
for(const p of [application,rejection,receipt,call,savings])validateContent(p);
for(let i=0;i<6;i++){
 const scene=episodeScenes[i];assert.equal(scene.duration,shotTimes[i+1]-shotTimes[i]);resolveWorld('01',shotLocations[i]);
 assert.deepEqual(scene.actors.map(a=>a.id),(i===2||i===5)?['darto']:['darto','petugas']);
 for(let f=0;f<scene.duration;f++)for(const actor of scene.actors){const state=evaluateActor(scene,actor,f);assert.equal(state.visible,true);if(!state.speaking)assert.equal(state.face.viseme,'rest');}
}
assert.equal(episodeLines.filter(l=>!['DARTO','PETUGAS'].includes(l.speaker)).length,3,'buyer/child/loudspeaker are explicit offscreen roles');
console.log('EPISODE 01 VALIDATED: 90 seconds / 6 source shots / 18 faithful dialogue takes; real audio assets, character timestamps, per-shot boundaries, explicit 1/2-actor membership, 2160 frames and readable-prop content budgets.');
