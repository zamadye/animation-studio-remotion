import { validateContent } from '../props/types';
import { bodyProportions, rigGeometry } from '../components/characters/rigGeometry';
import type { ActingPose } from '../animation/clips';
import type { FaceState } from '../animation/faceRig';
import {
  addPoseLayer,
  blendPoses,
  computeIdleLayer,
  computeListeningLayer,
  computeSpeakingLayer,
  computeWalkLocomotion,
  NEUTRAL_POSE,
  normalizePose,
} from '../engine/pose';
import {
  actorBlinkAt,
  computeAutoGaze,
  evaluateBlendedFace,
  smoothVisemeOpenness,
} from '../engine/face';
import { smoothstep } from '../engine/math';
import { sampleMotion, idle } from './motions';
import type { ActorDefinition, StorySceneDefinition } from './types';

/** One clock; independent body/emotion/speech tracks. Unlisted actors never exist. */
export const evaluateActor = (
  scene: StorySceneDefinition,
  actor: ActorDefinition,
  frame: number,
) => {
  const visible =
    frame >= (actor.enter ?? 0) && frame < (actor.exit ?? scene.duration);
  const cue = actor.body.find(
    (c) => frame >= c.start && frame < c.start + c.duration,
  );
  // Hold the completed approved pose (important for seated posture), never
  // reset to standing merely because a speaking cue ends.
  const prior = [...actor.body]
    .reverse()
    .find((c) => frame >= c.start + c.duration);
  const basePose = cue
    ? sampleMotion(cue.motion, frame - cue.start, cue.duration)
    : prior
      ? sampleMotion(prior.motion, prior.duration - 1, prior.duration)
      : sampleMotion(idle, 0, 1);

  const emotion = actor.emotions?.find(
    (c) => frame >= c.start && frame < c.end,
  );
  const speech = scene.speech.find(
    (c) => c.speaker === actor.id && frame >= c.start && frame < c.end,
  );
  const local = speech ? frame - speech.start : 0;

  if (!scene.performance) {
    const viseme = speech?.visemes.find(
      (c) => local >= c.start && local < c.end,
    );
    const blinkPhase = frame % 103;
    const face: FaceState = {
      emotion: emotion?.emotion ?? 'neutral',
      intensity: emotion?.intensity ?? 1,
      viseme: viseme?.viseme ?? 'rest',
      openness: viseme?.openness ?? 1,
      blink:
        blinkPhase >= 73 && blinkPhase <= 77
          ? Math.sin(((blinkPhase - 73) / 4) * Math.PI)
          : 0,
      tearPhase: (frame % scene.fps) / scene.fps,
    };
    return {
      visible,
      x: actor.x,
      facing: actor.facing ?? ('front' as const),
      pose: basePose,
      face,
      speech,
      speaking: Boolean(speech),
      motion: cue?.motion.label ?? prior?.motion.label ?? 'idle',
    };
  }

  const perf = scene.performance;
  let pose: ActingPose = normalizePose(basePose);

  // Smooth pose transition across consecutive BodyCue boundaries.
  const blendFrames = Math.max(0, perf.poseBlendFrames ?? 6);
  if (cue && blendFrames > 0) {
    const intoCue = frame - cue.start;
    if (intoCue < blendFrames) {
      const prevCue = [...actor.body]
        .reverse()
        .find((c) => c.start + c.duration <= cue.start);
      const prevPose = prevCue
        ? sampleMotion(prevCue.motion, prevCue.duration - 1, prevCue.duration)
        : NEUTRAL_POSE;
      pose = blendPoses(
        prevPose,
        pose,
        smoothstep(intoCue / Math.max(1, blendFrames)),
      );
    }
  }

  // Foot-locked locomotion along PathCue segments.
  const paths = actor.paths ?? [];
  const activePath = paths.find((p) => frame >= p.start && frame < p.end);
  const completedPath = [...paths].reverse().find((p) => frame >= p.end);
  let x = completedPath ? completedPath.toX : actor.x;
  let facing: 'front' | 'threeQuarterLeft' | 'threeQuarterRight' =
    actor.facing ?? 'front';

  if (activePath) {
    const loco = computeWalkLocomotion(
      activePath.fromX,
      activePath.toX,
      activePath.start,
      activePath.end,
      frame,
      scene.fps,
      activePath.scale ?? actor.scale ?? 1,
    );
    x = loco.x;
    facing = loco.facingDir > 0 ? 'threeQuarterRight' : 'threeQuarterLeft';
    pose = addPoseLayer(pose, loco.poseDelta);
  }

  const baseHeadTurn =
    facing === 'threeQuarterLeft'
      ? -0.55
      : facing === 'threeQuarterRight'
        ? 0.55
        : 0;
  const baseBodyTurn =
    facing === 'threeQuarterLeft'
      ? -0.4
      : facing === 'threeQuarterRight'
        ? 0.4
        : 0;
  pose.headTurn = baseHeadTurn + (pose.headTurn ?? 0);
  pose.bodyTurn = baseBodyTurn + (pose.bodyTurn ?? 0);

  const bioProps = bodyProportions(actor.design);
  if (perf.breathing) {
    pose = addPoseLayer(
      pose,
      computeIdleLayer(
        actor.id,
        frame,
        scene.fps,
        pose.seated ?? 0,
        bioProps.motionTempo,
        bioProps.postureSlouch,
      ),
    );
  }

  const visemeSample = speech
    ? perf.smoothViseme
      ? smoothVisemeOpenness(speech.visemes, local)
      : (() => {
          const v = speech.visemes.find(
            (c) => local >= c.start && local < c.end,
          );
          return {
            viseme: v?.viseme ?? ('rest' as const),
            openness: v ? (v.openness ?? 1) : 0,
          };
        })()
    : { viseme: 'rest' as const, openness: 0 };

  const activeEmotion = emotion?.emotion ?? 'neutral';
  const partnerCue = scene.speech.find(
    (c) => c.speaker !== actor.id && frame >= c.start && frame < c.end,
  );

  if (perf.speakingMotion && speech) {
    const speakEnergy =
      visemeSample.viseme === 'rest'
        ? 0.22
        : Math.max(0.35, visemeSample.openness);
    pose = addPoseLayer(
      pose,
      computeSpeakingLayer(
        actor.id,
        frame,
        scene.fps,
        speakEnergy,
        activeEmotion,
        bioProps.motionTempo,
      ),
    );
  } else if (perf.listeningMotion && !speech) {
    pose = addPoseLayer(
      pose,
      computeListeningLayer(
        actor.id,
        frame,
        scene.fps,
        Boolean(partnerCue),
        activeEmotion,
      ),
    );
  }

  if (perf.autoGaze) {
    const targetActor =
      (partnerCue
        ? scene.actors.find((a) => a.id === partnerCue.speaker)
        : undefined) ??
      scene.actors.find(
        (a) =>
          a.id !== actor.id &&
          frame >= (a.enter ?? 0) &&
          frame < (a.exit ?? scene.duration),
      );
    if (targetActor) {
      const targetCompleted = [...(targetActor.paths ?? [])]
        .reverse()
        .find((p) => frame >= p.end);
      const targetActive = (targetActor.paths ?? []).find(
        (p) => frame >= p.start && frame < p.end,
      );
      const targetX = targetActive
        ? computeWalkLocomotion(
            targetActive.fromX,
            targetActive.toX,
            targetActive.start,
            targetActive.end,
            frame,
            scene.fps,
            targetActive.scale ?? targetActor.scale ?? 1,
          ).x
        : (targetCompleted?.toX ?? targetActor.x);
      const selfHeight =
        rigGeometry(actor.design).height * (actor.scale ?? 1);
      const targetHeight =
        rigGeometry(targetActor.design).height * (targetActor.scale ?? 1);
      const dy = (selfHeight - targetHeight) * 320;
      const gaze = computeAutoGaze({ x, y: 0 }, { x: targetX, y: dy });
      pose.gazeX = (pose.gazeX ?? 0) + gaze.gazeX;
      pose.gazeY = (pose.gazeY ?? 0) + gaze.gazeY;
      pose.headTurn = Math.max(
        -1,
        Math.min(1, (pose.headTurn ?? 0) + gaze.headTurnBias),
      );
    }
  }

  const blinkPhase = frame % 103;
  const blink = perf.seededBlink
    ? actorBlinkAt(actor.id, frame, scene.fps)
    : blinkPhase >= 73 && blinkPhase <= 77
      ? Math.sin(((blinkPhase - 73) / 4) * Math.PI)
      : 0;

  const face = evaluateBlendedFace({
    actorId: actor.id,
    emotions: actor.emotions,
    frame,
    fps: scene.fps,
    viseme: visemeSample.viseme,
    openness: visemeSample.openness,
    blink,
    gazeX: pose.gazeX,
    gazeY: pose.gazeY,
    headTurn: pose.headTurn,
    blendFrames: perf.emotionBlendFrames ?? 8,
  });

  return {
    visible,
    x,
    facing,
    pose,
    face,
    speech,
    speaking: Boolean(speech),
    motion: activePath
      ? 'locomotion'
      : (cue?.motion.label ?? prior?.motion.label ?? 'idle'),
  };
};

export const evaluateScene = (scene: StorySceneDefinition, frame: number) =>
  scene.actors
    .map((actor) => ({ actor, ...evaluateActor(scene, actor, frame) }))
    .filter((x) => x.visible);

export const validateStoryScene = (scene: StorySceneDefinition) => {
  const fail = (message: string): never => {
    throw new Error(`${scene.id}: ${message}`);
  };
  if (
    !Number.isInteger(scene.fps) ||
    scene.fps <= 0 ||
    !Number.isInteger(scene.duration) ||
    scene.duration <= 0
  ) {
    fail('invalid clock');
  }
  const ids = new Set(scene.actors.map((a) => a.id));
  if (ids.size !== scene.actors.length) {
    fail('duplicate actor ID');
  }
  for (const actor of scene.actors) {
    const enter = actor.enter ?? 0;
    const exit = actor.exit ?? scene.duration;
    if (actor.enter !== undefined && (actor.enter < 0 || actor.enter >= scene.duration)) {
      fail(`invalid entrance: ${actor.id}`);
    }
    if (actor.exit !== undefined && (actor.exit <= enter || actor.exit > scene.duration)) {
      fail(`invalid exit: ${actor.id}`);
    }
    for (const prop of actor.props ?? []) {
      validateContent(prop.content);
      if (
        !Number.isInteger(prop.start) ||
        !Number.isInteger(prop.end) ||
        prop.start < enter ||
        prop.end > exit ||
        prop.end <= prop.start
      ) {
        fail(`invalid held prop interval: ${actor.id}`);
      }
      if (prop.hand !== 'left' && prop.hand !== 'right') {
        fail('invalid prop hand');
      }
    }
    const props = actor.props ?? [];
    if (new Set(props.map((p) => p.content.id)).size !== props.length) {
      fail(`duplicate prop ID: ${actor.id}`);
    }
    for (let i = 0; i < props.length; i++) {
      for (let j = i + 1; j < props.length; j++) {
        if (
          props[i].hand === props[j].hand &&
          props[i].start < props[j].end &&
          props[j].start < props[i].end
        ) {
          fail(`two props in same hand: ${actor.id}`);
        }
      }
    }
    let emotionEnd = 0;
    for (const c of actor.emotions ?? []) {
      if (c.start < emotionEnd || c.end <= c.start || c.end > scene.duration) {
        fail(`invalid emotion intervals: ${actor.id}`);
      }
      emotionEnd = c.end;
    }
    let end = 0;
    for (const c of actor.body) {
      if (
        c.start < end ||
        !Number.isInteger(c.start) ||
        !Number.isInteger(c.duration) ||
        c.duration < 1 ||
        c.motion.index < 0 ||
        c.motion.index > 12 ||
        c.start + c.duration > scene.duration
      ) {
        fail(`overlapping/out-of-range body cues: ${actor.id}`);
      }
      end = c.start + c.duration;
    }
    let pathEnd = enter;
    for (const p of actor.paths ?? []) {
      if (
        !Number.isInteger(p.start) ||
        !Number.isInteger(p.end) ||
        p.start < pathEnd ||
        p.end <= p.start ||
        p.end > exit
      ) {
        fail(`overlapping/out-of-range path cues: ${actor.id}`);
      }
      pathEnd = p.end;
    }
  }
  for (const c of scene.speech) {
    if (!ids.has(c.speaker)) {
      fail(`speaker ${c.speaker} is not in scene cast`);
    }
    if (c.start < 0 || c.end <= c.start || c.end > scene.duration) {
      fail(`invalid speech interval: ${c.id}`);
    }
    const actor = scene.actors.find((a) => a.id === c.speaker)!;
    if (c.start < (actor.enter ?? 0) || c.end > (actor.exit ?? scene.duration)) {
      fail(`speaker absent during speech: ${c.id}`);
    }
    let end = 0;
    for (const v of c.visemes) {
      if (v.start < end || v.end <= v.start || v.end > c.end - c.start) {
        fail(`invalid viseme timing: ${c.id}`);
      }
      end = v.end;
    }
  }
  for (let i = 0; i < scene.speech.length; i++) {
    for (let j = i + 1; j < scene.speech.length; j++) {
      const a = scene.speech[i];
      const b = scene.speech[j];
      if (a.speaker === b.speaker && a.start < b.end && b.start < a.end) {
        fail(`overlapping speech for ${a.speaker}`);
      }
    }
  }
  return scene;
};
