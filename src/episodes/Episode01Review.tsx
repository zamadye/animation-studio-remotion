import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {WorldStoryScene} from '../world/WorldStoryScene';
import {PropArt} from '../props/PropArt';
import {propSize,type HeldContent} from '../props/types';
import {episodeLines,episodeScenes,shotTimes,shotLocations,shotLabels,application,rejection,receipt,call,savings} from './episode01';
const Motorcycle:React.FC=()=> <svg width="580" height="290" viewBox="0 0 580 290" style={{position:'absolute',left:420,top:660}} aria-label="Motor tua milik Darto"><g stroke="#493b35" strokeWidth="12" strokeLinejoin="round"><circle cx="100" cy="205" r="60" fill="#353f42"/><circle cx="455" cy="205" r="60" fill="#353f42"/><circle cx="100" cy="205" r="27" fill="#a7aaa1"/><circle cx="455" cy="205" r="27" fill="#a7aaa1"/><path d="M100 205l87-121h130l138 121H290l-103-121m130 0-27 121" fill="none"/><path d="M149 85h170l40 47H170Z" fill="#668475"/><ellipse cx="270" cy="174" rx="47" ry="33" fill="#7f8b85"/><circle cx="414" cy="73" r="18" fill="#eedeb0"/><path d="M150 70h160" strokeWidth="25"/><path d="M455 205l-69-157h-52m61 8h40" fill="none"/><path d="M25 148h110m252-8h118" fill="none"/></g></svg>;
const insertFor=(i:number,t:number):HeldContent|null=>i===0&&t>8.4?application:i===1&&t>3.4&&t<10.8?rejection:i===2&&t>7.4?receipt:i===3&&t>10.4&&t<15.2?savings:i===5&&t>1&&t<8.5?call:null;
export const Episode01Review:React.FC<{portrait?:boolean}>=({portrait=false})=>{
 const f=useCurrentFrame(),i=Math.min(5,shotTimes.findIndex((s,j)=>j<6&&f>=s&&f<shotTimes[j+1]));
 const index=Math.max(0,i),local=f-shotTimes[index],seconds=local/24;
 const line=episodeLines.find(l=>f>=l.start&&f<l.end),scene=episodeScenes[index],baseInsert=insertFor(index,seconds);
 const insert=baseInsert?.id===call.id&&f<1822?{...call,messages:call.messages.slice(0,1)}:baseInsert;
 const W=portrait?1080:1920,H=portrait?1920:1080;
 const speaker=line?.speaker;const focusX=speaker==='PETUGAS'?1295:speaker==='DARTO'?(index===2||index===5?950:615):960;
 const zoom=portrait?(line&&['DARTO','PETUGAS'].includes(speaker??'')?1.35:.96):(line&&index!==2&&index!==5?1.12:1);
 const canvasTop=portrait?170:0;
 const x=W/2-focusX*zoom,y=canvasTop+(portrait?80:0)-(portrait?200:0)*(zoom-1);
 const label=speaker==='ANAK (telepon)'?'Anak · melalui telepon':speaker==='PEMBELI'?'Pembeli · dari luar layar':speaker==='PENGERAS SUARA'?'Pengeras suara':speaker==='DARTO'?'Darto':'Petugas';
 const insertScale=insert?(insert.kind==='phone'?(portrait?1.7:1.22):(portrait?1.29:1.0)):1;
 const dims=insert?propSize(insert):null;
 return <AbsoluteFill style={{background:'#e8dfcb',color:'#293e36',fontFamily:'Arial',overflow:'hidden'}}>
  <div style={{position:'absolute',width:1920,height:1080,left:x,top:y,transform:`scale(${zoom})`,transformOrigin:'0 0'}}>
   <Sequence from={shotTimes[index]} durationInFrames={scene.duration} layout="none"><WorldStoryScene episodeId="01" location={shotLocations[index]} scene={scene} audio={false}/></Sequence>
   {index===2&&<Motorcycle/>}
  </div>
  {insert&&dims&&<AbsoluteFill style={{background:'radial-gradient(ellipse at center,#bbc7b5,#61766b)',alignItems:'center',justifyContent:'center'}}>
   <div style={{width:dims.width*insertScale,height:dims.height*insertScale,marginTop:portrait?-40:-80}}><div style={{transform:`scale(${insertScale})`,transformOrigin:'0 0'}}><PropArt content={insert}/></div></div>
   {index===1&&<div style={{position:'absolute',right:portrait?65:330,top:portrait?1160:620,color:'#a54e3b',border:'7px solid #a54e3b',padding:'12px 20px',fontWeight:900,fontSize:portrait?42:50,transform:'rotate(-12deg)',background:'#fff7e7dd'}}>DITUNDA</div>}
  </AbsoluteFill>}
  <div style={{position:'absolute',top:portrait?65:26,left:portrait?55:35,right:portrait?55:35,display:'flex',justifyContent:'space-between',alignItems:'start',gap:30}}>
   <div><div style={{fontSize:portrait?23:18,letterSpacing:3,fontWeight:700}}>SATIR KEHIDUPAN · EPISODE 01</div><div style={{fontSize:portrait?43:29,fontWeight:900,marginTop:10}}>Orang Miskin Dilarang Miskin</div></div>
   {!portrait&&<div style={{fontSize:16,background:'#f9f0dce8',padding:'9px 14px',borderRadius:6}}>VERSI REVIEW · VO SEMENTARA</div>}
  </div>
  <div style={{position:'absolute',left:portrait?55:35,top:portrait?230:122,fontSize:portrait?27:19,background:'#f4ecd9e6',padding:'9px 16px',borderRadius:6}}>{String(index+1).padStart(2,'0')} / {shotLabels[index]}</div>
  {line&&<div style={{position:'absolute',left:portrait?45:260,right:portrait?45:260,bottom:portrait?190:42,padding:portrait?'25px 30px':'17px 30px',background:'#243d36f2',borderRadius:12,color:'#fff7e5',fontSize:portrait?39:30,lineHeight:1.28,textAlign:'center'}}><div style={{color:'#e1c58d',fontWeight:700,fontSize:portrait?28:22,marginBottom:9}}>{label}</div>{line.text.replace(/^\.\.\./,'…')}</div>}
  {f>84*24&&!line&&<div style={{position:'absolute',left:portrait?70:480,right:portrait?70:480,top:portrait?850:390,padding:40,textAlign:'center',fontSize:portrait?50:46,lineHeight:1.3,fontWeight:800,background:'#f6eddbed',borderRadius:12}}>“Tidak ada warga<br/>yang tertinggal.”</div>}
  <div style={{position:'absolute',bottom:portrait?62:10,left:30,right:30,textAlign:'center',fontSize:portrait?21:15,color:'#576457'}}>Fiksi satir · bukan gambaran prosedur resmi{portrait?' · Versi review':''}</div>
  {episodeLines.map(l=><Sequence key={l.id} from={l.start} durationInFrames={l.end-l.start} layout="none"><Audio src={staticFile(l.audio)}/></Sequence>)}
  <Audio src={staticFile('audio/ep01-roomtone-synthetic.wav')} volume={.15}/>
 </AbsoluteFill>;
};
