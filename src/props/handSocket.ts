import type {CharacterDesign} from '../components/characters/cast';
import type {ActingPose} from '../animation/clips';
import {ARM_UPPER,ARM_LOWER,RIG_SCALE,rigGeometry,seatedRootDrop} from '../components/characters/rigGeometry';
export const handAngles=(p:Partial<ActingPose>,hand:'left'|'right')=>hand==='left'?{side:-1 as const,shoulder:6+(p.armLeft??0),elbow:p.elbowLeft??0,wrist:p.wristLeft??0}:{side:1 as const,shoulder:-6+(p.armRight??0),elbow:p.elbowRight??0,wrist:p.wristRight??0};
const rotate=(x:number,y:number,a:number)=>{const t=a*Math.PI/180;return {x:x*Math.cos(t)-y*Math.sin(t),y:x*Math.sin(t)+y*Math.cos(t)};};
/** Forward kinematics of the locked skeleton; attachment follows the hand, never drives it. */
export const handSocket=(design:CharacterDesign,p:Partial<ActingPose>,hand:'left'|'right')=>{
 const a=handAngles(p,hand),g=rigGeometry(design);
 const upper=rotate(0,ARM_UPPER,a.shoulder),lower=rotate(0,ARM_LOWER,a.shoulder+a.elbow),palm=rotate(0,12,a.shoulder+a.elbow+a.wrist);
 const waist=rotate(a.side*(g.shoulder/2-12)+upper.x+lower.x+palm.x,-150+upper.y+lower.y+palm.y,p.torsoLean??0);
 return {x:(p.rootX??0)+27+RIG_SCALE*(180+waist.x),y:(p.rootY??0)+RIG_SCALE*g.height*seatedRootDrop(p)+20+RIG_SCALE*(620+g.height*(350+waist.y-620))};
};
