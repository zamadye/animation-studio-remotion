import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,interpolate} from 'remotion';
import source from './source.json';
import {rakaSpeech} from './speech';
import {PartOneWorld,TableForeground,WorkDesk,type SetName} from '../gajian-part1/PartOneWorld';
import {character,hold,perform} from '../../story/compose';
import {march,seatedLean,leftArm} from '../../story/motions';
import {StoryActor} from '../../story/StoryActor';
import {evaluateActor,validateStoryScene} from '../../story/evaluate';
import {portraitCamera,heldPropCenter} from '../../camera/PortraitCamera';
import type {HeldContent,LetterContent} from '../../props/types';
export const PART_TWO_DURATION=source.duration;
export const partTwoShots=[
 {start:0,end:3.2,set:'table',action:'book'},
 {start:3.2,end:6.8,set:'table',action:'cut'},
 {start:6.8,end:9.53,set:'kitchen',action:'pack'},
 {start:9.53,end:13.45,set:'home',action:'reuse'},
 {start:13.45,end:17.5,set:'home',action:'hope'},
 {start:17.5,end:23.51,set:'table',action:'savings'},
 {start:23.51,end:27.5,set:'table',action:'jar'},
 {start:27.5,end:31.15,set:'street',action:'walk'},
 {start:31.15,end:32.55,set:'office',action:'work'},
 {start:32.55,end:33.8,set:'office',action:'lunch'},
 {start:33.8,end:34.8,set:'street',action:'return'},
 {start:34.8,end:36.22,set:'table',action:'record'},
 {start:36.22,end:39.2,set:'office',action:'invite'},
 {start:39.2,end:44.61,set:'office',action:'decline'},
 {start:44.61,end:50.19,set:'home',action:'wife'},
 {start:50.19,end:56,set:'home',action:'resolve'},
] as const;
export const partTwoScene=(frame:number)=>{
 const shot=partTwoShots.find(s=>frame>=Math.round(s.start*24)&&frame<Math.round(s.end*24))??partTwoShots.at(-1)!;
 const start=Math.round(shot.start*24),duration=Math.round(shot.end*24)-start,local=frame-start,seconds=frame/24;
 const book:LetterContent={kind:'letter',layout:'notebook',id:'buku-hemat',heading:shot.action==='savings'||shot.action==='jar'?'UANG DISISIHKAN':'CATATAN PENGELUARAN',number:shot.action==='savings'||shot.action==='jar'?'Sedikit demi sedikit':'Rencana lebih hemat',lines:shot.action==='savings'||shot.action==='jar'?['Rp5.000',...(seconds>=19?['Rp10.000']:[]),...(seconds>=21?['Rp15.000']:[])]:['Jajan kopi','Beli makan siang','Bawa bekal dari rumah','Pakai barang yang masih layak'],struckLines:shot.action==='cut'?(local>35?[0,1]:[0]):shot.action==='record'?[0,1]:[],signature:'Raka'};
 const lunch:HeldContent={kind:'lunchbox',id:'bekal-raka',open:shot.action==='lunch'};
 const work:LetterContent={kind:'letter',layout:'notebook',id:'rekap-raka',heading:'REKAP HARIAN',number:'Dokumen pekerjaan',lines:['Periksa data','Cocokkan catatan','Simpan rekap'],signature:'Raka'};
 const seated=shot.set==='table'||shot.action==='work'||shot.action==='lunch';
 const prop=shot.action==='pack'||shot.action==='lunch'?lunch:shot.action==='work'?work:book;
 const showBook=['book','cut','savings','jar','record','resolve'].includes(shot.action);
 const raka=character({id:'raka',x:shot.action==='wife'?65:shot.action==='invite'||shot.action==='decline'?60:shot.action==='work'?105:205,scale:1.8,duration,expression:shot.action==='hope'||shot.action==='resolve'?'happy':shot.action==='wife'?'tired':'neutral',motions:shot.set==='street'?[perform(march,0,duration)]:seated?[perform(seatedLean,0,shot.action==='work'?duration:1)]:shot.action==='decline'?[perform(leftArm,0,duration)]:[],props:showBook||shot.action==='pack'||shot.action==='lunch'||shot.action==='work'?[hold(prop,'left',0,duration)]:[]});
 raka.seat=shot.action==='work'||shot.action==='lunch'?'rig':'none';raka.emotions=raka.emotions?.map(e=>({...e,intensity:.4}));
 const nisa=character({id:'nisa',x:560,scale:1.8,duration,expression:'sad'});nisa.emotions=nisa.emotions?.map(e=>({...e,intensity:.4}));nisa.seat='none';
 // Existing Pria design is an unnamed colleague, not a new Raka identity.
 const colleague=character({id:'pria',x:570,scale:1.8,duration,expression:'happy',motions:[perform(leftArm,0,shot.action==='invite'?duration:1)],props:[hold({kind:'lunchbox',id:'bekal-rekan'},'right',0,duration)]});colleague.seat='none';
 const actors=shot.action==='wife'?[raka,nisa]:shot.action==='invite'||shot.action==='decline'?[raka,colleague]:[raka];
 const scene=validateStoryScene({id:'part2-'+start,fps:24,duration,actors,speech:rakaSpeech(start,duration)});
 return {shot,scene,local,raka,seconds};
};
const SavingJar:React.FC=()=> <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
 <g transform="translate(650 1525)"><rect x="18" width="150" height="25" rx="7" fill="#8b997e" stroke="#526957" strokeWidth="6"/><path d="M20 25Q0 40 0 65v105q90 30 180 0V65q0-25-20-40Z" fill="#b2c2a2" fillOpacity=".7" stroke="#6d856e" strokeWidth="7"/><path d="M22 120h130v48H22Z" fill="#839f73" stroke="#586f54" strokeWidth="4"/><path d="M35 104h120v44H35Z" fill="#a7b386" stroke="#586f54" strokeWidth="4"/><rect x="20" y="56" width="140" height="45" fill="#f3e9cd"/><text x="90" y="86" textAnchor="middle" fontFamily="Arial" fontSize="22" fill="#43624e">SISIHAN</text></g>
 </svg>;
const ReuseBag:React.FC=()=> <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><g transform="translate(610 1390)"><path d="M20 65q100-50 200 0v230H20Z" fill="#9c805c" stroke="#594e3d" strokeWidth="8"/><path d="M55 65V25q65-60 130 0v40" stroke="#594e3d" strokeWidth="13" fill="none"/><path d="M85 150h85v80H85Z" fill="#c1ac83" stroke="#6e6148" strokeWidth="5"/><path d="M95 160l65 60m-65 0l65-60" stroke="#877154" strokeWidth="4" strokeDasharray="5 4"/></g></svg>;
export const PartTwo:React.FC=()=>{
 const frame=useCurrentFrame(),{shot,scene,local,raka}=partTwoScene(frame),floorY=1710;
 let target={x:530,y:1290,zoom:1.65};
 if(shot.action==='wife'||shot.action==='invite'||shot.action==='decline')target={x:575,y:1290,zoom:1.12};
 if(shot.action==='resolve')target={x:510,y:1220,zoom:2.05};
 if(shot.set==='street')target={x:530,y:1290,zoom:1.25};
 if(shot.action==='work')target={x:565,y:1380,zoom:1.2};
 if(shot.action==='reuse')target={x:590,y:1450,zoom:1.5};
 if(shot.action==='jar')target={x:755,y:1570,zoom:3};
 if(['book','cut','savings','pack','lunch'].includes(shot.action)){
  const point=heldPropCenter(raka,evaluateActor(scene,raka,local).pose,raka.props![0],floorY);
  const u=Math.min(1,local/18),blend=u*u*(3-2*u);
  const zoom=shot.action==='pack'||shot.action==='lunch'?5.5:5.7;
  target={x:530+(point.x-530)*blend,y:1290+(point.y-1290)*blend,zoom:1.65+(zoom-1.65)*blend};
 }
 const cam=portraitCamera(target.x,target.y,target.zoom*interpolate(local,[0,scene.duration-1],[1,1.02],{extrapolateRight:'clamp'}));
 return <AbsoluteFill style={{background:'#e6d6b7',overflow:'hidden'}}>
  <div style={{position:'absolute',width:1080,height:1920,transformOrigin:'0 0',transform:`translate(${cam.x}px,${cam.y}px) scale(${cam.zoom})`}}>
   <PartOneWorld set={shot.set as SetName} night={['book','cut','record','wife','resolve','return'].includes(shot.action)}/>
   {scene.actors.map(actor=><StoryActor key={actor.id} scene={scene} actor={actor} frame={local} floorY={floorY}/>)}
   {shot.set==='table'&&<TableForeground/>}
   {shot.action==='jar'&&<SavingJar/>}
   {shot.action==='reuse'&&<ReuseBag/>}
   {shot.action==='work'&&<WorkDesk frame={local} duration={scene.duration}/>}
  </div>
  <Audio src={staticFile(source.audio)}/>
 </AbsoluteFill>;
};
