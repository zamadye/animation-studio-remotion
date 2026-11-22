import React from 'react';
import type {Vec2} from './TwoBoneIK';
export type HandTargetSpec={id:string;position:Vec2;owner:'Darto'|'Petugas'|'desk';contactFrame:number};
export const localFromWorld=(world:Vec2,root:Vec2,scale:number,rootOffset:Vec2={x:0,y:0}):Vec2=>({x:(world.x-root.x)/scale-rootOffset.x,y:(world.y-root.y)/scale-rootOffset.y});
export const HandTargetDebug:React.FC<{target:Vec2;label:string;color?:string;visible?:boolean}>=({target,label,color='#ed5146',visible=false})=>visible?<g pointerEvents="none"><circle cx={target.x} cy={target.y} r="12" fill="none" stroke={color} strokeWidth="4"/><path d={`M${target.x-18} ${target.y}h36M${target.x} ${target.y-18}v36`} stroke={color} strokeWidth="3"/><text x={target.x+16} y={target.y-12} fontSize="17" fontWeight="bold" fill={color}>{label}</text></g>:null;
