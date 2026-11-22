import {sampleDemoSpeech,type FaceEmotion,type FaceState,type FaceViseme} from './faceRig';
export const FACE_FPS=24;
export const FACE_FRAMES=60;
export const faceCatalogIndex:ReadonlyArray<{label:string;emotion:FaceEmotion;speech?:boolean;phonemes?:boolean}>=[
 {label:'00 · Netral + kedip',emotion:'neutral'},
 {label:'01 · Bentuk mulut / fonem',emotion:'neutral',phonemes:true},
 {label:'02 · Bicara netral',emotion:'neutral',speech:true},
 {label:'03 · Senang / senyum',emotion:'happy'},
 {label:'04 · Tertawa',emotion:'laughing'},
 {label:'05 · Sedih',emotion:'sad'},
 {label:'06 · Menangis / air mata',emotion:'crying'},
 {label:'07 · Marah',emotion:'angry'},
 {label:'08 · Marah sambil bicara',emotion:'angry',speech:true},
 {label:'09 · Takut / cemas',emotion:'afraid'},
 {label:'10 · Terkejut',emotion:'surprised'},
 {label:'11 · Curiga',emotion:'suspicious'},
 {label:'12 · Lelah',emotion:'tired'},
 {label:'13 · Malu',emotion:'embarrassed'},
 {label:'14 · Sedih sambil bicara',emotion:'sad',speech:true},
 {label:'15 · Menangis sambil bicara',emotion:'crying',speech:true},
];
export const FACE_DURATION=faceCatalogIndex.length*FACE_FRAMES;
const ease=(u:number)=>{const x=Math.max(0,Math.min(1,u));return x*x*(3-2*x);};
export const sampleFaceCatalog=(frame:number,expressionIndex?:number)=>{
 const safe=Math.max(0,Math.min(FACE_DURATION-1,Math.floor(frame))),local=safe%FACE_FRAMES;
 const index=expressionIndex===undefined?Math.floor(safe/FACE_FRAMES):Math.max(0,Math.min(faceCatalogIndex.length-1,Math.floor(expressionIndex)));
 const item=faceCatalogIndex[index],u=local/(FACE_FRAMES-1);
 const intensity=u<.2?ease(u/.2):u>.8?ease((1-u)/.2):1;
 const blink=local>=27&&local<=32?Math.sin((local-27)/5*Math.PI):0;
 const face:FaceState={emotion:item.emotion,intensity,viseme:'rest',blink,tearPhase:(local%24)/24,gazeX:0,gazeY:0};
 if(item.speech)Object.assign(face,sampleDemoSpeech(local,FACE_FPS));
 if(item.phonemes){const visemes:FaceViseme[]=['rest','MBP','A','E','O','U','FV','L'];face.viseme=visemes[Math.min(7,Math.floor(local/7.5))];face.openness=1;}
 return {index,label:item.label,local,face};
};
