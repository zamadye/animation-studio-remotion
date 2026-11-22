import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const cache=new Map();
const load=p=>{p=path.resolve(p);if(!fs.existsSync(p))p=['.ts','.tsx','.json'].map(ext=>p+ext).find(fs.existsSync)??p;if(cache.has(p))return cache.get(p);let code=p.endsWith('.json')?'export default '+fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,q,spec)=>`from ${q}${spec.startsWith('.')?load(path.resolve(path.dirname(p),spec)):import.meta.resolve(spec)}${q}`);const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(p,url);return url;};
const {evaluateActor,validateStoryScene}=await import(load('src/story/evaluate.ts'));

const {phoneScene,letterScene,exampleChat,exampleLetter}=await import(load('src/props/PropCameraProof.tsx'));
const {PropArt}=await import(load('src/props/PropArt.tsx'));
const {HeldProps}=await import(load('src/props/HeldProps.tsx'));
const {handSocket}=await import(load('src/props/handSocket.ts'));
const {validateContent}=await import(load('src/props/types.ts'));
const {readCameraAt}=await import(load('src/camera/readCamera.ts'));
const {characterRegistry}=await import(load('src/components/characters/registry.ts'));
const {sampleMotion}=await import(load('src/story/motions.ts'));
for(const scene of [phoneScene,letterScene]){
 assert.equal(validateStoryScene(scene),scene);
 const actor=scene.actors[0],prop=actor.props[0];
 for(const frame of [0,24,59,60,95,96,130,scene.duration-1]){
  const {pose}=evaluateActor(scene,actor,frame);
  const markup=renderToStaticMarkup(React.createElement(HeldProps,{design:actor.design,pose,items:actor.props,frame,scale:1}));
  assert.match(markup,new RegExp(`data-prop-id="${prop.content.id}"`));assert.match(markup,/data-grip="thumb"/);assert.doesNotMatch(markup,/NaN|undefined|Infinity/);
 }
 const off=renderToStaticMarkup(React.createElement(HeldProps,{design:actor.design,pose:{},items:actor.props,frame:scene.duration,scale:1}));assert.doesNotMatch(off,/data-prop-id=/);
 const art=renderToStaticMarkup(React.createElement(PropArt,{content:prop.content}));
 const lines=prop.content.kind==='phone'?prop.content.messages.flatMap(m=>m.lines):prop.content.lines;
 for(const text of lines.filter(Boolean))assert.ok(art.includes(text),'insert contains the exact authored text');
 assert.throws(()=>validateStoryScene({...scene,actors:[{...actor,props:[prop,{...prop,content:{...prop.content,id:'duplicate-hand'}}]}]}),/two props in same hand/);
 assert.throws(()=>validateStoryScene({...scene,actors:[{...actor,props:[{...prop,end:scene.duration+1}]}]}),/invalid held prop/);
}
assert.throws(()=>validateContent({...exampleChat,messages:[{from:'me',lines:['X'.repeat(80)]}]}),/layout budget/);
assert.throws(()=>validateContent({...exampleLetter,lines:Array(12).fill('long')}),/1–10/);
for(const [frame,phase] of [[0,'wide'],[60,'push'],[95,'push'],[96,'insert'],[263,'insert'],[264,'return']])assert.equal(readCameraAt({pushStart:60,insertStart:96,returnStart:264},288,frame).phase,phase);
assert.throws(()=>readCameraAt({pushStart:96,insertStart:60,returnStart:264},288,0),/timing/);
assert.equal(readCameraAt({pushStart:60,insertStart:96,returnStart:264},288,264).progress,0);
// Numerical FK coverage includes both hands, all cast metadata/heights and all locked movements.
let sockets=0;
for(const design of Object.values(characterRegistry))for(let index=0;index<13;index++)for(let f=0;f<60;f++)for(const hand of ['left','right']){
 const pose=sampleMotion({index,label:'qa'},f,60),point=handSocket(design,pose,hand);
 assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
 const shifted=handSocket(design,{...pose,rootX:(pose.rootX??0)+17,rootY:(pose.rootY??0)-11},hand);
 assert.ok(Math.abs(shifted.x-point.x-17)<1e-8&&Math.abs(shifted.y-point.y+11)<1e-8,'socket preserves root translation');sockets++;
}
console.log(`HELD PROPS VALIDATED: ${sockets} FK samples; both hands/all 16 cast/all 13 motions, content reuse, grip layer, visibility, invalid-content rejection and camera boundaries.`);
const {plugAndPlayScene}=await import(load('src/story/examples/plugAndPlay.ts'));
assert.equal(validateStoryScene(plugAndPlayScene).actors.length,1);
assert.deepEqual(plugAndPlayScene.actors[0].body.map(c=>c.motion.index),[6,2,0]);
// Independent matrix chain matches the socket helper and the SVG attachment hierarchy.
const multiply=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
const T=(x,y)=>[1,0,0,1,x,y],S=(x,y)=>[x,0,0,y,0,0],R=d=>{const a=d*Math.PI/180;return [Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0];};
const {rigGeometry,seatedRootDrop}=await import(load('src/components/characters/rigGeometry.ts'));
for(const design of Object.values(characterRegistry))for(let index=0;index<13;index++)for(const f of [0,17,31,59])for(const hand of ['left','right']){
 const p=sampleMotion({index,label:'matrix'},f,60),g=rigGeometry(design),left=hand==='left',side=left?-1:1;
 const shoulder=(left?6:-6)+(left?p.armLeft:p.armRight),elbow=(left?p.elbowLeft:p.elbowRight)??0,wrist=(left?p.wristLeft:p.wristRight)??0;
 const chain=[T(p.rootX??0,(p.rootY??0)+.85*g.height*seatedRootDrop(p)),T(27,20),S(.85,.85),T(0,620),S(1,g.height),T(0,-620),T(180,350),R(p.torsoLean??0),T(-180,-350),T(180+side*(g.shoulder/2-12),200),R(shoulder),T(0,77),R(elbow),T(0,66),R(wrist)];
 const m=chain.reduce(multiply,[1,0,0,1,0,0]),s=handSocket(design,p,hand);
 assert.ok(Math.abs(s.x-(m[2]*12+m[4]))<1e-8&&Math.abs(s.y-(m[3]*12+m[5]))<1e-8,'FK socket matches locked SVG matrix chain');
}
console.log('ATTACHMENT MATRIX VALIDATED: 1664 samples against independent SVG transform matrices; plug-and-play example uses approved motion indices.');
