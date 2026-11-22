import React from 'react';
import {StoryScene} from '../story/StoryScene';
import type {StorySceneDefinition} from '../story/types';
import {WorldStage} from './WorldStage';
import {resolveWorld} from './registry';
/** World and explicit story cast share a 1920x1080 canvas and one frame clock.
 * Actor positions are authored in the story; draft world anchors never move them implicitly. */
export const WorldStoryScene:React.FC<{episodeId:string;location:string;scene:StorySceneDefinition;audio?:boolean;debug?:boolean}>=({episodeId,location,scene,audio=true,debug=false})=>{
 const world=resolveWorld(episodeId,location);
 return <WorldStage episodeId={episodeId} location={location} debug={debug}>
  <StoryScene scene={scene} floorY={world.floorY} audio={audio} debug={debug}/>
 </WorldStage>;
};
