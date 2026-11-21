import type {Episode,Shot,CharacterProfile} from './types';
import {cast,fallbackCast,resolveCharacterDesign} from '../components/characters/cast';
const normalize=(value:string)=>value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const matches=(profile:CharacterProfile,request:string)=>{const a=normalize(profile.name);const b=normalize(request);return a===b||a.startsWith(`${b} `)||b.startsWith(`${a} `);};
const profilesFor=(episode:Episode):CharacterProfile[]=>episode.characters.length?episode.characters:[{name:cast[episode.id]?.hero.name??fallbackCast.hero.name,role:cast[episode.id]?.hero.role??fallbackCast.hero.role},{name:cast[episode.id]?.foil.name??fallbackCast.foil.name,role:cast[episode.id]?.foil.role??fallbackCast.foil.role}];
export const resolveSceneActors=(episode:Episode,shot:Shot)=>{
 const profiles=profilesFor(episode);const chosen=shot.characters.map((name)=>profiles.find((profile)=>matches(profile,name))).filter((x):x is CharacterProfile=>Boolean(x));
 const first=chosen[0]??profiles[0];const second=chosen.find((profile)=>normalize(profile.name)!==normalize(first.name))??profiles.find((profile)=>normalize(profile.name)!==normalize(first.name))??{name:fallbackCast.foil.name,role:fallbackCast.foil.role};
 return {first,second,firstDesign:resolveCharacterDesign(episode.id,first),secondDesign:resolveCharacterDesign(episode.id,second)};
};
export const isChildRole=(profile:CharacterProfile)=>/anak|murid|siswa|pelajar/i.test(`${profile.name} ${profile.role}`);
