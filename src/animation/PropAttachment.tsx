import React from 'react';
import type {Vec2} from './TwoBoneIK';
export type PropOwner='Darto'|'Petugas'|'desk';
export type PropAttachmentState={owner:PropOwner;hand:Vec2|null;desk:Vec2;rotation:number;contact:boolean};
const W=154,H=104;
export const propTopLeft=(state:PropAttachmentState):Vec2=>{
 if(!state.hand||state.owner==='desk')return state.desk;
 return state.owner==='Darto'?{x:state.hand.x-8,y:state.hand.y-H+12}:{x:state.hand.x-W+8,y:state.hand.y-H+12};
};
export const PropAttachment:React.FC<{state:PropAttachmentState;debug?:boolean}>=({state,debug=false})=>{
 const p=propTopLeft(state);return <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position:'absolute',left:p.x,top:p.y,overflow:'visible',transform:`rotate(${state.rotation}deg)`,transformOrigin:state.owner==='Petugas'?'100% 88%':'0% 88%',filter:'drop-shadow(0 5px 4px rgba(38,31,24,.24))'}}>
  <path d="M12 14H135L142 91H17Z" fill="#d8c28f" stroke="#4b3d31" strokeWidth="5" strokeLinejoin="round"/><path d="M12 14l15-9h58l14 9" fill="#e7d6aa" stroke="#4b3d31" strokeWidth="5" strokeLinejoin="round"/><path d="M36 35h78M36 49h68M36 63h74" stroke="#a18b61" strokeWidth="3.5" strokeLinecap="round"/><path d="M112 14h23l2 20-22-3z" fill="#c5ab76" stroke="#4b3d31" strokeWidth="3"/><path d="M17 88l8 4 3-8" fill="none" stroke="#b64d37" strokeWidth="3"/>
  {state.contact&&<ellipse cx={state.owner==='Petugas'?132:18} cy="83" rx="11" ry="7" fill="#d5a27e" stroke="#4b3d31" strokeWidth="2"/>}
  {debug&&<g fill="none" stroke="#e44" strokeWidth="2"><circle cx="18" cy="83" r="8"/><circle cx="132" cy="83" r="8"/></g>}
 </svg>;
};
