import type {CharacterDesign} from './cast';
import {solveArmRotationsFacing, type Vec2} from '../../animation/TwoBoneIK';
export const ARM_UPPER=77;
export const ARM_LOWER=66;
export const RIG_SCALE=.85;
export const rigGeometry=(design:CharacterDesign)=>{
 const feminine=design.presentation==='feminine';
 const shoulder=(feminine?108:design.presentation==='masculine'?126:120)*(design.bodyShape==='broad'?1.10:design.bodyShape==='slim'?.95:1);
 return {shoulder,waist:shoulder*(feminine?.60:.75),height:(design.child ? .82 : 1)*(design.heightScale??1)};
};
/** Targets use the public 360×540 CharacterRig coordinates, before root offset.
 * Invert viewport, height and torso transforms in reverse order. */
export const targetToRig=(target:Vec2,design:CharacterDesign,lean:number):Vec2=>{
 const h=rigGeometry(design).height;
 const x=(target.x-27)/RIG_SCALE,y=((target.y-20)/RIG_SCALE-620)/h+620;
 const a=-lean*Math.PI/180,dx=x-180,dy=y-350;
 return {x:180+dx*Math.cos(a)-dy*Math.sin(a),y:350+dx*Math.sin(a)+dy*Math.cos(a)};
};
export const solveRigArm=(design:CharacterDesign,target:Vec2,side:-1|1,lean=0)=>{
 const x=180+side*(rigGeometry(design).shoulder/2-12),y=200;
 const ik=solveArmRotationsFacing({x,y},targetToRig(target,design,lean),{x,y:y+ARM_UPPER},{x,y:y+ARM_UPPER+ARM_LOWER},side);
 return {shoulder:ik.shoulderRotation,elbow:ik.elbowRotation,clamped:ik.clamped};
};

export const LEG_UPPER=98;
export const LEG_LOWER=100;
export const legGeometry=(side:-1|1,hip=0,knee=0,seated=0)=>{
 const x=side<0?145+10*seated:215-15*seated,y=350;
 const a=hip*Math.PI/180,b=(hip+knee)*Math.PI/180;
 const joint={x:x-Math.sin(a)*LEG_UPPER,y:y+Math.cos(a)*LEG_UPPER};
 return {root:{x,y},knee:joint,ankle:{x:joint.x-Math.sin(b)*LEG_LOWER,y:joint.y+Math.cos(b)*LEG_LOWER}};
};
/** Vertical pelvis compensation keeps the seated soles on the standing floor. */
export const seatedRootDrop=(pose:{seated?:number;hipLeft?:number;hipRight?:number;kneeLeft?:number;kneeRight?:number})=>{
 const seat=Math.max(0,Math.min(1,pose.seated??0));
 if(!seat)return 0;
 const a=legGeometry(-1,pose.hipLeft,pose.kneeLeft,seat).ankle;
 const b=legGeometry(1,pose.hipRight,pose.kneeRight,seat).ankle;
 return 548-Math.max(a.y,b.y);
};
