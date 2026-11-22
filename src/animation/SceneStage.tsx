import React from 'react';
import {useCurrentFrame} from 'remotion';
export const SceneStage:React.FC<{location?:'service-office';children:React.ReactNode;foreground?:React.ReactNode;debug?:boolean}> = ({location='service-office',children,foreground,debug=false})=>{
 const frame=useCurrentFrame();const cloudX=(frame*0.16)%80;
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#d9e2dc'}}>
  <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
   <defs><linearGradient id="office-wall" x2="0" y2="1"><stop stopColor="#e6ddcd"/><stop offset=".76" stopColor="#d8c9b0"/><stop offset=".761" stopColor="#9c7958"/><stop offset="1" stopColor="#785b43"/></linearGradient><linearGradient id="window-sky" x2="0" y2="1"><stop stopColor="#aac7c4"/><stop offset="1" stopColor="#e4d7b8"/></linearGradient></defs>
   <rect width="1080" height="1920" fill="url(#office-wall)"/>
   <rect x="52" y="250" width="360" height="490" rx="4" fill="#86694e"/><rect x="74" y="272" width="316" height="446" fill="url(#window-sky)"/>
   <g opacity=".7" transform={`translate(${cloudX} 0)`}><ellipse cx="135" cy="390" rx="95" ry="28" fill="#fff7e5"/><ellipse cx="510" cy="480" rx="120" ry="32" fill="#fff7e5"/></g>
   <path d="M74 560h316M232 272v446" stroke="#a5805c" strokeWidth="18"/>
   <rect x="690" y="300" width="300" height="410" rx="8" fill="#a77d51"/><rect x="720" y="330" width="240" height="340" fill="#d9cfb8"/><path d="M755 390h170M755 435h132M755 510h170M755 555h135" stroke="#988873" strokeWidth="9"/>
   {/* Human-scale office details: pinned queue notices, a clock, fan, plant and counter tools. */}
   <rect x="448" y="320" width="190" height="250" rx="8" fill="#806145"/><rect x="460" y="332" width="166" height="226" fill="#b28d61"/>
   <g stroke="#70563c" strokeWidth="3"><rect x="475" y="352" width="54" height="68" fill="#efe2c4"/><rect x="547" y="352" width="62" height="68" fill="#c7d4c3"/><rect x="475" y="435" width="54" height="68" fill="#d7c69f"/><rect x="547" y="435" width="62" height="68" fill="#eadfc9"/></g>
   <g stroke="#988873" strokeWidth="4"><path d="M484 372h36M484 385h30M556 372h43M556 385h34M484 455h36M556 455h43"/></g>
   <circle cx="554" cy="238" r="48" fill="#f1e6d1" stroke="#71543b" strokeWidth="9"/><path d="M554 238v-29m0 29 23 14" stroke="#71543b" strokeWidth="6" strokeLinecap="round"/><circle cx="554" cy="238" r="5" fill="#b64d37"/>
   <g transform="translate(510 106)"><circle cx="0" cy="0" r="13" fill="#806145"/><path d="M0 0V-54M0 0 48-24M0 0-46-26M0 0 43 29M0 0-42 33" stroke="#806145" strokeWidth="13" strokeLinecap="round"/><path d="M-8 9h16l-3 39h-10z" fill="#9a7650"/></g>
   <g transform="translate(924 842)"><path d="M-53 0h106l-13 106h-80z" fill="#bd7957" stroke="#78553e" strokeWidth="7"/><path d="M0 0V-120M0-75q-52-39-60-5 21 27 60 18M0-46q50-48 63-13-17 31-63 24M0-104q27-48 48-26-4 29-48 43" fill="#66836a" stroke="#49634d" strokeWidth="7" strokeLinejoin="round"/></g>
   <rect x="0" y="1190" width="1080" height="22" fill="#6d503b"/><path d="M0 1212h1080v88H0z" fill="#a27e5b"/>
   <path d="M110 1153l124-19 43 25-125 21z" fill="#eadbb8" stroke="#70543b" strokeWidth="5"/><path d="M120 1147l122-19 122 21-123 21z" fill="#d8c69d" stroke="#70543b" strokeWidth="4"/>
   <rect x="839" y="1126" width="68" height="35" rx="6" fill="#b64d37" stroke="#604331" strokeWidth="5"/><path d="M850 1126v-26h45v26" fill="#75604a" stroke="#604331" strokeWidth="5"/><rect x="859" y="1108" width="28" height="10" fill="#d7c39b"/>
   <path d="M70 1280v150M1010 1280v150" stroke="#775a41" strokeWidth="30"/>
   <rect x="0" y="1428" width="1080" height="492" fill="#76593f" opacity=".28"/>
   {/* foreground edge gives the characters a shared physical floor plane */}
   <path d="M0 1460h1080" stroke="#594936" strokeWidth="12" opacity=".35"/>
  </svg>
  {children}
  <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
   {/* Foreground desk plane: hides legs and anchors hands/props on the public side. */}
   <path d="M0 1190H1080V1428H0Z" fill="#9c7858"/><path d="M0 1190H1080V1210H0Z" fill="#5c4433"/><path d="M0 1210H1080" stroke="#c29a69" strokeWidth="7"/>
   <path d="M72 1238H512V1400H72ZM568 1238H1008V1400H568Z" fill="#987451" stroke="#76563c" strokeWidth="8"/>
   <path d="M96 1260H488M592 1260H984" stroke="#b28a60" strokeWidth="5"/><circle cx="540" cy="1305" r="11" fill="#d2b47b" stroke="#6c523a" strokeWidth="5"/>
   {debug&&<g stroke="#e44" strokeWidth="3" fill="none"><path d="M70 1190h940M70 1428h940"/><text x="80" y="1250" fill="#e44" fontSize="22">DESK OCCLUSION · FRONT PLANE</text></g>}
  </svg>
  {foreground}
 </div>;
};
