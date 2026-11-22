import type {MouthShape} from './clips';
export type Utterance={speaker:'DARTO'|'PETUGAS';text:string;startFrame:number;endFrame:number;audioFile:string};
const nuclei=(text:string)=>[...text.toLocaleLowerCase().matchAll(/[aeiou]+/g)].map(m=>({at:m.index??0,vowel:m[0][0]}));
/** Coarse vowel-nucleus mouth keys; audio is timed, but without forced alignment this is explicitly not phoneme-accurate lip-sync. */
export const mouthAtUtterance=(utterance:Utterance,frame:number):MouthShape=>{
 if(frame<utterance.startFrame||frame>=utterance.endFrame)return 'rest';const units=nuclei(utterance.text);if(!units.length)return 'closed';const p=(frame-utterance.startFrame)/(utterance.endFrame-utterance.startFrame);const index=Math.min(units.length-1,Math.floor(p*units.length));const local=(p*units.length)-index;if(local<.12||local>.86)return 'closed';const vowel=units[index].vowel;return vowel==='o'||vowel==='u'?'round':vowel==='a'?'wide':'open';
};
