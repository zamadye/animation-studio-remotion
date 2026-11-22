import {character,perform,hold} from '../compose';
import {march,rightArm,idle} from '../motions';
import {validateStoryScene} from '../evaluate';
import type {PhoneContent} from '../../props/types';
/** Self-contained authoring example: swap ID, motion, emotion or prop independently. */
const chat:PhoneContent={kind:'phone',id:'contoh-chat',contact:'Ibu',messages:[{from:'them',lines:['Sudah sampai, Nak?']},{from:'me',lines:['Sudah, Bu.']}]};
export const plugAndPlayScene=validateStoryScene({
 id:'plug-and-play-example',fps:24,duration:240,
 actors:[character({id:'darto',x:650,scale:1.1,duration:240,
  motions:[perform(march,0,60),perform(rightArm,60,60),perform(idle,120,120)],
  expression:'happy',props:[hold(chat,'right',0,240)],
 })],speech:[],
});
// march is the locked in-place cycle, NOT path-following locomotion.
// Render with WorldStoryScene or PropReadShot in a 1920x1080, 24fps composition.
