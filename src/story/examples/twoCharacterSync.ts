import {darto,petugas} from '../../components/characters/registry';
import {march,rightArm,sitDown,seatedLean,seatedGesture,standUp,idle} from '../motions';
import {validateStoryScene} from '../evaluate';
import type {SpeechCue} from '../types';
import speech from './syncSpeech.json';
/** Only these two actors are mounted; the other fourteen are not scene members. */
export const twoCharacterSync=validateStoryScene({
 id:'two-character-sync',fps:24,duration:432,
 actors:[
  {id:'darto',design:darto,x:430,scale:1.05,body:[
   {start:0,duration:60,motion:march},{start:60,duration:60,motion:rightArm},
   {start:120,duration:60,motion:sitDown},{start:180,duration:60,motion:seatedLean},
   {start:240,duration:60,motion:seatedGesture},{start:300,duration:60,motion:seatedLean},
   {start:360,duration:60,motion:standUp},{start:420,duration:12,motion:idle},
  ],emotions:[{start:120,end:288,emotion:'sad'},{start:288,end:360,emotion:'crying'},{start:360,end:432,emotion:'neutral'}]},
  {id:'petugas',design:petugas,x:1110,scale:1.05,body:[{start:288,duration:60,motion:rightArm}],emotions:[{start:180,end:240,emotion:'surprised'},{start:240,end:360,emotion:'angry'}]},
 ],speech:speech as SpeechCue[],
});
