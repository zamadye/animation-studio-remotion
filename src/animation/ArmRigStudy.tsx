import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cast} from '../components/characters/cast';
import {ProportionCharacterRig} from './ProportionCharacterRig';
const poses=[
 {label:'Rileks · bahu 6°',left:{shoulder:6,elbow:0},right:{shoulder:-6,elbow:0}},
 {label:'Siku menekuk · 85°',left:{shoulder:12,elbow:85},right:{shoulder:-12,elbow:-85}},
 {label:'Angkat tangan · 140°',left:{shoulder:6,elbow:0},right:{shoulder:-80,elbow:-60}},
];
export const ArmRigStudy:React.FC=()=> <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial',color:'#283138',padding:40}}>
 <h1>UJI RIG BAHU → SIKU → PERGELANGAN</h1>
 <p>Ruas berantai · panjang tetap · sleeve overlap · draft pemeriksaan pose</p>
 <div style={{display:'flex',gap:32,marginTop:50}}>{poses.map(p=><div key={p.label} style={{width:310,textAlign:'center'}}><h3>{p.label}</h3><ProportionCharacterRig design={cast['06'].hero} roleLabel="Ayah" arms={p}/></div>)}</div>
 <p>Uji statis awal. Kontak properti dan gerakan kontinu belum disahkan.</p>
 </AbsoluteFill>;
