import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const compile=path=>ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const url=source=>`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const ikURL=url(compile('src/animation/TwoBoneIK.ts'));
const geometry=compile('src/components/characters/rigGeometry.ts').replace('../../animation/TwoBoneIK',ikURL);
const {rigGeometry,solveRigArm,RIG_SCALE,ARM_UPPER,ARM_LOWER}=await import(url(geometry));
const cast=JSON.parse(fs.readFileSync('src/components/characters/cast-data.json','utf8'));
const rad=x=>x*Math.PI/180;
let cases=0;
for(const pair of Object.values(cast))for(const design of Object.values(pair))for(const side of [-1,1])for(const lean of [-12,0,12]){
 const {shoulder,height}=rigGeometry(design);
 const x=180+side*(shoulder/2-12),y=200;
 // Known reachable pose. Build a public target with the same FK and viewport
 // chain used by production; IK must round-trip it for adult and child bodies.
 const a=rad(-side*45),b=rad(-side*80);
 const px=x-Math.sin(a)*ARM_UPPER-Math.sin(b)*ARM_LOWER;
 const py=y+Math.cos(a)*ARM_UPPER+Math.cos(b)*ARM_LOWER;
 const l=rad(lean),dx=px-180,dy=py-350;
 const qx=180+dx*Math.cos(l)-dy*Math.sin(l),qy=350+dx*Math.sin(l)+dy*Math.cos(l);
 const target={x:27+RIG_SCALE*qx,y:20+RIG_SCALE*(620+height*(qy-620))};
 const solved=solveRigArm(design,target,side,lean);
 assert.equal(solved.clamped,false,`${design.name}: reachable`);
 const sa=rad(solved.shoulder),sb=rad(solved.shoulder+solved.elbow);
 const actual={x:x-Math.sin(sa)*ARM_UPPER-Math.sin(sb)*ARM_LOWER,y:y+Math.cos(sa)*ARM_UPPER+Math.cos(sb)*ARM_LOWER};
 assert.ok(Math.hypot(actual.x-px,actual.y-py)<1e-6,`${design.name}: IK/FK endpoint`);
 const far=solveRigArm(design,{x:5000,y:-5000},side,lean);
 assert.ok(far.clamped&&Number.isFinite(far.shoulder)&&Number.isFinite(far.elbow),'unreachable targets clamp without NaN');
 cases++;
}
assert.equal(cast['06'].foil.child,true,'Dini uses child geometry');
for(const [ep,pair] of Object.entries(cast))for(const design of Object.values(pair))assert.ok(design.presentation&&design.bodyShape,`${ep}: canonical body metadata`);
console.log(`RIG VALIDATED: ${cases} IK/FK round-trips across all 16 characters, both arms, torso lean, child height, and unreachable targets.`);

const {legGeometry,seatedRootDrop,LEG_UPPER,LEG_LOWER}=await import(url(geometry));
const {sampleRigCatalog,rigMotionIndex,CATALOG_DURATION,MOTION_FRAMES}=await import(url(compile('src/animation/rigMotionCatalog.ts')));
assert.equal(rigMotionIndex.length,13);
let legCases=0;
for(let frame=0;frame<CATALOG_DURATION;frame++){
 const sample=sampleRigCatalog(frame),{pose}=sample;
 assert.equal(sample.index,Math.floor(frame/MOTION_FRAMES),'global movement index');
 assert.deepEqual(sampleRigCatalog(frame),sample,'deterministic catalog sampling');
 for(const pair of Object.values(cast))for(const design of Object.values(pair)){
  const {height}=rigGeometry(design);
  for(const side of [-1,1]){
   const hip=(side<0?pose.hipLeft:pose.hipRight)??0,knee=(side<0?pose.kneeLeft:pose.kneeRight)??0;
   const g=legGeometry(side,hip,knee,pose.seated);
   assert.ok(Math.abs(Math.hypot(g.knee.x-g.root.x,g.knee.y-g.root.y)-LEG_UPPER)<1e-7,'constant thigh length');
   assert.ok(Math.abs(Math.hypot(g.ankle.x-g.knee.x,g.ankle.y-g.knee.y)-LEG_LOWER)<1e-7,'constant calf length');
   if(pose.seated){
    const delta=RIG_SCALE*height*(g.ankle.y+seatedRootDrop(pose)-548);
    assert.ok(Math.abs(delta)<1e-6,`${design.name}: seated/transition foot stays at floor`);
   }
   legCases++;
  }
 }
}
for(let index=0;index<rigMotionIndex.length-1;index++){
 const end=sampleRigCatalog((index+1)*MOTION_FRAMES-1).pose,start=sampleRigCatalog((index+1)*MOTION_FRAMES).pose;
 for(const key of ['armLeft','armRight','elbowLeft','elbowRight','hipLeft','hipRight','kneeLeft','kneeRight','torsoLean','seated'])assert.ok(Math.abs((end[key]??0)-(start[key]??0))<1e-7,`${index}: no pose pop at ${key}`);
}
assert.ok(sampleRigCatalog(90).pose.armLeft>0&&sampleRigCatalog(150).pose.armRight<0,'both arms exercise mirrored shoulders');
assert.ok(sampleRigCatalog(270).pose.kneeLeft>0&&sampleRigCatalog(330).pose.kneeRight>0,'both knees exercise');
assert.equal(sampleRigCatalog(630).pose.seated,1,'seated waist test is fully seated');
assert.ok(sampleRigCatalog(630).pose.torsoLean>0,'waist rotation while seated');
console.log(`CATALOG VALIDATED: ${rigMotionIndex.length} shared movements, ${CATALOG_DURATION} deterministic frames, ${legCases} leg-length/seat-floor checks, and continuous section boundaries.`);
