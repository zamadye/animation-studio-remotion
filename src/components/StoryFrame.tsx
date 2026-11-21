import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Episode, Shot, AspectRatio, TemplateId} from '../data/types';
import {tokens as t} from '../design/tokens';
import {fadeAt, slideYAt, progressAt} from '../motion/primitives';
import {resolveSceneActors,isChildRole} from '../data/actors';
import {CharacterRig} from './characters/CharacterRig';
import type {ActingCue} from './characters/CharacterRig';
import {SceneSet} from './SceneSet';
import {SceneProp} from './SceneProp';
import {ConversationPanel} from './ConversationPanel';
import {dialogueBeatAt} from '../data/timeline';

const getShot=(episode:Episode,sec:number)=>episode.shots.find((s)=>sec>=s.startSeconds&&sec<s.endSeconds)??episode.shots[episode.shots.length-1];
const toTime=(sec:number)=>`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(Math.floor(sec%60)).padStart(2,'0')}`;
const speakerMatches=(speaker:string,name:string)=>{const s=speaker.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();const n=name.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();return Boolean(s&&n&&(s===n||s.includes(n)||n.split(' ').some(part=>part.length>3&&s.includes(part))));};
const emotionFor=(shot:Shot):ActingCue=>{
 const words=`${shot.objective} ${shot.dialogue} ${shot.animation} ${shot.camera}`.toLowerCase();
 if(/walk cycle|tracking samping|berjalan/.test(words))return 'walk';
 if(shot.number===6||/maaf|kehilangan|kosong|lapar|takut|sedih|bingung|terlambat/.test(words))return 'concern';
 if(/lega|berhasil|terima kasih|syukurlah|membantu/.test(words))return 'relief';
 if(/marah|kesal|memprotes|menuntut|menolak|aturan tetap/.test(words))return 'frustrated';
 if(/kaget|terjebak|ditunda|hilang/.test(words))return 'surprise';
 if(/meminta|menyerahkan|mengangkat|membawa|menunjuk|menarik|menawarkan|membuka|menekan|berjalan/.test(words))return 'gesture';
 return 'talk';
};
const safeTemplate=(id:TemplateId|undefined):TemplateId=>id==='CARTOON-EVIDENCE-INSERT'||id==='CARTOON-MESSAGE-POV'?id:'CARTOON-STAGE-DIALOGUE';
export const StoryFrame:React.FC<{episode:Episode;ratio:AspectRatio;reducedMotion?:boolean}>=({episode,ratio,reducedMotion=false})=>{
 const frame=useCurrentFrame();const {fps,width,height}=useVideoConfig();const sec=frame/fps;const shot=getShot(episode,sec);const localFrame=frame-shot.startSeconds*fps;
 const vertical=ratio==='vertical';const referenceWidth=ratio==='landscape'?1920:1080;const unit=width/referenceWidth;const safe=t.safe[ratio];const pad=Math.round(width*safe.x);const titleSize=Math.round((vertical?62:ratio==='square'?54:72)*unit);const beat=dialogueBeatAt(shot,localFrame,fps);
 const sceneActors=resolveSceneActors(episode,shot);const variant=safeTemplate(shot.templateId);const actionCue=emotionFor(shot);const firstSpeaking=speakerMatches(beat.speaker,sceneActors.first.name);const secondSpeaking=speakerMatches(beat.speaker,sceneActors.second.name);const mainCue:ActingCue=reducedMotion?'neutral':actionCue==='walk'?(firstSpeaking?'walkTalk':'walk'):firstSpeaking?'talk':actionCue;const secondaryCue:ActingCue=reducedMotion?'neutral':actionCue==='walk'?(secondSpeaking?'walkTalk':'walk'):secondSpeaking?'talk':shot.number===6?'hold':'neutral';
 const enter=fadeAt(frame,{startFrame:shot.startSeconds*fps,durationFrames:12,easing:'easeOut',reducedMotion});const translate=slideYAt(frame,{startFrame:shot.startSeconds*fps,durationFrames:12,easing:'easeOut',reducedMotion},18*unit);
 const sceneTop=0;const sceneHeight=1;
 const roleScale=variant==='CARTOON-MESSAGE-POV'?(vertical?.34:ratio==='square'?.30:.42):variant==='CARTOON-EVIDENCE-INSERT'?(vertical?.42:ratio==='square'?.36:.44):(vertical?.56:ratio==='square'?.48:.56);const actorTop=vertical?'31%':ratio==='square'?'30%':'28%';const shotLeft=shot.number===3?`${8+24*Math.min(1,localFrame/(14*fps))}%`:['8%','1%','20%','7%','2%','16%'][shot.number-1];const shotRight=['8%','1%','20%','7%','2%','16%'][shot.number-1];
 const firstScale=roleScale*(isChildRole(sceneActors.first)?0.82:1);const secondScale=roleScale*(isChildRole(sceneActors.second)?0.82:1);
 const dialogue=beat.speaker?`${beat.speaker}: ${beat.text}`:beat.text;const captionSize=Math.max(18,Math.min(29*unit,2800/Math.max(60,dialogue.length)));
 const sceneHeadingTop=height*(vertical?.17:ratio==='square'?.155:.19);const captionTop=height*(vertical?.735:ratio==='square'?.755:.755);
 const progress=Math.min(100,Math.max(0,sec/90*100));const footerBottom=height*safe.bottom;
 const cameraText=shot.camera.toLowerCase();const cameraPush=/push-in|snap zoom|punch-in/.test(cameraText);const cameraPull=/pull-back|pull back/.test(cameraText);const cameraPhase=progressAt(localFrame,{startFrame:0,durationFrames:/snap zoom/.test(cameraText)?12:36,easing:'easeInOut',reducedMotion});const cameraSettle=progressAt(localFrame,{startFrame:0,durationFrames:12,easing:'easeOut',reducedMotion});const stageScale=cameraPush?1+0.035*cameraPhase:cameraPull?1.035-0.035*cameraPhase:1;const cameraX=/whip-pan/.test(cameraText)?(1-cameraSettle)*28*unit:/tracking/.test(cameraText)?-14*unit*cameraPhase:0;const cameraY=/tilt.*(turun|down|tangan|meja)/.test(cameraText)?-16*unit*cameraPhase:/tilt.*(mata|wajah|up)/.test(cameraText)?16*unit*cameraPhase:0;const focusBlur=/rack focus|rack-focus/i.test(shot.camera)?1.8*(1-cameraSettle):0;
 return <AbsoluteFill style={{backgroundColor:t.color.paper,color:t.color.ink,fontFamily:t.type.body,overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0,opacity:.18,backgroundImage:'radial-gradient(#b9ad9b 0.7px, transparent .7px)',backgroundSize:`${20*unit}px ${20*unit}px`}}/>
  <div style={{position:'absolute',left:pad,right:pad,top:pad*.7,display:'flex',justifyContent:'space-between',fontFamily:t.type.mono,fontSize:Math.max(13,16*unit),letterSpacing:'.12em',color:t.color.muted}}><span>STUDIO / FIKSI SATIR</span><span>EP {episode.id} · {String(shot.number).padStart(2,'0')} / 06</span></div>
  <div style={{position:'absolute',left:pad,right:pad,top:sceneHeadingTop,opacity:enter,transform:`translateY(${translate}px)`}}>
   <div style={{fontFamily:t.type.mono,color:t.color.rust,fontSize:Math.max(14,18*unit),textTransform:'uppercase',letterSpacing:'.11em',marginBottom:18*unit}}>{toTime(sec)} — {shot.location}</div>
   <div style={{fontSize:titleSize,fontWeight:800,lineHeight:1.02,maxWidth:vertical?'12ch':ratio==='square'?'15ch':'18ch',letterSpacing:'-.045em'}}>{episode.title}</div>
   <div style={{width:72*unit,height:5*unit,background:t.color.rust,marginTop:18*unit}}/>
  </div>
  <div style={{position:'absolute',left:0,right:0,top:height*sceneTop,height:height*sceneHeight,overflow:'hidden',transform:`translate(${cameraX}px,${cameraY}px) scale(${stageScale})`,transformOrigin:'50% 52%'}}>
   <SceneSet episodeId={episode.id} location={shot.location} focusBlur={focusBlur} frame={localFrame}/>
   <div style={{position:'absolute',left:'3%',right:'3%',top:'68%',borderTop:'2px solid rgba(32,38,43,.24)'}}/>
   <div style={{position:'absolute',left:shotLeft,top:actorTop,opacity:enter,transform:`translateY(${(1-enter)*14*unit}px)`}}><CharacterRig design={sceneActors.firstDesign} frame={reducedMotion?0:localFrame} fps={fps} cue={mainCue} scale={firstScale} gaze="right" reducedMotion={reducedMotion}/></div>
   {sceneActors.hasSecond&&<div style={{position:'absolute',right:shotRight,top:actorTop,opacity:enter,transform:`translateY(${(1-enter)*12*unit}px)`}}><CharacterRig design={sceneActors.secondDesign} frame={reducedMotion?0:localFrame-5} fps={fps} cue={secondaryCue} scale={secondScale} gaze="left" reducedMotion={reducedMotion}/></div>}
   {variant==='CARTOON-MESSAGE-POV'?<ConversationPanel shot={shot} beat={beat} frame={reducedMotion?0:localFrame} scale={unit*(vertical?1:ratio==='square'?.68:.82)} reducedMotion={reducedMotion}/>:<SceneProp episode={episode} shot={shot} frame={localFrame} scale={unit} variant={variant} reducedMotion={reducedMotion}/>}
   <div style={{position:'absolute',left:shotLeft,top:'58%',font:'700 10px ui-monospace,monospace',color:'#3b7772',letterSpacing:'.08em'}}>{sceneActors.first.name.toUpperCase()}</div>
   {sceneActors.hasSecond&&<div style={{position:'absolute',right:shotRight,top:'58%',font:'700 10px ui-monospace,monospace',color:'#3b7772',letterSpacing:'.08em'}}>{sceneActors.second.name.toUpperCase()}</div>}
  </div>
  <div style={{position:'absolute',left:pad,right:pad,top:captionTop,opacity:enter,transform:`translateY(${(1-enter)*8*unit}px)`}}>
   <div style={{fontFamily:t.type.mono,color:t.color.teal,fontSize:Math.max(12,15*unit),letterSpacing:'.06em',textTransform:'uppercase',marginBottom:7*unit}}>ADEGAN {shot.number} · {shot.objective}</div>
   <div title={dialogue} style={{borderLeft:`5px solid ${t.color.rust}`,paddingLeft:16*unit,fontSize:captionSize,fontWeight:750,lineHeight:1.12,maxWidth:'100%',overflowWrap:'anywhere'}}>{dialogue}</div>
   <div style={{fontFamily:t.type.mono,color:t.color.muted,fontSize:Math.max(11,13*unit),marginTop:10*unit}}>KAMERA · {shot.camera}</div>
  </div>
  <div style={{position:'absolute',left:pad,right:pad,bottom:footerBottom+24*unit,height:3*unit,background:t.color.line}}><div style={{height:'100%',width:`${progress}%`,background:t.color.rust}}/></div>
  <div style={{position:'absolute',left:pad,bottom:footerBottom,fontFamily:t.type.mono,fontSize:Math.max(12,14*unit),color:t.color.muted}}>CERITA FIKSI · AKTING ILUSTRATIF · DIALOG BELUM DIREKAM</div>
 </AbsoluteFill>;
};
export const getShotAtFrame=(episode:Episode,frame:number,fps=30):Shot=>getShot(episode,frame/fps);
