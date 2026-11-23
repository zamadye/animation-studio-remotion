import React from 'react';
import {Kontrakan} from '../../world/Kontrakan';
export type SetName='home'|'street'|'office'|'table'|'kitchen';
export const PartOneWorld:React.FC<{set:SetName;night?:boolean}>=({set,night=false})=>{
 if(set==='home')return <><Kontrakan/>{night&&<div style={{position:'absolute',inset:0,background:'#23374b55',pointerEvents:'none'}}/>}</>;
 return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
 <defs><pattern id="wallgrain" width="43" height="37" patternUnits="userSpaceOnUse"><path d="M4 9h5m20 18h6" stroke="#927f64" opacity=".13" strokeWidth="2"/></pattern><linearGradient id="sky" x2="0" y2="1"><stop stopColor={night?'#253d50':'#9dbeb8'}/><stop offset="1" stopColor={night?'#ba8a68':'#e9d9b0'}/></linearGradient></defs>
 <rect width="1080" height="1920" fill={set==='street'?'url(#sky)':'#e1d3b7'}/><rect width="1080" height="1920" fill="url(#wallgrain)"/>
 {set==='street'?<>
 <circle cx={night?830:220} cy="360" r="85" fill={night?'#e9cf9c':'#f7e1a2'}/>
 <path d="M0 690h220V560h180v230h260V610h230v150h190v700H0Z" fill="#6d827e" opacity=".6"/>
 <path d="M0 960h350v590H0Zm650-80h430v670H650Z" fill="#b39d7e" stroke="#736e5a" strokeWidth="12"/>
 <path d="M0 960l170-190 200 190M620 890l230-190 230 190" fill="#8a6352" stroke="#64594c" strokeWidth="16"/>
 {[40,190,710,880].map(x=><g key={x}><rect x={x} y="1050" width="100" height="170" fill="#a9bbb0" stroke="#72674f" strokeWidth="10"/><path d={`M${x+50} 1055v160`} stroke="#72674f" strokeWidth="7"/></g>)}
 <path d="M0 1520h1080v400H0" fill="#777e75"/><path d="M0 1510h1080" stroke="#d6c5a4" strokeWidth="40"/><path d="M-200 1840h350m180 0h350m180 0h350" stroke="#e0d4b0" strokeWidth="13"/>
 <path d="M560 300v1210m0-1100h200" stroke="#5d685e" strokeWidth="18"/><path d="M730 390h90v40h-90Z" fill="#bca879"/>
 </>:<>
 <rect y="1390" width="1080" height="530" fill="#b6a184"/><path d="M0 1390h1080" stroke="#8d795f" strokeWidth="15"/>
 {[1470,1600,1730,1860].map(y=><path key={y} d={`M0 ${y}h1080`} stroke="#9d896b" strokeWidth="3"/>)}
 <rect x="80" y="400" width="490" height="530" fill="#9db7ae" stroke="#797860" strokeWidth="20"/><path d="M90 740h470M320 400v520" stroke="#797860" strokeWidth="12"/>
 {set==='office'?<>
 <rect x="690" y="620" width="300" height="710" fill="#8c9782" stroke="#68715e" strokeWidth="12"/>{[780,960,1140].map(y=><g key={y}><path d={`M705 ${y}h270`} stroke="#68715e" strokeWidth="8"/><path d={`M825 ${y+60}h60`} stroke="#dfcba1" strokeWidth="10"/></g>)}

 </>:<>
 <rect x="720" y="430" width="250" height="330" fill="#99a48a" stroke="#66775f" strokeWidth="12"/><path d="M845 440v310" stroke="#66775f" strokeWidth="8"/><path d="M810 565v55m65-55v55" stroke="#decba7" strokeWidth="9"/>
 <rect x="690" y="1030" width="390" height="400" fill="#97a18b" stroke="#67725e" strokeWidth="12"/><path d="M680 1020h400" stroke="#b49470" strokeWidth="40"/>
 <path d="M770 1010v-80q0-80 70-80v60" stroke="#5c736d" strokeWidth="13" fill="none"/>
 <ellipse cx="958" cy="990" rx="70" ry="23" fill="#58665d"/><path d="M893 930h130v60H893Z" fill="#abb4a1" stroke="#5c6b60" strokeWidth="6"/>
 <rect x="590" y="600" width="100" height="150" fill="#fff3d3" stroke="#9c8a68" strokeWidth="5"/><path d="M590 625h100" stroke="#a56550" strokeWidth="24"/><text x="640" y="715" textAnchor="middle" fill="#716149" fontSize="64">1</text>
 </>}
 </>}
 </svg>;
};
export const TableForeground:React.FC=()=> <svg width="1080" height="1920" style={{position:'absolute',inset:0,pointerEvents:'none'}}><g transform="translate(0 190)"><path d="M40 1580v340m960-340v340" stroke="#79634a" strokeWidth="28"/><path d="M10 1505h1060v95H10Z" fill="#b48d64" stroke="#795f45" strokeWidth="12"/><path d="M30 1530h1020" stroke="#cfad80" strokeWidth="5"/><ellipse cx="850" cy="1500" rx="70" ry="14" fill="#e7dfc5"/><path d="M807 1438h85v58h-85Z" fill="#eee6cc" stroke="#7c7c65" strokeWidth="5"/><path d="M895 1448q45-5 18 34h-18" stroke="#7c7c65" strokeWidth="8" fill="none"/></g></svg>;

/** Practical workstation, not a detached UI card. All art stays in the scene camera. */
export const WorkDesk:React.FC<{frame:number;duration:number}>=({frame,duration})=>{
 const rows=Math.min(4,1+Math.floor(frame/Math.max(1,duration)*4));
 return <svg data-workstation="raka" width="1080" height="1920" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
  <path d="M60 1660v260m940-260v260" stroke="#75604a" strokeWidth="27"/>
  <path d="M30 1610h960v65H30Z" fill="#b48d64" stroke="#795f45" strokeWidth="10"/>
  <path d="M50 1628h920" stroke="#d3af7d" strokeWidth="4"/>
  <g transform="translate(650 1200)">
   <path d="M120 300v90m-85 8h170" fill="none" stroke="#4e5d57" strokeWidth="18"/>
   <rect width="350" height="300" rx="13" fill="#46564f" stroke="#36423e" strokeWidth="8"/>
   <rect x="17" y="20" width="316" height="254" rx="3" fill="#e9eddf"/>
   <path d="M17 20h316v49H17Z" fill="#467b69"/>
   <text x="33" y="52" fontFamily="Arial" fontSize="19" fill="#fff">REKAP KERJA</text>
   <path d="M32 90h285M32 127h285M32 164h285M32 201h285M32 238h285M190 90v148M270 90v148" stroke="#b6c4b1" strokeWidth="2"/>
   {[0,1,2,3].map(i=><g key={i}><path d={`M44 ${110+i*37}h${90-i*9}`} stroke="#81958a" strokeWidth="6"/>{i<rows&&<path d={`M284 ${107+i*37}l8 8 13-16`} fill="none" stroke="#43775e" strokeWidth="5"/>}</g>)}
   <circle cx="175" cy="287" r="4" fill="#c3d39a"/>
  </g>
  <path d="M670 1584h265l30 25H655Z" fill="#728178" stroke="#465b50" strokeWidth="4"/>
  {[0,1,2].map(i=><path key={i} d={`M${673-i*4} ${1590+i*7}h265`} stroke="#b1bbab" strokeWidth="2"/>)}
  <g transform="translate(70 1570)"><path d="M0 0h170v25H0Z" fill="#eee8d6" stroke="#8d8874" strokeWidth="4"/><path d="M15-10h150v20H15Z" fill="#fff8e7" stroke="#8d8874" strokeWidth="3"/><path d="M30-3h90m-90 6h70" stroke="#a7ad99" strokeWidth="3"/></g>
 </svg>;
};
