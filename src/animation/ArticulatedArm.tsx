import React from 'react';
import {ARM_UPPER,ARM_LOWER} from '../components/characters/rigGeometry';

export type ArmPose = {shoulder: number; elbow: number; wrist?: number};
/** Angles in degrees, measured from hanging down. Local transforms preserve
 * shoulder → elbow → wrist parenting and fixed segment lengths. */
export const ArticulatedArm: React.FC<{
 x:number; y:number; side:-1|1; shirt:string; skin:string; pose?:ArmPose;
}> = ({x,y,side,shirt,skin,pose={shoulder:side* -6,elbow:0}}) => (
 <g data-joint="shoulder" transform={`translate(${x} ${y}) rotate(${pose.shoulder})`}>
  <path d={`M0 0V${ARM_UPPER}`} fill="none" stroke="#493b35" strokeWidth="36"/>
  <path d={`M0 0V${ARM_UPPER}`} fill="none" stroke={shirt} strokeWidth="25"/>
  <g data-joint="elbow" transform={`translate(0 ${ARM_UPPER}) rotate(${pose.elbow})`}>
   <path d={`M0 -3V${ARM_LOWER-1}`} fill="none" stroke="#493b35" strokeWidth="30"/>
   <path d={`M0 -3V${ARM_LOWER-1}`} fill="none" stroke={shirt} strokeWidth="20"/>
   <circle r="12" fill={shirt} stroke="none"/>
   <path d={`M-9 ${ARM_LOWER-8}H9`} stroke="#493b35" strokeWidth="3"/>
   <g data-joint="wrist" transform={`translate(0 ${ARM_LOWER}) rotate(${pose.wrist??0}) scale(${side} 1)`}>
    <path d="M-9 -2L8 -2Q13 2 13 11L12 23Q10 30 2 30Q-8 29-10 22L-13 10Q-14 5-10 4L-7 9" fill={skin} stroke="#493b35" strokeWidth="4"/>
   </g>
  </g>
 </g>
);
