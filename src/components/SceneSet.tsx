import React from 'react';
import {tokens as t} from '../design/tokens';
const palettes:Record<string,{wall:string;floor:string;window:string;detail:string}>= {
 '01':{wall:'#e8dfcf',floor:'#bd9f7b',window:'#9cb6b2',detail:'#a57e57'},'02':{wall:'#e3e7e0',floor:'#a4aca5',window:'#a5c1bd',detail:'#596d72'},'03':{wall:'#dddcd1',floor:'#8c9d92',window:'#a5c4ba',detail:'#4c807a'},'04':{wall:'#e5d9c7',floor:'#b59773',window:'#a9c0b4',detail:'#976e52'},'05':{wall:'#c7d4cb',floor:'#81999a',window:'#8bb7b1',detail:'#5e7e79'},'06':{wall:'#e6dcca',floor:'#ad9478',window:'#a9bcae',detail:'#7b7462'},'07':{wall:'#d8ddd5',floor:'#99886f',window:'#a3b9ae',detail:'#796f56'},'08':{wall:'#e4dfd0',floor:'#9a8d78',window:'#aac3b5',detail:'#637875'},
};
export const SceneSet:React.FC<{episodeId:string;location:string;wide?:boolean;focusBlur?:number}> = ({episodeId,location,wide=false,focusBlur=0})=>{
 const p=palettes[episodeId]??palettes['01']; const lower=location.toLowerCase(); const outside=/jalan|halte|jembatan|selokan|malam|teras|pinggir/.test(lower);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:p.wall,filter:focusBlur>0?`blur(${focusBlur}px)`:'none'}}>
  <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg,${p.wall} 0%,${p.wall} 70%,${p.floor} 70%,${p.floor} 100%)`}}/>
  {/* stable set geometry; re-used in all scenes for visual continuity */}
  <div style={{position:'absolute',left:'7%',top:'13%',width:'22%',height:'34%',border:`${wide?5:3}px solid ${p.detail}`,background:outside?`linear-gradient(180deg,${p.window},#d7c9a8)`:p.window,borderRadius:2}}>
    <div style={{position:'absolute',left:'50%',top:0,bottom:0,borderLeft:`${wide?4:2}px solid ${p.detail}`}}/><div style={{position:'absolute',top:'50%',left:0,right:0,borderTop:`${wide?4:2}px solid ${p.detail}`}}/>
  </div>
  <div style={{position:'absolute',right:'8%',top:'23%',width:'21%',height:'32%',background:p.detail,opacity:.82,borderRadius:'3px 3px 0 0'}}/>
  <div style={{position:'absolute',left:'4%',right:'4%',top:'69%',height:'2px',background:'rgba(32,38,43,.16)'}}/>
  <div style={{position:'absolute',right:'10%',top:'15%',fontFamily:'monospace',fontSize:'clamp(9px,1.1vw,16px)',letterSpacing:'.12em',color:'rgba(32,38,43,.48)',textTransform:'uppercase'}}>{location}</div>
  <div style={{position:'absolute',inset:0,opacity:.12,backgroundImage:'linear-gradient(90deg,transparent 49.8%,#343b3e 50%,transparent 50.2%)',backgroundSize:'96px 100%'}}/>
 </div>;
};
