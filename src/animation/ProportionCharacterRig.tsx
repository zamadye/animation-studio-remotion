import React from 'react';
import {FacialFeatures} from '../components/characters/FacialFeatures';
import {faceFromPose,type FaceState} from './faceRig';
import {ArticulatedArm, type ArmPose} from './ArticulatedArm';
import type {ActingPose} from './clips';
import {rigGeometry,legGeometry,LEG_UPPER,LEG_LOWER} from '../components/characters/rigGeometry';
import type {CharacterDesign} from '../components/characters/cast';

const stroke='#493b35';
export const ProportionCharacterRig:React.FC<{design:CharacterDesign;roleLabel:string;child?:boolean;heightScale?:number;embedded?:boolean;face?:FaceState;pose?:Partial<ActingPose>;arms?:{left?:ArmPose;right?:ArmPose}}>=({design,roleLabel,child=design.child??false,heightScale=design.heightScale??1,embedded=false,face,pose={},arms})=>{
 const seated=Math.max(0,Math.min(1,pose.seated??0));
 const headScale=child?1.25:1;
 const skin=design.skin,shirt=design.outfit,accent=design.accent;
 const {shoulder,waist}=rigGeometry(design);
 const shoulderLeft=180-shoulder/2,shoulderRight=180+shoulder/2,waistLeft=180-waist/2,waistRight=180+waist/2;
 return <svg viewBox="0 -40 360 660" x={embedded?0:undefined} y={embedded?-40:undefined} width={embedded?360:260} height={embedded?660:448} style={{overflow:'visible'}} role="img" aria-label={`${design.name}, ${roleLabel}`}>
  <g transform={`translate(0 620) scale(1 ${child ? .82*heightScale : heightScale}) translate(0 -620)`} stroke={stroke} strokeLinejoin="round" strokeLinecap="round">
   {([-1,1] as const).map(side=>{
    const hip=(side<0?pose.hipLeft:pose.hipRight)??0,knee=(side<0?pose.kneeLeft:pose.kneeRight)??0;
    const {root:{x}}=legGeometry(side,hip,knee,seated);
    const ankle=(side<0?pose.ankleLeft:pose.ankleRight)??(-hip-knee);
    const pants=design.lowerGarmentColor??'#414342';
    const fill=side<0&&seated>0?'#353b3e':pants;
    return <g key={side} data-joint="hip" transform={`rotate(${hip} ${x} 350)`}>
     <path d={`M${x} 350v${LEG_UPPER}`} stroke={stroke} strokeWidth="44"/><path d={`M${x} 350v${LEG_UPPER}`} stroke={fill} strokeWidth="34"/>
     <g data-joint="knee" transform={`rotate(${knee} ${x} ${350+LEG_UPPER})`}>
      <path d={`M${x} ${350+LEG_UPPER-4}v${LEG_LOWER+4}`} stroke={stroke} strokeWidth="34"/><path d={`M${x} ${350+LEG_UPPER-4}v${LEG_LOWER+4}`} stroke={fill} strokeWidth="25"/>
      <circle cx={x} cy={350+LEG_UPPER} r="13" fill={fill} stroke="none"/>
      <g data-joint="ankle" transform={`rotate(${ankle} ${x} 548) translate(${x-141} 0)`}><path d="M137 540q-11 7-15 18-2 8 8 10h60q9-4 4-12l-14-15z" fill="#343b3e" strokeWidth="7"/><path d="M133 565h54" stroke="#87908c" strokeWidth="3"/></g>
     </g>
    </g>;
   })}
   {/* Pelvis overlap conceals hip roots during sit/stand and waist rotations. */}
   <path data-joint="pelvis" d={`M${waistLeft-7} 331Q180 324 ${waistRight+7} 331L${waistRight+9} 361Q180 373 ${waistLeft-9} 361Z`} fill={design.lowerGarmentColor??'#414342'} strokeWidth="6"/>
   {design.lowerGarment==='skirt'&&(()=>{
    const left=legGeometry(-1,pose.hipLeft,pose.kneeLeft,seated).knee;
    const right=legGeometry(1,pose.hipRight,pose.kneeRight,seated).knee;
    return <path d={`M${waistLeft-5} 338L${waistRight+5} 338L${right.x+18} ${right.y+14}Q${(left.x+right.x)/2} ${(left.y+right.y)/2+29} ${left.x-18} ${left.y+14}Z`} fill={shirt} strokeWidth="7"/>;
   })()}
   <g data-joint="waist" transform={`rotate(${pose.torsoLean??0} 180 350)`}>
   {/* Hip-rooted torso with separate upper/lower sleeves and elbow overlap. */}
   <path d={`M${shoulderLeft} 184Q180 166 ${shoulderRight} 184L${waistRight} 338Q180 366 ${waistLeft} 338Z`} fill={shirt} strokeWidth="9"/>
   <ArticulatedArm x={shoulderLeft+12} y={200} side={-1} shirt={shirt} skin={skin} pose={arms?.left}/>
   <ArticulatedArm x={shoulderRight-12} y={200} side={1} shirt={shirt} skin={skin} pose={arms?.right}/>
   {/* Role-specific costume blocks: contrast, badge, batik, courier vest, HT, apron, tie. */}
   {roleLabel==='Humas'&&<><path d="M143 202h74v140h-74z" fill={shirt} stroke="none"/><path d="M147 210l14 10-14 10 14 10-14 10m52-40-14 10 14 10-14 10 14 10" fill="none" stroke={accent} strokeWidth="6"/><path d="M173 194v92" stroke="#d5c497" strokeWidth="5"/><rect x="165" y="288" width="28" height="42" rx="3" fill="#e4d5b1" strokeWidth="4"/></>}
   {roleLabel==='Pak Beni'&&<><path d="M136 200h88l-14 132h-60z" fill="#896b49" strokeWidth="5"/><path d="M145 212l35 44 35-44" fill="none" stroke={accent} strokeWidth="8"/><path d="M225 222q45 8 52 67l-35 14-20-45" fill="#71583f" strokeWidth="6"/></>}
   {roleLabel==='Koordinator'&&<><path d="M143 202h74l-10 130h-54z" fill="#456452" strokeWidth="5"/><rect x="184" y="254" width="25" height="36" rx="3" fill="#ddc675" strokeWidth="4"/><rect x="139" y="222" width="20" height="36" rx="4" fill="#303d3e" strokeWidth="4"/><path d="M146 229h9m-9 6h9" stroke="#d4c58f" strokeWidth="3"/></>}
   {design.apron&&<><path d="M151 214h58l14 127h-86z" fill="#d59b55" strokeWidth="6"/><path d="M158 272h47v31h-47z" fill="#a96e53" strokeWidth="4"/><rect x="190" y="222" width="18" height="24" fill="#efe3c9" strokeWidth="3"/></>}
   {roleLabel==='Manajer'&&<><path d="M164 196l16 19 16-19-5 52-11 16-11-16z" fill="#f1e3c6" strokeWidth="4"/><path d="M180 238l13 18-13 40-13-40z" fill="#9b5549" strokeWidth="4"/><path d="M207 210v106" stroke={accent} strokeWidth="4"/><rect x="199" y="300" width="20" height="30" fill="#e9dfc6" strokeWidth="3"/></>}
   {roleLabel==='Ayah'&&<><path d="M145 203l35 32 35-32-10 27-25 24-25-24z" fill="#ede3cf" strokeWidth="4"/><path d="M180 235v91" stroke={accent} strokeWidth="5"/></>}
   {roleLabel==='Rika'&&<><rect x="155" y="281" width="50" height="43" rx="4" fill="#d8c28f" strokeWidth="4"/><path d="M160 290h40m-40 8h40" stroke="#806b4d" strokeWidth="3"/><rect x="184" y="214" width="21" height="25" fill="#f2e7ce" strokeWidth="3"/></>}
   {roleLabel==='HR'&&<><path d="M153 200l27 24 27-24" fill="none" stroke="#eee0c2" strokeWidth="8"/><path d="M180 220v110" stroke={accent} strokeWidth="5"/></>}
   {roleLabel==='Influencer'&&<><path d="M180 204l25 27-25 27-25-27z" fill={accent} strokeWidth="4"/><rect x="195" y="292" width="27" height="34" fill="#d7c9ad" strokeWidth="4"/></>}
   {roleLabel==='Nina'&&<path d="M145 228l35 32 35-32" fill="none" stroke={accent} strokeWidth="6"/>}
   {roleLabel==='Bendahara'&&<><path d="M150 203l30 26 30-26" fill="none" stroke="#e9dfc6" strokeWidth="7"/><rect x="193" y="292" width="28" height="36" fill="#d8c28f" strokeWidth="4"/></>}
   {roleLabel==='Mira'&&<><path d="M142 216h76v120h-76z" fill={shirt} stroke="none"/><path d="M152 231h56v8h-56zM152 251h35v7h-35z" fill={accent} stroke="none"/></>}
   {roleLabel==='Pria'&&<><path d="M145 209l35 25 35-25" fill="none" stroke={accent} strokeWidth="6"/><path d="M145 286h28v39h-28z" fill="#527b7e" strokeWidth="4"/></>}
   {/* Neck (15 units) tucks under collar; head size/body differences scale only after joint alignment. */}
   <path d="M160 157v31q20 13 40 0v-31z" fill={skin} strokeWidth="6"/>
   <g data-joint="neck" transform={`rotate(${pose.headTilt??0} 180 178) translate(180 100) scale(${headScale}) translate(-180 -100)`}>
    <path d="M180 42Q231 42 237 88Q243 127 218 151Q200 165 180 165Q160 165 142 151Q117 127 123 88Q129 42 180 42Z" fill={skin} strokeWidth="8"/>
    {design.hairShape==='bun'&&<circle cx="225" cy="54" r="27" fill={design.hair} strokeWidth="7"/>}
    {design.hairShape==='curly'&&<g fill={design.hair} strokeWidth="6"><circle cx="140" cy="63" r="22"/><circle cx="168" cy="44" r="25"/><circle cx="198" cy="43" r="24"/><circle cx="224" cy="64" r="21"/></g>}
    {design.hairShape==='cap'?<><path d="M124 92Q120 34 180 32Q238 36 238 91Q204 73 124 92Z" fill={design.hair} strokeWidth="8"/><path d="M123 87q62-20 119 0v16q-58-17-117 2z" fill={accent} strokeWidth="4"/></>:design.hairShape!=='curly'&&<path d="M123 98Q117 34 179 31Q237 34 239 91L228 105Q210 78 184 78Q151 79 130 108Z" fill={design.hair} strokeWidth="8"/>}
    <FacialFeatures face={face??faceFromPose(pose)} hair={design.hair}/>
    {design.glasses&&<g fill="none" stroke="#383f42" strokeWidth="5"><rect x="136" y="101" width="36" height="29" rx="8"/><rect x="189" y="101" width="36" height="29" rx="8"/><path d="M172 110h17"/></g>}
   </g>
   </g>
  </g>
 </svg>;
};
