import {cast} from './cast';
/** Stable story IDs, independent of episode hero/foil placement.
 * This registry contains design metadata only, never mounts any characters. */
export const darto=cast['01'].hero;
export const petugas=cast['01'].foil;
export const nina=cast['02'].hero;
export const hr=cast['02'].foil;
export const pria=cast['03'].hero;
export const influencer=cast['03'].foil;
export const ibuSari=cast['04'].hero;
export const bendahara=cast['04'].foil;
export const mira=cast['05'].hero;
export const humas=cast['05'].foil;
export const ayah=cast['06'].hero;
export const dini=cast['06'].foil;
export const pakBeni=cast['07'].hero;
export const koordinator=cast['07'].foil;
export const rika=cast['08'].hero;
export const manajer=cast['08'].foil;
// Story IDs must preserve the catalog design identity: costume artwork keys on design.name.
// Raka/Nisa are story IDs, not replacements for the visual identity Ayah/Mira.
export const raka=ayah;
export const nisa=mira;
export const characterRegistry={raka,nisa,darto,petugas,nina,hr,pria,influencer,ibuSari,bendahara,mira,humas,ayah,dini,pakBeni,koordinator,rika,manajer} as const;
export type CharacterId=keyof typeof characterRegistry;
