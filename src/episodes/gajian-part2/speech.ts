import source from './source.json';
import type {SpeechCue} from '../../story/types';
/** Source SRT owns utterance boundaries. Amplitude gates the mouth in pauses.
 * Shape variation is text-estimated, NOT a phoneme forced alignment claim.
 */
export const rakaSpeech=(start:number,duration:number):SpeechCue[]=>source.cues.flatMap(c=>{
 const a=Math.max(start,Math.round(c.start*24)),b=Math.min(start+duration,Math.round(c.end*24));
 if(b<=a)return [];
 const letters=[...c.sourceText.toLowerCase()].filter(x=>/[aeioubpmfv]/.test(x));
 return [{id:'raka-source-'+c.id,speaker:'raka' as const,start:a-start,end:b-start,text:c.sourceText,alignment:'audio-energy-text-estimate' as const,visemes:Array.from({length:b-a},(_,i)=>{
  const frame=a+i,energy=source.energy[frame]??0,progress=(frame/24-c.start)/(c.end-c.start),ch=letters[Math.min(letters.length-1,Math.floor(progress*letters.length))]??'a';
  const viseme=energy<.09?'rest':ch==='o'?'O':ch==='u'?'U':ch==='e'||ch==='i'?'E':ch==='b'||ch==='p'||ch==='m'?'MBP':ch==='f'||ch==='v'?'FV':'A';
  return {start:i,end:i+1,viseme,openness:energy<.09?0:Math.max(.18,energy)};
 })} as SpeechCue];
});
