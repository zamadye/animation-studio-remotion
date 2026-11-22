import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {cast} from '../components/characters/cast';
import {CharacterRig} from '../components/characters/CharacterRig';
import {actingPoseAt,emotionAt,shotAt,actingShots} from './ActingTimeline';
import {expressionFor} from './ExpressionMixer';
import {localFromWorld} from './HandTarget';
import {PropAttachment,type PropAttachmentState} from './PropAttachment';
import {SceneGraph} from './SceneGraph';
import {ShotCamera} from './ShotCamera';
import type {CameraShot} from './CameraRig';
import type {ActingPose} from './clips';

export const PROOF_DURATION=360;
const darto=cast['01'].hero,petugas=cast['01'].foil;
const roots={darto:{x:160,y:840},petugas:{x:540,y:760}};const viewScale=1.16*1.04;
const contact={dartoOffer:{x:448,y:1178},clerkReceive:{x:646,y:1178},clerkRead:{x:690,y:1170},desk:{x:430,y:1086},dartoWithdraw:{x:380,y:1290}};
const smooth=(x:number)=>{const u=Math.max(0,Math.min(1,x));return u*u*(3-2*u)};
const keyed=(frame:number,keys:Array<[number,number]>):number=>{if(frame<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){if(frame<=keys[i][0]){const [a,av]=keys[i-1],[b,bv]=keys[i],u=smooth((frame-a)/(b-a));return av+(bv-av)*u;}}return keys[keys.length-1][1];};
const mixPoint=(a:{x:number;y:number},b:{x:number;y:number},t:number)=>({x:a.x+(b.x-a.x)*smooth(t),y:a.y+(b.y-a.y)*smooth(t)});
const dartoRootX=(f:number)=>f<36?keyed(f,[[0,-42],[24,-18],[36,0]]):0;
const dartoHandWorld=(f:number)=>{
 const handRest={x:516,y:1280};
 if(f<40)return handRest;
 if(f<58)return mixPoint(handRest,contact.dartoOffer,(f-40)/18);
 if(f<75)return contact.dartoOffer;
 if(f<228)return null;
 if(f<240)return mixPoint(handRest,contact.dartoOffer,(f-228)/12);
 if(f<258)return mixPoint(contact.dartoOffer,contact.dartoWithdraw,(f-240)/18);
 return contact.dartoWithdraw;
};
const clerkHandWorld=(f:number)=>{
 const handRest={x:614,y:1256};
 if(f<80)return null;
 if(f<100)return mixPoint(handRest,contact.clerkReceive,(f-80)/20);
 if(f<120)return mixPoint(contact.clerkReceive,contact.clerkRead,(f-100)/20);
 if(f<198)return contact.clerkRead;
 if(f<228)return mixPoint(contact.clerkRead,contact.clerkReceive,(f-198)/30);
 return null;
};
const propStateAt=(f:number,dHand:{x:number;y:number}|null,cHand:{x:number;y:number}|null):PropAttachmentState=>{
 if(f<75)return {owner:'Darto',hand:dHand??contact.dartoOffer,desk:contact.desk,rotation:interpolate(f,[0,40,58,75],[-6,-6,0,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),contact:true};
 if(f<100)return {owner:'desk',hand:null,desk:contact.desk,rotation:0,contact:true};
 if(f<120){const from=contact.desk;const to=cHand?{x:cHand.x-154+8,y:cHand.y-104+12}:from;return {owner:'desk',hand:null,desk:mixPoint(from,to,(f-100)/20),rotation:interpolate(f,[100,120],[-2,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),contact:true};}
 if(f<228)return {owner:'Petugas',hand:cHand??contact.clerkRead,desk:contact.desk,rotation:interpolate(f,[120,198,228],[0,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),contact:true};
 if(f<240)return {owner:'desk',hand:null,desk:contact.desk,rotation:0,contact:true};
 return {owner:'Darto',hand:dHand??contact.dartoWithdraw,desk:contact.desk,rotation:interpolate(f,[240,258,300,359],[0,-5,-8,-8],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),contact:true};
};
const InsertHands:React.FC<{dHand:{x:number;y:number}|null;cHand:{x:number;y:number}|null}>=({dHand,cHand})=><svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none'}}>
 {dHand&&<g><path d={`M150 1080 Q${dHand.x-110} 1100 ${dHand.x} ${dHand.y}`} fill="none" stroke="#20262b" strokeWidth="58" strokeLinecap="round"/><path d={`M150 1080 Q${dHand.x-110} 1100 ${dHand.x} ${dHand.y}`} fill="none" stroke={darto.outfit} strokeWidth="44" strokeLinecap="round"/><ellipse cx={dHand.x} cy={dHand.y} rx="25" ry="17" fill={darto.skin} stroke="#20262b" strokeWidth="6"/></g>}
 {cHand&&<g><path d={`M990 1085 Q${cHand.x+105} 1090 ${cHand.x} ${cHand.y}`} fill="none" stroke="#20262b" strokeWidth="58" strokeLinecap="round"/><path d={`M990 1085 Q${cHand.x+105} 1090 ${cHand.x} ${cHand.y}`} fill="none" stroke={petugas.outfit} strokeWidth="44" strokeLinecap="round"/><ellipse cx={cHand.x} cy={cHand.y} rx="25" ry="17" fill={petugas.skin} stroke="#20262b" strokeWidth="6"/><path d={`M${cHand.x-14} ${cHand.y+2}q-5 15 4 20m6-21q-3 16 5 19m5-20q0 14 7 16`} fill="none" stroke="#855d4a" strokeWidth="4" strokeLinecap="round"/></g>}
 </svg>;
const shotCamera=(f:number):CameraShot=>{
 const shot=shotAt(f);
 if(shot.camera==='twoShot')return {framing:'two-shot',move:'track',fromScale:0.94,toScale:0.98,fromX:0,toX:-12,durationFrames:75,focalX:50,focalY:48};
 if(shot.camera==='insert')return {framing:'medium',move:'push-in',fromScale:1.12,toScale:1.18,fromX:0,toX:-8,fromY:0,toY:-12,durationFrames:75,focalX:50,focalY:50};
 if(shot.camera==='clerk')return {framing:'medium',move:'push-in',fromScale:1.52,toScale:1.68,fromX:-230,toX:-255,durationFrames:75,focalX:73,focalY:47};
 if(shot.camera==='darto')return {framing:'close-up',move:'push-in',fromScale:2.02,toScale:2.20,fromX:210,toX:225,fromY:-210,toY:-235,durationFrames:75,focalX:30,focalY:43};
 return {framing:'medium',move:'pull-back',fromScale:1.00,toScale:0.96,fromX:-24,toX:0,durationFrames:60,focalX:50,focalY:48};
};
export const ProofScene:React.FC<{debug?:boolean}>=({debug=false})=>{
 const f=useCurrentFrame(),shot=shotAt(f),camera=shotCamera(f),local=f-shot.start;
 const walk=f<36,phase=2*Math.PI*(f%24)/24,walkFade=walk?1-smooth((f-29)/7):0,rootX=dartoRootX(f);
 const dEmotion=emotionAt('Darto',f),cEmotion=emotionAt('Petugas',f);
 const dPose={...actingPoseAt('Darto',f),...expressionFor(dEmotion),rootX,
  hipLeft:12*Math.sin(phase)*walkFade,hipRight:-12*Math.sin(phase)*walkFade,kneeLeft:16*Math.max(0,-Math.sin(phase))*walkFade,kneeRight:16*Math.max(0,Math.sin(phase))*walkFade,
  torsoLean:keyed(f,[[0,-3],[18,-2],[36,1],[48,6],[58,7],[75,2],[120,2],[150,1],[198,0],[216,-5],[228,-7],[250,-5],[270,7],[295,8],[320,12],[359,12]]),
  headTilt:keyed(f,[[0,-2],[20,-1],[36,1],[58,1],[75,2],[120,2],[150,1],[198,0],[216,-4],[228,-7],[250,-5],[270,5],[295,6],[320,10],[359,10]]),
  gazeX:keyed(f,[[0,5],[36,8],[58,10],[75,2],[120,0],[150,0],[198,0],[216,7],[228,10],[250,8],[270,2],[300,0],[359,0]]),
  gazeY:keyed(f,[[0,0],[75,0],[100,8],[150,10],[198,4],[225,0],[250,0],[300,6],[330,18],[359,18]]),
  rootY:keyed(f,[[0,0],[24,-2*Math.abs(Math.sin(phase))],[36,0],[198,0],[216,-2],[228,2],[250,0],[270,1],[300,0],[330,3],[359,3]])-3*Math.abs(Math.sin(phase))*walkFade,
  armRight:keyed(f,[[0,0],[12,2],[36,5],[48,-12],[58,-20],[75,0],[150,0],[198,0],[216,-5],[228,-8],[240,-2],[258,4],[300,5],[359,3]]),
  elbowRight:keyed(f,[[0,0],[36,0],[48,-6],[58,-12],[75,0],[198,0],[228,-4],[240,0],[258,5],[300,0],[359,0]]),
 };
 const cPose={...actingPoseAt('Petugas',f),...expressionFor(cEmotion),
  headTilt:keyed(f,[[0,0],[80,0],[100,3],[120,8],[150,8],[180,5],[198,3],[216,3],[228,0],[300,0],[359,0]]),
  gazeX:keyed(f,[[0,-5],[80,-5],[100,-2],[120,0],[180,0],[198,-4],[216,-7],[228,-5],[359,-5]]),
  gazeY:keyed(f,[[0,0],[80,0],[100,4],[120,10],[180,10],[198,4],[216,-2],[228,0],[359,0]]),
  torsoLean:keyed(f,[[0,0],[80,0],[100,-2],[120,-4],[180,-4],[198,-3],[216,-1],[228,0],[359,0]]),
  armLeft:keyed(f,[[0,0],[80,0],[100,-10],[120,-18],[180,-18],[198,-18],[216,-14],[228,0],[359,0]]),
  elbowLeft:keyed(f,[[0,0],[80,0],[100,5],[120,10],[180,10],[198,10],[216,12],[228,0],[359,0]]),
 };
 const dWorld=dartoHandWorld(f),cWorld=clerkHandWorld(f);
 const dLocal=dWorld?localFromWorld(dWorld,roots.darto,viewScale,{x:dPose.rootX??0,y:dPose.rootY??0}):undefined;
 const cLocal=cWorld?localFromWorld(cWorld,roots.petugas,viewScale):undefined;
 const prop=propStateAt(f,dWorld,cWorld);
 const debugMode=debug;
 return <AbsoluteFill style={{background:'#e4d8c4',overflow:'hidden'}}>
  <ShotCamera shot={camera} frame={local}>
   <SceneGraph debug={debugMode} foreground={<>
    <div style={{position:'absolute',left:roots.darto.x,top:roots.darto.y,transform:'scale(1.04)',transformOrigin:'bottom left',zIndex:3,display:'block'}}>
     <CharacterRig design={darto} frame={f} fps={30} cue={walk?'walk':f<75?'gesture':f<225?'hold':f<300?'frustrated':'hold'} actingPose={dPose as ActingPose} scale={1.16} gaze={f>=75&&f<198?'down':f>=300?'down':'right'} facing="threeQuarterRight" rightHandTarget={dLocal} showHandTargets={debugMode}/>
    </div>
    <div style={{position:'absolute',inset:0,zIndex:4,pointerEvents:'none'}}><PropAttachment state={prop} debug={debugMode}/></div>
   </>}>
    <div style={{position:'absolute',left:roots.petugas.x,top:roots.petugas.y,transform:'scale(1.04)',transformOrigin:'bottom center',display:'block'}}>
     <CharacterRig design={petugas} frame={f} fps={30} cue={f<198?'hold':f<228?'stern':'hold'} actingPose={cPose as ActingPose} scale={1.16} gaze={f<150?'left':'down'} facing="threeQuarterLeft" leftHandTarget={cLocal} showHandTargets={debugMode}/>
    </div>
   </SceneGraph>
  </ShotCamera>
 </AbsoluteFill>;
};
export {actingShots,shotAt};
