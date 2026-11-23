import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{p=path.resolve(p);if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;if(cache.has(p))return cache.get(p);let code=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(p,url);return url;};
const {buildGajianScene,gajianTimeline,budget,expenseTotal}=await import(load('src/episodes/gajian/scene.ts'));
const {portraitCamera,heldPropCenter}=await import(load('src/camera/PortraitCamera.ts'));
const {evaluateActor}=await import(load('src/story/evaluate.ts'));
const script=JSON.parse(fs.readFileSync('src/episodes/gajian/script.json','utf8'));
assert.equal(gajianTimeline.duration,2160);assert.equal(script.scenes.flatMap(s=>s.lines).length,27);
assert.equal(expenseTotal,3720000);assert.equal(budget.income-expenseTotal,-520000);
for(let i=0;i<3;i++){
 const t=gajianTimeline.scenes[i];assert.deepEqual(t.lines.map(l=>({speaker:l.speaker,text:l.text})),script.scenes[i].lines);
 const take=JSON.parse(fs.readFileSync(`public/audio/gajian/${t.id}.json`,'utf8'));assert.equal(take.model,'eleven_v3');assert.ok(new Set(take.voice_segments.map(v=>v.voice_id)).size===2,'two actual voices returned');assert.ok(fs.existsSync(`public/${t.audio}`));
 for(let f=0;f<t.duration;f++){
  const scene=buildGajianScene(i,f);assert.deepEqual(scene.actors.map(a=>a.id),['raka','nisa']);
  for(const actor of scene.actors){const state=evaluateActor(scene,actor,f);if(!state.visible)continue;if(!state.speaking)assert.equal(state.face.viseme,'rest');for(const p of actor.props??[]){const c=heldPropCenter(actor,state.pose,p,1660);assert.ok(Number.isFinite(c.x+c.y));const cam=portraitCamera(c.x,c.y,9.5);assert.ok(cam.x<=0&&cam.y<=0&&cam.x+1080*cam.zoom>=1080&&cam.y+1920*cam.zoom>=1920,'native world always covers viewport');}}
 }
}
const hidden=buildGajianScene(0,0).actors[1];assert.ok(hidden.enter>0);assert.ok(!JSON.stringify(hidden.props).includes('Untuk Ibu'),'no premature mother-remittance reveal');
for(const z of [1,1.2,1.8,8.5,9.5])for(const x of [-200,0,540,1080,1500])for(const y of [0,900,1660,2200]){const c=portraitCamera(x,y,z);assert.ok(c.x<=0&&c.y<=0&&c.x+1080*z>=1080-1e-6&&c.y+1920*z>=1920-1e-6);}
assert.throws(()=>portraitCamera(100,100,.9),/cover/);
const renderer=fs.readFileSync('src/episodes/gajian/GajianEpisode.tsx','utf8');assert.doesNotMatch(renderer,/PropArt|INSERT|VERSI REVIEW|SATIR KEHIDUPAN|Orang Miskin/,'no detached prop art or legacy title/review labels');assert.match(renderer,/heldPropCenter/);
console.log('GAJIAN VALIDATED: 27 user-script turns, 3 contextual two-voice takes, 90s native portrait, continuous hand-prop camera, budget deficit Rp520.000, no premature mother reveal, all scene frames and viewport coverage.');
