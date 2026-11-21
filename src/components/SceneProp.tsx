import React from 'react';
import type {Episode,Shot,TemplateId} from '../data/types';
const names:Record<string,string[]>={
 '01':['MAP LECEK','MOTOR TUA','UANG HASIL JUAL','KOTAK ASET','FORMULIR','PONSEL RETAK'],
 '02':['CV PERTAMA','KPI PENGALAMAN','PINTU KANTOR','PESAN IBU','KURSI WAWANCARA','TOMBOL TERIMA'],
 '03':['SELOKAN','TRIPOD / KAMERA','LAYAR GANDA','TALI PENOLONG','TANGAN MENOLONG','FRAME KOSONG'],
 '04':['FORMULIR SEKOLAH','AMPLOP IURAN','MESIN JAHIT','KOTAK DANA','KURSI ACARA','BUKU CATATAN'],
 '05':['PINTU RUMAH','GARIS AIR','PETA DRAINASE','PAPAN PROYEK','PONSEL WARGA','TANDA BANJIR'],
 '06':['PONSEL','JADWAL SEKOLAH','GRUP KELUARGA','KURSI KOSONG','FOTO PENGHARGAAN','GAMBAR DINI'],
 '07':['PAPAN JEMBATAN','NOMOR ANTREAN','PETA RUTE VIP','PALU & PAPAN','KENDARAAN','PAPAN DIBONGKAR'],
 '08':['UANG KEMBALIAN','KAMERA PONSEL','ROTI KEDALUWARSA','MEJA KOSONG','KAMERA CCTV','POSTER INTEGRITAS'],
};
const kind=(episode:string,n:number)=>{
 const table:Record<string,string[]>={
 '01':['paper','motor','money','form','form','phone'],'02':['paper','chart','door','phone','chair','phone'],'03':['water','camera','phone','rope','rope','camera'],'04':['paper','money','sewing','money','chair','paper'],'05':['water','water','map','bridge','phone','water'],'06':['phone','clock','phone','chair','paper','paper'],'07':['bridge','ticket','map','hammer','vehicle','bridge'],'08':['money','camera','bread','chair','camera','poster']};
 return table[episode]?.[n-1]??'paper';
};
const Icon:React.FC<{kind:string;phase:number}>=({kind,phase})=>{
 const stroke='#293238'; const common={fill:'#fff8e8',stroke,strokeWidth:5,strokeLinejoin:'round' as const};
 const wave=14+Math.sin(phase/18)*5;
 switch(kind){
 case 'phone':return <g><rect x="39" y="12" width="62" height="105" rx="10" {...common}/><rect x="47" y="23" width="46" height="75" fill="#cadbd2" stroke={stroke} strokeWidth="3"/><path d="M54 40h31M54 51h25M54 67h31" stroke="#4d7774" strokeWidth="4"/><circle cx="70" cy="107" r="3" fill={stroke}/></g>;
 case 'money':return <g><rect x="17" y="36" width="108" height="64" rx="8" fill="#d9c17f" stroke={stroke} strokeWidth="5"/><circle cx="71" cy="68" r="20" fill="#f3e6bb" stroke={stroke} strokeWidth="4"/><path d="M28 50h10M105 86h10" stroke={stroke} strokeWidth="4"/><text x="71" y="75" textAnchor="middle" fontSize="22" fontWeight="bold" fill={stroke}>Rp</text></g>;
 case 'water':return <g><path d={`M14 ${80+wave/4} Q35 ${67+wave/4} 55 ${80+wave/4} T98 ${80+wave/4} T132 ${80+wave/4} L132 116H14Z`} fill="#91b7b0" stroke={stroke} strokeWidth="5"/><path d="M29 36h83v44H29z" fill="#d8e2d7" stroke={stroke} strokeWidth="5"/><path d="M48 50h45M48 62h34" stroke="#708d87" strokeWidth="4"/></g>;
 case 'camera':return <g><rect x="20" y="42" width="106" height="68" rx="12" fill="#76858a" stroke={stroke} strokeWidth="5"/><path d="M42 42l10-18h35l12 18" fill="#a7b6ae" stroke={stroke} strokeWidth="5"/><circle cx="74" cy="75" r="24" fill="#d6d7c7" stroke={stroke} strokeWidth="5"/><circle cx="74" cy="75" r="12" fill="#527575"/></g>;
 case 'bridge':case 'vehicle':return <g><path d="M12 93h120M25 92l18-38 18 38 18-38 18 38 18-38 18 38" fill="none" stroke={stroke} strokeWidth="7"/><path d="M22 105h102" stroke="#a98254" strokeWidth="9"/></g>;
 case 'map':return <g><path d="M16 30l37-12 42 12 33-13v91l-33 14-42-14-37 14z" fill="#dce3cd" stroke={stroke} strokeWidth="5"/><path d="M53 21v88M95 30v82M30 85l26-19 25 10 25-31" fill="none" stroke="#b64d37" strokeWidth="5" strokeDasharray="7 6"/><circle cx="107" cy="45" r="7" fill="#b64d37"/></g>;
 case 'chair':return <g><path d="M43 23v53q0 10 12 10h40q12 0 12-10V23M55 86v30M96 86v30M43 61h64" fill="none" stroke={stroke} strokeWidth="9" strokeLinecap="round"/></g>;
 case 'clock':case 'chart':return <g><circle cx="72" cy="68" r="48" fill="#e8e0ce" stroke={stroke} strokeWidth="5"/><path d="M72 36v34l24 14" fill="none" stroke="#b64d37" strokeWidth="6" strokeLinecap="round"/><path d="M30 108h84" stroke={stroke} strokeWidth="4"/></g>;
 case 'bread':return <g><path d="M26 89 Q15 50 45 40 Q50 18 76 28 Q99 17 108 42 Q135 46 119 91 Q111 107 34 103Z" fill="#d4aa68" stroke={stroke} strokeWidth="5"/><path d="M48 47l12 15M76 39l12 15M98 48l10 13" stroke="#f2d89e" strokeWidth="5"/></g>;
 case 'motor':return <g><circle cx="39" cy="96" r="19" fill="#f3eee4" stroke={stroke} strokeWidth="6"/><circle cx="111" cy="96" r="19" fill="#f3eee4" stroke={stroke} strokeWidth="6"/><path d="M38 93l23-39 25 3 21 36M62 54l-8-15h25M79 62h25l10 31" fill="none" stroke="#54736d" strokeWidth="8" strokeLinecap="round"/><path d="M55 47h25" stroke={stroke} strokeWidth="7"/></g>;
 case 'ticket':case 'paper':case 'form':case 'poster':case 'sewing':return <g><path d="M36 18h70v100H36z" fill={kind==='poster'?'#efe0bd':'#fffaf0'} stroke={stroke} strokeWidth="5"/><path d="M49 39h43M49 53h43M49 67h32M49 84h40" stroke={kind==='poster'?'#b64d37':'#78817b'} strokeWidth="5"/><path d="M86 101l8 8 15-20" fill="none" stroke="#497c6e" strokeWidth="6"/></g>;
 case 'door':return <g><path d="M36 112V20h72v92z" fill="#a97952" stroke={stroke} strokeWidth="6"/><circle cx="92" cy="69" r="4" fill="#f0d28b"/></g>;
 case 'hammer':return <g><path d="M71 39v75" stroke="#8b6346" strokeWidth="11" strokeLinecap="round"/><path d="M43 28h57v20H43z" fill="#9aa4a0" stroke={stroke} strokeWidth="5"/><path d="M43 28l-12 15 12 5" fill="#9aa4a0" stroke={stroke} strokeWidth="5"/></g>;
 case 'rope':return <g><path d="M24 95 Q28 28 69 53 Q102 74 119 35" fill="none" stroke="#c6a05f" strokeWidth="12" strokeLinecap="round"/><path d="M24 95 Q28 28 69 53 Q102 74 119 35" fill="none" stroke={stroke} strokeWidth="3" strokeDasharray="5 8"/></g>;
 default:return <g><path d="M20 36h103v73H20z" fill="#d6ded4" stroke={stroke} strokeWidth="5"/><path d="M33 52h77M33 67h65M33 82h72" stroke="#6c817a" strokeWidth="4"/><circle cx="111" cy="31" r="13" fill="#c16c53" stroke={stroke} strokeWidth="4"/></g>;
 }
};
export const SceneProp:React.FC<{episode:Episode;shot:Shot;frame:number;scale:number;variant?:TemplateId;reducedMotion?:boolean}> = ({episode,shot,frame,scale,variant='CARTOON-STAGE-DIALOGUE',reducedMotion=false})=>{
 const label=(names[episode.id]??names['01'])[shot.number-1]??'PROP'; const type=kind(episode.id,shot.number); const t=reducedMotion?0:frame/30; const enter=reducedMotion?1:Math.min(1,Math.max(0,(frame-shot.startSeconds*30)/10)); const propScale=scale*(variant==='CARTOON-EVIDENCE-INSERT'?1.28:1);
 return <div style={{position:'absolute',left:'50%',top:variant==='CARTOON-EVIDENCE-INSERT'?'4%':'12%',width:144*propScale,height:140*propScale,transform:`translate(-50%,${(1-enter)*8*propScale}px)`,opacity:.96}}>
  <svg viewBox="0 0 144 140" width="100%" height="100%" style={{overflow:'visible'}}><rect x="3" y="3" width="138" height="134" rx="7" fill="#fffdf8" stroke="#283239" strokeWidth="3"/><Icon kind={type} phase={t}/><path d="M11 119h122" stroke="#d8cdbd" strokeWidth="2"/></svg>
  <div style={{position:'absolute',left:5,right:5,bottom:6,textAlign:'center',font:'700 8px/1.2 ui-monospace,monospace',letterSpacing:'.04em',color:'#40474a'}}>{label}</div>
 </div>;
};
