import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';
import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{
 p=path.resolve(p);if(cache.has(p))return cache.get(p);
 if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;
 let source=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
 source=source.replace(/from\s+(['"])([^'"]+)\1/g,(match,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);
 const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(p,url);return url;
};
const {twoCharacterSync:scene}=await import(load('src/story/examples/twoCharacterSync.ts'));
const {evaluateScene,validateStoryScene}=await import(load('src/story/evaluate.ts'));
const {StoryActor}=await import(load('src/story/StoryActor.tsx'));
assert.deepEqual(scene.actors.map(a=>a.id),['darto','petugas']);
for(let frame=0;frame<scene.duration;frame++){
 const states=evaluateScene(scene,frame);assert.equal(states.length,2,'only two listed actors');
 for(const s of states){
  const active=scene.speech.find(c=>c.speaker===s.actor.id&&frame>=c.start&&frame<c.end);
  assert.equal(s.speaking,Boolean(active));
  const bodyWithoutDialogue=evaluateScene({...scene,speech:[]},frame).find(x=>x.actor.id===s.actor.id).pose;
  assert.deepEqual(s.pose,bodyWithoutDialogue,'speech never changes approved body pose');
  if(!active)assert.equal(s.face.viseme,'rest','non-speaker has no speech animation');
 }
}
const before=evaluateScene(scene,220),speaking=before.find(x=>x.actor.id==='darto');
assert.equal(speaking.pose.seated,1,'speaking keeps seated body');assert.equal(speaking.face.emotion,'sad','speech preserves sadness');
assert.equal(evaluateScene(scene,310).find(x=>x.actor.id==='darto').face.emotion,'crying','listener can cry while the other actor speaks');
const single={...scene,actors:[scene.actors[0]],speech:scene.speech.filter(c=>c.speaker==='darto')};
assert.equal(evaluateScene(single,220).length,1,'one actor works independently');
const oneMarkup=renderToStaticMarkup(React.createElement(StoryActor,{scene:single,actor:single.actors[0],frame:220,floorY:900}));assert.equal((oneMarkup.match(/data-story-actor=/g)??[]).length,1,'actual single actor renderer');
assert.throws(()=>validateStoryScene({...scene,actors:[scene.actors[0]]}),/not in scene cast/);
assert.throws(()=>validateStoryScene({...scene,actors:[scene.actors[0],scene.actors[0]]}),/duplicate/);
assert.throws(()=>validateStoryScene({...scene,actors:[{...scene.actors[0],exit:200},scene.actors[1]]}),/absent during speech/);
const markup=renderToStaticMarkup(React.createElement('div',null,scene.actors.map(actor=>React.createElement(StoryActor,{key:actor.id,scene,actor,frame:220,floorY:900}))));
assert.equal((markup.match(/data-story-actor=/g)??[]).length,2,'actual renderer mounts exactly two actors');assert.doesNotMatch(markup,/Nina|Rika|Pak Beni/);
for(const c of scene.speech){assert.ok(fs.existsSync('public/'+c.audio),'referenced audio exists');assert.ok(c.visemes.some(v=>v.viseme==='rest'),'energy gate includes silent mouth frames');}
console.log('STORY SYNC VALIDATED: 432 frames, explicit two-/one-actor cast, independent seated body/emotion/speech, silent listeners, audio refs, SSR membership and invalid-scene rejection.');
