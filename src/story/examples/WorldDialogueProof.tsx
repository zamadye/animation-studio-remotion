import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {darto,petugas} from '../../components/characters/registry';
import {WorldStoryScene} from '../../world/WorldStoryScene';
import {validateStoryScene} from '../evaluate';
import {rightArm} from '../motions';
import type {SpeechCue} from '../types';
import speech from './syncSpeech.json';
/** Reuse measured audio windows and approved motion, not new rig choreography.
 * Standing dialogue avoids pretending that document/seat contact has been solved. */
export const worldDialogueProof=validateStoryScene({
 id:'world-dialogue-proof',fps:24,duration:288,
 actors:[
  {id:'darto',design:darto,x:430,scale:1.05,body:[{start:0,duration:60,motion:rightArm}],emotions:[{start:0,end:180,emotion:'sad'}]},
  {id:'petugas',design:petugas,x:1110,scale:1.05,body:[],emotions:[{start:156,end:228,emotion:'angry'}]},
 ],
 speech:(speech as SpeechCue[]).map(c=>({...c,start:c.start-120,end:c.end-120})),
});
export const WorldDialogueProof:React.FC=()=>{
 const frame=useCurrentFrame();
 const cue=worldDialogueProof.speech.find(c=>frame>=c.start&&frame<c.end);
 return <AbsoluteFill style={{background:'#e5dbc6'}}>
  <WorldStoryScene episodeId="01" location="Kantor pelayanan" scene={worldDialogueProof}/>
  <div style={{position:'absolute',left:32,top:24,background:'#f4ecdde8',border:'2px solid #b4a181',borderRadius:8,padding:'12px 20px',fontFamily:'Arial',color:'#283138'}}>
   <b style={{fontSize:25}}>PROOF WORLD + CERITA · KANTOR PELAYANAN</b>
   <div style={{fontSize:18,marginTop:6}}>Darto + Petugas · rig terkunci · dialog berdiri · belum kontak dokumen</div>
  </div>
  {cue&&<div style={{position:'absolute',bottom:28,left:240,right:240,textAlign:'center',background:'#283138ee',color:'#fff7e8',padding:'16px 30px',borderRadius:10,fontFamily:'Arial',fontSize:30}}><b style={{color:'#e3c389'}}>{cue.speaker==='darto'?'Darto':'Petugas'}:</b> {cue.text}</div>}
 </AbsoluteFill>;
};
