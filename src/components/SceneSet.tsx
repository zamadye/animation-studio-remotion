import React from 'react';
import {tokens as t} from '../design/tokens';
const palettes:Record<string,{wall:string;floor:string;window:string;detail:string}>= {
 '01':{wall:'#e8dfcf',floor:'#bd9f7b',window:'#9cb6b2',detail:'#a57e57'},'02':{wall:'#e3e7e0',floor:'#a4aca5',window:'#a5c1bd',detail:'#596d72'},'03':{wall:'#dddcd1',floor:'#8c9d92',window:'#a5c4ba',detail:'#4c807a'},'04':{wall:'#e5d9c7',floor:'#b59773',window:'#a9c0b4',detail:'#976e52'},'05':{wall:'#c7d4cb',floor:'#81999a',window:'#8bb7b1',detail:'#5e7e79'},'06':{wall:'#e6dcca',floor:'#ad9478',window:'#a9bcae',detail:'#7b7462'},'07':{wall:'#d8ddd5',floor:'#99886f',window:'#a3b9ae',detail:'#796f56'},'08':{wall:'#e4dfd0',floor:'#9a8d78',window:'#aac3b5',detail:'#637875'},
};
export const SceneSet:React.FC<{episodeId:string;location:string;wide?:boolean;focusBlur?:number;frame?:number}> = ({episodeId,location,wide=false,focusBlur=0,frame=0})=>{
 const p=palettes[episodeId]??palettes['01']; const lower=location.toLowerCase(); const outside=/jalan|halte|jembatan|selokan|malam|teras|pinggir/.test(lower);const office=/kantor|meja petugas/.test(lower);const pan=((frame%900)/900)*18-9;
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:p.wall,filter:focusBlur>0?`blur(${focusBlur}px)`:'none'}}>
  <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg,${p.wall} 0%,${p.wall} 70%,${p.floor} 70%,${p.floor} 100%)`}}/>
  {/* Full-bleed multi-plane world: moving sky/trees outside; civic-office fixtures inside. */}
  {outside?<>
   <div style={{position:'absolute',left:`${12+pan*.35}%`,top:'12%',width:'45%',height:'27%',background:p.window,opacity:.9,clipPath:'polygon(8% 12%,92% 12%,100% 100%,0 100%)'}}/>
   <div style={{position:'absolute',left:`${23+pan}%`,top:'9%',width:'13%',height:'22%',borderRadius:'50%',background:'#e5c985',opacity:.7}}/>
   <div style={{position:'absolute',right:`${10-pan*.5}%`,top:'35%',width:'50%',height:'34%',background:p.detail,clipPath:'polygon(0 20%,20% 0,100% 0,100% 100%,0 100%)',opacity:.65}}/>
   {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:`${4+i*11+pan*.7}%`,top:`${39+i%2*5}%`,width:'13%',height:'31%',background:'#667e68',opacity:.78,clipPath:'polygon(50% 0,100% 45%,82% 45%,100% 75%,72% 75%,85% 100%,15% 100%,28% 75%,0 75%,18% 45%,0 45%)'}}/>)}
   <div style={{position:'absolute',inset:'70% 0 0',background:'linear-gradient(180deg,#887c68,#71685a)'}}/>
   <div style={{position:'absolute',left:'-10%',right:'-10%',top:'84%',height:4,borderTop:'5px dashed #e6d9b8',transform:`translateX(${pan*3}px)`}}/>
  </>:<>
   <div style={{position:'absolute',left:'7%',top:'13%',width:'22%',height:'34%',border:`${wide?5:3}px solid ${p.detail}`,background:p.window,borderRadius:2}}>
    <div style={{position:'absolute',left:'50%',top:0,bottom:0,borderLeft:`${wide?4:2}px solid ${p.detail}`}}/><div style={{position:'absolute',top:'50%',left:0,right:0,borderTop:`${wide?4:2}px solid ${p.detail}`}}/>
    <div style={{position:'absolute',left:`${12+pan}%`,top:'28%',width:'24%',height:'18%',borderRadius:'50%',background:'#fff6d9'}}/>
   </div>
   <div style={{position:'absolute',right:'8%',top:'23%',width:'21%',height:'32%',background:p.detail,opacity:.82,borderRadius:'3px 3px 0 0'}}/>
   {office?<>
    <div style={{position:'absolute',left:'7%',right:'6%',top:'61%',height:'5%',background:'#795a43',boxShadow:'0 10px 0 rgba(55,43,34,.14)'}}/>
    <div style={{position:'absolute',left:'10%',top:'66%',width:'3%',height:'12%',background:'#795a43'}}/><div style={{position:'absolute',right:'11%',top:'66%',width:'3%',height:'12%',background:'#795a43'}}/>
    <div style={{position:'absolute',right:'9%',top:'31%',width:'18%',height:'23%',background:'#d2c4a6',border:'4px solid #755f48'}}/>
   </>:<>
    <div style={{position:'absolute',left:'18%',top:'56%',width:'64%',height:'4%',background:'#785d45'}}/>
    <div style={{position:'absolute',left:'23%',top:'60%',width:'3%',height:'11%',background:'#785d45'}}/><div style={{position:'absolute',right:'23%',top:'60%',width:'3%',height:'11%',background:'#785d45'}}/>
   </>}
   <div style={{position:'absolute',left:'4%',right:'4%',top:'69%',height:'2px',background:'rgba(32,38,43,.16)'}}/>
  </>}
  <div style={{position:'absolute',left:'0',right:'0',top:'72%',height:'28%',background:`linear-gradient(180deg,${p.floor},${p.floor})`,opacity:.52}}/>
  <div style={{position:'absolute',right:'10%',top:'15%',fontFamily:'monospace',fontSize:'clamp(9px,1.1vw,16px)',letterSpacing:'.12em',color:'rgba(32,38,43,.48)',textTransform:'uppercase'}}>{location}</div>
  <div style={{position:'absolute',inset:0,opacity:.12,backgroundImage:'linear-gradient(90deg,transparent 49.8%,#343b3e 50%,transparent 50.2%)',backgroundSize:'96px 100%'}}/>
 </div>;
};
