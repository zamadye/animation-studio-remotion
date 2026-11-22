import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {cast} from '../components/characters/cast';
import {CharacterRig} from '../components/characters/CharacterRig';
import type {CharacterDesign} from '../components/characters/cast';
import {sampleActingClip} from './clips';

type Variation={design:(typeof cast)[string]['hero'];label:string;role:string;pose:string;presentation?:'masculine'|'feminine'|'androgynous';bodyShape?:'slim'|'average'|'broad';overrides?:Partial<CharacterDesign>};
const concepts:Variation[]=[
 {design:cast['02'].hero,label:'Nina',role:'Lulusan baru',pose:'listening',presentation:'feminine',bodyShape:'slim'},
 {design:cast['02'].foil,label:'HR',role:'Perekrut',pose:'thinking',presentation:'androgynous',bodyShape:'broad'},
 {design:cast['03'].hero,label:'Pria',role:'Warga yang butuh bantuan',pose:'listening',presentation:'masculine',bodyShape:'average'},
 {design:cast['03'].foil,label:'Influencer',role:'Pemburu engagement',pose:'thinking',presentation:'androgynous',bodyShape:'slim'},
 {design:cast['04'].hero,label:'Ibu Sari',role:'Penjahit',pose:'listening',presentation:'feminine',bodyShape:'average'},
 {design:cast['04'].foil,label:'Bendahara',role:'Pengurus sekolah',pose:'thinking',presentation:'androgynous',bodyShape:'broad'},
 {design:cast['05'].hero,label:'Mira',role:'Pedagang kampung',pose:'listening',presentation:'feminine',bodyShape:'average'},
 {design:cast['05'].foil,label:'Humas',role:'Juru bicara',pose:'thinking',presentation:'androgynous',bodyShape:'average',overrides:{hairShape:'curly',outfit:'#76576f',accent:'#e0ad63',glasses:true}},
 {design:cast['06'].hero,label:'Ayah',role:'Anggota grup keluarga',pose:'listening',presentation:'masculine',bodyShape:'broad',overrides:{hairShape:'cap',outfit:'#86674e',accent:'#c3a66b',costume:'workwear'}},
 {design:cast['06'].foil,label:'Dini',role:'Anak yang menunggu',pose:'thinking',presentation:'feminine',bodyShape:'slim',overrides:{hairShape:'bun',outfit:'#a95f70',accent:'#e5c278',lowerGarment:'skirt',lowerGarmentColor:'#604c5b'}},
 {design:cast['07'].hero,label:'Pak Beni',role:'Warga pengantar barang',pose:'listening',presentation:'masculine',bodyShape:'broad',overrides:{hairShape:'curly',outfit:'#786044',accent:'#d19a4e',costume:'workwear'}},
 {design:cast['07'].foil,label:'Koordinator',role:'Petugas lapangan',pose:'thinking',presentation:'androgynous',bodyShape:'average',overrides:{hairShape:'cap',outfit:'#4e7164',accent:'#d6b968',costume:'service-uniform',glasses:true}},
 {design:cast['08'].hero,label:'Rika',role:'Kasir dan ibu',pose:'listening',presentation:'feminine',bodyShape:'average',overrides:{hairShape:'bun',outfit:'#78536a',accent:'#d99d56',apron:true,lowerGarment:'skirt',lowerGarmentColor:'#59454e'}},
 {design:cast['08'].foil,label:'Manajer',role:'Pengelola minimarket',pose:'thinking',presentation:'androgynous',bodyShape:'broad',overrides:{hairShape:'short',outfit:'#465b68',accent:'#bd9652',costume:'service-uniform',glasses:true}},
];
export const CharacterVariationSheet:React.FC<{page?:number}>=({page=0})=>{
 const frame=useCurrentFrame(),items=concepts.slice(page*7,page*7+7);
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial,sans-serif',color:'#283138',overflow:'hidden'}}>
  <div style={{position:'absolute',left:42,top:24,fontSize:34,fontWeight:900,letterSpacing:1}}>STUDI VARIASI KARAKTER · {page+1}/2</div>
  <div style={{position:'absolute',left:44,top:62,fontSize:16,color:'#706452'}}>Tokoh episode lain · eksplorasi siluet, palet, rambut, dan kostum · belum final</div>
  {items.map((item,i)=>{
   const col=i%2,row=Math.floor(i/2),left=col*540,top=96+row*450;
   const design={...item.design,bodyShape:item.bodyShape??item.design.bodyShape??'average',presentation:item.presentation??item.design.presentation??'androgynous',...item.overrides};
   return <React.Fragment key={item.label}>
    <div style={{position:'absolute',left:left+12,top:top+10,width:516,height:428,background:'#f2eadc',border:'4px solid #765a42',borderRadius:18,boxSizing:'border-box'}}/>
    <div style={{position:'absolute',left:left+30,top:top+24,fontSize:26,fontWeight:800}}>{item.label}</div>
    <div style={{position:'absolute',left:left+30,top:top+55,fontSize:16,color:'#71634f'}}>{item.role}</div>
    <div style={{position:'absolute',left:left+166,top:top+92,transform:'scale(.58)',transformOrigin:'top left'}}>
     <CharacterRig design={design} frame={frame} fps={30} cue="hold" actingPose={sampleActingClip(item.pose,0)} scale={1} facing={i%2===0?'threeQuarterRight':'threeQuarterLeft'} gaze={i%2===0?'right':'left'} reducedMotion/>
    </div>
    <div style={{position:'absolute',left:left+30,top:top+390,fontSize:13,fontWeight:700,color:item.design.accent}}>SILUET · PALET · RAMBUT · KOSTUM</div>
   </React.Fragment>;
  })}
 </AbsoluteFill>;
};
