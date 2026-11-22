import {sampleRigCatalog,MOTION_FRAMES} from '../animation/rigMotionCatalog';
/** Named imports point to APPROVED catalog samples; no re-authored body curves. */
export type Motion={readonly index:number;readonly label:string};
const motion=(index:number,label:string):Motion=>Object.freeze({index,label});
export const idle=motion(0,'idle');
export const leftArm=motion(1,'leftArm');
export const rightArm=motion(2,'rightArm');
export const bothArms=motion(3,'bothArms');
export const leftLeg=motion(4,'leftLeg');
export const rightLeg=motion(5,'rightLeg');
export const march=motion(6,'march');
export const leanLeft=motion(7,'leanLeft');
export const leanRight=motion(8,'leanRight');
export const sitDown=motion(9,'sitDown');
export const seatedLean=motion(10,'seatedLean');
export const seatedGesture=motion(11,'seatedGesture');
export const standUp=motion(12,'standUp');
export const sampleMotion=(motion:Motion,localFrame:number,durationFrames:number)=>sampleRigCatalog(Math.round(Math.max(0,Math.min(1,localFrame/Math.max(1,durationFrames-1)))*(MOTION_FRAMES-1)),motion.index).pose;
