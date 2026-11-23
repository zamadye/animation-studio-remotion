import {
  faceChannels,
  type FaceChannels,
  type FaceEmotion,
  type FaceState,
  type FaceViseme,
} from '../animation/faceRig';
import type { EmotionCue, VisemeCue } from '../story/types';
import { clamp, clamp01, lerp, seededHash, smoothstep } from './math';

/** Deterministic per-actor blink curve in [0, 1] with seeded cadence and occasional double-blink. */
export const actorBlinkAt = (
  actorId: string,
  frame: number,
  fps: number,
): number => {
  const safeFps = Math.max(1, fps);
  const scale = safeFps / 24;
  const period = Math.round((89 + (seededHash(`${actorId}:period`) % 39)) * scale);
  const offset = seededHash(`${actorId}:offset`) % period;
  const shifted = Math.max(0, Math.floor(frame)) + offset;
  const cycleIndex = Math.floor(shifted / period);
  const local = shifted % period;
  const blinkLen = Math.max(4, Math.round(5 * scale));
  if (local >= 0 && local < blinkLen) {
    return Math.sin((local / Math.max(1, blinkLen - 1)) * Math.PI);
  }
  const hasDouble = seededHash(`${actorId}:dbl:${cycleIndex}`) % 5 === 0;
  const secondStart = blinkLen + Math.max(3, Math.round(4 * scale));
  if (hasDouble && local >= secondStart && local < secondStart + blinkLen) {
    return Math.sin(
      ((local - secondStart) / Math.max(1, blinkLen - 1)) * Math.PI,
    );
  }
  return 0;
};

/** Co-articulates mouth openness across neighboring frames while preserving exact rest on silence. */
export const smoothVisemeOpenness = (
  visemes: readonly VisemeCue[],
  localFrame: number,
): { viseme: FaceViseme; openness: number } => {
  const sampleAt = (f: number) => visemes.find((c) => f >= c.start && f < c.end);
  const current = sampleAt(localFrame);
  if (!current || current.viseme === 'rest') {
    return { viseme: 'rest', openness: 0 };
  }
  const prev = sampleAt(localFrame - 1);
  const next = sampleAt(localFrame + 1);
  const oCurr = current.openness ?? 1;
  const oPrev = prev && prev.viseme !== 'rest' ? (prev.openness ?? 1) : 0;
  const oNext = next && next.viseme !== 'rest' ? (next.openness ?? 1) : 0;
  return {
    viseme: current.viseme,
    openness: clamp01(oPrev * 0.22 + oCurr * 0.56 + oNext * 0.22),
  };
};

const blendChannels = (
  a: FaceChannels,
  b: FaceChannels,
  t: number,
): FaceChannels => ({
  inner: lerp(a.inner, b.inner, t),
  outer: lerp(a.outer, b.outer, t),
  eye: lerp(a.eye, b.eye, t),
  smile: lerp(a.smile, b.smile, t),
  blush: lerp(a.blush, b.blush, t),
  tears: lerp(a.tears, b.tears, t),
});

export type EvaluateBlendedFaceParams = {
  actorId: string;
  emotions?: readonly EmotionCue[];
  frame: number;
  fps: number;
  viseme: FaceViseme;
  openness: number;
  blink: number;
  gazeX?: number;
  gazeY?: number;
  headTurn?: number;
  blendFrames?: number;
};

/** Resolves current face emotion with smooth crossfades across emotion boundaries. */
export const evaluateBlendedFace = ({
  actorId: _actorId,
  emotions = [],
  frame,
  fps,
  viseme,
  openness,
  blink,
  gazeX = 0,
  gazeY = 0,
  headTurn = 0,
  blendFrames = 8,
}: EvaluateBlendedFaceParams): FaceState => {
  const idx = emotions.findIndex((c) => frame >= c.start && frame < c.end);
  const active = idx >= 0 ? emotions[idx] : undefined;
  const prev = idx > 0 ? emotions[idx - 1] : undefined;
  const emotion: FaceEmotion = active?.emotion ?? 'neutral';
  const intensity = active?.intensity ?? 1;

  let channelsOverride: FaceChannels | undefined;
  if (active && blendFrames > 0) {
    const intoCue = frame - active.start;
    if (intoCue < blendFrames) {
      const fromChannels = prev
        ? faceChannels({
            emotion: prev.emotion,
            intensity: prev.intensity ?? 1,
          })
        : faceChannels({ emotion: 'neutral', intensity: 1 });
      const toChannels = faceChannels({ emotion, intensity });
      const u = smoothstep(intoCue / blendFrames);
      channelsOverride = blendChannels(fromChannels, toChannels, u);
    }
  }

  return {
    emotion,
    intensity,
    viseme,
    openness: viseme === 'rest' ? 0 : openness,
    blink,
    tearPhase: (frame % Math.max(1, fps)) / Math.max(1, fps),
    gazeX,
    gazeY,
    headTurn,
    jawDrop: viseme === 'rest' ? 0 : openness * 3.2,
    channelsOverride,
  };
};

/** Computes natural eye-line and subtle head-turn bias toward a world target. */
export const computeAutoGaze = (
  selfHead: { x: number; y: number },
  targetHead: { x: number; y: number },
  maxX = 5,
  maxY = 3.5,
): { gazeX: number; gazeY: number; headTurnBias: number } => {
  const dx = targetHead.x - selfHead.x;
  const dy = targetHead.y - selfHead.y;
  const nx = clamp(dx / 450, -1, 1);
  const ny = clamp(dy / 350, -1, 1);
  return {
    gazeX: nx * maxX,
    gazeY: ny * maxY,
    headTurnBias: nx * 0.14,
  };
};
