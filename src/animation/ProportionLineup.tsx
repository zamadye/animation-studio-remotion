import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cast} from '../components/characters/cast';
import {ProportionCharacterRig} from './ProportionCharacterRig';

const people=Object.entries(cast).filter(([ep])=>ep!=='01').flatMap(([ep,pair])=>(['hero','foil'] as const).map(side=>({ep,side,name:pair[side].name})));
export const ProportionLineup:React.FC<{page?:number;rigStudy?:boolean}>=({page=0,rigStudy=false})=>{
 const items=people.slice(page*7,page*7+7);
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial,sans-serif',color:'#283138',overflow:'hidden'}}>
  <div style={{position:'absolute',left:42,top:24,fontSize:31,fontWeight:900}}>{rigStudy?'UJI RIG KARAKTER':'LINEUP PROPORSI BARU'} · {page+1}/2</div>
  <div style={{position:'absolute',left:44,top:62,fontSize:15,color:'#706452'}}>{rigStudy?'Bahu → siku → pergelangan · 3 pose statis per karakter · belum uji gerak kontinu':'Base pria diterapkan ke tokoh episode lain · dewasa 3,8 kepala · Dini 3 kepala'}</div>
  {items.map((item,i)=>{
    const design=cast[item.ep][item.side];
   const left=12+(i%2)*540,top=96+Math.floor(i/2)*450;
   return <React.Fragment key={item.name}>
    <div style={{position:'absolute',left:left+12,top:top+10,width:516,height:428,background:'#f2eadc',border:'4px solid #765a42',borderRadius:18,boxSizing:'border-box'}}/>
    <div style={{position:'absolute',left:left+30,top:top+24,fontSize:25,fontWeight:800}}>{item.name}</div>
    <div style={{position:'absolute',left:left+30,top:top+54,fontSize:15,color:'#71634f'}}>{design.role}</div>
    {rigStudy ? [
     {label:'Rileks',left:{shoulder:6,elbow:0},right:{shoulder:-6,elbow:0}},
     {label:'Siku 85°',left:{shoulder:12,elbow:85},right:{shoulder:-12,elbow:-85}},
     {label:'Angkat',left:{shoulder:6,elbow:0},right:{shoulder:-80,elbow:-60}},
    ].map((pose,j)=><React.Fragment key={pose.label}>
     <div style={{position:'absolute',left:left+25+j*166,top:top+92,transform:'scale(.56)',transformOrigin:'top left'}}><ProportionCharacterRig design={design} roleLabel={item.name} child={design.child} heightScale={design.heightScale} arms={pose}/></div>
     <div style={{position:'absolute',left:left+25+j*166,top:top+382,width:156,textAlign:'center',fontSize:16}}>{pose.label}</div>
    </React.Fragment>) : <div style={{position:'absolute',left:left+145,top:top+76,transform:'scale(.67)',transformOrigin:'top left'}}><ProportionCharacterRig design={design} roleLabel={item.name} child={design.child} heightScale={design.heightScale}/></div>}
   </React.Fragment>;
  })}
 </AbsoluteFill>;
};
