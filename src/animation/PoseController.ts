import type {ActingPose} from './clips';
export type PoseId='idle_neutral'|'approach_counter'|'reach_forward'|'offer_document'|'release_document'|'read_document'|'dismissive_response'|'shocked_reaction'|'frustrated_response'|'defeated_posture';
export type PoseClip={id:PoseId;duration:number;transitionFrames:number;curve:'smooth'|'linear';pose:Partial<ActingPose>};
export const poseLibrary:Record<PoseId,PoseClip>={
 idle_neutral:{id:'idle_neutral',duration:48,transitionFrames:8,curve:'smooth',pose:{expression:'neutral',headTilt:0,torsoLean:0,armLeft:0,armRight:0,gazeX:0,gazeY:0,mouth:'rest'}},
 approach_counter:{id:'approach_counter',duration:75,transitionFrames:12,curve:'smooth',pose:{expression:'hopeful',headTilt:-2,torsoLean:2,armLeft:-5,armRight:8,gazeX:8,gazeY:-1}},
 reach_forward:{id:'reach_forward',duration:35,transitionFrames:8,curve:'smooth',pose:{expression:'uncertain',headTilt:-3,torsoLean:7,armRight:-28,elbowRight:-14,gazeX:8,gazeY:2}},
 offer_document:{id:'offer_document',duration:30,transitionFrames:6,curve:'smooth',pose:{expression:'hopeful',headTilt:-2,torsoLean:9,armRight:-35,elbowRight:-8,gazeX:10,gazeY:0}},
 release_document:{id:'release_document',duration:12,transitionFrames:4,curve:'smooth',pose:{expression:'uncertain',torsoLean:4,armRight:-16,elbowRight:-2,gazeX:7}},
 read_document:{id:'read_document',duration:55,transitionFrames:9,curve:'smooth',pose:{expression:'evaluating',headTilt:8,torsoLean:-4,armLeft:-18,elbowLeft:10,gazeY:10,mouth:'closed'}},
 dismissive_response:{id:'dismissive_response',duration:30,transitionFrames:7,curve:'smooth',pose:{expression:'dismissive',headTilt:3,torsoLean:-2,armLeft:-34,elbowLeft:18,gazeX:-6,mouth:'closed'}},
 shocked_reaction:{id:'shocked_reaction',duration:28,transitionFrames:4,curve:'smooth',pose:{expression:'shocked',headTilt:-7,torsoLean:-5,rootY:-3,gazeX:8,gazeY:-3,mouth:'round'}},
 frustrated_response:{id:'frustrated_response',duration:34,transitionFrames:7,curve:'smooth',pose:{expression:'frustrated',headTilt:3,torsoLean:8,armRight:18,elbowRight:-7,armLeft:9,gazeX:-2,mouth:'open'}},
 defeated_posture:{id:'defeated_posture',duration:60,transitionFrames:12,curve:'smooth',pose:{expression:'defeated',headTilt:11,torsoLean:10,armLeft:9,armRight:5,gazeY:12,mouth:'closed',rootY:3}},
};
const smooth=(x:number)=>x*x*(3-2*x);
export const blendPose=(a:ActingPose,b:Partial<ActingPose>,amount:number):ActingPose=>{
 const t=Math.max(0,Math.min(1,amount));const out={...a};
 (Object.keys(b) as (keyof ActingPose)[]).forEach((key)=>{const av=a[key],bv=b[key];if(typeof av==='number'&&typeof bv==='number')out[key]=(av+(bv-av)*t) as never;else if(t>=.5&&bv!==undefined)out[key]=bv as never;});return out;
};
export const transitionPoses=(from:ActingPose,to:Partial<ActingPose>,frame:number,duration:number,curve:'smooth'|'linear'='smooth')=>blendPose(from,to,(curve==='smooth'?smooth:(x:number)=>x)(frame/Math.max(1,duration)));
