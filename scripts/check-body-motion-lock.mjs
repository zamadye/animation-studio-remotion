import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
export const bodyLockInputs=()=>{
 const read=p=>fs.readFileSync(p,'utf8');
 const draw=read('src/animation/ProportionCharacterRig.tsx');
 const production=read('src/components/characters/CharacterRig.tsx');
 return {
  'motion-schedule':read('src/animation/rigMotionCatalog.ts'),
  'body-geometry':read('src/components/characters/rigGeometry.ts'),
  'arm-hierarchy':read('src/animation/ArticulatedArm.tsx'),
  'cast-designs':read('src/components/characters/cast-data.json'),
  'body-drawing':draw.slice(draw.indexOf('  <g transform={`translate(0 620)'),draw.indexOf('   <g data-joint="neck"')),
  'body-adapter':production.slice(production.indexOf(' const seated='),production.indexOf(' // Facing')),
  'body-placement':production.slice(production.indexOf('  <ellipse cx="180"'),production.indexOf('   {leftHandTarget&&')).replace(/ face=\{face\}/g,''),
 };
};
export const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
if(process.argv[1]?.endsWith('check-body-motion-lock.mjs')){
 const lock=JSON.parse(fs.readFileSync('docs/body-motion-lock.json','utf8'));
 for(const [key,value] of Object.entries(bodyLockInputs()))assert.equal(digest(value),lock.sha256[key],`APPROVED BODY LOCK: ${key} changed. Do not regenerate the baseline without user approval.`);
 console.log('BODY LOCK VERIFIED: approved motion schedule, geometry, arms, cast, pelvis/legs/waist drawing and production placement unchanged.');
}
