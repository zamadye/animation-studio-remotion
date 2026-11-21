import type {Episode,Shot,CharacterProfile} from './types';
import {cast,fallbackCast,resolveCharacterDesign} from '../components/characters/cast';
const normalize=(value:string)=>value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const matches=(profile:CharacterProfile,request:string)=>{const a=normalize(profile.name);const b=normalize(request);return a===b||a.startsWith(`${b} `)||b.startsWith(`${a} `);};
const profilesFor=(episode:Episode):CharacterProfile[]=>episode.characters.length?episode.characters:[{name:cast[episode.id]?.hero.name??fallbackCast.hero.name,role:cast[episode.id]?.hero.role??fallbackCast.hero.role},{name:cast[episode.id]?.foil.name??fallbackCast.foil.name,role:cast[episode.id]?.foil.role??fallbackCast.foil.role}];
const isOffscreenVoice=(name:string,role='')=>/telepon|suara|pengeras|voice.?over|off.?screen/i.test(`${name} ${role}`);
export const resolveSceneActors=(episode:Episode,shot:Shot)=>{
 const profiles=profilesFor(episode);const sourceCast=shot.characters.map(name=>profiles.find(profile=>matches(profile,name))??{name,role:'source-listed scene character'});
 // A plainly named dialogue participant missing from the cast list (e.g. PEMBELI) still needs a distinct staged design.
 const dialogueSpeakers=(shot.dialogue??'').split('\n').map(line=>line.match(/^\s*([^:]{1,55}):\s*/)?.[1]?.trim()).filter((name):name is string=>Boolean(name));
 const explicitSpeakers=dialogueSpeakers.filter(name=>!isOffscreenVoice(name));const candidates=[...sourceCast,...explicitSpeakers.map(name=>profiles.find(profile=>matches(profile,name))??{name,role:'speaking participant inferred from source dialogue'})].filter(profile=>!isOffscreenVoice(profile.name,profile.role));
 const unique=candidates.filter((profile,index)=>candidates.findIndex(other=>normalize(other.name)===normalize(profile.name))===index).slice(0,2);
 const first=unique[0]??profiles[0]??{name:fallbackCast.hero.name,role:fallbackCast.hero.role};const second=unique[1]??{name:fallbackCast.foil.name,role:fallbackCast.foil.role};
 return {first,second,hasSecond:unique.length>1,firstDesign:resolveCharacterDesign(episode.id,first),secondDesign:resolveCharacterDesign(episode.id,second)};
};
export const isChildRole=(profile:CharacterProfile)=>/anak|murid|siswa|pelajar/i.test(`${profile.name} ${profile.role}`);
