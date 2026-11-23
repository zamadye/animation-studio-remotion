export type ExpressionName =
  | 'neutral'
  | 'confused'
  | 'suspicious'
  | 'frustrated'
  | 'angry'
  | 'embarrassed'
  | 'pleading'
  | 'exhausted'
  | 'defeated'
  | 'surprised'
  | 'thinking'
  | 'hopeful'
  | 'uncertain'
  | 'shocked'
  | 'evaluating'
  | 'dismissive';

export type MouthShape = 'rest' | 'open' | 'wide' | 'round' | 'closed';

export type EasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'overshoot';

export type ActingPose = {
  wristLeft?: number;
  wristRight?: number;
  seated?: number;
  ankleLeft?: number;
  ankleRight?: number;
  headTurn?: number;
  bodyTurn?: number;
  breath?: number;
  shoulderLift?: number;
  hairSwing?: number;
  jawDrop?: number;
  headTilt: number;
  torsoLean: number;
  armLeft: number;
  armRight: number;
  elbowLeft: number;
  elbowRight: number;
  hipLeft: number;
  hipRight: number;
  kneeLeft: number;
  kneeRight: number;
  gazeX: number;
  gazeY: number;
  rootX: number;
  rootY: number;
  squash: number;
  expression: ExpressionName;
  mouth: MouthShape;
  blink: boolean;
};

export type PoseKeyframe = {
  at: number;
  pose: Partial<ActingPose>;
  easing?: EasingName;
};

export type AnimationClip = {
  name: string;
  durationFrames: number;
  recoveryFrames: number;
  loop?: boolean;
  keyframes: PoseKeyframe[];
};

const k = (
  at: number,
  pose: Partial<ActingPose>,
  easing: EasingName = 'easeInOut',
): PoseKeyframe => ({ at, pose, easing });

const clip = (
  name: string,
  durationFrames: number,
  keyframes: PoseKeyframe[],
  recoveryFrames = 8,
  loop = false,
): AnimationClip => ({ name, durationFrames, recoveryFrames, keyframes, loop });

const neutral: ActingPose = {
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

export const actingClips: Record<string, AnimationClip> = {
  idle_breathing: clip(
    'idle_breathing',
    72,
    [
      k(0, { rootY: 0, torsoLean: 0, breath: 0 }),
      k(18, { rootY: -1.5, torsoLean: -0.5, breath: 0.7 }),
      k(36, { rootY: -3, torsoLean: 0, breath: 1 }),
      k(54, { rootY: -1.5, torsoLean: 0.5, breath: 0.3 }),
      k(72, { rootY: 0, torsoLean: 0, breath: 0 }),
    ],
    0,
    true,
  ),
  listening: clip(
    'listening',
    54,
    [
      k(0, { headTilt: 0, expression: 'neutral' }),
      k(12, { headTilt: 3, expression: 'neutral' }),
      k(20, { headTilt: 2, gazeX: -3, blink: true }),
      k(27, { headTilt: 1, gazeX: 0, blink: false }),
      k(54, { headTilt: 0 }),
    ],
    0,
    true,
  ),
  confused: clip('confused', 131, [
    k(0, { headTilt: 0 }),
    k(8, { headTilt: -7, expression: 'confused', gazeX: 5 }),
    k(20, { headTilt: -5, expression: 'confused', gazeX: -2 }),
    k(32, { headTilt: -7, gazeX: 4 }),
    k(48, { headTilt: -4, expression: 'thinking', gazeY: -3 }),
    k(114, { headTilt: -4, expression: 'thinking', gazeY: -3 }),
    k(131, { headTilt: 0, expression: 'neutral', gazeX: 0, gazeY: 0 }),
  ]),
  suspicious: clip('suspicious', 48, [
    k(0, { expression: 'neutral' }),
    k(10, { headTilt: 4, expression: 'suspicious', gazeX: -8 }),
    k(34, { headTilt: 3, expression: 'suspicious', gazeX: -8 }),
    k(48, { headTilt: 0, expression: 'neutral', gazeX: 0 }),
  ]),
  frustrated: clip('frustrated', 44, [
    k(0, { torsoLean: 0 }),
    k(9, { torsoLean: 4, expression: 'frustrated', armLeft: -8 }),
    k(25, { torsoLean: 2, expression: 'frustrated', armLeft: 4 }),
    k(44, { torsoLean: 0, expression: 'neutral', armLeft: 0 }),
  ]),
  angry: clip('angry', 36, [
    k(0, { headTilt: 1 }),
    k(5, { torsoLean: 5, expression: 'angry', armLeft: 8 }),
    k(15, { torsoLean: 3, expression: 'angry', armLeft: 3 }),
    k(36, { torsoLean: 0, expression: 'frustrated', armLeft: 0 }),
  ]),
  embarrassed: clip('embarrassed', 42, [
    k(0, { expression: 'neutral' }),
    k(8, { headTilt: 8, gazeY: 7, expression: 'embarrassed', armLeft: 12 }),
    k(30, { headTilt: 7, gazeY: 8, expression: 'embarrassed' }),
    k(42, { headTilt: 0, gazeY: 0, expression: 'neutral' }),
  ]),
  pleading: clip('pleading', 192, [
    k(0, { torsoLean: 0 }),
    k(10, { torsoLean: -5, expression: 'pleading', armLeft: -12, elbowLeft: 10 }),
    k(32, { torsoLean: -4, expression: 'pleading', armLeft: -8, elbowLeft: 7 }),
    k(56, { torsoLean: -4, expression: 'pleading', armLeft: -8, elbowLeft: 7 }),
    k(178, { torsoLean: -4, expression: 'pleading', armLeft: -8, elbowLeft: 7 }),
    k(192, { torsoLean: 0, expression: 'exhausted', armLeft: 0, elbowLeft: 0 }),
  ]),
  exhausted: clip(
    'exhausted',
    60,
    [
      k(0, { headTilt: 0, torsoLean: 0 }),
      k(18, { headTilt: 6, torsoLean: 5, expression: 'exhausted', rootY: 2 }),
      k(40, { headTilt: 8, torsoLean: 6, expression: 'exhausted', rootY: 3 }),
      k(60, { headTilt: 6, torsoLean: 4, expression: 'exhausted', rootY: 2 }),
    ],
    12,
    true,
  ),
  defeated: clip(
    'defeated',
    72,
    [
      k(0, { headTilt: 0 }),
      k(12, { headTilt: 8, torsoLean: 7, expression: 'defeated', gazeY: 8 }),
      k(48, { headTilt: 10, torsoLean: 8, expression: 'defeated', gazeY: 10 }),
      k(72, { headTilt: 9, torsoLean: 7, expression: 'defeated', gazeY: 9 }),
    ],
    0,
    true,
  ),
  surprised: clip('surprised', 36, [
    k(0, { headTilt: 0 }),
    k(4, { headTilt: -6, expression: 'surprised', squash: 1.07, rootY: -4 }),
    k(10, { headTilt: -3, expression: 'surprised', squash: 0.97, rootY: 1 }),
    k(20, { headTilt: -2, expression: 'surprised', squash: 1 }),
    k(36, { headTilt: 0, expression: 'neutral' }),
  ]),
  thinking: clip('thinking', 52, [
    k(0, { expression: 'neutral' }),
    k(12, {
      headTilt: -4,
      gazeX: 5,
      gazeY: -4,
      expression: 'thinking',
      armRight: -8,
    }),
    k(34, { headTilt: -3, gazeX: 5, gazeY: -4, expression: 'thinking' }),
    k(52, { headTilt: 0, gazeX: 0, gazeY: 0, expression: 'neutral', armRight: 0 }),
  ]),
  pointing: clip('pointing', 40, [
    k(0, { armRight: 0 }),
    k(6, { armRight: -8, elbowRight: 12 }),
    k(13, { armRight: 36, elbowRight: -8 }),
    k(29, { armRight: 32, elbowRight: -6 }),
    k(40, { armRight: 0, elbowRight: 0 }),
  ]),
  handing_object: clip('handing_object', 46, [
    k(0, { armRight: 0, elbowRight: 0 }),
    k(8, { torsoLean: 2, armRight: -10, elbowRight: 12 }),
    k(20, { torsoLean: 3, armRight: 23, elbowRight: -18 }),
    k(30, { torsoLean: 1, armRight: 29, elbowRight: -14 }),
    k(46, { torsoLean: 0, armRight: 0, elbowRight: 0 }),
  ]),
  taking_object: clip('taking_object', 42, [
    k(0, { armLeft: 0 }),
    k(7, { torsoLean: -2, armLeft: -8, elbowLeft: 9 }),
    k(17, { torsoLean: -3, armLeft: 24, elbowLeft: -13 }),
    k(27, { torsoLean: 0, armLeft: 18, elbowLeft: -9 }),
    k(42, { armLeft: 0, elbowLeft: 0 }),
  ]),
  walking: clip(
    'walking',
    24,
    [
      k(0, {
        armLeft: -12,
        armRight: 12,
        hipLeft: 0,
        hipRight: 18,
        kneeLeft: 0,
        kneeRight: 22,
        rootY: 0,
      }),
      k(6, {
        armLeft: 0,
        armRight: 0,
        hipLeft: -18,
        hipRight: 0,
        kneeLeft: 18,
        kneeRight: 0,
        rootY: -3,
      }),
      k(12, {
        armLeft: 12,
        armRight: -12,
        hipLeft: 0,
        hipRight: -18,
        kneeLeft: 0,
        kneeRight: 18,
        rootY: 0,
      }),
      k(18, {
        armLeft: 0,
        armRight: 0,
        hipLeft: 18,
        hipRight: 0,
        kneeLeft: 22,
        kneeRight: 0,
        rootY: -3,
      }),
      k(24, {
        armLeft: -12,
        armRight: 12,
        hipLeft: 0,
        hipRight: 18,
        kneeLeft: 0,
        kneeRight: 22,
        rootY: 0,
      }),
    ],
    0,
    true,
  ),
  turning_head: clip('turning_head', 30, [
    k(0, { headTilt: 0, gazeX: 0 }),
    k(5, { headTilt: 1, gazeX: 2 }),
    k(14, { headTilt: 0, gazeX: 18 }),
    k(21, { headTilt: -1, gazeX: 18 }),
    k(30, { headTilt: 0, gazeX: 0 }),
  ]),
  looking_away: clip('looking_away', 32, [
    k(0, { gazeX: 0 }),
    k(7, { gazeX: 7, headTilt: 1 }),
    k(13, { gazeX: 18, headTilt: 4, expression: 'embarrassed' }),
    k(27, { gazeX: 18, headTilt: 4, expression: 'embarrassed' }),
    k(32, { gazeX: 0, headTilt: 0, expression: 'neutral' }),
  ]),
};

const ease = (x: number, name: EasingName) =>
  name === 'easeIn'
    ? x * x
    : name === 'easeOut'
      ? 1 - (1 - x) * (1 - x)
      : name === 'easeInOut'
        ? x * x * (3 - 2 * x)
        : name === 'overshoot'
          ? x + (x - 1) * x * 0.18
          : x;

export const sampleActingClip = (name: string, frame: number): ActingPose => {
  const c = actingClips[name] ?? actingClips.idle_breathing;
  const phase = c.loop
    ? ((frame % c.durationFrames) + c.durationFrames) % c.durationFrames
    : Math.max(0, Math.min(c.durationFrames, frame));
  let left = c.keyframes[0];
  let right = c.keyframes[c.keyframes.length - 1];
  for (let i = 1; i < c.keyframes.length; i++) {
    if (phase <= c.keyframes[i].at) {
      left = c.keyframes[i - 1];
      right = c.keyframes[i];
      break;
    }
  }
  const span = Math.max(1, right.at - left.at);
  const u = ease(
    Math.max(0, Math.min(1, (phase - left.at) / span)),
    right.easing ?? 'easeInOut',
  );
  const result = { ...neutral };
  for (const key of Object.keys(neutral) as (keyof ActingPose)[]) {
    const a = left.pose[key] ?? neutral[key];
    const b = right.pose[key] ?? a;
    const value =
      typeof a === 'number' && typeof b === 'number'
        ? a + (b - a) * u
        : u < 1
          ? a
          : b;
    (result as Record<string, unknown>)[key] = value;
  }
  if (!c.loop && frame > c.durationFrames && c.recoveryFrames > 0) {
    const r = Math.min(1, (frame - c.durationFrames) / c.recoveryFrames);
    for (const key of [
      'headTilt',
      'torsoLean',
      'armLeft',
      'armRight',
      'rootX',
      'rootY',
    ] as const) {
      result[key] = result[key] * (1 - r);
    }
  }
  return result;
};
