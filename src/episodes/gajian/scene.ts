import type {StorySceneDefinition} from '../../story/types';
import type {PhoneContent,LetterContent,WalletContent,HeldContent} from '../../props/types';
import {character,perform,hold} from '../../story/compose';
import {rightArm,sitDown,seatedLean} from '../../story/motions';
import {validateStoryScene} from '../../story/evaluate';
import timing from './timeline.json';
export const GAJIAN_DURATION=timing.duration;
export const gajianTimeline=timing;
export const budget={income:3200000,motor:850000,loan:420000,rent:1000000,utilities:250000,food:700000,mother:500000};
export const expenseTotal=budget.motor+budget.loan+budget.rent+budget.utilities+budget.food+budget.mother;
export const bank=(step:number):PhoneContent=>({kind:'phone',id:'hp-raka',mode:'bank',contact:'Rekening Raka',messages:[],bank:{label:step===0?'Gaji masuk':step===1?'Setelah cicilan motor':step===2?'Sisa setelah pinjaman':'Hitungan bulan ini',amount:step===0?'Rp3.200.000':step===1?'Rp2.350.000':step===2?'Rp1.930.000':'−Rp520.000',notices:step===0?['Gaji +Rp3.200.000']:step===1?['Motor −Rp850.000']:step===2?['Motor −Rp850.000','Pinjaman −Rp420.000']:['Gaji Rp3.200.000','Total keluar Rp3.720.000','Selisih −Rp520.000']}});
export const notebook:LetterContent={kind:'letter',layout:'notebook',id:'buku-nisa',heading:'BULAN INI',number:'Pengeluaran keluarga',lines:['Motor                 850.000','Pinjaman              420.000','Kontrakan           1.000.000','Listrik + air         250.000','Dapur                 700.000','Untuk Ibu             500.000','','Total             Rp3.720.000','Gaji              Rp3.200.000','Kurang              Rp520.000'],signature:'Nisa'};
export const wallet:WalletContent={kind:'wallet',id:'dompet-raka'};
export const buildGajianScene=(index:number,frame:number):StorySceneDefinition=>{
 const t=timing.scenes[index],n=t.lines.length;
 const step=index>0?3:frame>t.lines[2].start?2:frame>t.lines[1].start?1:0;
 const lastWallet=index===2&&frame>=t.lines[6].start;
 const prop:HeldContent=lastWallet?wallet:bank(step);
 const book=index===0||index===1&&frame<t.lines[3].start?{...notebook,lines:['Kontrakan Rp1.000.000','Listrik + air Rp250.000','Dapur Rp700.000','','Total rumah Rp1.950.000']}:notebook;
 const raka=character({id:'raka',x:55,scale:1.4,duration:t.duration,expression:index===0?'happy':index===1?'sad':'tired',motions:index===0?[perform(rightArm,0,48)]:[perform(sitDown,0,60),perform(seatedLean,60,60)],props:[hold(prop,'right',0,t.duration)]});
 const nisa=character({id:'nisa',x:520,scale:1.4,duration:t.duration,expression:index===0?'neutral':index===1?'angry':'sad',motions:index===0?[]:[perform(sitDown,0,60),perform(seatedLean,60,60)],props:[hold(book,'left',0,t.duration)]});
 raka.seat='none';nisa.seat='none';
 // Enter on her first scripted turn; no extra physical cast.
 if(index===0){nisa.enter=t.lines[3].start;nisa.props=[hold(book,'left',nisa.enter,t.duration)];}
 if(index===1)nisa.emotions=[{start:0,end:t.lines[4].start,emotion:'angry'},{start:t.lines[4].start,end:t.duration,emotion:'sad'}];
 return validateStoryScene({id:'gajian-'+index,fps:24,duration:t.duration,actors:[raka,nisa],speech:t.lines.map(l=>({...l,speaker:l.speaker as 'raka'|'nisa',visemes:l.visemes as StorySceneDefinition['speech'][number]['visemes'],alignment:'audio-energy-text-estimate' as const}))});
};
