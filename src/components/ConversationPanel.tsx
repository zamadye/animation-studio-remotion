import React from 'react';
import type {Shot} from '../data/types';
import type {DialogueBeat} from '../data/timeline';
import {tokens as t} from '../design/tokens';
import {progressAt} from '../motion/primitives';
export const ConversationPanel:React.FC<{shot:Shot;beat:DialogueBeat;frame:number;scale:number;reducedMotion?:boolean}>=({shot,beat,frame,scale,reducedMotion=false})=>{
 const width=300*scale;const height=410*scale;const reveal=progressAt(frame,{startFrame:beat.startFrame,durationFrames:8,easing:'easeOut',reducedMotion});
 return <div style={{position:'absolute',left:'50%',top:'50%',width,height,transform:'translate(-50%,-50%)',border:`${5*scale}px solid #283239`,borderRadius:24*scale,background:'#f7f3e9',boxShadow:`8px 12px 0 rgba(32,38,43,.18)`,padding:13*scale,boxSizing:'border-box',overflow:'hidden'}}>
  <div style={{height:24*scale,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #d8cdbd',font:`700 ${10*scale}px ui-monospace,monospace`,color:'#536563'}}><span>● ● ●</span><span>MESSAGE / FICTION</span></div>
  <div style={{font:`700 ${10*scale}px ui-monospace,monospace`,color:'#77756e',textAlign:'center',margin:`${12*scale}px 0`}}>{shot.location.toUpperCase()}</div>
  <div style={{opacity:reveal,transform:`translateY(${(1-reveal)*7*scale}px)`,display:'flex',justifyContent:beat.index%2?'flex-end':'flex-start'}}><div style={{maxWidth:'94%',background:beat.index%2?'#d9e2d9':'#fffdf8',border:`1px solid ${t.color.line}`,borderRadius:10*scale,padding:`10px ${11*scale}px`,fontSize:Math.max(16,19*scale),lineHeight:1.25,color:t.color.ink,overflowWrap:'anywhere'}}><b style={{display:'block',font:`700 ${9*scale}px ui-monospace,monospace`,color:t.color.teal,marginBottom:5*scale}}>{beat.speaker||'DIALOG'}</b>{beat.text}</div></div>
  <div style={{position:'absolute',bottom:9*scale,left:13*scale,right:13*scale,display:'flex',gap:5*scale,alignItems:'center'}}><span style={{width:6*scale,height:6*scale,borderRadius:'50%',background:t.color.rust}}/><div style={{height:2*scale,flex:1,background:t.color.line}}/><span style={{font:`${8*scale}px ui-monospace,monospace`,color:t.color.muted}}>{String(beat.index+1).padStart(2,'0')} / {String(beat.count).padStart(2,'0')} · NOT VO SYNC</span></div>
 </div>;
};
