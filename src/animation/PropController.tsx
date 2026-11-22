import React from 'react';
export const PropController:React.FC<{kind:'folder'|'none';frame:number;handed?:boolean}>=({kind,frame,handed=false})=>{
 if(kind==='none')return null;const anticipation=Math.max(0,Math.min(1,frame/12));const turn=handed?Math.sin(frame/12)*2:-4+4*anticipation;const lift=handed?Math.sin(frame/10)*5:0;
 return <svg viewBox="0 0 220 170" width="220" height="170" style={{position:'absolute',left:'42%',top:'55%',overflow:'visible',transform:`translateY(${-lift}px) rotate(${turn}deg)`,filter:'drop-shadow(0 18px 10px rgba(38,31,24,.22))'}}>
  <path d="M21 30L142 9 198 30 79 52Z" fill="#e5d3a5" stroke="#4b3d31" strokeWidth="7" strokeLinejoin="round"/><path d="M21 30v98l58 24V52Z" fill="#c9ae78" stroke="#4b3d31" strokeWidth="7"/><path d="M79 52l119-22v98l-119 24Z" fill="#d9c28e" stroke="#4b3d31" strokeWidth="7"/><path d="M102 72l71-13M100 91l58-10" stroke="#9b875e" strokeWidth="5" strokeLinecap="round"/>
  <path d="M176 38q13 8 10 21" fill="none" stroke="#b64d37" strokeWidth="7" strokeLinecap="round"/>
 </svg>;
};
