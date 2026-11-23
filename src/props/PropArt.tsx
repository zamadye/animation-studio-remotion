import React from 'react';
import {propSize,validateContent,type HeldContent} from './types';
/** Same SVG and exact same content object in the hand and the camera insert. */
export const PropArt:React.FC<{content:HeldContent}>=({content:p})=>{
 validateContent(p);const size=propSize(p);
 return <svg data-prop-id={p.id} aria-label={p.kind==='phone'?'HP dengan chat':'Surat terbaca'} width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} style={{overflow:'visible',fontFamily:'Arial'}}>
 {p.kind==='phone'?<>
  <rect width="360" height="640" rx="34" fill="#303a3a" stroke="#493b35" strokeWidth="9"/>
  <rect x="17" y="24" width="326" height="590" rx="20" fill="#eee9db"/>
  <path d="M37 24h286q20 0 20 20v102H17V44q0-20 20-20" fill="#246857"/>
  <text x="36" y="57" fill="#fff" fontSize="17">09:41</text><text x="278" y="57" fill="#fff" fontSize="16">4G</text>
  <text x="36" y="100" fill="#fff" fontWeight="bold" fontSize="23">{p.contact}</text>
  <text x="36" y="128" fill="#dcece2" fontSize="16">{p.mode==='call'?'Panggilan berlangsung':'Chat · contoh fiktif'}</text>
  {p.messages.map((m,i)=>{const y=168+i*133;return <g key={i}><rect x={m.from==='me'?50:28} y={y} width="282" height="116" rx="13" fill={m.from==='me'?'#cce7b6':'#fffdf6'}/>{m.lines.map((line,j)=><text key={j} x={m.from==='me'?64:42} y={y+30+j*27} fontSize="22" fill="#243731">{line}</text>)}<text x={m.from==='me'?259:237} y={y+104} fontSize="12" fill="#5c7368">09:4{i+1}</text></g>})}
  {p.mode==='call'?<><circle cx="180" cy="580" r="21" fill="#a74f3e"/><path d="M168 581q12-12 24 0" fill="none" stroke="#fff" strokeWidth="5"/></>:<rect x="35" y="580" width="290" height="24" rx="12" fill="#fff"/>}<rect x="140" y="624" width="80" height="5" rx="2" fill="#a8b5ae"/>
 </>:<>
  <rect width="640" height="800" rx="4" fill="#fff8e6" stroke="#89785e" strokeWidth="5"/>
  <path d="M580 0v60h60" fill="#e4d8ba" stroke="#89785e" strokeWidth="3"/>
  <text x="48" y="65" fontSize="19" fill="#6d6e5c">{p.headerTag??'KANTOR PELAYANAN WARGA'}</text>
  <path d="M48 86h544" stroke="#43695d" strokeWidth="5"/>
  <text x="48" y="143" fontSize="32" fontWeight="bold" fill="#2e4c43">{p.heading}</text>
  <text x="48" y="182" fontSize="21" fill="#605b4b">{p.number}</text>
  {p.lines.map((line,i)=><text key={i} x="48" y={252+i*35} fontSize="26" fill="#303a34">{line}</text>)}
  <text x="362" y="686" fontSize="20" fill="#605b4b">{p.signatureLabel??'Petugas pelayanan,'}</text><path d="M380 727q35-56 42-8t38-5 61 8" stroke="#526d89" strokeWidth="3" fill="none"/>
  <text x="362" y="765" fontSize="22" fill="#303a34">{p.signature}</text>
 </>}
 </svg>;
};
