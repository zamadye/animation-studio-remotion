import {characterRegistry,type CharacterId} from '../components/characters/registry';
import type {FaceEmotion} from '../animation/faceRig';
import type {HeldContent,HeldProp} from '../props/types';
import {validateContent} from '../props/types';
import type {Motion} from './motions';
import type {ActorDefinition,BodyCue} from './types';
/** Small authoring helpers; no implicit cast, hidden animation, or global render state. */
export const perform=(motion:Motion,start:number,duration:number):BodyCue=>({motion,start,duration});
export const hold=(content:HeldContent,hand:'left'|'right',start:number,end:number):HeldProp=>({content:validateContent(content),hand,start,end});
export const character=({id,x,scale=1,duration,motions=[],expression='neutral',props=[]}:{id:CharacterId;x:number;scale?:number;duration:number;motions?:readonly BodyCue[];expression?:FaceEmotion;props?:readonly HeldProp[]}):ActorDefinition=>({id,design:characterRegistry[id],x,scale,body:motions,emotions:[{start:0,end:duration,emotion:expression}],props});
