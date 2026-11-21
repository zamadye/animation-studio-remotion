import castData from './cast-data.json';
import type {CharacterProfile} from '../../data/types';
export type CharacterDesign={name:string;role:string;skin:string;hair:string;outfit:string;accent:string;hairShape:'short'|'bun'|'hijab'|'cap'|'curly';glasses?:boolean;apron?:boolean};
export type CastPair={hero:CharacterDesign;foil:CharacterDesign};
export const cast=castData as Record<string,CastPair>;
export const fallbackCast:CastPair={hero:{name:'Karakter utama',role:'tokoh cerita',skin:'#b98262',hair:'#302824',outfit:'#526c69',accent:'#d1aa60',hairShape:'short'},foil:{name:'Lawan adegan',role:'tokoh pendamping',skin:'#d5a180',hair:'#38302c',outfit:'#526878',accent:'#c7a95b',hairShape:'bun'}};
const extraPalettes=[
 {skin:'#b98262',hair:'#302824',outfit:'#6c7c6f',accent:'#d1a451'},
 {skin:'#d3a183',hair:'#382f2a',outfit:'#526f78',accent:'#c68360'},
 {skin:'#9f684c',hair:'#292825',outfit:'#876b55',accent:'#cfb06f'},
 {skin:'#c88e6a',hair:'#3a2e2a',outfit:'#736779',accent:'#7a9a89'},
 {skin:'#d4aa86',hair:'#362a27',outfit:'#5c7771',accent:'#cf875b'},
];
const stableIndex=(value:string)=>[...value].reduce((sum,char)=>(sum*31+char.charCodeAt(0))>>>0,7);
export const resolveCharacterDesign=(episodeId:string,profile:CharacterProfile):CharacterDesign=>{
 const known=cast[episodeId];if(known){const match=[known.hero,known.foil].find(c=>c.name.toLocaleLowerCase()===profile.name.toLocaleLowerCase());if(match)return match;}
 const hash=stableIndex(`${episodeId}:${profile.name}`);const palette=extraPalettes[hash%extraPalettes.length];const hairShapes:['short','bun','curly']=['short','bun','curly'];
 return {name:profile.name,role:profile.role,...palette,hairShape:hairShapes[(hash>>>3)%hairShapes.length],glasses:/petugas|guru|pejabat|bendahara/i.test(profile.name)?hash%3===0:false,apron:/penjahit|kasir|pedagang/i.test(profile.role)};
};
