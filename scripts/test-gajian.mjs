import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

let mockFrame = 0;
const remotionShimSource = `
  import React from 'react';
  export const useCurrentFrame = () => globalThis.__TEST_FRAME__ ?? 0;
  export const useVideoConfig = () => ({ fps: 24, width: 1080, height: 1920, durationInFrames: 2213 });
  export const staticFile = (p) => '/static/' + p;
  export const AbsoluteFill = ({ children, style }) => React.createElement('div', { 'data-abs-fill': '1', style }, children);
  export const Sequence = ({ children, from, durationInFrames }) => React.createElement('div', { 'data-seq': from + ':' + durationInFrames }, children);
  export const Audio = ({ src }) => React.createElement('audio', { src });
`;
const remotionShimUrl =
  'data:text/javascript;base64,' +
  Buffer.from(
    remotionShimSource.replace(
      "from 'react'",
      `from '${import.meta.resolve('react')}'`,
    ),
  ).toString('base64');

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
  code = code.replace(/from\s+(['"])([^'"]+)\1/g, (_, q, spec) => {
    if (spec === 'remotion') {
      return `from ${q}${remotionShimUrl}${q}`;
    }
    return `from ${q}${spec.startsWith('.') ? load(path.resolve(path.dirname(p), spec)) : import.meta.resolve(spec)}${q}`;
  });
  const url =
    'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  cache.set(p, url);
  return url;
};

const {
  gajianTimeline,
  gajianScenes,
  gajianAllLines,
  gajianPhone,
  budgetNote,
  GAJIAN_FPS,
  GAJIAN_TOTAL_FRAMES,
} = await import(load('src/episodes/gajian/gajian.ts'));
const { GajianEpisode } = await import(
  load('src/episodes/gajian/GajianEpisode.tsx')
);
const { evaluateActor } = await import(load('src/story/evaluate.ts'));
const { resolveWorld } = await import(load('src/world/registry.ts'));
const { validateContent } = await import(load('src/props/types.ts'));

const sourceScript = JSON.parse(
  fs.readFileSync('src/episodes/gajian/script.json', 'utf8'),
);

assert.equal(GAJIAN_FPS, 24);
assert.equal(gajianScenes.length, 3);
assert.equal(gajianTimeline.scenes.length, 3);
assert.equal(
  gajianTimeline.scenes.reduce((n, s) => n + s.durationFrames, 0),
  GAJIAN_TOTAL_FRAMES,
);

const expectedLines = sourceScript.scenes.flatMap((s) =>
  s.lines.map((l) => ({ speaker: l.speaker, text: l.text })),
);
assert.equal(gajianAllLines.length, expectedLines.length);
assert.deepEqual(
  gajianAllLines.map((l) => ({ speaker: l.speaker, text: l.text })),
  expectedLines,
);

resolveWorld('gajian', 'Kontrakan');
validateContent(gajianPhone);
validateContent(budgetNote);

for (let i = 0; i < gajianScenes.length; i++) {
  const sData = gajianTimeline.scenes[i];
  const scene = gajianScenes[i];
  assert.ok(
    fs.existsSync(`public/${sData.audio}`),
    `audio exists: ${sData.audio}`,
  );
  assert.deepEqual(
    scene.actors.map((a) => a.id),
    ['raka', 'nisa'],
  );
  assert.equal(scene.duration, sData.durationFrames);

  for (let f = 0; f < scene.duration; f++) {
    const states = scene.actors.map((actor) => ({
      id: actor.id,
      state: evaluateActor(scene, actor, f),
    }));
    for (const { id, state } of states) {
      if (id === 'raka') {
        assert.equal(state.visible, true);
      } else if (i === 0 && f < 235) {
        assert.equal(state.visible, false, 'Nisa enters at frame 235');
      } else {
        assert.equal(state.visible, true);
      }
      if (!state.speaking) {
        assert.equal(
          state.face.viseme,
          'rest',
          `scene ${scene.id} frame ${f}: non-speaker mouth stays rest`,
        );
      }
    }
  }
}

// Verify Nisa's entrance locomotion moves monotonically from 1420 -> 1120.
const nisaActor = gajianScenes[0].actors[1];
const xs = [235, 250, 265, 287, 300].map(
  (f) => evaluateActor(gajianScenes[0], nisaActor, f).x,
);
assert.equal(xs[0], 1420);
assert.ok(xs[1] < xs[0] && xs[2] < xs[1] && xs[3] === 1120 && xs[4] === 1120);

// Verify seated choreography in Scene 3 holds seated = 1 during calculation.
const rakaSeated = evaluateActor(
  gajianScenes[2],
  gajianScenes[2].actors[0],
  120,
);
assert.equal(rakaSeated.pose.seated, 1);

// SSR render GajianEpisode across key frames in both portrait and landscape modes.
for (const portrait of [true, false]) {
  for (const f of [0, 150, 255, 710, 950, 1430, 2115]) {
    globalThis.__TEST_FRAME__ = f;
    mockFrame = f;
    const html = renderToStaticMarkup(
      React.createElement(GajianEpisode, { portrait }),
    );
    assert.doesNotMatch(
      html,
      /NaN|Infinity|undefined/,
      `clean SSR at frame ${f} (portrait=${portrait})`,
    );
    assert.ok(
      html.includes('Baru Gajian, Udah Habis?'),
      `title rendered at frame ${f}`,
    );
  }
}
void mockFrame;

console.log(
  `GAJIAN VALIDATED: 3 scenes / ${GAJIAN_TOTAL_FRAMES} frames / ${gajianAllLines.length} lines, real MP3s, Kontrakan world, Raka & Nisa locomotion + seated acting, silent listener mouths, and portrait/landscape SSR renders.`,
);
