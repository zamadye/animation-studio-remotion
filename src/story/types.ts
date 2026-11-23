import type { HeldProp } from '../props/types';
import type { CharacterDesign } from '../components/characters/cast';
import type { CharacterId } from '../components/characters/registry';
import type { FaceEmotion, FaceViseme } from '../animation/faceRig';
import type { Motion } from './motions';

export type BodyCue = {
  start: number;
  duration: number;
  motion: Motion;
};

export type PathCue = {
  start: number;
  end: number;
  fromX: number;
  toX: number;
  scale?: number;
};

export type EmotionCue = {
  start: number;
  end: number;
  emotion: FaceEmotion;
  intensity?: number;
};

export type VisemeCue = {
  start: number;
  end: number;
  viseme: FaceViseme;
  openness?: number;
};

export type SpeechCue = {
  id: string;
  speaker: CharacterId;
  start: number;
  end: number;
  text: string;
  audio?: string;
  visemes: readonly VisemeCue[];
  alignment: 'authored' | 'audio-energy-text-estimate';
};

export type PerformanceConfig = {
  breathing?: boolean;
  speakingMotion?: boolean;
  listeningMotion?: boolean;
  autoGaze?: boolean;
  seededBlink?: boolean;
  poseBlendFrames?: number;
  emotionBlendFrames?: number;
  smoothViseme?: boolean;
};

export type ActorDefinition = {
  id: CharacterId;
  design: CharacterDesign;
  x: number;
  scale?: number;
  facing?: 'front' | 'threeQuarterLeft' | 'threeQuarterRight';
  enter?: number;
  exit?: number;
  body: readonly BodyCue[];
  paths?: readonly PathCue[];
  props?: readonly HeldProp[];
  emotions?: readonly EmotionCue[];
};

export type StorySceneDefinition = {
  id: string;
  fps: number;
  duration: number;
  actors: readonly ActorDefinition[];
  speech: readonly SpeechCue[];
  performance?: PerformanceConfig;
};
