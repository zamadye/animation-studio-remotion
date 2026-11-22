import type {EmotionState} from './ExpressionMixer';
import type {ActingPose} from './clips';
import {poseLibrary, transitionPoses, type PoseId} from './PoseController';
export type ShotId='A_approach_offer'|'B_document_contact'|'C_clerk_read'|'D_darto_reaction'|'E_response_hold';
export type ActingShot={id:ShotId;start:number;end:number;intent:string;camera:'twoShot'|'insert'|'clerk'|'darto'|'medium'};
export const actingShots:ActingShot[]=[
 {id:'A_approach_offer',start:0,end:75,intent:'Three-quarter medium two-shot: Darto advances to the applicant side, looks to the form, then extends it to the desk.',camera:'twoShot'},
 {id:'B_document_contact',start:75,end:150,intent:'Insert on the desk edge and hands: document contacts the desk; clerk reaches and receives it.',camera:'insert'},
 {id:'C_clerk_read',start:150,end:225,intent:'Clerk medium close-up: scan the form, pause, evaluate, then dismiss.',camera:'clerk'},
 {id:'D_darto_reaction',start:225,end:300,intent:'Darto close-up: hope turns to disbelief and frustration; shoulders and torso respond.',camera:'darto'},
 {id:'E_response_hold',start:300,end:360,intent:'Return to medium: Darto begins a reply, hesitates, lowers his gaze, and withdraws the form.',camera:'medium'},
];
export const emotionAt=(name:'Darto'|'Petugas',frame:number):EmotionState=>name==='Darto'
 ? frame<48?'hopeful':frame<75?'uncertain':frame<150?'uncertain':frame<225?'uncertain':frame<250?'shocked':frame<300?'frustrated':'defeated'
 : frame<150?'neutral':frame<195?'evaluating':frame<225?'dismissive':'neutral';
export const shotAt=(frame:number)=>actingShots.find((s)=>frame>=s.start&&frame<s.end)??actingShots.at(-1)!;
const dartoCues:Array<{start:number;pose:PoseId}>=[{start:0,pose:'approach_counter'},{start:36,pose:'reach_forward'},{start:52,pose:'offer_document'},{start:75,pose:'release_document'},{start:105,pose:'idle_neutral'},{start:205,pose:'shocked_reaction'},{start:248,pose:'frustrated_response'},{start:300,pose:'defeated_posture'}];
const clerkCues:Array<{start:number;pose:PoseId}>=[{start:0,pose:'idle_neutral'},{start:96,pose:'read_document'},{start:150,pose:'read_document'},{start:198,pose:'dismissive_response'},{start:230,pose:'idle_neutral'}];
const neutral=poseLibrary.idle_neutral.pose as ActingPose;
const sample=(cues:Array<{start:number;pose:PoseId}>,frame:number):Partial<ActingPose>=>{
 const nextIndex=cues.findIndex((c)=>c.start>frame);const i=nextIndex===-1?cues.length-1:Math.max(0,nextIndex-1);const current=cues[i],next=cues[i+1];const pose=poseLibrary[current.pose];
 if(!next)return pose.pose;
 const nextPose=poseLibrary[next.pose],transition=Math.min(nextPose.transitionFrames,Math.max(1,next.start-current.start));
 if(frame>=next.start-transition)return transitionPoses(pose.pose as ActingPose,nextPose.pose,frame-(next.start-transition),transition,nextPose.curve);
 return pose.pose;
};
export const actingPoseAt=(name:'Darto'|'Petugas',frame:number):Partial<ActingPose>=>({...neutral,...sample(name==='Darto'?dartoCues:clerkCues,frame)});
