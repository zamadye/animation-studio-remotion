import React from 'react';
import {Audio,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import type {StorySceneDefinition} from './types';
import {validateStoryScene} from './evaluate';
import {StoryActor} from './StoryActor';
/** Cast membership controls rendering, not the full design registry/catalog. */
export const StoryScene:React.FC<{scene:StorySceneDefinition;floorY:number;debug?:boolean;audio?:boolean;children?:React.ReactNode}>=({scene,floorY,debug=false,audio=true,children})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 React.useMemo(()=>validateStoryScene(scene),[scene]);
 if(fps!==scene.fps)throw new Error(`${scene.id}: scene fps ${scene.fps} differs from composition fps ${fps}`);
 return <>{children}{scene.actors.map(actor=><StoryActor key={actor.id} actor={actor} scene={scene} frame={frame} floorY={floorY} debug={debug}/>)}
  {audio&&scene.speech.filter(c=>c.audio).map(c=><Sequence key={c.id} from={c.start} durationInFrames={c.end-c.start} layout="none"><Audio src={staticFile(c.audio!)}/></Sequence>)}
 </>;
};
