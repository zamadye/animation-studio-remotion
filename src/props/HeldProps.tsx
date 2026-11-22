import React from 'react';
import type {CharacterDesign} from '../components/characters/cast';
import type {ActingPose} from '../animation/clips';
import {ARM_UPPER,ARM_LOWER,RIG_SCALE,rigGeometry,seatedRootDrop} from '../components/characters/rigGeometry';
import {handAngles} from './handSocket';
import {PropArt} from './PropArt';
import {propSize,type HeldProp} from './types';
export const HeldProps:React.FC<{design:CharacterDesign;pose:Partial<ActingPose>;items:readonly HeldProp[];frame:number;scale:number}>=({design,pose,items,frame,scale})=>{
 const g=rigGeometry(design);
 return <svg data-held-props style={{position:'absolute',left:0,top:0,overflow:'visible',pointerEvents:'none'}} width={360*scale} height={540*scale} viewBox="0 0 360 540">
 <g transform={`translate(${pose.rootX??0} ${(pose.rootY??0)+RIG_SCALE*g.height*seatedRootDrop(pose)}) translate(27 20) scale(${RIG_SCALE}) translate(0 620) scale(1 ${g.height}) translate(0 -620) rotate(${pose.torsoLean??0} 180 350)`}>
 {items.filter(p=>frame>=p.start&&frame<p.end).map(p=>{const a=handAngles(pose,p.hand),s=propSize(p.content);return <g key={p.content.id} transform={`translate(${180+a.side*(g.shoulder/2-12)} 200) rotate(${a.shoulder}) translate(0 ${ARM_UPPER}) rotate(${a.elbow}) translate(0 ${ARM_LOWER}) rotate(${a.wrist})`}>
  <g transform={`translate(0 12) rotate(${-a.shoulder-a.elbow-a.wrist}) translate(0 -12)`}>
  <g transform={`translate(${p.hand==='left'?-s.width*s.scale:0} ${p.content.kind==='phone'?-42:-55}) scale(${s.scale})`}><PropArt content={p.content}/></g>
  {/* Accessory-only grip overlay: body silhouette/approved arm curves stay unchanged. */}
  <path transform={p.hand==='left'?'scale(-1 1)':undefined} data-grip="thumb" d="M-5 6Q6 1 12 8L18 15Q19 21 13 23L2 18-5 18Z" fill={design.skin} stroke="#493b35" strokeWidth="3" strokeLinejoin="round"/>
 </g></g>;})}
 </g></svg>;
};
