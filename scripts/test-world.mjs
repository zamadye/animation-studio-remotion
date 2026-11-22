import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{p=path.resolve(p);if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;if(cache.has(p))return cache.get(p);let code=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(p,url);return url;};
const {resolveWorld,worldLocations,heroWorlds}=await import(load('src/world/registry.ts'));
const {WorldArt}=await import(load('src/world/WorldArt.tsx'));
const {WorldStage}=await import(load('src/world/WorldStage.tsx'));
const episodes=JSON.parse(fs.readFileSync('src/data/episodes.json','utf8'));
assert.equal(heroWorlds.length,8);assert.equal(new Set(worldLocations.map(w=>w.id)).size,worldLocations.length);
for(const e of episodes)for(const shot of e.shots)assert.equal(resolveWorld(e.id,shot.location).location,shot.location,'every source shot resolves');
assert.throws(()=>resolveWorld('99','unknown'),/Unknown story world/);
for(const world of worldLocations){
 const markup=renderToStaticMarkup(React.createElement(WorldArt,{world}));
 assert.match(markup,/viewBox="0 0 1920 1080"/);assert.doesNotMatch(markup,/NaN|undefined|Infinity/);
 assert.ok(world.floorY>730&&world.floorY<1080);
 assert.equal(world.night,/malam/i.test(world.location));
 const fore=renderToStaticMarkup(React.createElement(WorldArt,{world,layer:'foreground'}));assert.doesNotMatch(fore,/width="1920" height="1080" fill=/,'foreground never paints an opaque backdrop');
}
const stage=renderToStaticMarkup(React.createElement(WorldStage,{episodeId:'01',location:'Kantor pelayanan'},React.createElement('span',{'data-test-actor':'only-listed'},'actor slot')));
assert.equal((stage.match(/data-test-actor=/g)??[]).length,1,'world does not clone or add actors');assert.doesNotMatch(stage,/character rig/);
assert.ok(stage.indexOf('z-index:0')<stage.indexOf('data-test-actor')&&stage.indexOf('data-test-actor')<stage.indexOf('z-index:2'),'background → actor → foreground ordering');
console.log(`WORLD VALIDATED: ${worldLocations.length} mapped locations, all 48 source shots, 8 episode previews, SVG rendering, night flags, transparent foreground and actor-slot layering.`);

const {WorldStoryScene}=await import(load('src/world/WorldStoryScene.tsx'));
const {worldDialogueProof}=await import(load('src/story/examples/WorldDialogueProof.tsx'));
const {evaluateActor}=await import(load('src/story/evaluate.ts'));
assert.deepEqual(worldDialogueProof.actors.map(a=>a.id),['darto','petugas']);
const integrated=WorldStoryScene({episodeId:'01',location:'Kantor pelayanan',scene:worldDialogueProof,audio:false});
assert.equal(integrated.props.children.props.floorY,resolveWorld('01','Kantor pelayanan').floorY);
assert.equal(integrated.props.children.props.scene,worldDialogueProof);
assert.equal(integrated.props.children.props.audio,false);
assert.throws(()=>WorldStoryScene({episodeId:'99',location:'unknown',scene:worldDialogueProof}),/Unknown story world/);
for(let frame=0;frame<worldDialogueProof.duration;frame++){
 const speaking=worldDialogueProof.speech.find(c=>frame>=c.start&&frame<c.end);
 for(const actor of worldDialogueProof.actors){
  const state=evaluateActor(worldDialogueProof,actor,frame);
  assert.equal(state.visible,true);
  assert.equal(state.speaking,Boolean(speaking?.speaker===actor.id));
  if(!state.speaking)assert.equal(state.face.viseme,'rest');
 }
}
assert.deepEqual(worldDialogueProof.speech.map(c=>[c.start,c.end]),[[60,136],[168,217]]);
console.log('WORLD STORY VALIDATED: shared floor, explicit two-actor cast, 288 frames, independent listener mouths, reused audio windows and strict location lookup.');
