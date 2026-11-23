import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const cache = new Map();
const load = (p) => {
  p = path.resolve(p);
  if (cache.has(p)) return cache.get(p);
  if (!fs.existsSync(p)) {
    p = ['.ts', '.tsx', '.json'].map((ext) => p + ext).find(fs.existsSync) ?? p;
  }
  let code = p.endsWith('.json')
    ? 'export default ' + fs.readFileSync(p, 'utf8')
    : ts.transpileModule(fs.readFileSync(p, 'utf8'), {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.React,
        },
      }).outputText;
  code = code.replace(
    /from\s+(['"])([^'"]+)\1/g,
    (_, q, spec) =>
      `from ${q}${spec.startsWith('.') ? load(path.resolve(path.dirname(p), spec)) : import.meta.resolve(spec)}${q}`,
  );
  const url =
    'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  cache.set(p, url);
  return url;
};

const { springValue, seededHash, seededUnit, applyEasing } = await import(
  load('src/engine/math.ts')
);
const {
  NEUTRAL_POSE,
  blendPoses,
  addPoseLayer,
  computeIdleLayer,
  computeSpeakingLayer,
  computeListeningLayer,
  computeWalkLocomotion,
} = await import(load('src/engine/pose.ts'));
const {
  actorBlinkAt,
  smoothVisemeOpenness,
  evaluateBlendedFace,
  computeAutoGaze,
} = await import(load('src/engine/face.ts'));
const { evaluateCamera, evaluateInsertTransition } = await import(
  load('src/engine/camera.ts')
);
const { ProportionCharacterRig } = await import(
  load('src/animation/ProportionCharacterRig.tsx')
);
const { raka, nisa } = await import(load('src/components/characters/registry.ts'));

// 1. Math & spring physics
assert.equal(springValue(0, 24), 0);
assert.equal(springValue(-5, 24), 0);
const underdamped = Array.from({ length: 48 }, (_, f) =>
  springValue(f, 24, { stiffness: 240, damping: 12, mass: 1 }),
);
assert.ok(Math.max(...underdamped) > 1.0, 'underdamped spring overshoots 1');
assert.ok(
  Math.abs(underdamped.at(-1) - 1) < 0.05,
  'underdamped spring settles near 1',
);
assert.ok(
  underdamped.every(Number.isFinite),
  'spring values remain finite across all frames',
);
assert.equal(seededHash('raka'), seededHash('raka'));
assert.notEqual(seededHash('raka'), seededHash('nisa'));
assert.ok(seededUnit('darto') >= 0 && seededUnit('darto') < 1);
assert.ok(applyEasing(0.5, 'easeOutBack') > 0.5);

// 2. Pose blending & layering
const pA = { ...NEUTRAL_POSE, headTilt: 0, squash: 1, expression: 'neutral' };
const pB = { ...NEUTRAL_POSE, headTilt: 10, squash: 1.1, expression: 'happy' };
const pMid = blendPoses(pA, pB, 0.5);
assert.equal(pMid.headTilt, 5);
assert.ok(Math.abs(pMid.squash - 1.05) < 1e-9);
assert.equal(pMid.expression, 'happy');
const layered = addPoseLayer(pA, { headTilt: 4, squash: 1.05 }, 0.5);
assert.equal(layered.headTilt, 2);
assert.ok(Math.abs(layered.squash - 1.025) < 1e-9);

// 3. Idle, speaking, listening & locomotion
const idleSample = computeIdleLayer('raka', 18, 24, 0);
assert.ok(Number.isFinite(idleSample.breath) && Number.isFinite(idleSample.headTilt));
const speakSample = computeSpeakingLayer('raka', 12, 24, 0.85, 'angry');
assert.ok(Math.abs(speakSample.headTilt) > 0 && speakSample.jawDrop > 0);
assert.deepEqual(computeSpeakingLayer('raka', 12, 24, 0, 'neutral'), {});
assert.deepEqual(computeListeningLayer('nisa', 12, 24, false, 'neutral'), {});
const listenSample = computeListeningLayer('nisa', 12, 24, true, 'suspicious');
assert.ok(Number.isFinite(listenSample.headTilt));

const locoBefore = computeWalkLocomotion(1400, 1100, 10, 58, 10, 24, 1);
assert.equal(locoBefore.x, 1400);
assert.equal(locoBefore.active, false);
const locoMid = computeWalkLocomotion(1400, 1100, 10, 58, 34, 24, 1);
assert.equal(locoMid.active, true);
assert.equal(locoMid.facingDir, -1);
assert.ok(locoMid.x < 1400 && locoMid.x > 1100);
assert.ok(Math.abs(locoMid.poseDelta.hipLeft) > 0);
const locoAfter = computeWalkLocomotion(1400, 1100, 10, 58, 58, 24, 1);
assert.equal(locoAfter.x, 1100);
assert.equal(locoAfter.active, false);

// 4. Blink, smoothed viseme, emotion crossfade & auto-gaze
const blinkSeq = (id) =>
  Array.from({ length: 140 }, (_, f) => (actorBlinkAt(id, f, 24) > 0.5 ? f : -1)).filter(
    (f) => f >= 0,
  );
assert.notDeepEqual(blinkSeq('raka'), blinkSeq('nisa'));
assert.notDeepEqual(blinkSeq('darto'), blinkSeq('petugas'));

const visemes = [
  { start: 0, end: 1, viseme: 'rest', openness: 0 },
  { start: 1, end: 2, viseme: 'A', openness: 0.9 },
  { start: 2, end: 3, viseme: 'O', openness: 0.6 },
];
assert.equal(smoothVisemeOpenness(visemes, 0).viseme, 'rest');
assert.equal(smoothVisemeOpenness(visemes, 0).openness, 0);
const smoothed = smoothVisemeOpenness(visemes, 1);
assert.equal(smoothed.viseme, 'A');
assert.ok(Math.abs(smoothed.openness - (0.9 * 0.56 + 0.6 * 0.22)) < 1e-6);

const blendedFace = evaluateBlendedFace({
  actorId: 'nisa',
  emotions: [
    { start: 0, end: 20, emotion: 'happy' },
    { start: 20, end: 60, emotion: 'angry' },
  ],
  frame: 24,
  fps: 24,
  viseme: 'A',
  openness: 0.8,
  blink: 0,
  blendFrames: 8,
});
assert.ok(blendedFace.channelsOverride, 'emotion transition produces smooth override');
assert.ok(
  blendedFace.channelsOverride.smile > -0.6 &&
    blendedFace.channelsOverride.smile < 1,
);

const gaze = computeAutoGaze({ x: 520, y: 0 }, { x: 1120, y: 0 });
assert.ok(gaze.gazeX > 0 && gaze.headTurnBias > 0);

// 5. Camera damping, clamping & insert transitions
const cam = evaluateCamera(
  [
    { frame: 0, focusX: 600, focusY: 540, zoom: 1.2, transitionFrames: 0 },
    { frame: 10, focusX: 1300, focusY: 540, zoom: 1.3, transitionFrames: 12 },
  ],
  16,
  24,
  { worldWidth: 1920, worldHeight: 1080, viewportWidth: 1080, viewportHeight: 1920 },
  [{ frame: 14, zoomBoost: 0.05, shakePx: 4, durationFrames: 10 }],
);
assert.ok(cam.zoom > 1.2 && cam.x <= 0 && cam.x >= 1080 - 1920 * cam.zoom);

const insOut = evaluateInsertTransition(5, 10, 50, 24);
assert.equal(insOut.visible, false);
const insIn = evaluateInsertTransition(16, 10, 50, 24);
assert.equal(insIn.visible, true);
assert.ok(insIn.opacity > 0.5 && insIn.scale > 0.8);

// 6. Rig V2 SSR rendering (3/4 turns, squash, breath, hijab, Raka & Nisa)
for (const [design, turn] of [
  [raka, 0.55],
  [raka, 0],
  [nisa, -0.55],
]) {
  const markup = renderToStaticMarkup(
    React.createElement(ProportionCharacterRig, {
      design,
      roleLabel: design.name,
      pose: {
        headTurn: turn,
        bodyTurn: turn * 0.8,
        squash: 0.94,
        breath: 0.8,
        shoulderLift: -1.5,
        hairSwing: 3,
        jawDrop: 2,
      },
      face: {
        emotion: 'happy',
        viseme: 'A',
        openness: 0.8,
        headTurn: turn,
        jawDrop: 2,
      },
    }),
  );
  assert.doesNotMatch(markup, /NaN|Infinity|undefined/);
  assert.ok(markup.includes(`aria-label="${design.name}, ${design.name}"`));
}

console.log(
  'ANIMATION ENGINE VALIDATED: spring physics, pose blending/layering, foot-locked locomotion, per-actor blink, co-articulated visemes, blended emotions, auto-gaze, damped camera, and Rig V2 3/4 SSR rendering.',
);
