import type { ActingPose } from './clips';

export type FaceEmotion =
  | 'neutral'
  | 'happy'
  | 'laughing'
  | 'sad'
  | 'crying'
  | 'angry'
  | 'afraid'
  | 'surprised'
  | 'suspicious'
  | 'tired'
  | 'embarrassed';

export type FaceViseme = 'rest' | 'A' | 'E' | 'O' | 'U' | 'MBP' | 'FV' | 'L';

export type AgeGroup = 'child' | 'young' | 'adult' | 'middle' | 'senior';

export type FaceShape =
  | 'round'
  | 'oval'
  | 'oblong'
  | 'square'
  | 'heart'
  | 'diamond'
  | 'pear';

export type EyeShape = 'almond' | 'round' | 'hooded' | 'narrow' | 'wide';

export type NoseShape = 'button' | 'straight' | 'broad' | 'aquiline' | 'soft';

export type BrowStyle =
  | 'thick'
  | 'arched'
  | 'straight'
  | 'bushy'
  | 'thin'
  | 'soft';

export type LipStyle = 'thin' | 'medium' | 'full' | 'wide';

export type FacialHair =
  | 'none'
  | 'stubble'
  | 'mustache'
  | 'goatee'
  | 'short-beard';

export type HairStyle =
  | 'short'
  | 'crop'
  | 'parted'
  | 'receding'
  | 'textured'
  | 'bun'
  | 'low-bun'
  | 'bob'
  | 'ponytail'
  | 'pigtails'
  | 'hijab'
  | 'curly'
  | 'cap';

export type FootwearStyle =
  | 'boots'
  | 'loafers'
  | 'flats'
  | 'sneakers'
  | 'school';

export type FaceBiometrics = {
  ageGroup: AgeGroup;
  faceShape: FaceShape;
  headWidth: number;
  headHeight: number;
  jawWidth: number;
  cheekbone: number;
  chinLength: number;
  eyeShape: EyeShape;
  eyeSpacing: number;
  eyeScale: number;
  eyelashes?: boolean;
  browStyle: BrowStyle;
  noseShape: NoseShape;
  lipStyle: LipStyle;
  lipColor?: string;
  facialHair?: FacialHair;
  wrinkles: number;
  eyeBags?: number;
  grayHair?: number;
  frecklesOrMoles?: 'none' | 'freckles' | 'mole-left' | 'mole-right';
};

export type BodyBiometrics = {
  neckWidth: number;
  neckLength: number;
  hipRatio: number;
  bellyCurve: number;
  limbThickness: number;
  handScale: number;
  footwear: FootwearStyle;
  postureSlouch: number;
  motionTempo: number;
};

export type CharacterBiometrics = {
  face: FaceBiometrics;
  body: BodyBiometrics;
};

export const DEFAULT_FACE_BIOMETRICS: FaceBiometrics = {
  ageGroup: 'adult',
  faceShape: 'oval',
  headWidth: 1,
  headHeight: 1,
  jawWidth: 1,
  cheekbone: 1,
  chinLength: 0,
  eyeShape: 'almond',
  eyeSpacing: 1,
  eyeScale: 1,
  eyelashes: false,
  browStyle: 'straight',
  noseShape: 'straight',
  lipStyle: 'medium',
  facialHair: 'none',
  wrinkles: 0.15,
  eyeBags: 0,
  grayHair: 0,
  frecklesOrMoles: 'none',
};

export const DEFAULT_BODY_BIOMETRICS: BodyBiometrics = {
  neckWidth: 34,
  neckLength: 1,
  hipRatio: 0.96,
  bellyCurve: 0,
  limbThickness: 1,
  handScale: 1,
  footwear: 'loafers',
  postureSlouch: 0,
  motionTempo: 1,
};

export const resolveCharacterBiometrics = (meta: {
  presentation?: string;
  bodyShape?: string;
  child?: boolean;
  biometrics?: {
    face?: Partial<FaceBiometrics>;
    body?: Partial<BodyBiometrics>;
  };
}): CharacterBiometrics => {
  const fem = meta.presentation === 'feminine';
  const masc = meta.presentation === 'masculine';
  const broad = meta.bodyShape === 'broad';
  const slim = meta.bodyShape === 'slim';
  const child = Boolean(meta.child);

  const baseFace: FaceBiometrics = {
    ...DEFAULT_FACE_BIOMETRICS,
    ageGroup: child ? 'child' : 'adult',
    faceShape: child ? 'round' : fem ? 'oval' : masc ? 'square' : 'oblong',
    headWidth: child ? 1.05 : fem ? 0.96 : broad ? 1.05 : 1,
    headHeight: child ? 0.92 : 1,
    jawWidth: child ? 0.88 : fem ? 0.82 : masc ? 1.05 : 0.94,
    chinLength: child ? -4 : 0,
    eyeShape: child ? 'wide' : fem ? 'almond' : 'hooded',
    eyeScale: child ? 1.2 : 1,
    eyelashes: fem || child,
    browStyle: child ? 'soft' : fem ? 'arched' : masc ? 'thick' : 'straight',
    noseShape: child ? 'button' : fem ? 'soft' : 'straight',
    lipStyle: fem ? 'full' : 'medium',
    wrinkles: child ? 0 : 0.2,
  };

  const baseBody: BodyBiometrics = {
    ...DEFAULT_BODY_BIOMETRICS,
    neckWidth: child ? 22 : fem ? 26 : broad ? 40 : slim ? 30 : 35,
    neckLength: child ? 0.85 : fem ? 1.06 : 1,
    hipRatio: child ? 0.94 : fem ? 1.14 : 0.94,
    bellyCurve: broad ? 5 : 0,
    limbThickness: child ? 0.74 : slim ? 0.88 : broad ? 1.12 : 1,
    handScale: child ? 0.78 : fem ? 0.92 : 1,
    footwear: child ? 'school' : fem ? 'flats' : masc ? 'boots' : 'loafers',
    postureSlouch: 0,
    motionTempo: child ? 1.18 : 1,
  };

  return {
    face: { ...baseFace, ...meta.biometrics?.face },
    body: { ...baseBody, ...meta.biometrics?.body },
  };
};

const FACE_SHAPE_PRESETS: Record<
  FaceShape,
  {
    templeW: number;
    cheekW: number;
    jawW: number;
    chinW: number;
    crownFlat: number;
    jawSquare: number;
  }
> = {
  round: {
    templeW: 1.04,
    cheekW: 1.07,
    jawW: 0.92,
    chinW: 0.56,
    crownFlat: 0,
    jawSquare: 0.15,
  },
  oval: {
    templeW: 0.96,
    cheekW: 0.98,
    jawW: 0.84,
    chinW: 0.42,
    crownFlat: 0,
    jawSquare: 0.1,
  },
  oblong: {
    templeW: 0.92,
    cheekW: 0.91,
    jawW: 0.86,
    chinW: 0.46,
    crownFlat: 0.12,
    jawSquare: 0.3,
  },
  square: {
    templeW: 1.02,
    cheekW: 1.02,
    jawW: 0.9,
    chinW: 0.56,
    crownFlat: 0.25,
    jawSquare: 0.55,
  },
  heart: {
    templeW: 1.05,
    cheekW: 1.04,
    jawW: 0.76,
    chinW: 0.3,
    crownFlat: 0.05,
    jawSquare: 0.05,
  },
  diamond: {
    templeW: 0.88,
    cheekW: 1.08,
    jawW: 0.78,
    chinW: 0.34,
    crownFlat: 0,
    jawSquare: 0.15,
  },
  pear: {
    templeW: 0.9,
    cheekW: 1.01,
    jawW: 0.98,
    chinW: 0.58,
    crownFlat: 0,
    jawSquare: 0.45,
  },
};

export type HeadContour = {
  path: string;
  shadePath: string;
  highlightPath: string;
  landmarks: {
    crownY: number;
    templeY: number;
    cheekY: number;
    jawY: number;
    chinY: number;
    halfWidth: number;
    jawHalf: number;
    chinX: number;
    earLeftX: number;
    earRightX: number;
    earY: number;
  };
};

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Parametric biometric skull path with subtle 3/4 cheekbone asymmetry. */
export const buildHeadContour = (
  bio: FaceBiometrics,
  headTurn = 0,
): HeadContour => {
  const turn = Math.max(-1, Math.min(1, headTurn));
  const p = FACE_SHAPE_PRESETS[bio.faceShape];
  const halfW = 58 * bio.headWidth;

  const rightFactor = turn > 0 ? 1 - turn * 0.15 : 1 - turn * 0.04;
  const leftFactor = turn < 0 ? 1 + turn * 0.15 : 1 + turn * 0.04;

  const rTemple = halfW * p.templeW * rightFactor;
  const lTemple = halfW * p.templeW * leftFactor;
  const rCheek = halfW * p.cheekW * bio.cheekbone * rightFactor;
  const lCheek = halfW * p.cheekW * bio.cheekbone * leftFactor;
  const rJaw = Math.min(rCheek * 0.98, halfW * p.jawW * bio.jawWidth * rightFactor);
  const lJaw = Math.min(lCheek * 0.98, halfW * p.jawW * bio.jawWidth * leftFactor);
  const chinHalf = halfW * p.chinW * bio.jawWidth * 0.42;

  const crownY = 106 - 64 * bio.headHeight;
  const templeY = 106 - 28 * bio.headHeight;
  const cheekY = 106 + 10 * bio.headHeight;
  const jawY = 106 + 39 * bio.headHeight + bio.chinLength * 0.4;
  const chinY = 106 + 59 * bio.headHeight + bio.chinLength;
  const chinX = 180 + turn * 6;

  const rxTemple = 180 + rTemple;
  const lxTemple = 180 - lTemple;
  const rxCheek = 180 + rCheek;
  const lxCheek = 180 - lCheek;
  const rxJaw = 180 + rJaw;
  const lxJaw = 180 - lJaw;

  const crownSpreadR = rTemple * (0.55 + p.crownFlat * 0.35);
  const crownSpreadL = lTemple * (0.55 + p.crownFlat * 0.35);
  const jawPull = 0.55 + p.jawSquare * 0.35;

  const path = [
    `M${r1(180)} ${r1(crownY)}`,
    `C${r1(180 + crownSpreadR)} ${r1(crownY)} ${r1(rxTemple)} ${r1(crownY + 12)} ${r1(rxTemple)} ${r1(templeY)}`,
    `C${r1(rxTemple + 2)} ${r1((templeY + cheekY) * 0.5)} ${r1(rxCheek + 2)} ${r1(cheekY - 8)} ${r1(rxCheek)} ${r1(cheekY)}`,
    `C${r1(rxCheek)} ${r1(cheekY + (jawY - cheekY) * 0.55)} ${r1(rxJaw)} ${r1(jawY - 6)} ${r1(rxJaw)} ${r1(jawY)}`,
    `C${r1(rxJaw - (rxJaw - chinX) * (1 - jawPull))} ${r1(jawY + (chinY - jawY) * 0.72)} ${r1(chinX + chinHalf)} ${r1(chinY)} ${r1(chinX)} ${r1(chinY)}`,
    `C${r1(chinX - chinHalf)} ${r1(chinY)} ${r1(lxJaw + (chinX - lxJaw) * (1 - jawPull))} ${r1(jawY + (chinY - jawY) * 0.72)} ${r1(lxJaw)} ${r1(jawY)}`,
    `C${r1(lxJaw)} ${r1(jawY - 6)} ${r1(lxCheek)} ${r1(cheekY + (jawY - cheekY) * 0.55)} ${r1(lxCheek)} ${r1(cheekY)}`,
    `C${r1(lxCheek - 2)} ${r1(cheekY - 8)} ${r1(lxTemple - 2)} ${r1((templeY + cheekY) * 0.5)} ${r1(lxTemple)} ${r1(templeY)}`,
    `C${r1(lxTemple)} ${r1(crownY + 12)} ${r1(180 - crownSpreadL)} ${r1(crownY)} ${r1(180)} ${r1(crownY)}Z`,
  ].join('');

  const shadeOnLeft = turn >= -0.15;
  const shadePath = shadeOnLeft
    ? `M${r1(180 - lTemple * 0.35)} ${r1(crownY + 3)}C${r1(lxTemple)} ${r1(crownY + 14)} ${r1(lxCheek)} ${r1(cheekY)} ${r1(lxJaw)} ${r1(jawY)}Q${r1(chinX - chinHalf * 0.8)} ${r1(chinY - 3)} ${r1(chinX)} ${r1(chinY)}Q${r1(lxJaw + 14)} ${r1(jawY - 12)} ${r1(lxCheek + 13)} ${r1(cheekY - 6)}Q${r1(lxTemple + 14)} ${r1(templeY)} ${r1(180 - lTemple * 0.35)} ${r1(crownY + 3)}Z`
    : `M${r1(180 + rTemple * 0.35)} ${r1(crownY + 3)}C${r1(rxTemple)} ${r1(crownY + 14)} ${r1(rxCheek)} ${r1(cheekY)} ${r1(rxJaw)} ${r1(jawY)}Q${r1(chinX + chinHalf * 0.8)} ${r1(chinY - 3)} ${r1(chinX)} ${r1(chinY)}Q${r1(rxJaw - 14)} ${r1(jawY - 12)} ${r1(rxCheek - 13)} ${r1(cheekY - 6)}Q${r1(rxTemple - 14)} ${r1(templeY)} ${r1(180 + rTemple * 0.35)} ${r1(crownY + 3)}Z`;

  const highlightPath = shadeOnLeft
    ? `M${r1(180 + rTemple * 0.42)} ${r1(crownY + 5)}C${r1(rxTemple - 1)} ${r1(crownY + 15)} ${r1(rxCheek - 1)} ${r1(cheekY - 1)} ${r1(rxJaw - 2)} ${r1(jawY - 6)}Q${r1(rxCheek - 9)} ${r1(cheekY)} ${r1(rxTemple - 9)} ${r1(templeY)}Z`
    : `M${r1(180 - lTemple * 0.42)} ${r1(crownY + 5)}C${r1(lxTemple + 1)} ${r1(crownY + 15)} ${r1(lxCheek + 1)} ${r1(cheekY - 1)} ${r1(lxJaw + 2)} ${r1(jawY - 6)}Q${r1(lxCheek + 9)} ${r1(cheekY)} ${r1(lxTemple + 9)} ${r1(templeY)}Z`;

  return {
    path,
    shadePath,
    highlightPath,
    landmarks: {
      crownY,
      templeY,
      cheekY,
      jawY,
      chinY,
      halfWidth: Math.max(rCheek, lCheek),
      jawHalf: Math.max(rJaw, lJaw),
      chinX,
      earLeftX: lxCheek - 1,
      earRightX: rxCheek + 1,
      earY: (templeY + cheekY) * 0.5 + 8,
    },
  };
};

export type FaceChannels = {
  inner: number;
  outer: number;
  eye: number;
  smile: number;
  blush: number;
  tears: number;
};

export type FaceState = {
  emotion: FaceEmotion;
  intensity?: number;
  viseme?: FaceViseme;
  openness?: number;
  blink?: number;
  tearPhase?: number;
  gazeX?: number;
  gazeY?: number;
  headTurn?: number;
  jawDrop?: number;
  channelsOverride?: FaceChannels;
};

export const clampFace = (x: number) => Math.max(0, Math.min(1, x));

export const faceFromPose = (pose: Partial<ActingPose>): FaceState => {
  const e = pose.expression;
  const emotion: FaceEmotion =
    e === 'angry' || e === 'frustrated'
      ? 'angry'
      : e === 'defeated' || e === 'pleading' || e === 'uncertain'
        ? 'sad'
        : e === 'surprised' || e === 'shocked'
          ? 'surprised'
          : e === 'suspicious' || e === 'evaluating' || e === 'dismissive'
            ? 'suspicious'
            : e === 'exhausted'
              ? 'tired'
              : e === 'embarrassed'
                ? 'embarrassed'
                : e === 'hopeful'
                  ? 'happy'
                  : 'neutral';
  return {
    emotion,
    intensity: 1,
    viseme:
      pose.mouth === 'open'
        ? 'A'
        : pose.mouth === 'wide'
          ? 'E'
          : pose.mouth === 'round'
            ? 'O'
            : pose.mouth === 'closed'
              ? 'MBP'
              : 'rest',
    blink: pose.blink ? 1 : 0,
    gazeX: pose.gazeX ?? 0,
    gazeY: pose.gazeY ?? 0,
    headTurn: pose.headTurn ?? 0,
    jawDrop: pose.jawDrop ?? 0,
  };
};

const channels = {
  neutral: { inner: 0, outer: 0, eye: 1, smile: 0, blush: 0, tears: 0 },
  happy: { inner: -2, outer: -2, eye: 0.8, smile: 1, blush: 0.22, tears: 0 },
  laughing: { inner: -4, outer: -2, eye: 0.1, smile: 1, blush: 0.35, tears: 0 },
  sad: { inner: -8, outer: 3, eye: 0.75, smile: -1, blush: 0, tears: 0 },
  crying: { inner: -11, outer: 5, eye: 0.23, smile: -1, blush: 0.3, tears: 1 },
  angry: { inner: 8, outer: -6, eye: 0.68, smile: -0.6, blush: 0.28, tears: 0 },
  afraid: { inner: -9, outer: -2, eye: 1.5, smile: -0.7, blush: 0, tears: 0 },
  surprised: { inner: -9, outer: -9, eye: 1.65, smile: 0, blush: 0, tears: 0 },
  suspicious: { inner: 2, outer: -2, eye: 0.55, smile: -0.3, blush: 0, tears: 0 },
  tired: { inner: 2, outer: 1, eye: 0.35, smile: -0.4, blush: 0, tears: 0 },
  embarrassed: { inner: -4, outer: 2, eye: 0.7, smile: 0.35, blush: 0.65, tears: 0 },
} as const;

export const faceChannels = (face: FaceState): FaceChannels => {
  const blinkFactor = 1 - clampFace(face.blink ?? 0);
  if (face.channelsOverride) {
    return {
      ...face.channelsOverride,
      eye: face.channelsOverride.eye * blinkFactor,
    };
  }
  const intensity = clampFace(face.intensity ?? 1);
  const c = channels[face.emotion];
  return {
    inner: c.inner * intensity,
    outer: c.outer * intensity,
    eye: (1 + (c.eye - 1) * intensity) * blinkFactor,
    smile: c.smile * intensity,
    blush: c.blush * intensity,
    tears: c.tears * intensity,
  };
};

const vowels: FaceViseme[] = [
  'MBP',
  'A',
  'E',
  'O',
  'U',
  'FV',
  'L',
  'A',
  'MBP',
  'rest',
];

/** Deterministic phonetic demonstration. Real dialogue should supply timed
 * viseme cues; this is deliberately not described as audio-derived lip sync. */
export const sampleDemoSpeech = (
  frame: number,
  fps = 24,
): { viseme: FaceViseme; openness: number } => {
  const step = Math.max(1, Math.round(fps / 6));
  const f = Math.max(0, frame);
  const u = (f % step) / step;
  return {
    viseme: vowels[Math.floor(f / step) % vowels.length],
    openness: 0.65 + 0.35 * Math.sin(Math.PI * u),
  };
};
