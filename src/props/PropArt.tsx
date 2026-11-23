import {CharacterRig} from '../components/characters/CharacterRig';
import {influencer} from '../components/characters/registry';
import React from 'react';
import {propSize,validateContent,type HeldContent} from './types';
/** Same SVG and exact same content object in the hand and the camera insert. */
export const PropArt:React.FC<{content:HeldContent}>=({content:p})=>{
 validateContent(p);const size=propSize(p);
 if(p.kind==='lunchbox')return <svg data-prop-id={p.id} width="480" height="300" viewBox="0 0 480 300"><rect x="12" y="65" width="450" height="218" rx="42" fill="#799580" stroke="#465d51" strokeWidth="12"/><rect x="28" y="35" width="420" height="192" rx="32" fill={p.open?'#e7e2c5':'#9cb098'} stroke="#465d51" strokeWidth="10"/>{p.open?<><path d="M290 48v163" stroke="#87937b" strokeWidth="8"/><ellipse cx="160" cy="133" rx="98" ry="65" fill="#fffae5"/><path d="M320 92q60-70 94 15-42 92-94-15" fill="#879c52"/><ellipse cx="361" cy="171" rx="49" ry="29" fill="#b97c49"/></>:<path d="M175 115q60-60 120 0" stroke="#647e69" strokeWidth="17" fill="none"/>}<rect x="202" y="220" width="80" height="50" rx="9" fill="#c7b481" stroke="#465d51" strokeWidth="6"/></svg>;
 if(p.kind==='wallet')return <svg data-prop-id={p.id} width="360" height="240" viewBox="0 0 360 240" aria-label="Dompet terbuka"><path d="M8 25Q80 0 178 25q90-25 174 0v195q-90-28-174-2-90-26-170 2Z" fill="#8b6242" stroke="#493b35" strokeWidth="9"/><path d="M178 25v193M25 60q65-17 137 0v120q-70-17-137 0Zm174 0q65-17 137 0v120q-70-17-137 0Z" fill="#b18c5f" stroke="#694a35" strokeWidth="5"/><path d="M30 95h125m48 0h125m-298 22h125m48 0h125" fill="none" stroke="#8d6b48" strokeWidth="3"/></svg>;

 return <svg data-prop-id={p.id} aria-label={p.kind==='phone'?'HP dengan chat':'Surat terbaca'} width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} style={{overflow:'visible',fontFamily:'Arial'}}>
 {p.kind==='phone'?<>
  <rect width="360" height="640" rx="34" fill="#303a3a" stroke="#493b35" strokeWidth="9"/>
  <rect x="17" y="24" width="326" height="590" rx="20" fill="#eee9db"/>
  <path d="M37 24h286q20 0 20 20v102H17V44q0-20 20-20" fill="#246857"/>
  <text x="36" y="57" fill="#fff" fontSize="17">09:41</text><text x="278" y="57" fill="#fff" fontSize="16">4G</text>
  <text x="36" y="100" fill="#fff" fontWeight="bold" fontSize="23">{p.contact}</text>
  <text x="36" y="128" fill="#dcece2" fontSize="16">{p.mode==='video'?'Video':p.mode==='bank'?'Rekening pribadi':p.mode==='call'?'Panggilan berlangsung':'Chat · contoh fiktif'}</text>
  {p.mode==='video'&&p.video?<>
   <rect x="18" y="147" width="324" height="454" fill="#c7d2c0"/>
   <svg x="20" y="150" width="320" height="450" viewBox="65 40 230 320" overflow="hidden"><CharacterRig design={influencer} frame={p.video.frame} fps={24} cue="hold" face={{emotion:'happy',intensity:.8,viseme:p.video.openness>.12?'A':'rest',openness:p.video.openness,blink:0,tearPhase:0}}/></svg>
   <circle cx="307" cy="525" r="13" fill="#ae6957"/>
  </>:p.mode==='bank'&&p.bank?<>
   <text x="35" y="190" fontSize="21" fill="#5c6e65">{p.bank.label}</text><text x="35" y="236" fontSize="34" fontWeight="bold" fill="#243731">{p.bank.amount}</text>
   {p.bank.notices.map((text,i)=><g key={i}><rect x="29" y={272+i*67} width="302" height="58" rx="9" fill="#fffdf6"/><text x="41" y={307+i*67} fontSize="19" fill="#243731">{text}</text></g>)}
  </>:p.messages.map((m,i)=>{const y=168+i*133;return <g key={i}><rect x={m.from==='me'?50:28} y={y} width="282" height="116" rx="13" fill={m.from==='me'?'#cce7b6':'#fffdf6'}/>{m.lines.map((line,j)=><text key={j} x={m.from==='me'?64:42} y={y+30+j*27} fontSize="22" fill="#243731">{line}</text>)}<text x={m.from==='me'?259:237} y={y+104} fontSize="12" fill="#5c7368">09:4{i+1}</text></g>})}
  {p.mode==='call'?<><circle cx="180" cy="580" r="21" fill="#a74f3e"/><path d="M168 581q12-12 24 0" fill="none" stroke="#fff" strokeWidth="5"/></>:<rect x="35" y="580" width="290" height="24" rx="12" fill="#fff"/>}<rect x="140" y="624" width="80" height="5" rx="2" fill="#a8b5ae"/>
 </>:<>
  <rect width="640" height="800" rx="4" fill="#fff8e6" stroke="#89785e" strokeWidth="5"/>
  <path d="M580 0v60h60" fill="#e4d8ba" stroke="#89785e" strokeWidth="3"/>
  <text x="48" y="65" fontSize="19" fill="#6d6e5c">{p.headerTag??(p.layout==='notebook'?'CATATAN RUMAH':'KANTOR PELAYANAN WARGA')}</text>
  <path d="M48 86h544" stroke="#43695d" strokeWidth="5"/>
  <text x="48" y="143" fontSize="32" fontWeight="bold" fill="#2e4c43">{p.heading}</text>
  <text x="48" y="182" fontSize="21" fill="#605b4b">{p.number}</text>
  {p.lines.map((line,i)=><text key={i} x="48" y={252+i*35} fontSize="26" fill="#303a34">{line}</text>)}
  {p.kind==='letter'&&p.struckLines?.map(i=><path key={i} d={`M45 ${243+i*35}h390`} stroke="#a15e4e" strokeWidth="5"/>)}
  {p.layout==='notebook'?<><path d="M35 208h570" stroke="#d3c8a7" strokeWidth="2"/>{Array.from({length:7},(_,i)=><path key={i} d={`M35 ${300+i*53}h570`} stroke="#dbd1b6" strokeWidth="2" opacity="0"/>)}</>:<>
  <text x="362" y="686" fontSize="20" fill="#605b4b">{p.signatureLabel??'Petugas pelayanan,'}</text><path d="M380 727q35-56 42-8t38-5 61 8" stroke="#526d89" strokeWidth="3" fill="none"/>
  <text x="362" y="765" fontSize="22" fill="#303a34">{p.signature}</text></>}
 </>}
 </svg>;
};
