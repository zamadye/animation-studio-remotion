import type {ProofShot} from './ShotTimeline';
import type {Utterance} from './SpeechTrack';
export const proofUtterances:Utterance[]=[
 {speaker:'DARTO',text:'Bu, saya mau daftar bantuan. Tiga hari ini dapur kami nggak ngebul.',startFrame:0,endFrame:192,audioFile:'audio/proof-darto-01.mp3'},
 {speaker:'PETUGAS',text:'Kendaraan ada?',startFrame:192,endFrame:244,audioFile:'audio/proof-petugas-01.mp3'},
 {speaker:'DARTO',text:'Motor tua. Kalau hujan, dia ikut mogok.',startFrame:244,endFrame:375,audioFile:'audio/proof-darto-02.mp3'},
];
export const utteranceAt=(frame:number)=>proofUtterances.find(x=>frame>=x.startFrame&&frame<x.endFrame);
export const subtitleForShot=(shot:ProofShot)=>shot.subtitle;
