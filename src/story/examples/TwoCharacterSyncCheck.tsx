import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {StoryScene} from '../StoryScene';
import {twoCharacterSync as scene} from './twoCharacterSync';
export const TwoCharacterSyncCheck:React.FC=()=>{
 const frame=useCurrentFrame(),line=scene.speech.find(c=>frame>=c.start&&frame<c.end);
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial',color:'#283138'}}>
  <h1 style={{margin:'28px 50px 8px',fontSize:36}}>UJI SINKRONISASI · TUBUH + EKSPRESI + BICARA</h1>
  <p style={{margin:'0 50px',fontSize:22}}>Cast adegan: Darto + Petugas saja · satu clock 24 fps · frame {frame}/431 · gerakan tubuh terkunci</p>
  <p style={{margin:'12px 50px',fontSize:18,color:'#71634f'}}>Audio dialog + gating energi · estimasi fonem berbasis teks, belum forced alignment · gerak langkah = march in place yang disetujui</p>
  <div style={{position:'absolute',left:80,right:80,top:900,borderTop:'3px solid #b6a17e'}}/>
  <div style={{position:'absolute',left:130,top:230,width:220,height:410,border:'8px solid #ad9572',background:'#c6d4ca',borderRadius:12}}/>
  <StoryScene scene={scene} floorY={900} debug/>
  <div style={{position:'absolute',left:100,right:100,top:962,padding:'16px 25px',background:'#f2eadc',borderRadius:12,fontSize:27,minHeight:34}}>{line?<><b>{line.speaker.toUpperCase()}: </b>{line.text}</>:<span style={{color:'#71634f'}}>Jeda dialog — mulut kembali diam, gerakan/emosi tetap berjalan.</span>}</div>
 </AbsoluteFill>;
};
