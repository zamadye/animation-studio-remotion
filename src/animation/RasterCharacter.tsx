import React from 'react';
import {Img, staticFile} from 'remotion';
import darto from '../../public/assets/production-v3/rig/darto/layers.json';
import petugas from '../../public/assets/production-v3/rig/petugas/layers.json';

type Spec=typeof darto;
type Side='L'|'R';
type Props={id:'darto'|'petugas';x:number;y:number;width:number;flip?:boolean;frame:number;acting:'enter'|'offer'|'wait'|'refuse'|'freeze'|'argue'|'retrieve'|'hold'};
const lerp=(f:number,keys:Array<[number,number]>)=>{for(let i=1;i<keys.length;i++){if(f<=keys[i][0]){const [a,av]=keys[i-1],[b,bv]=keys[i];const t=Math.max(0,Math.min(1,(f-a)/(b-a)));const s=t*t*(3-2*t);return av+(bv-av)*s;}}return keys.at(-1)![1];};
const asset=(id:string,path:string)=>staticFile(`assets/production-v3/rig/${id}/${path}`);
export const RasterCharacter:React.FC<Props>=({id,x,y,width,flip=false,frame,acting})=>{
 const s=(id==='darto'?darto:petugas) as Spec;const h=width*900/480;
 const action=id==='darto';
 const upper=action?lerp(frame,[[0,0],[75,0],[102,-8],[140,-25],[178,-16],[204,4],[222,0],[236,16],[265,12],[300,-6],[332,-4],[359,-4]]):lerp(frame,[[0,0],[135,0],[160,-4],[184,0],[204,-20],[222,-20],[260,0],[359,0]]);
 const lower=action?lerp(frame,[[0,0],[75,0],[102,-6],[140,-18],[178,-12],[204,8],[222,0],[236,7],[265,4],[300,0],[359,0]]):lerp(frame,[[0,0],[155,0],[180,8],[204,28],[228,24],[265,0],[359,0]]);
 const bodyTilt=action?lerp(frame,[[0,0],[72,0],[103,-3],[145,0],[178,0],[205,0],[220,4],[240,2],[266,8],[302,12],[335,11],[359,11]]):lerp(frame,[[0,0],[154,0],[174,-3],[194,0],[204,-1],[222,-1],[255,0],[359,0]]);
 const headTilt=action?lerp(frame,[[0,0],[72,0],[103,-6],[145,-2],[178,0],[204,2],[220,5],[240,9],[266,8],[302,12],[335,14],[359,14]]):lerp(frame,[[0,0],[155,0],[175,-3],[193,0],[204,-8],[222,-8],[255,0],[359,0]]);
 const rotate=(key:string,angle:number)=>{const p=(s as any).pivot[key]??{x:240,y:430};return {transform:`rotate(${angle}deg)`,transformOrigin:`${p.x*width/480}px ${p.y*h/900}px`};};
 const neutral=['pelvis','torso','head','thigh_L','shin_L','foot_L','thigh_R','shin_R','foot_R'];
 const order=s.drawOrder as string[];
 return <div style={{position:'absolute',left:x,top:y,width,height:h,transform:flip?'scaleX(-1)':'none',transformOrigin:'center bottom'}}>
  {order.map((layer)=>{
   const file=(s.layers as any)[layer];if(!file)return null;
   let st:React.CSSProperties={position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'fill',transformOrigin:'50% 50%'};
   if(layer==='torso')st={...st,...rotate('pelvis',bodyTilt)};
   if(layer==='head')st={...st,...rotate('head',headTilt)};
   if(layer==='upper_arm_R')st={...st,...rotate('upper_arm_R',upper)};
   if(layer==='forearm_R')st={...st,...rotate('elbow_R',lower)};
   if(layer==='hand_R')st={...st,...rotate('wrist_R',lower*.55)};
   if(layer==='upper_arm_L')st={...st,...rotate('upper_arm_L',action?-upper*.35:upper)};
   if(layer==='forearm_L')st={...st,...rotate('elbow_L',action?-lower*.3:lower)};
   if(layer==='hand_L')st={...st,...rotate('wrist_L',lower*.2)};
   if(layer==='thigh_L')st={...st,...rotate('hip_L',action&&acting==='enter'?lerp(frame,[[0,0],[70,0],[74,-15],[100,12],[125,0],[359,0]]):0)};
   if(layer==='shin_L')st={...st,...rotate('knee_L',action&&acting==='enter'?lerp(frame,[[0,0],[74,0],[85,20],[105,0],[359,0]]):0)};
   if(layer==='pelvis'&&bodyTilt)st={...st,...rotate('pelvis',bodyTilt)};
   if(neutral.includes(layer)&&!['torso','head','pelvis','thigh_L','shin_L'].includes(layer))st={...st};
   return <Img key={layer} src={asset(id,file)} style={st}/>;
  })}
 </div>;
};
