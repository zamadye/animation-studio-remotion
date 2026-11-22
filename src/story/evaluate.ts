import {validateContent} from '../props/types';
import {sampleMotion,idle} from './motions';
import type {ActorDefinition,StorySceneDefinition} from './types';
import type {FaceState} from '../animation/faceRig';
/** One clock; independent body/emotion/speech tracks. Unlisted actors never exist. */
export const evaluateActor=(scene:StorySceneDefinition,actor:ActorDefinition,frame:number)=>{
 const visible=frame>=(actor.enter??0)&&frame<(actor.exit??scene.duration);
 const cue=actor.body.find(c=>frame>=c.start&&frame<c.start+c.duration);
 // Hold the completed approved pose (important for seated posture), never
 // reset to standing merely because a speaking cue ends.
 const prior=[...actor.body].reverse().find(c=>frame>=c.start+c.duration);
 const pose=cue?sampleMotion(cue.motion,frame-cue.start,cue.duration):prior?sampleMotion(prior.motion,prior.duration-1,prior.duration):sampleMotion(idle,0,1);
 const emotion=actor.emotions?.find(c=>frame>=c.start&&frame<c.end);
 const speech=scene.speech.find(c=>c.speaker===actor.id&&frame>=c.start&&frame<c.end);
 const local=speech?frame-speech.start:0;
 const viseme=speech?.visemes.find(c=>local>=c.start&&local<c.end);
 const blinkPhase=frame%103;
 const face:FaceState={emotion:emotion?.emotion??'neutral',intensity:emotion?.intensity??1,viseme:viseme?.viseme??'rest',openness:viseme?.openness??1,blink:blinkPhase>=73&&blinkPhase<=77?Math.sin((blinkPhase-73)/4*Math.PI):0,tearPhase:(frame%scene.fps)/scene.fps};
 return {visible,pose,face,speech,speaking:Boolean(speech),motion:cue?.motion.label??prior?.motion.label??'idle'};
};
export const evaluateScene=(scene:StorySceneDefinition,frame:number)=>scene.actors.map(actor=>({actor,...evaluateActor(scene,actor,frame)})).filter(x=>x.visible);
export const validateStoryScene=(scene:StorySceneDefinition)=>{
 const fail=(message:string):never=>{throw new Error(`${scene.id}: ${message}`);};
 if(!Number.isInteger(scene.fps)||scene.fps<=0||!Number.isInteger(scene.duration)||scene.duration<=0)fail('invalid clock');
 const ids=new Set(scene.actors.map(a=>a.id));if(ids.size!==scene.actors.length)fail('duplicate actor ID');
 for(const actor of scene.actors){
  if(actor.enter!==undefined&&(actor.enter<0||actor.enter>=scene.duration))fail(`invalid entrance: ${actor.id}`);
  if(actor.exit!==undefined&&(actor.exit<=(actor.enter??0)||actor.exit>scene.duration))fail(`invalid exit: ${actor.id}`);
  for(const prop of actor.props??[]){
   validateContent(prop.content);
   if(!Number.isInteger(prop.start)||!Number.isInteger(prop.end)||prop.start<(actor.enter??0)||prop.end>(actor.exit??scene.duration)||prop.end<=prop.start)fail(`invalid held prop interval: ${actor.id}`);
   if(prop.hand!=='left'&&prop.hand!=='right')fail('invalid prop hand');
  }
  const props=actor.props??[];
  if(new Set(props.map(p=>p.content.id)).size!==props.length)fail(`duplicate prop ID: ${actor.id}`);
  for(let i=0;i<props.length;i++)for(let j=i+1;j<props.length;j++)if(props[i].hand===props[j].hand&&props[i].start<props[j].end&&props[j].start<props[i].end)fail(`two props in same hand: ${actor.id}`);
  let emotionEnd=0;for(const c of actor.emotions??[]){if(c.start<emotionEnd||c.end<=c.start||c.end>scene.duration)fail(`invalid emotion intervals: ${actor.id}`);emotionEnd=c.end;}
  let end=0;
  for(const c of actor.body){if(c.start<end||!Number.isInteger(c.start)||!Number.isInteger(c.duration)||c.duration<1||c.motion.index<0||c.motion.index>12||c.start+c.duration>scene.duration)fail(`overlapping/out-of-range body cues: ${actor.id}`);end=c.start+c.duration;}
 }
 for(const c of scene.speech){
  if(!ids.has(c.speaker))fail(`speaker ${c.speaker} is not in scene cast`);
  if(c.start<0||c.end<=c.start||c.end>scene.duration)fail(`invalid speech interval: ${c.id}`);
  const actor=scene.actors.find(a=>a.id===c.speaker)!;
  if(c.start<(actor.enter??0)||c.end>(actor.exit??scene.duration))fail(`speaker absent during speech: ${c.id}`);
  let end=0;for(const v of c.visemes){if(v.start<end||v.end<=v.start||v.end>c.end-c.start)fail(`invalid viseme timing: ${c.id}`);end=v.end;}
 }
 for(let i=0;i<scene.speech.length;i++)for(let j=i+1;j<scene.speech.length;j++){const a=scene.speech[i],b=scene.speech[j];if(a.speaker===b.speaker&&a.start<b.end&&b.start<a.end)fail(`overlapping speech for ${a.speaker}`);}
 return scene;
};
