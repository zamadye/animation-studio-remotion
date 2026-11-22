import type {FaceViseme} from '../animation/faceRig';
/** Silent animatic fallback only. For audio, supply authored/aligned VisemeCue
 * intervals or the explicitly labeled audio-energy estimate used by the demo. */
export const textVisemeAt=(text:string,frame:number,duration:number):FaceViseme=>{
 if(frame<0||frame>=duration)return 'rest';
 const letters=[...text.toLowerCase()].filter(c=>'aeioubpmfvl'.includes(c));
 if(!letters.length)return 'rest';
 const progress=frame/Math.max(1,duration)*letters.length,phase=progress%1;
 if(phase<.12||phase>.88)return 'rest';
 const c=letters[Math.min(letters.length-1,Math.floor(progress))];
 const shapes={a:'A',e:'E',i:'E',o:'O',u:'U',b:'MBP',p:'MBP',m:'MBP',f:'FV',v:'FV',l:'L'} as const;
 return shapes[c as keyof typeof shapes];
};
