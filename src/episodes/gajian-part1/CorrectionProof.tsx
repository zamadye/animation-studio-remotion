import React from 'react';
import {AbsoluteFill,Sequence} from 'remotion';
import {PartOne} from './PartOne';
import {CharacterRig} from '../../components/characters/CharacterRig';
import {raka,nisa} from '../../components/characters/registry';
export const CorrectionProof:React.FC=()=> <AbsoluteFill>
 <Sequence from={0} durationInFrames={240}><Sequence from={-288}><PartOne/></Sequence></Sequence>
 <Sequence from={240} durationInFrames={336}><Sequence from={-1392}><PartOne/></Sequence></Sequence>
</AbsoluteFill>;
/** Identical CharacterRig/design/neutral pose at different uniform scales. */
export const CatalogIdentityProof:React.FC=()=> <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial',color:'#283138'}}>
 <div style={{fontSize:30,fontWeight:700,margin:30}}>CEK IDENTITAS RIG · BUKAN DESAIN BARU</div>
 {[{design:raka,base:raka,name:'Raka · Rig V4'},{design:nisa,base:nisa,name:'Nisa · Rig V4'}].map((p,i)=><div key={p.name} style={{position:'absolute',left:30+i*540,top:110,width:510,height:1750,border:'2px solid #a69679'}}>
 <div style={{textAlign:'center',fontSize:28,margin:20}}>{p.name}</div>
 <div style={{margin:'20px auto',width:216}}><CharacterRig design={p.base} frame={0} fps={24} cue="hold" scale={.6}/></div>
 <div style={{fontSize:22,textAlign:'center'}}>Rig katalog · skala 0,6</div>
 <div style={{position:'absolute',top:620,left:0}}><CharacterRig design={p.design} frame={0} fps={24} cue="hold" scale={1.4}/></div>
 <div style={{position:'absolute',top:1430,width:'100%',fontSize:22,textAlign:'center'}}>Rig episode · skala 1,4<br/>Pose & ekspresi netral yang sama</div>
 </div>)}
 </AbsoluteFill>;
