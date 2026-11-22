import React from 'react';
import {Sequence} from 'remotion';
import {character,perform,hold} from '../story/compose';
import {rightArm} from '../story/motions';
import {validateStoryScene} from '../story/evaluate';
import {PropReadShot} from '../camera/PropReadShot';
import type {PhoneContent,LetterContent} from './types';
export const exampleChat:PhoneContent={kind:'phone',id:'hp-undangan',contact:'Bu Rina · HR',messages:[
 {from:'them',lines:['Pak Darto, besok','wawancara jam 09.00.']},
 {from:'them',lines:['Bawa KTP dan surat','lamaran, ya Pak.']},
 {from:'me',lines:['Baik, Bu.','Terima kasih.']},
]};
export const exampleLetter:LetterContent={kind:'letter',id:'surat-undangan',heading:'UNDANGAN WAWANCARA',number:'Nomor: 014/HR/XI/2026',lines:['Kepada Bapak Darto,','','Mohon hadir untuk wawancara:','Senin, 23 November 2026','Pukul 09.00 WITA','Ruang HR, lantai 1.','','Bawa KTP dan surat lamaran.'],signature:'Rina · Bagian HR'};
export const phoneScene=validateStoryScene({id:'phone-read-proof',fps:24,duration:288,actors:[character({id:'darto',x:650,scale:1.15,duration:288,motions:[perform(rightArm,0,60)],expression:'happy',props:[hold(exampleChat,'right',0,288)]})],speech:[]});
export const letterScene=validateStoryScene({id:'letter-read-proof',fps:24,duration:336,actors:[character({id:'darto',x:650,scale:1.15,duration:336,motions:[perform(rightArm,0,60)],expression:'neutral',props:[hold(exampleLetter,'right',0,336)]})],speech:[]});
export const PropCameraProof:React.FC=()=> <>
 <Sequence from={0} durationInFrames={288}><PropReadShot episodeId="02" location="Ruang wawancara" scene={phoneScene} actorId="darto" propId={exampleChat.id} camera={{pushStart:60,insertStart:96,returnStart:264}}/></Sequence>
 <Sequence from={288} durationInFrames={336}><PropReadShot episodeId="02" location="Ruang wawancara" scene={letterScene} actorId="darto" propId={exampleLetter.id} camera={{pushStart:60,insertStart:96,returnStart:312}}/></Sequence>
 </>;
