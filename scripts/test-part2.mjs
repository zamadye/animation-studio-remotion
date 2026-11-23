import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{p=path.resolve(p);if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;if(cache.has(p))return cache.get(p);let code=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(p,url);return url;};
const {partTwoScene,partTwoShots}=await import(load('src/episodes/gajian-part2/PartTwo.tsx'));
const {evaluateActor}=await import(load('src/story/evaluate.ts'));
const {raka,nisa,ayah,mira}=await import(load('src/components/characters/registry.ts'));
const {propSize,validateContent}=await import(load('src/props/types.ts'));
const {heldPropCenter,portraitCamera}=await import(load('src/camera/PortraitCamera.ts'));
const source=JSON.parse(fs.readFileSync('src/episodes/gajian-part2/source.json','utf8'));
const crypto=await import('node:crypto');assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/'+source.audio)).digest('hex'),source.sha256);
assert.equal(source.cues.length,8);assert.equal(source.duration,1344);assert.equal(source.audioSeconds,56);assert.deepEqual(raka,ayah);assert.deepEqual(nisa,mira);
assert.equal(partTwoShots[0].start,0);assert.equal(partTwoShots.at(-1).end,56);partTwoShots.slice(1).forEach((s,i)=>assert.equal(s.start,partTwoShots[i].end));
let talking=0;for(let f=0;f<source.duration;f++){const {shot,scene,local}=partTwoScene(f);assert.ok(local>=0&&local<scene.duration);assert.ok(scene.actors.some(a=>a.id==='raka'));assert.ok(scene.speech.every(c=>c.speaker==='raka'));
for(const actor of scene.actors){const state=evaluateActor(scene,actor,local);assert.ok(state.visible);if(actor.id!=='raka')assert.equal(state.face.viseme,'rest');else if(state.face.viseme!=='rest')talking++;if((source.energy[f]??0)<.09)assert.equal(state.face.viseme,'rest');for(const p of actor.props??[]){validateContent(p.content);const point=heldPropCenter(actor,state.pose,p,1710);assert.ok(Number.isFinite(point.x+point.y));const c=portraitCamera(point.x,point.y,5.7);assert.ok(c.x<=0&&c.y<=0&&c.x+1080*c.zoom>=1080&&c.y+1920*c.zoom>=1920);}}
if(shot.action==='savings'&&f<19*24)assert.deepEqual(scene.actors[0].props[0].content.lines,['Rp5.000']);
}
assert.ok(talking>500);assert.equal(partTwoScene(33*24).raka.props[0].content.open,true);assert.equal(partTwoScene(8*24).raka.props[0].content.kind,'lunchbox');assert.deepEqual(partTwoScene(46*24).scene.actors.map(a=>a.id),['raka','nisa']);assert.deepEqual(partTwoScene(38*24).scene.actors.map(a=>a.id),['raka','pria']);
console.log('PART2 PASS: 56s unchanged user audio hash; 8 SRT cues; 1344 valid scene frames; catalog identities; '+talking+' Raka mouth frames; silent listeners; attached props and clamped portrait; staged savings.');
