import {rakaSpeech} from './speech';
import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,interpolate} from 'remotion';
import source from './source.json';
import {PartOneWorld,TableForeground,WorkDesk,type SetName} from './PartOneWorld';
import {character,hold,perform} from '../../story/compose';
import {march,seatedLean} from '../../story/motions';
import {StoryActor} from '../../story/StoryActor';
import {evaluateActor,validateStoryScene} from '../../story/evaluate';
import {heldPropCenter,portraitCamera} from '../../camera/PortraitCamera';
import type {PhoneContent,LetterContent} from '../../props/types';
export const PART_ONE_DURATION=source.duration;
export const shots=[
 {start:0,end:4.47,set:'home',camera:'phone'},
 {start:4.47,end:16.67,set:'home',camera:'medium'},
 {start:16.67,end:20.03,set:'home',camera:'face'},
 {start:20.03,end:21,set:'street',camera:'wide'},
 {start:21,end:23.7,set:'office',camera:'medium'},
 {start:23.7,end:24.83,set:'street',camera:'wide',night:true},
 {start:24.83,end:29.47,set:'home',camera:'medium',night:true},
 {start:29.47,end:30.42,set:'home',camera:'phone',night:true},
 {start:30.42,end:32.18,set:'table',camera:'calendar'},
 {start:32.18,end:35.18,set:'table',camera:'phone'},
 {start:35.18,end:53.86,set:'table',camera:'bills'},
 {start:53.86,end:58.06,set:'table',camera:'count'},
 {start:58.06,end:61.78,set:'kitchen',camera:'wife'},
 {start:61.78,end:71.16,set:'table',camera:'face'},
 {start:71.16,end:74.4,set:'home',camera:'two',night:true},
] as const;
export const getShot=(seconds:number)=>shots.find(s=>Math.round(seconds*24)>=Math.round(s.start*24)&&Math.round(seconds*24)<Math.round(s.end*24))??shots[shots.length-1];
const obligations=[{at:35.18,text:'Cicilan motor  Rp850.000'},{at:40.14,text:'Pinjaman lama  Rp420.000'},{at:42.98,text:'Kontrakan  Rp1.000.000'},{at:44.46,text:'Listrik, air & dapur'},{at:46.3,text:'Hampir Rp1.000.000'},{at:48.3,text:'Bensin / kebutuhan mendadak'},{at:50.3,text:'Kiriman untuk Ibu'}];
export const partOneScene=(frame:number)=>{
 const seconds=frame/24,shot=getShot(seconds),start=Math.round(shot.start*24),duration=Math.round(shot.end*24)-start,local=frame-start;
 const video=seconds<16.67;
 const phone:PhoneContent=video?{kind:'phone',mode:'video',id:'hp-raka-part1',contact:'Video pagi ini',messages:[],video:{frame,openness:seconds<4.47?(source.energy[frame]??0):0}}:{kind:'phone',mode:'bank',id:'hp-raka-part1',contact:'Rekening Raka',messages:[],bank:{label:seconds<30.42?'Saldo tersedia':'Gaji diterima',amount:seconds<30.42?'Rp—':'Rp3.200.000',notices:seconds<30.42?[]:['Transfer gaji masuk']}};
 const book:LetterContent={kind:'letter',layout:'notebook',id:'catatan-part1',heading:'KEWAJIBAN BULAN INI',number:'Gaji Rp3.200.000',lines:obligations.filter(o=>frame>=Math.round(o.at*24)).map(o=>o.text),signature:'Raka'};
 const workSheet:LetterContent={kind:'letter',layout:'notebook',id:'lembar-kerja',heading:'REKAP HARIAN',number:'Dokumen pekerjaan',lines:['Data masuk','Periksa jumlah','Cocokkan catatan','Simpan rekap'],signature:'Raka'};
 const seated=shot.set==='table'||shot.set==='office';
 const actor=character({id:'raka',x:shot.set==='office'?105:shot.camera==='two'?90:205,scale:1.8,duration,expression:seconds<4.47?'neutral':seconds<20.03?'sad':seconds<30.42?'tired':seconds<35.18?'happy':seconds<58.06?'sad':'sad',motions:shot.set==='street'?[perform(march,0,duration)]:shot.set==='office'?[perform(seatedLean,0,duration)]:seated?[perform(seatedLean,0,1)]:[],props:shot.set==='office'?[hold(workSheet,'left',0,duration)]:shot.set==='street'?[]:[hold(phone,'right',0,duration),...(frame>=Math.round(35.18*24)?[hold(book,'left',0,duration)]:[])]});
 actor.seat=shot.set==='office'?'rig':'none';
 actor.emotions=actor.emotions?.map(e=>({...e,intensity:.4}));
 const wife=character({id:'nisa',x:shot.camera==='wife'?310:555,scale:1.8,duration,expression:'neutral'});wife.seat='none';
 const actors=shot.camera==='wife'?[wife]:shot.camera==='two'?[actor,wife]:[actor];
 const scene=validateStoryScene({id:'part1-'+start,fps:24,duration,actors,speech:actors.some(a=>a.id==='raka')?rakaSpeech(start,duration):[]});
 return {scene,shot,local,seconds,actor};
};
export const PartOne:React.FC=()=>{
 const frame=useCurrentFrame(),{scene,shot,local,seconds,actor}=partOneScene(frame);
 const floorY=1710;
 let target={x:540,y:1270,zoom:1.35};
 if(shot.camera==='medium')target={x:500,y:1260,zoom:1.9};
 if(shot.camera==='face')target={x:shot.set==='table'?650:510,y:shot.set==='table'?1280:1150,zoom:2.15};
 if(shot.set==='office')target={x:565,y:1380,zoom:1.2};
 if(shot.camera==='wife')target={x:620,y:1180,zoom:1.85};
 if(shot.camera==='two')target={x:610,y:1300,zoom:1.15};
 if(shot.camera==='calendar')target={x:640,y:665,zoom:4.2};
 if(shot.camera==='count')target={x:535,y:1350,zoom:2.2};
 if(shot.camera==='phone'||shot.camera==='bills'){
  const prop=actor.props![shot.camera==='bills'?1:0];
  const point=heldPropCenter(actor,evaluateActor(scene,actor,local).pose,prop,floorY);
  target={...point,zoom:shot.camera==='bills'?6.2:8.2};
 }
 if(shot.camera==='phone'&&shot.start===32.18){
  const u=Math.min(1,local/18),ease=u*u*(3-2*u);
  target={x:535+(target.x-535)*ease,y:1350+(target.y-1350)*ease,zoom:2.2+(target.zoom-2.2)*ease};
 }
 // Slow optical push; every prop shot magnifies the same held object and scene.
 const push=interpolate(local,[0,Math.max(1,scene.duration-1)],[1,1.025],{extrapolateRight:'clamp'});
 const cam=portraitCamera(target.x,target.y,target.zoom*push);
 return <AbsoluteFill style={{background:'#dfd0b3',overflow:'hidden'}}>
  <div style={{position:'absolute',width:1080,height:1920,transformOrigin:'0 0',transform:`translate(${cam.x}px,${cam.y}px) scale(${cam.zoom})`}}>
   <PartOneWorld set={shot.set as SetName} night={'night' in shot&&shot.night}/>
   {scene.actors.map(a=><StoryActor key={a.id} actor={a} scene={scene} frame={local} floorY={floorY}/>)}
   {shot.set==='table'&&<TableForeground/>}
   {shot.set==='office'&&<WorkDesk frame={local} duration={scene.duration}/>}
  </div>
  <Audio src={staticFile(source.audio)}/>
 </AbsoluteFill>;
};
