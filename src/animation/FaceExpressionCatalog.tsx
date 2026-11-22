import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {CharacterRig} from '../components/characters/CharacterRig';
import {cast} from '../components/characters/cast';
import {rigGeometry,RIG_SCALE} from '../components/characters/rigGeometry';
import {sampleFaceCatalog,FACE_FRAMES,FACE_FPS} from './faceCatalog';

/** Production rig cropped to face. No body movement channels are overridden. */
export const FaceExpressionCatalog:React.FC<{expressionIndex?:number}>=({expressionIndex})=>{
 const frame=useCurrentFrame(),sample=sampleFaceCatalog(frame,expressionIndex);
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial,sans-serif',color:'#283138'}}>
  <h1 style={{margin:'22px 40px 6px',fontSize:34}}>KATALOG WAJAH · 16 KARAKTER · GERAKAN TUBUH DIKUNCI</h1>
  <div style={{margin:'0 40px',display:'flex',justifyContent:'space-between',fontSize:25,fontWeight:700}}><span>{sample.label}</span><span>{sample.index+1} / 16</span></div>
  <p style={{margin:'8px 40px',fontSize:17}}>Satu indeks ekspresi bersama · {FACE_FPS} fps · frame {sample.local}/{FACE_FRAMES-1} · demonstrasi fonem, belum sinkron rekaman dialog</p>
  {Object.entries(cast).flatMap(([ep,pair])=>[pair.hero,pair.foil].map((design,j)=>({design,id:`${ep}-${j}`}))).map(({design,id},i)=>{
   const centerY=20+RIG_SCALE*(620+rigGeometry(design).height*(100-620));
   return <div key={id} style={{position:'absolute',left:28+(i%8)*236,top:155+Math.floor(i/8)*438,width:224,height:416,background:'#f2eadc',borderRadius:12,border:'1px solid #c8b99f'}}>
    <div style={{marginTop:16,textAlign:'center',fontWeight:700,fontSize:21}}>{design.name}</div>
    <svg viewBox={`100 ${centerY-84} 160 170`} width="220" height="270" style={{marginTop:14}} role="img" aria-label={`${design.name}, ${sample.label}`}>
     <CharacterRig design={design} frame={frame} fps={FACE_FPS} cue="hold" reducedMotion face={sample.face}/>
    </svg>
    <div style={{textAlign:'center',fontSize:20,fontWeight:700,marginTop:3}}>Mulut: {sample.face.viseme}</div>
    <div style={{textAlign:'center',fontSize:14,color:'#71634f',marginTop:14}}>Ekspresi {String(sample.index).padStart(2,'0')} · frame {sample.local}</div>
   </div>;
  })}
  <div style={{position:'absolute',bottom:20,left:40,right:40,fontSize:17,color:'#71634f'}}>Alis + kelopak + mata + pipi + bibir/rahang + air mata · ekspresi tetap terbaca saat bicara · katalog tubuh 13 gerakan tidak diubah</div>
 </AbsoluteFill>;
};
