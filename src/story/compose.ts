import {
  characterRegistry,
  type CharacterId,
} from '../components/characters/registry';
import type { FaceEmotion } from '../animation/faceRig';
import type { HeldContent, HeldProp } from '../props/types';
import { validateContent } from '../props/types';
import type { Motion } from './motions';
import type {
  ActorDefinition,
  BodyCue,
  EmotionCue,
  PathCue,
  PerformanceConfig,
} from './types';

export const EXPRESSIVE_PERFORMANCE: PerformanceConfig = {
  breathing: true,
  speakingMotion: true,
  listeningMotion: true,
  autoGaze: true,
  seededBlink: true,
  poseBlendFrames: 6,
  emotionBlendFrames: 8,
  smoothViseme: true,
};

/** Small authoring helpers; no implicit cast, hidden animation, or global render state. */
export const perform = (
  motion: Motion,
  start: number,
  duration: number,
): BodyCue => ({ motion, start, duration });

export const walkTo = (
  fromX: number,
  toX: number,
  start: number,
  end: number,
  scale?: number,
): PathCue => ({ fromX, toX, start, end, scale });

export const hold = (
  content: HeldContent,
  hand: 'left' | 'right',
  start: number,
  end: number,
): HeldProp => ({
  content: validateContent(content),
  hand,
  start,
  end,
});

export const character = ({
  id,
  x,
  scale = 1,
  facing,
  enter,
  exit,
  duration,
  motions = [],
  paths = [],
  expression = 'neutral',
  emotions,
  props = [],
}: {
  id: CharacterId;
  x: number;
  scale?: number;
  facing?: 'front' | 'threeQuarterLeft' | 'threeQuarterRight';
  enter?: number;
  exit?: number;
  duration: number;
  motions?: readonly BodyCue[];
  paths?: readonly PathCue[];
  expression?: FaceEmotion;
  emotions?: readonly EmotionCue[];
  props?: readonly HeldProp[];
}): ActorDefinition => ({
  id,
  design: characterRegistry[id],
  x,
  scale,
  facing,
  enter,
  exit,
  body: motions,
  paths,
  emotions: emotions ?? [{ start: 0, end: duration, emotion: expression }],
  props,
});
