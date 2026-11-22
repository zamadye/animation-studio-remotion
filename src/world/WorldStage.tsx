import React from 'react';
import {WorldArt} from './WorldArt';
import {resolveWorld} from './registry';
/** Use in a 1920×1080 story canvas so art, floor and actor coordinates agree.
 * Other aspect ratios need an explicit camera/crop and matching actor mapping. */
export const WorldStage:React.FC<{episodeId:string;location:string;debug?:boolean;children?:React.ReactNode}>=({episodeId,location,debug=false,children})=>{
 const world=resolveWorld(episodeId,location);
 return <div data-world-id={world.id} style={{position:'absolute',inset:0,isolation:'isolate',overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0,zIndex:0}}><WorldArt world={world} layer="background"/></div>
  <div style={{position:'absolute',inset:0,zIndex:1}}>{children}</div>
  <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none'}}><WorldArt world={world} layer="foreground" debug={debug}/></div>
 </div>;
};
