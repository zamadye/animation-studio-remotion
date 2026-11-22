import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const compile=p=>ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const url=s=>`data:text/javascript;base64,${Buffer.from(s).toString('base64')}`;
const faceURL=url(compile('src/animation/faceRig.ts'));
const {faceChannels,sampleDemoSpeech,faceFromPose}=await import(faceURL);
const {sampleFaceCatalog,faceCatalogIndex,FACE_DURATION}=await import(url(compile('src/animation/faceCatalog.ts').replace('./faceRig',faceURL)));
const component=compile('src/components/characters/FacialFeatures.tsx').replace("from 'react'",`from '${import.meta.resolve('react')}'`).replace('../../animation/faceRig',faceURL);
const {FacialFeatures}=await import(url(component));
const visemes=new Set();
for(let frame=0;frame<FACE_DURATION;frame++){
 const s=sampleFaceCatalog(frame);
 assert.deepEqual(sampleFaceCatalog(frame),s,'deterministic face sampling');
 assert.equal(s.index,Math.floor(frame/60),'shared index');
 const c=faceChannels(s.face);
 for(const value of Object.values(c))assert.ok(Number.isFinite(value),'finite facial geometry channels');
 assert.ok(c.eye>=0&&c.eye<=1.65&&c.tears>=0&&c.tears<=1,'bounded face channels');
 if(s.index===1)visemes.add(s.face.viseme);
 assert.ok(!('armLeft' in s.face)&&!('rootY' in s.face)&&!('torsoLean' in s.face),'facial sampler cannot animate body');
 const svg=renderToStaticMarkup(React.createElement('svg',null,React.createElement(FacialFeatures,{face:s.face,hair:'#332824'})));
 assert.doesNotMatch(svg,/NaN|Infinity|undefined/,'valid rendered face');
}
assert.equal(visemes.size,8,'all eight mouth shapes exercised');
const signatures=new Set();
for(const emotion of new Set(faceCatalogIndex.map(x=>x.emotion))){
 const neutral=faceChannels({emotion,intensity:0});
 assert.equal(neutral.eye,1);assert.ok(Math.abs(neutral.smile)<1e-9);assert.equal(neutral.tears,0);
 signatures.add(JSON.stringify(faceChannels({emotion,intensity:1})));
}
assert.equal(signatures.size,11,'eleven distinct emotion control sets');
assert.equal(faceChannels({emotion:'crying'}).tears,1,'crying includes tears');
assert.equal(faceChannels({emotion:'angry',blink:1}).eye,0,'blink remains available during anger');
assert.equal(faceFromPose({expression:'angry',mouth:'open'}).emotion,'angry','legacy acting expressions still work');
assert.ok(new Set(Array.from({length:48},(_,f)=>sampleDemoSpeech(f).viseme)).size>=8,'speech cycles mouth shapes');
const group=renderToStaticMarkup(React.createElement('svg',null,Array.from({length:16},(_,i)=>React.createElement(FacialFeatures,{key:i,face:{emotion:'angry',viseme:'E'},hair:'#332824'}))));
const ids=[...group.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,16,'mouth clip paths are unique across sixteen simultaneous characters');
console.log(`FACE VALIDATED: ${FACE_DURATION} deterministic rendered frames, 16 shared indices, 11 emotion sets, 8 mouth shapes, unique clip paths; body channels untouched.`);
