import type {ActorDefinition} from '../story/types';
import type {ActingPose} from '../animation/clips';
import type {HeldProp} from '../props/types';
import {propSize,propTop} from '../props/types';
import {handSocket} from '../props/handSocket';
import {rigGeometry,RIG_SCALE} from '../components/characters/rigGeometry';
export const portraitCamera=(x:number,y:number,zoom:number)=>{
 if(!Number.isFinite(x+y+zoom)||zoom<1)throw new Error('Portrait camera must cover canvas at zoom >= 1');
 return {zoom,x:Math.max(1080-1080*zoom,Math.min(0,540-x*zoom)),y:Math.max(1920-1920*zoom,Math.min(0,900-y*zoom))};
};
/** Focus the actual transformed prop, never replace it with a detached insert. */
export const heldPropCenter=(actor:ActorDefinition,pose:Partial<ActingPose>,prop:HeldProp,floorY:number)=>{
 const h=rigGeometry(actor.design).height,s=actor.scale??1,point=handSocket(actor.design,pose,prop.hand),size=propSize(prop.content);
 const dx=(prop.hand==='left'?-1:1)*size.width*size.scale/2,dy=propTop(prop.content)+size.height*size.scale/2-12;
 const a=(pose.torsoLean??0)*Math.PI/180,rx=dx*Math.cos(a)-dy*Math.sin(a),ry=dx*Math.sin(a)+dy*Math.cos(a);
 const footY=20+RIG_SCALE*(620+h*(568-620));
 return {x:actor.x+s*(point.x+RIG_SCALE*rx),y:floorY-footY*s+s*(point.y+RIG_SCALE*h*ry)};
};
