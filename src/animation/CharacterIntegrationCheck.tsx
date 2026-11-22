import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CharacterRig} from '../components/characters/CharacterRig';
import {solveRigArm} from '../components/characters/rigGeometry';
import {cast} from '../components/characters/cast';
/** Deliberately uses the production entry point, not the study renderer. */
export const CharacterIntegrationCheck:React.FC=()=>{
 const frame=useCurrentFrame();
 const stage=Math.floor(frame/30)%6;
 const u=(frame%30)/29,ease=u*u*(3-2*u);
 const lift=stage===0?ease:stage===1?1:stage===2?1-ease:0;
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial',color:'#283138'}}>
  <h1 style={{margin:'20px 40px 4px'}}>INTEGRASI RIG · SEMUA KARAKTER</h1>
  <p style={{margin:'0 40px'}}>Komponen produksi CharacterRig · {stage>=3?'transisi target tangan IK':'transisi bahu dan siku'} · draft QA, bukan episode final</p>
  {Object.entries(cast).flatMap(([ep,pair])=>[pair.hero,pair.foil].map((design,j)=>({design,ep,j}))).map(({design,ep,j},i)=>{const target={x:270,y:275};const ik=solveRigArm(design,target,1);const weight=stage===3?ease:stage===4?1:stage===5?1-ease:0;return <div key={`${ep}-${j}`} style={{position:'absolute',left:40+i%8*235,top:120+Math.floor(i/8)*470,width:220,textAlign:'center'}}>
   <h3 style={{margin:0}}>{design.name}</h3>
   <CharacterRig design={design} frame={frame} fps={30} cue="talk" scale={.6} rightHandTarget={stage===4?target:undefined} actingPose={{headTilt:0,torsoLean:0,armLeft:0,armRight:stage>=3?(ik.shoulder+6)*weight:-74*lift,elbowLeft:0,elbowRight:stage>=3?ik.elbow*weight:-60*lift,hipLeft:0,hipRight:0,kneeLeft:0,kneeRight:0,gazeX:0,gazeY:0,rootX:0,rootY:0,squash:1,expression:'neutral',mouth:Math.floor(frame/5)%2?'open':'rest',blink:frame%60>55}}/>
  </div>;})}
 </AbsoluteFill>;
};
