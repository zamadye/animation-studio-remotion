import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {heroWorlds,worldLocations} from './registry';
import {WorldArt} from './WorldArt';
export const WORLD_PAGE_FRAMES=84;
export const WorldCatalog:React.FC<{page?:number;atlas?:boolean;debug?:boolean}>=({page,atlas=false,debug=false})=>{
 const entries=atlas?worldLocations:heroWorlds;
 const frame=useCurrentFrame(),index=page===undefined?Math.min(entries.length-1,Math.floor(frame/(atlas?1:WORLD_PAGE_FRAMES))):Math.max(0,Math.min(entries.length-1,page));
 const world=entries[index],variants=worldLocations.filter(x=>x.episodeId===world.episodeId);
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial',color:'#283138'}}>
  <div style={{position:'absolute',inset:'0 0 140px'}}><WorldArt world={world} debug={debug}/></div>
  <div style={{position:'absolute',top:20,left:30,padding:'12px 20px',background:'#f3ead7ee',borderRadius:8,border:'2px solid #b4a181'}}><b style={{fontSize:28}}>WORLD {world.episodeId} · {world.location.toUpperCase()}</b><div style={{fontSize:17,marginTop:5}}>Arah desain · detail & tekstur vektor · draft, belum blocking final</div></div>
  <div style={{position:'absolute',left:40,right:40,bottom:26}}><div style={{fontSize:22,fontWeight:700}}>KATALOG WORLD · {index+1} / {entries.length} · {variants.length} lokasi naskah</div><div style={{fontSize:18,marginTop:9,lineHeight:1.45}}>{variants.map(x=>x.location).join('  /  ')}</div><div style={{fontSize:16,marginTop:7,color:'#79694f'}}>Latar → area karakter → furnitur depan · siang/malam sesuai lokasi · rig dan gerakan karakter tetap dikunci</div></div>
 </AbsoluteFill>;
};
