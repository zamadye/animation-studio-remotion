import React from 'react';
import {AbsoluteFill,Audio,Sequence,useCurrentFrame,staticFile} from 'remotion';
import {StoryScene} from '../../story/StoryScene';
import {evaluateActor} from '../../story/evaluate';
import {Kontrakan} from '../../world/Kontrakan';
import {portraitCamera,heldPropCenter} from '../../camera/PortraitCamera';
import {buildGajianScene,gajianTimeline} from './scene';
const smooth=(f:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(f-a)/(b-a)));return t*t*(3-2*t);};
export const GajianShot:React.FC<{index:number}>=({index})=>{
 const frame=useCurrentFrame(),t=gajianTimeline.scenes[index],scene=buildGajianScene(index,frame);
 const line=t.lines.find(l=>frame>=l.start&&frame<l.end),floorY=1660;
 const wide={x:540,y:1200,zoom:1.2};let cam=portraitCamera(wide.x,wide.y,wide.zoom);
 // Physically zoom the same whole scene toward the actual prop socket.
 const focusStart=index===0?48:index===2?48:Infinity;
 const focusEnd=index===0?t.lines[3].start-12:index===2?t.lines[2].end:Infinity;
 if(frame>=focusStart&&frame<focusEnd&&index!==1){
  const actor=scene.actors[index===2?1:0],prop=actor.props![0],pose=evaluateActor(scene,actor,frame).pose;
  const point=heldPropCenter(actor,pose,prop,floorY);
  const amount=smooth(frame,focusStart,focusStart+30)*(1-smooth(frame,focusEnd-24,focusEnd));
  const zoom=wide.zoom+(index===2?7.3:8.3)*amount;
  cam=portraitCamera(wide.x+(point.x-wide.x)*amount,wide.y+(point.y-wide.y)*amount,zoom);
 }else if(line&&frame>focusEnd+8){
  const target=line.speaker==='raka'?330:795;
  cam=portraitCamera(target,index===0?1250:1320,1.8);
 }
 return <AbsoluteFill style={{background:'#d9c8a8',overflow:'hidden'}}>
  <div data-camera="continuous-world" style={{position:'absolute',width:1080,height:1920,transformOrigin:'0 0',transform:`translate(${cam.x}px,${cam.y}px) scale(${cam.zoom})`}}>
   <Kontrakan/>
   <StoryScene scene={scene} floorY={floorY} audio={false}/>
  </div>
  {line&&<div style={{position:'absolute',left:44,right:44,bottom:132,textAlign:'center',fontFamily:'Arial',fontSize:38,lineHeight:1.25,fontWeight:600,color:'#fffaf0',padding:'14px 22px',borderRadius:12,background:'#182f2cdb',textShadow:'0 2px 3px #0006'}}>{line.text}</div>}
 </AbsoluteFill>;
};
export const GajianEpisode:React.FC=()=> <AbsoluteFill style={{background:'#d9c8a8'}}>
 {gajianTimeline.scenes.map((scene,index)=><Sequence key={scene.id} from={scene.start} durationInFrames={scene.duration}><GajianShot index={index}/><Audio src={staticFile(scene.audio)}/></Sequence>)}
 </AbsoluteFill>;
