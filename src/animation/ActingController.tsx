import React from 'react';
import {sampleActingClip,type ActingPose} from './clips';
import {expressionControls} from './ExpressionController';
export const ActingController:React.FC<{clip:string;frame:number;onPose:(pose:ActingPose)=>React.ReactNode}>=({clip,frame,onPose})=>{
 const pose=sampleActingClip(clip,frame);const face=expressionControls(pose.expression,pose.mouth,pose.gazeX,pose.gazeY);
 return <>{onPose({...pose,...face})}</>;
};
