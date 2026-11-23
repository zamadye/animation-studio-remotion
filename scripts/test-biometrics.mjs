import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const remotionShimSource = `
  import React from 'react';
  export const useCurrentFrame = () => globalThis.__BIO_TEST_FRAME__ ?? 0;
  export const useVideoConfig = () => ({ fps: 24, width: 1920, height: 1080, durationInFrames: 240 });
  export const staticFile = (p) => '/static/' + p;
  export const AbsoluteFill = ({ children, style }) => React.createElement('div', { 'data-abs-fill': '1', style }, children);
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

const { characterRegistry } = await import(
  load('src/components/characters/registry.ts')
);
const { resolveCharacterBiometrics, buildHeadContour } = await import(
  load('src/animation/faceRig.ts')
);
const { bodyProportions } = await import(
  load('src/components/characters/rigGeometry.ts')
);
const { ProportionCharacterRig } = await import(
  load('src/animation/ProportionCharacterRig.tsx')
);
const { BiometricCastShowcase } = await import(
  load('src/animation/BiometricCastShowcase.tsx')
);

const entries = Object.entries(characterRegistry);
assert.equal(entries.length, 18, 'expected 18 registered characters');

const faceShapes = new Set();
const ageGroups = new Set();
const eyeShapes = new Set();
const noseShapes = new Set();
const footwears = new Set();
const headPaths = new Set();
const svgOutputs = new Set();

for (const [id, design] of entries) {
  const bio = resolveCharacterBiometrics(design);
  const bp = bodyProportions(design);
  faceShapes.add(bio.face.faceShape);
  ageGroups.add(bio.face.ageGroup);
  eyeShapes.add(bio.face.eyeShape);
  noseShapes.add(bio.face.noseShape);
  footwears.add(bp.footwear);

  const contour0 = buildHeadContour(bio.face, 0);
  const contourTurn = buildHeadContour(bio.face, 0.55);
  assert.notEqual(
    contour0.path,
    contourTurn.path,
    `${id}: 3/4 headTurn sculpts skull contour`,
  );
  headPaths.add(contour0.path);

  for (const turn of [-0.6, 0, 0.6]) {
    const svg = renderToStaticMarkup(
      React.createElement(ProportionCharacterRig, {
        design,
        roleLabel: design.name,
        pose: { headTurn: turn, bodyTurn: turn * 0.7 },
        face: { emotion: 'neutral', viseme: 'rest', headTurn: turn },
      }),
    );
    assert.doesNotMatch(
      svg,
      /NaN|Infinity|undefined/,
      `${id} valid SVG at turn ${turn}`,
    );
    if (turn === 0) svgOutputs.add(svg);
  }
}

assert.equal(faceShapes.size, 7, 'all 7 face shapes represented');
assert.equal(ageGroups.size, 5, 'all 5 age groups represented');
assert.equal(eyeShapes.size, 5, 'all 5 eye shapes represented');
assert.equal(noseShapes.size, 5, 'all 5 nose shapes represented');
assert.equal(footwears.size, 5, 'all 5 footwear styles represented');
assert.ok(
  headPaths.size >= 14,
  `expected >= 14 distinct skull contour paths across 18 characters, got ${headPaths.size}`,
);
assert.equal(
  svgOutputs.size,
  18,
  'all 18 characters produce unique SVG silhouettes',
);

// Spot-check biometric distinctions across age, gender, and build
const diniBio = resolveCharacterBiometrics(characterRegistry.dini);
assert.equal(diniBio.face.ageGroup, 'child');
assert.equal(diniBio.face.wrinkles, 0);
assert.equal(characterRegistry.dini.hairShape, 'pigtails');
assert.ok(diniBio.body.neckWidth <= 24);

const beniBio = resolveCharacterBiometrics(characterRegistry.pakBeni);
assert.equal(beniBio.face.ageGroup, 'senior');
assert.ok(beniBio.face.wrinkles >= 0.8);
assert.ok((beniBio.face.grayHair ?? 0) >= 0.5);
assert.equal(beniBio.face.facialHair, 'short-beard');

const dartoBio = resolveCharacterBiometrics(characterRegistry.darto);
assert.equal(dartoBio.face.faceShape, 'square');
assert.equal(dartoBio.face.facialHair, 'stubble');
assert.equal(dartoBio.body.footwear, 'boots');

for (const id of ['petugas', 'nina', 'nisa']) {
  const b = resolveCharacterBiometrics(characterRegistry[id]);
  assert.equal(b.face.eyelashes, true, `${id} has eyelashes`);
  assert.ok(b.body.hipRatio >= 1.1, `${id} feminine hip ratio`);
  assert.equal(b.body.footwear, 'flats', `${id} flats footwear`);
}

const rakaBio = resolveCharacterBiometrics(characterRegistry.raka);
assert.equal(rakaBio.face.faceShape, 'diamond');
assert.equal(characterRegistry.raka.hairShape, 'textured');
assert.equal(rakaBio.body.footwear, 'sneakers');

const nisaBio = resolveCharacterBiometrics(characterRegistry.nisa);
assert.equal(nisaBio.face.faceShape, 'oval');
assert.equal(characterRegistry.nisa.hairShape, 'hijab');
assert.equal(nisaBio.face.frecklesOrMoles, 'mole-left');

// SSR render BiometricCastShowcase across full-body and close-up portrait phases
for (const f of [0, 60, 120, 180]) {
  globalThis.__BIO_TEST_FRAME__ = f;
  const html = renderToStaticMarkup(React.createElement(BiometricCastShowcase));
  assert.doesNotMatch(html, /NaN|Infinity|undefined/);
  assert.equal((html.match(/data-biometric-card=/g) ?? []).length, 18);
}

console.log(
  `BIOMETRICS VALIDATED: 18 unique character rigs, ${headPaths.size} distinct skull paths, 7 face shapes, 5 age groups, 5 eye/nose/footwear styles, and 4 showcase SSR frames.`,
);
