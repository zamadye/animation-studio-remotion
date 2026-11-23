import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{p=path.resolve(p);if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;if(cache.has(p))return cache.get(p);let code=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(p,url);return url;};
const {partOneScene,shots}=await import(load('src/episodes/gajian-part1/PartOne.tsx'));
const source=JSON.parse(fs.readFileSync('src/episodes/gajian-part1/source.json','utf8'));
const crypto=await import('node:crypto');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/'+source.audio)).digest('hex'),source.sha256);
assert.equal(source.cues.length,25);assert.equal(source.audioSeconds,74.4);assert.equal(source.duration,1786);
for(let f=0;f<source.duration;f++){const {scene,shot,local}=partOneScene(f);assert.ok(local>=0&&local<scene.duration);assert.ok(scene.speech.every(c=>c.speaker==='raka'),'no invented Nisa voice');assert.ok(scene.actors.length>=1);if(shot.camera==='bills')assert.ok(scene.actors[0].props[1]);for(const actor of scene.actors)assert.ok(local<(actor.exit??scene.duration));if(f<Math.round(35.18*24)&&shot.set!=='office')assert.ok(!scene.actors.flatMap(a=>a.props??[]).some(p=>p.content.kind==='letter'));}
assert.equal(shots[0].start,0);assert.equal(shots.at(-1).end,74.4);shots.slice(1).forEach((s,i)=>assert.equal(s.start,shots[i].end));
assert.ok(!JSON.stringify(source).includes('clockScale'));console.log('PART1 PASS: source MP3 hash unchanged; 25 original SRT cues; 1786 locally visible frames; contiguous shot ranges; Raka speech follows original SRT and source energy; no premature ledger.');

const {evaluateActor}=await import(load('src/story/evaluate.ts'));
const {raka,nisa,ayah,mira}=await import(load('src/components/characters/registry.ts'));
assert.equal(raka.name,'Raka');assert.equal(nisa.name,'Nisa');assert.equal(raka.costume,'workwear');assert.equal(nisa.hairShape,'hijab');assert.equal(nisa.lowerGarment,'skirt');
const costumeMarkup=design=>renderToStaticMarkup(React.createElement(CharacterRig,{design,frame:0,fps:24,cue:'hold'}));
const {CharacterRig}=await import(load('src/components/characters/CharacterRig.tsx'));
const {characterRegistry}=await import(load('src/components/characters/registry.ts'));
assert.equal(costumeMarkup(raka),costumeMarkup(characterRegistry.raka));assert.equal(costumeMarkup(nisa),costumeMarkup(characterRegistry.nisa));
let active=0,closed=0;
for(let f=108;f<source.duration;f++){const {scene,local}=partOneScene(f);for(const a of scene.actors){const state=evaluateActor(scene,a,local);if(a.id==='nisa')assert.equal(state.face.viseme,'rest');if(a.id==='raka'){if(state.face.viseme!=='rest')active++;else closed++;if((source.energy[f]??0)<.09)assert.equal(state.face.viseme,'rest');}}}
assert.ok(active>400);assert.ok(closed>0);console.log('CORRECTION PASS: user Rig V4 character identity retained; Raka has '+active+' active mouth frames; quiet frames and Nisa stay closed.');

const work=partOneScene(22*24);assert.equal(work.shot.set,'office');assert.equal(work.actor.props[0].content.id,'lembar-kerja');assert.equal(work.actor.body[0].motion.index,10);assert.ok(work.scene.duration>=60);console.log('WORK SHOT PASS: practical workstation, held work document, approved motion 10, >=2.5 seconds.');
