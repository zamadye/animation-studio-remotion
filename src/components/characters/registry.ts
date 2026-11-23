import { cast, type CharacterDesign } from './cast';

/** Stable story IDs, independent of episode hero/foil placement.
 * This registry contains design metadata only, never mounts any characters. */
export const darto = cast['01'].hero;
export const petugas = cast['01'].foil;
export const nina = cast['02'].hero;
export const hr = cast['02'].foil;
export const pria = cast['03'].hero;
export const influencer = cast['03'].foil;
export const ibuSari = cast['04'].hero;
export const bendahara = cast['04'].foil;
export const mira = cast['05'].hero;
export const humas = cast['05'].foil;
export const ayah = cast['06'].hero;
export const dini = cast['06'].foil;
export const pakBeni = cast['07'].hero;
export const koordinator = cast['07'].foil;
export const rika = cast['08'].hero;
export const manajer = cast['08'].foil;

export const raka: CharacterDesign = {
  name: 'Raka',
  role: 'pekerja kantoran muda',
  skin: '#b87f5d',
  hair: '#272422',
  outfit: '#446d73',
  accent: '#c9934c',
  hairShape: 'textured',
  bodyShape: 'average',
  presentation: 'masculine',
  costume: 'workwear',
  lowerGarment: 'trousers',
  lowerGarmentColor: '#3b4042',
  biometrics: {
    face: {
      ageGroup: 'young',
      faceShape: 'diamond',
      headWidth: 0.97,
      headHeight: 1.04,
      jawWidth: 0.93,
      cheekbone: 1.06,
      chinLength: 3,
      eyeShape: 'almond',
      eyeSpacing: 1.0,
      eyeScale: 1.02,
      eyelashes: false,
      browStyle: 'straight',
      noseShape: 'straight',
      lipStyle: 'medium',
      facialHair: 'none',
      wrinkles: 0.08,
      eyeBags: 0.2,
      grayHair: 0,
      frecklesOrMoles: 'none',
    },
    body: {
      neckWidth: 33,
      neckLength: 1.04,
      hipRatio: 0.93,
      bellyCurve: 0,
      limbThickness: 0.98,
      handScale: 1.0,
      footwear: 'sneakers',
      postureSlouch: 0.5,
      motionTempo: 1.06,
    },
  },
};

export const nisa: CharacterDesign = {
  name: 'Nisa',
  role: 'istri Raka',
  skin: '#d8a684',
  hair: '#3b2b26',
  outfit: '#b86a56',
  accent: '#e5c687',
  hairShape: 'hijab',
  bodyShape: 'slim',
  presentation: 'feminine',
  costume: 'casual',
  lowerGarment: 'skirt',
  lowerGarmentColor: '#4c464a',
  heightScale: 0.96,
  biometrics: {
    face: {
      ageGroup: 'young',
      faceShape: 'oval',
      headWidth: 0.95,
      headHeight: 0.98,
      jawWidth: 0.78,
      cheekbone: 1.02,
      chinLength: 0,
      eyeShape: 'round',
      eyeSpacing: 1.03,
      eyeScale: 1.1,
      eyelashes: true,
      browStyle: 'arched',
      noseShape: 'soft',
      lipStyle: 'full',
      lipColor: '#c4756a',
      facialHair: 'none',
      wrinkles: 0.05,
      eyeBags: 0,
      grayHair: 0,
      frecklesOrMoles: 'mole-left',
    },
    body: {
      neckWidth: 25,
      neckLength: 1.04,
      hipRatio: 1.14,
      bellyCurve: 0,
      limbThickness: 0.86,
      handScale: 0.9,
      footwear: 'flats',
      postureSlouch: 0,
      motionTempo: 1.05,
    },
  },
};

export const characterRegistry = {
  darto,
  petugas,
  nina,
  hr,
  pria,
  influencer,
  ibuSari,
  bendahara,
  mira,
  humas,
  ayah,
  dini,
  pakBeni,
  koordinator,
  rika,
  manajer,
  raka,
  nisa,
} as const;

export type CharacterId = keyof typeof characterRegistry;
