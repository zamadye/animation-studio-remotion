import type {ActingPose} from './clips';
export type FaceEmotion='neutral'|'happy'|'laughing'|'sad'|'crying'|'angry'|'afraid'|'surprised'|'suspicious'|'tired'|'embarrassed';
export type FaceViseme='rest'|'A'|'E'|'O'|'U'|'MBP'|'FV'|'L';
export type FaceState={emotion:FaceEmotion;intensity?:number;viseme?:FaceViseme;openness?:number;blink?:number;tearPhase?:number;gazeX?:number;gazeY?:number};
export const clampFace=(x:number)=>Math.max(0,Math.min(1,x));
export const faceFromPose=(pose:Partial<ActingPose>):FaceState=>{
 const e=pose.expression;
 const emotion:FaceEmotion=e==='angry'||e==='frustrated'?'angry':e==='defeated'||e==='pleading'||e==='uncertain'?'sad':e==='surprised'||e==='shocked'?'surprised':e==='suspicious'||e==='evaluating'||e==='dismissive'?'suspicious':e==='exhausted'?'tired':e==='embarrassed'?'embarrassed':e==='hopeful'?'happy':'neutral';
 return {emotion,intensity:1,viseme:pose.mouth==='open'?'A':pose.mouth==='wide'?'E':pose.mouth==='round'?'O':pose.mouth==='closed'?'MBP':'rest',blink:pose.blink?1:0,gazeX:pose.gazeX??0,gazeY:pose.gazeY??0};
};
const channels={
 neutral:{inner:0,outer:0,eye:1,smile:0,blush:0,tears:0},
 happy:{inner:-2,outer:-2,eye:.8,smile:1,blush:.22,tears:0},
 laughing:{inner:-4,outer:-2,eye:.1,smile:1,blush:.35,tears:0},
 sad:{inner:-8,outer:3,eye:.75,smile:-1,blush:0,tears:0},
 crying:{inner:-11,outer:5,eye:.23,smile:-1,blush:.3,tears:1},
 angry:{inner:8,outer:-6,eye:.68,smile:-.6,blush:.28,tears:0},
 afraid:{inner:-9,outer:-2,eye:1.5,smile:-.7,blush:0,tears:0},
 surprised:{inner:-9,outer:-9,eye:1.65,smile:0,blush:0,tears:0},
 suspicious:{inner:2,outer:-2,eye:.55,smile:-.3,blush:0,tears:0},
 tired:{inner:2,outer:1,eye:.35,smile:-.4,blush:0,tears:0},
 embarrassed:{inner:-4,outer:2,eye:.7,smile:.35,blush:.65,tears:0},
} as const;
export const faceChannels=(face:FaceState)=>{
 const intensity=clampFace(face.intensity??1),c=channels[face.emotion];
 return {inner:c.inner*intensity,outer:c.outer*intensity,eye:(1+(c.eye-1)*intensity)*(1-clampFace(face.blink??0)),smile:c.smile*intensity,blush:c.blush*intensity,tears:c.tears*intensity};
};
const vowels:FaceViseme[]=['MBP','A','E','O','U','FV','L','A','MBP','rest'];
/** Deterministic phonetic demonstration. Real dialogue should supply timed
 * viseme cues; this is deliberately not described as audio-derived lip sync. */
export const sampleDemoSpeech=(frame:number,fps=24):{viseme:FaceViseme;openness:number}=>{
 const step=Math.max(1,Math.round(fps/6)),f=Math.max(0,frame),u=(f%step)/step;
 return {viseme:vowels[Math.floor(f/step)%vowels.length],openness:.65+.35*Math.sin(Math.PI*u)};
};
