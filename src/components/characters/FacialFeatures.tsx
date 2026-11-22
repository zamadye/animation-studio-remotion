import React from 'react';
import {clampFace,faceChannels,type FaceState} from '../../animation/faceRig';

/** Face-only geometry. No access to body angles, root transforms or motion clips. */
export const FacialFeatures:React.FC<{face:FaceState;hair:string}>=({face,hair})=>{
 const mouthId=`mouth-${React.useId().replace(/:/g,'')}`;
 const c=faceChannels(face),v=face.viseme??'rest',speaking=v!=='rest',cry=face.emotion==='crying';
 const defaultOpen=face.emotion==='surprised'?12:face.emotion==='afraid'?8:face.emotion==='laughing'?12:cry?8:0;
 const shape={rest:[19,defaultOpen],A:[19,13],E:[25,6],O:[10,13],U:[7,8],MBP:[19,.3],FV:[18,3],L:[17,9]}[v];
 const width=shape[0],opening=shape[1]*(speaking?clampFace(face.openness??1):clampFace(face.intensity??1));
 const smile=c.smile,cy=141,corner=cy-3*smile,upper=cy-opening*.45,lower=cy+opening*.85+smile*3;
 const mouth=`M${180-width} ${corner}Q180 ${upper} ${180+width} ${corner}Q180 ${lower} ${180-width} ${corner}Z`;
 const eyeRy=Math.max(.2,7*c.eye),narrow=c.eye<.2;
 return <g data-rig="face-v1" data-emotion={face.emotion} strokeLinecap="round" strokeLinejoin="round">
  <g opacity={c.blush} fill="#bc6659" stroke="none"><ellipse cx="143" cy="132" rx="12" ry="6"/><ellipse cx="219" cy="132" rx="12" ry="6"/></g>
  <path d={`M139 ${103+c.outer}Q154 ${98+(c.outer+c.inner)/2} 170 ${102+c.inner}M190 ${102+c.inner}Q205 ${98+(c.outer+c.inner)/2} 221 ${103+c.outer}`} fill="none" stroke={hair} strokeWidth="6"/>
  <g transform={`translate(${face.gazeX??0} ${face.gazeY??0})`}>
   {([155,207] as const).map((x,i)=>narrow?<path key={x} d={face.emotion==='laughing'?`M${x-8} 117q8-9 16 0`:cry?`M${x-8} 115l8 4 8-4`:`M${x-7} 116h14`} fill="none" stroke="#302b29" strokeWidth="4"/>:<g key={x}>
    {(face.emotion==='afraid'||face.emotion==='surprised')&&<ellipse cx={x} cy="116" rx="10" ry={eyeRy+3} fill="#f2e7d1" stroke="#493b35" strokeWidth="2"/>}
    <ellipse cx={x} cy="116" rx={face.emotion==='afraid'?4:5} ry={eyeRy} fill="#25282a" stroke="none"/>
    {c.eye>.5&&<circle cx={x+1.5} cy={113-Math.max(0,c.eye-1)*3} r="1.4" fill="#fff3dc" stroke="none"/>}
    {face.emotion==='angry'&&<path d={i===0?'M146 110l17 4':'M199 114l17-4'} stroke="#493b35" strokeWidth="3"/>}
   </g>)}
  </g>
  <path d="M180 115q-8 15 1 17" fill="none" stroke="#754b3d" strokeWidth="4"/>
  {opening<.7?<path d={`M${180-width} 141Q180 ${141+smile*10} ${180+width} 141`} fill="none" stroke="#754b3d" strokeWidth="4"/>:<>
   <defs><clipPath id={mouthId}><path d={mouth}/></clipPath></defs>
   <path d={mouth} fill="#57332f" stroke="#754b3d" strokeWidth="3.5"/>
   <g clipPath={`url(#${mouthId})`} stroke="none">
    {(v==='E'||v==='FV'||face.emotion==='laughing'||face.emotion==='angry')&&<path d={`M150 ${cy-5}h60v${v==='FV'?8:6}h-60Z`} fill="#f5e7ce"/>}
    {(v==='A'||v==='L'||cry||face.emotion==='laughing')&&<ellipse cx="180" cy={v==='L'?cy+2:lower+1} rx={v==='L'?7:12} ry="5" fill="#ca8077"/>}
   </g>
  </>}
  {c.tears>0&&<g opacity={c.tears} stroke="#5e98a7" strokeWidth="1.8" fill="#a4d5dc">
   {[149,213].map((x,i)=>{const t=((face.tearPhase??0)+i*.33)%1,y=123+t*24;return <g key={x}><path d={`M${x} 121q${i?-3:3} 12 0 27`} fill="none" strokeWidth="4" opacity=".75"/><path d={`M${x} ${y-5}q-6 7-4 10 4 5 8 0 2-3-4-10Z`}/></g>;})}
  </g>}
  {face.emotion==='afraid'&&<path d="M228 101q-7 10-3 13 5 4 8-1 2-3-5-12Z" fill="#b1d5d5" stroke="#6496a0" strokeWidth="1.5" opacity={clampFace(face.intensity??1)}/>}
 </g>;
};
