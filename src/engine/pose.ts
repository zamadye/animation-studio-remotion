import type { ActingPose } from '../animation/clips';
import type { FaceEmotion } from '../animation/faceRig';
import { clamp01, lerp, seededUnit, smoothstep } from './math';

export const NEUTRAL_POSE: ActingPose = {
  wristLeft: 0,
  wristRight: 0,
  seated: 0,
  ankleLeft: 0,
  ankleRight: 0,
  headTurn: 0,
  bodyTurn: 0,
  breath: 0,
  shoulderLift: 0,
  hairSwing: 0,
  jawDrop: 0,
  headTilt: 0,
  torsoLean: 0,
  armLeft: 0,
  armRight: 0,
  elbowLeft: 0,
  elbowRight: 0,
  hipLeft: 0,
  hipRight: 0,
  kneeLeft: 0,
  kneeRight: 0,
  gazeX: 0,
  gazeY: 0,
  rootX: 0,
  rootY: 0,
  squash: 1,
  expression: 'neutral',
  mouth: 'rest',
  blink: false,
};

const NUMERIC_POSE_KEYS = [
  'wristLeft',
  'wristRight',
  'seated',
  'ankleLeft',
  'ankleRight',
  'headTurn',
  'bodyTurn',
  'breath',
  'shoulderLift',
  'hairSwing',
  'jawDrop',
  'headTilt',
  'torsoLean',
  'armLeft',
  'armRight',
  'elbowLeft',
  'elbowRight',
  'hipLeft',
  'hipRight',
  'kneeLeft',
  'kneeRight',
  'gazeX',
  'gazeY',
  'rootX',
  'rootY',
  'squash',
] as const;

export const normalizePose = (pose: Partial<ActingPose>): ActingPose => ({
  ...NEUTRAL_POSE,
  ...pose,
});

/** Smoothly interpolates two poses across all numeric and categorical channels. */
export const blendPoses = (
  a: Partial<ActingPose>,
  b: Partial<ActingPose>,
  t: number,
): ActingPose => {
  const u = clamp01(t);
  const pa = normalizePose(a);
  const pb = normalizePose(b);
  const out: ActingPose = {
    ...pa,
    expression: u >= 0.5 ? pb.expression : pa.expression,
    mouth: u >= 0.5 ? pb.mouth : pa.mouth,
    blink: u >= 0.5 ? pb.blink : pa.blink,
  };
  for (const key of NUMERIC_POSE_KEYS) {
    out[key] = lerp(pa[key] ?? 0, pb[key] ?? 0, u);
  }
  return out;
};

/** Applies an additive motion layer onto a base pose; squash combines multiplicatively. */
export const addPoseLayer = (
  base: ActingPose,
  delta: Partial<ActingPose>,
  weight = 1,
): ActingPose => {
  const w = Math.max(0, weight);
  if (w === 0) {
    return base;
  }
  const out: ActingPose = { ...base };
  for (const key of NUMERIC_POSE_KEYS) {
    const dv = delta[key];
    if (dv === undefined) {
      continue;
    }
    if (key === 'squash') {
      out.squash = (out.squash ?? 1) * (1 + (dv - 1) * w);
    } else {
      out[key] = (out[key] ?? 0) + dv * w;
    }
  }
  return out;
};

/** Continuous deterministic breathing and subtle weight shift with delayed head follow-through. */
export const computeIdleLayer = (
  actorId: string,
  frame: number,
  fps: number,
  seated = 0,
  motionTempo = 1,
  postureSlouch = 0,
): Partial<ActingPose> => {
  const safeFps = Math.max(1, fps);
  const tempo = Math.max(0.6, Math.min(1.5, motionTempo));
  const phaseOffset = seededUnit(`${actorId}:idle`) * Math.PI * 2;
  const omega = ((Math.PI * 2) / 3.4) * tempo;
  const cycle = (frame / safeFps) * omega + phaseOffset;
  const breath = Math.sin(cycle);
  const sway = Math.sin(cycle * 0.5 + 0.4);
  const follow = Math.sin(cycle - 0.55);
  const hairLag = Math.sin(cycle - 0.9);
  const isSeated = seated > 0.5;
  return {
    breath,
    shoulderLift: -1.6 * breath,
    torsoLean: (isSeated ? 0.5 : 1.0) * sway + postureSlouch * 0.45,
    headTilt: 1.1 * follow + postureSlouch * 0.35,
    hairSwing: 1.8 * hairLag,
    rootY: (isSeated ? -0.55 : -1.1) * breath,
  };
};

/** Speech-energy-coupled micro-acting: head emphasis, shoulders, subtle hands, and follow-through. */
export const computeSpeakingLayer = (
  actorId: string,
  frame: number,
  fps: number,
  energy: number,
  emotion: FaceEmotion,
  motionTempo = 1,
): Partial<ActingPose> => {
  const safeFps = Math.max(1, fps);
  const tempo = Math.max(0.6, Math.min(1.5, motionTempo));
  const amp =
    clamp01(energy) *
    (emotion === 'angry' || emotion === 'surprised'
      ? 1.3
      : emotion === 'tired' || emotion === 'sad' || emotion === 'crying'
        ? 0.55
        : 1);
  if (amp <= 0.01) {
    return {};
  }
  const seed = seededUnit(`${actorId}:speak`) * Math.PI * 2;
  const t = (frame / safeFps) * Math.PI * 2 * tempo;
  const nodWave = Math.sin(t * 1.85 + seed);
  const doubleBeat = Math.cos(t * 3.1 + seed * 0.7);
  const gestureWave = Math.sin(t * 1.05 + seed - 0.3);
  return {
    headTilt: amp * (2.6 * nodWave + 1.1 * doubleBeat),
    torsoLean: amp * 1.6 * gestureWave,
    shoulderLift: -amp * 1.8 * Math.max(0, nodWave),
    armLeft: amp * 5.5 * gestureWave,
    armRight: -amp * 6.5 * gestureWave,
    elbowLeft: amp * 6 * Math.max(0, gestureWave),
    elbowRight: -amp * 7 * Math.max(0, -gestureWave),
    hairSwing: amp * 2.6 * Math.sin(t * 1.85 + seed - 0.75),
    squash: 1 + amp * 0.016 * Math.sin(t * 2.5 + seed),
    jawDrop: amp * 3.2,
  };
};

/** Subtle attentive listening reaction when a scene partner is speaking. */
export const computeListeningLayer = (
  actorId: string,
  frame: number,
  fps: number,
  partnerSpeaking: boolean,
  emotion: FaceEmotion,
): Partial<ActingPose> => {
  if (!partnerSpeaking) {
    return {};
  }
  const safeFps = Math.max(1, fps);
  const seed = seededUnit(`${actorId}:listen`) * Math.PI * 2;
  const t = (frame / safeFps) * Math.PI * 2;
  const nodPulse = Math.pow(Math.max(0, Math.sin(t * 0.52 + seed)), 8);
  const reactTilt =
    emotion === 'suspicious' ? -1.8 : emotion === 'surprised' ? -2.4 : 0;
  return {
    headTilt: reactTilt + 3.8 * nodPulse,
    torsoLean: emotion === 'angry' ? -1.2 : 1.0,
    hairSwing: 1.5 * nodPulse,
  };
};

export type LocomotionSample = {
  x: number;
  active: boolean;
  facingDir: -1 | 1;
  poseDelta: Partial<ActingPose>;
};

/** Foot-locked locomotion: gait phase derives strictly from horizontal travel distance. */
export const computeWalkLocomotion = (
  fromX: number,
  toX: number,
  startFrame: number,
  endFrame: number,
  frame: number,
  _fps: number,
  scale = 1,
): LocomotionSample => {
  const facingDir: -1 | 1 = toX >= fromX ? 1 : -1;
  if (frame <= startFrame) {
    return { x: fromX, active: false, facingDir, poseDelta: {} };
  }
  if (frame >= endFrame) {
    return { x: toX, active: false, facingDir, poseDelta: {} };
  }
  const u = (frame - startFrame) / Math.max(1, endFrame - startFrame);
  const eased = smoothstep(u);
  const x = lerp(fromX, toX, eased);
  const distance = Math.abs(x - fromX);
  const stride = 148 * Math.max(0.5, scale);
  const phase = (distance / stride) * Math.PI * 2;
  const envelope = clamp01(
    Math.min((frame - startFrame) / 5, (endFrame - frame) / 5),
  );
  const swing = Math.sin(phase);
  const bounce = Math.abs(Math.sin(phase));
  return {
    x,
    active: true,
    facingDir,
    poseDelta: {
      hipLeft: 24 * swing * envelope,
      hipRight: -24 * swing * envelope,
      kneeLeft: 36 * Math.max(0, -swing) * envelope,
      kneeRight: 36 * Math.max(0, swing) * envelope,
      ankleLeft: -10 * swing * envelope,
      ankleRight: 10 * swing * envelope,
      armLeft: -14 * swing * envelope,
      armRight: 14 * swing * envelope,
      elbowLeft: -10 * Math.max(0, swing) * envelope,
      elbowRight: 10 * Math.max(0, -swing) * envelope,
      torsoLean: 4.5 * facingDir * envelope,
      rootY: -5 * bounce * envelope,
      squash: 1 - 0.022 * (1 - bounce) * envelope,
      hairSwing: (-4.2 * facingDir + 2.8 * Math.cos(phase)) * envelope,
    },
  };
};
