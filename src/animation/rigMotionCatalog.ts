import type {ActingPose} from './clips';

/** One ordered schedule for every character. No character-specific keyframes. */
export const MOTION_FRAMES=60;
export const MOTION_FPS=24;
export const rigMotionIndex=[
 '00 · Netral / semua pivot',
 '01 · Lengan kiri / bahu–siku',
 '02 · Lengan kanan / bahu–siku',
 '03 · Kedua lengan / pergelangan',
 '04 · Kaki kiri / panggul–lutut–ankle',
 '05 · Kaki kanan / panggul–lutut–ankle',
 '06 · Langkah bergantian',
 '07 · Pinggang condong kiri',
 '08 · Pinggang condong kanan',
 '09 · Turun duduk / pelvis + lutut',
 '10 · Duduk / pinggang maju–pulih',
 '11 · Duduk / kedua lengan',
 '12 · Berdiri kembali / kaki rata',
] as const;
export const CATALOG_DURATION=rigMotionIndex.length*MOTION_FRAMES;
const smooth=(u:number)=>{const x=Math.max(0,Math.min(1,u));return x*x*(3-2*x);};
const envelope=(u:number)=>u<.3?smooth(u/.3):u>.7?smooth((1-u)/.3):1;
export type CatalogSample={index:number;label:string;pose:ActingPose;wristLeft:number;wristRight:number};
export const sampleRigCatalog=(frame:number,motionIndex?:number):CatalogSample=>{
 const safe=Math.max(0,Math.min(CATALOG_DURATION-1,Math.floor(frame)));
 const index=motionIndex===undefined?Math.floor(safe/MOTION_FRAMES):Math.max(0,Math.min(rigMotionIndex.length-1,Math.floor(motionIndex)));
 const u=(safe%MOTION_FRAMES)/(MOTION_FRAMES-1),w=envelope(u);
 const pose:ActingPose={headTilt:0,torsoLean:0,armLeft:0,armRight:0,elbowLeft:0,elbowRight:0,hipLeft:0,hipRight:0,kneeLeft:0,kneeRight:0,gazeX:0,gazeY:0,rootX:0,rootY:0,squash:1,expression:'neutral',mouth:'rest',blink:false,seated:0};
 let wristLeft=0,wristRight=0;
 if(index===1||index===3){pose.armLeft=74*w;pose.elbowLeft=60*w;}
 if(index===2||index===3){pose.armRight=-74*w;pose.elbowRight=-60*w;}
 if(index===3){wristLeft=-18*w;wristRight=18*w;}
 if(index===4){pose.hipLeft=-32*w;pose.kneeLeft=60*w;}
 if(index===5){pose.hipRight=-32*w;pose.kneeRight=60*w;}
 if(index===6){
  const cycle=Math.sin(u*Math.PI*4)*Math.sin(u*Math.PI)**2;
  pose.hipLeft=24*cycle;pose.hipRight=-24*cycle;
  pose.kneeLeft=40*Math.max(0,-cycle);pose.kneeRight=40*Math.max(0,cycle);
  pose.armLeft=-12*cycle;pose.armRight=12*cycle;
 }
 if(index===7)pose.torsoLean=-14*w;
 if(index===8)pose.torsoLean=14*w;
 if(index>=9){
  const seated=index===9?smooth(u):index===12?1-smooth(u):1;
  pose.seated=seated;
  pose.hipLeft=pose.hipRight=-90*seated;
  pose.kneeLeft=pose.kneeRight=90*seated;
  // Anticipation/recovery of the waist during sit/stand; upright at the ends.
  pose.torsoLean=(index===9||index===12)?12*Math.sin(Math.PI*u):index===10?16*w:0;
  if(index===11){pose.armLeft=55*w;pose.armRight=-55*w;pose.elbowLeft=75*w;pose.elbowRight=-75*w;}
 }
 pose.wristLeft=wristLeft;pose.wristRight=wristRight;
 return {index,label:rigMotionIndex[index],pose,wristLeft,wristRight};
};
