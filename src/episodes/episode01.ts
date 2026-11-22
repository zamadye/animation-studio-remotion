import {character,perform,hold} from '../story/compose';
import {rightArm,idle} from '../story/motions';
import {validateStoryScene} from '../story/evaluate';
import type {SpeechCue} from '../story/types';
import type {LetterContent,PhoneContent} from '../props/types';
import timelineData from './ep01-timeline.json';
export type EpisodeLine={id:string;shot:number;speaker:string;text:string;start:number;end:number;audio:string;visemes:SpeechCue['visemes']};
export const episodeLines=timelineData as EpisodeLine[];
export const application:LetterContent={kind:'letter',id:'map-permohonan',heading:'PERMOHONAN BANTUAN',number:'Pemohon: Darto',lines:['Pekerjaan: buruh harian','','Tiga hari dapur tidak ngebul.','','Kendaraan: motor tua','Dipakai untuk mencari kerja.'],signatureLabel:'Pemohon,',signature:'Darto'};
export const rejection:LetterContent={kind:'letter',id:'hasil-pemeriksaan',heading:'BELUM MEMENUHI SYARAT',number:'Hasil pemeriksaan berkas',lines:['Pemohon: Darto','','Kepemilikan aset: MOTOR','','Status permohonan: DITUNDA','','Catatan:','Masih memiliki kendaraan.'],signature:'Petugas pelayanan'};
export const receipt:LetterContent={kind:'letter',id:'bukti-jual-motor',heading:'MOTOR SUDAH DIJUAL',number:'Catatan Darto',lines:['Motor tua dilepas.','','Uangnya untuk membeli beras.','','Sekarang mencari kerja','harus berjalan kaki.'],signatureLabel:'Pemohon,',signature:'Darto'};
export const call:PhoneContent={kind:'phone',mode:'call',id:'telepon-anak',contact:'Anak · telepon',messages:[{from:'them',lines:['Pak, hari ini kita','makan apa?']},{from:'me',lines:['Bapak usahakan, Nak.']}]};
export const shotTimes=[0,12,26,40,56,72,90].map(s=>s*24);
export const shotLocations=['Kantor pelayanan','Meja petugas','Pinggir jalan','Kantor pelayanan','Kantor pelayanan','Teras kantor'];
export const shotLabels=['Permohonan','Punya aset','Motor dilepas','Dianggap simpanan','Bukti usaha','Tidak tertinggal?'];
export const episodeScenes=shotLocations.map((_,index)=>{
 const start=shotTimes[index],end=shotTimes[index+1],duration=end-start;
 const lines=episodeLines.filter(l=>l.shot===index+1);
 const actors=[character({id:'darto',x:index===2||index===5?760:430,scale:1.05,duration,
  expression:index<2?'sad':index===3?'surprised':index===5?'crying':'tired',
  motions:[perform(rightArm,0,60),perform(idle,60,duration-60)],
  props:index===0?[hold(application,'right',0,duration)]:index===2?[hold(receipt,'right',0,duration)]:index===5?[hold(call,'right',0,duration)]:[],
 })];
 if(index!==2&&index!==5)actors.push(character({id:'petugas',x:1110,scale:1.05,duration,expression:index===4?'suspicious':'neutral'}));
 return validateStoryScene({id:`episode01-shot-${index+1}`,fps:24,duration,actors,speech:lines.filter(l=>['DARTO','PETUGAS'].includes(l.speaker)).map(l=>({id:l.id,speaker:l.speaker==='DARTO'?'darto':'petugas',start:l.start-start,end:l.end-start,text:l.text,audio:l.audio,alignment:'audio-energy-text-estimate',visemes:l.visemes}))});
});

export const savings:LetterContent={kind:'letter',id:'uang-simpanan',heading:'DIANGGAP SIMPANAN',number:'Uang hasil penjualan motor',lines:['Tujuan: membeli beras.','','Motor sudah tidak ada.','Pekerjaan ikut hilang.','','Namun uang untuk makan','dianggap sebagai simpanan.'],signatureLabel:'Ringkasan fiksi,',signature:'Catatan cerita · fiksi'};
