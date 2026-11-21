import React from 'react';
import type {CharacterDesign} from './cast';

export type ActingCue='neutral'|'talk'|'concern'|'surprise'|'gesture'|'hold'|'frustrated'|'relief'|'stern'|'delight'|'walk'|'walkTalk';
export type Viseme='rest'|'open'|'wide'|'round'|'closed';
const line=(stroke:string,width:number=18)=>({stroke,strokeWidth:width,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,fill:'none'});
export const CharacterRig:React.FC<{design:CharacterDesign;frame:number;fps:number;cue:ActingCue;scale?:number;gaze?:'left'|'right'|'center';reducedMotion?:boolean;}> = ({design,frame,fps,cue,scale=1,gaze='center',reducedMotion=false})=>{
 const tick=reducedMotion?0:frame;const t=tick/fps;const blink=!reducedMotion&&(tick%103>72&&tick%103<76);const walking=(cue==='walk'||cue==='walkTalk')&&!reducedMotion;
 const viseme:Viseme=cue==='surprise'?'round':cue==='concern'||cue==='stern'?'closed':cue==='delight'?'wide':(cue==='talk'||cue==='walkTalk')?(['closed','open','round','wide'] as Viseme[])[Math.floor(tick/4)%4]:'rest';
 const smooth=(x:number)=>{const u=Math.max(0,Math.min(1,x));return u*u*(3-2*u)};
 const gestureArm=tick<=4?-6*smooth(tick/4):tick<=12?-6+24*smooth((tick-4)/8):tick<=24?18*(1-smooth((tick-12)/12)):0;
 const gaitPose=Math.floor(tick/3)%8;const leftLegAngle=[0,-10,-18,-8,0,10,18,8][gaitPose];const rightLegAngle=[18,8,0,-8,-18,-8,0,8][gaitPose];
 const bob=reducedMotion||cue==='hold'||(tick>24&&!walking)?0:walking?[0,2,5,2,0,2,5,2][gaitPose]:cue==='gesture'?Math.sin(Math.PI*Math.min(1,tick/24))*2.2:cue==='talk'?Math.sin(Math.PI*Math.min(1,tick/18))*1.2:0;
 const armLift=reducedMotion?0:walking?Math.sin((gaitPose/8)*Math.PI*2)*10:cue==='gesture'?gestureArm:cue==='concern'?8:0;
 const elbowBend=reducedMotion?0:walking?8:cue==='gesture'?Math.max(0,Math.min(18,armLift*.55)):cue==='concern'?5:0;
 const headTilt=reducedMotion?0:cue==='concern'?4:cue==='surprise'?-3:cue==='gesture'?1:0;
 const gazeX=gaze==='left'?-5:gaze==='right'?5:0;
 const mouthByViseme:Record<Viseme,string>={rest:'M161 233 Q180 245 199 233',open:'M162 232 Q180 260 198 232',wide:'M157 233 Q180 251 203 233',round:'M173 230 Q180 252 187 230',closed:'M159 239 Q180 226 201 239'};
 const mouth=mouthByViseme[viseme];
 const brow=cue==='concern'||cue==='relief'?'M121 160 Q140 169 158 157 M202 157 Q220 169 239 160':cue==='frustrated'||cue==='stern'?'M121 154 Q140 164 158 165 M202 165 Q220 164 239 154':'M121 159 Q140 149 158 158 M202 158 Q220 149 239 159';
 const hairShape=design.hairShape;
 return <svg aria-label={`${design.name}, character rig`} viewBox="0 0 360 540" width={360*scale} height={540*scale} style={{overflow:'visible',filter:'drop-shadow(0 8px 2px rgba(32,38,43,.12))'}}>
  <ellipse cx="180" cy="511" rx="95" ry="13" fill="#20262b" opacity=".14"/>
  <g transform={`translate(0 ${bob})`} stroke="#20262b" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round">
   {/* legs: hips stay fixed for paper-cutout acting */}
   <g transform={`rotate(${walking?leftLegAngle:0} 152 405)`}><path d="M143 405 L135 488 Q134 501 122 505 L170 505 Q178 500 174 489 L184 414" fill={design.outfit}/><path d="M123 505 Q144 497 170 505 L170 516 L119 516Z" fill="#343b3e"/></g>
   <g transform={`rotate(${walking?rightLegAngle:0} 208 405)`}><path d="M184 414 L189 488 Q190 500 181 505 L231 505 Q237 500 227 489 L226 405" fill={design.outfit}/><path d="M181 505 Q205 497 231 505 L237 516 L181 516Z" fill="#343b3e"/></g>
   {/* torso and optional apron */}
   <path d="M122 281 Q180 256 238 281 L260 409 Q218 435 101 409Z" fill={design.outfit}/>
   {design.apron&&<path d="M143 298 L218 298 L230 411 L130 411Z" fill={design.accent} strokeWidth="7"/>}
   <g transform={`rotate(${-armLift} 122 300)`}><path d="M119 296 Q88 307 78 355" {...line(design.outfit,30)}/><g transform={`rotate(${elbowBend} 78 355)`}><path d="M78 355 L62 396" {...line(design.outfit,25)}/><path d="M62 396 Q56 405 65 411 L83 401" {...line(design.skin,18)}/></g></g>
   <g transform={`rotate(${armLift} 238 300)`}><path d="M241 296 Q272 310 280 354" {...line(design.outfit,30)}/><g transform={`rotate(${-elbowBend} 280 354)`}><path d="M280 354 L296 389" {...line(design.outfit,25)}/><path d="M296 389 Q302 398 292 405 L277 395" {...line(design.skin,18)}/></g></g>
   {/* neck */}<path d="M158 255 L158 282 Q180 299 202 282 L202 254" fill={design.skin}/>
   {/* Head pivot at the neck; position is fixed so eye-line remains stable. */}<g transform={`rotate(${headTilt} 180 270)`}>
   <ellipse cx="82" cy="180" rx="15" ry="24" fill={design.skin}/><ellipse cx="278" cy="180" rx="15" ry="24" fill={design.skin}/>
   <ellipse cx="180" cy="175" rx="99" ry="112" fill={design.skin}/>
   {/* hair silhouettes vary by character role */}
   {hairShape==='hijab'?<><path d="M83 175 Q72 64 177 57 Q279 62 278 177 L264 267 Q239 247 226 218 L216 119 Q178 91 140 121 L126 224 Q111 248 90 265Z" fill={design.accent}/><path d="M121 112 Q178 74 236 112" fill="none" stroke={design.outfit} strokeWidth="14"/></>:hairShape==='cap'?<><path d="M83 140 Q90 60 180 60 Q262 63 278 144 Q238 118 191 123 Q134 120 83 140Z" fill={design.hair}/><path d="M85 142 Q181 118 279 140 L270 159 Q183 139 91 160Z" fill={design.accent}/></>:hairShape==='bun'?<><circle cx="238" cy="79" r="38" fill={design.hair}/><path d="M82 158 Q82 64 178 61 Q258 62 278 145 L253 129 Q221 106 197 117 L179 105 Q144 123 117 157 L106 191Z" fill={design.hair}/></>:hairShape==='curly'?<><circle cx="100" cy="108" r="30" fill={design.hair}/><circle cx="143" cy="74" r="34" fill={design.hair}/><circle cx="188" cy="65" r="34" fill={design.hair}/><circle cx="231" cy="83" r="35" fill={design.hair}/><circle cx="263" cy="119" r="28" fill={design.hair}/></>:<path d="M81 163 Q70 69 171 59 Q255 57 279 135 L264 161 Q247 130 217 125 Q179 116 147 138 Q117 149 94 185Z" fill={design.hair}/>}
   {/* eyes and brow */}
   <path d={brow} {...line(design.hair,8)}/>
   <g transform={`translate(${gazeX} 0)`}>{blink?<path d="M125 184 Q141 191 157 184 M204 184 Q221 191 237 184" {...line('#25282a',7)}/>:<><ellipse cx="142" cy="184" rx="8" ry="12" fill="#25282a" stroke="none"/><ellipse cx="220" cy="184" rx="8" ry="12" fill="#25282a" stroke="none"/><circle cx="145" cy="180" r="2.5" fill="white" stroke="none"/><circle cx="223" cy="180" r="2.5" fill="white" stroke="none"/></>}</g>
   <path d="M179 182 Q168 205 180 208" {...line('#855d4a',5)}/><path d={mouth} {...line('#613e38',7)}/>
   {design.glasses&&<g fill="none" stroke="#333b3e" strokeWidth="6"><rect x="119" y="166" width="46" height="35" rx="10"/><rect x="198" y="166" width="46" height="35" rx="10"/><path d="M165 179 L198 179"/></g>}
   </g>
   {/* costume detail */}<path d="M180 297 L180 411 M147 316 L166 333" fill="none" stroke={design.accent} strokeWidth="7"/>
   <circle cx="202" cy="319" r="5" fill={design.accent} stroke="none"/>
  </g>
 </svg>;
};
