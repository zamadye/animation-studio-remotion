import {HeldProps} from '../props/HeldProps';
import React from 'react';
import {CharacterRig} from '../components/characters/CharacterRig';
import {RIG_SCALE,rigGeometry} from '../components/characters/rigGeometry';
import {evaluateActor} from './evaluate';
import type {ActorDefinition,StorySceneDefinition} from './types';
export const StoryActor:React.FC<{scene:StorySceneDefinition;actor:ActorDefinition;frame:number;floorY:number;debug?:boolean}>=({scene,actor,frame,floorY,debug=false})=>{
 const state=evaluateActor(scene,actor,frame);if(!state.visible)return null;
 const scale=actor.scale??1,footY=20+RIG_SCALE*(620+rigGeometry(actor.design).height*(568-620));
 return <div data-story-actor={actor.id} style={{position:'absolute',left:actor.x,top:floorY-footY*scale}}>
  <CharacterRig design={actor.design} frame={frame} fps={scene.fps} cue="hold" scale={scale} actingPose={state.pose} face={state.face} showSeat/>
  {actor.props&&<HeldProps design={actor.design} pose={state.pose} items={actor.props} frame={frame} scale={scale}/>}
  {debug&&<div style={{position:'absolute',left:20,top:-50,fontSize:19,color:state.speaking?'#a84633':'#456452',fontWeight:700}}>{actor.design.name} · {state.speaking?'BICARA':'DIAM'}<br/><span style={{fontSize:14}}>{state.motion} · {state.face.emotion} · {state.face.viseme}</span></div>}
 </div>;
};
