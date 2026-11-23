import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const extractBlock = (source, tag, file) => {
  const startMarker = `@lock-start:${tag}`;
  const endMarker = `@lock-end:${tag}`;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Missing lock markers (${tag}) in ${file}`);
  }
  return source.slice(start, end + endMarker.length);
};

export const bodyLockInputs = () => {
  const read = (p) => fs.readFileSync(p, 'utf8');
  const draw = read('src/animation/ProportionCharacterRig.tsx');
  const production = read('src/components/characters/CharacterRig.tsx');
  return {
    'motion-schedule': read('src/animation/rigMotionCatalog.ts'),
    'body-geometry': read('src/components/characters/rigGeometry.ts'),
    'arm-hierarchy': read('src/animation/ArticulatedArm.tsx'),
    'cast-designs': read('src/components/characters/cast-data.json'),
    'body-drawing': extractBlock(
      draw,
      'body-drawing',
      'src/animation/ProportionCharacterRig.tsx',
    ),
    'body-adapter': extractBlock(
      production,
      'body-adapter',
      'src/components/characters/CharacterRig.tsx',
    ),
    'body-placement': extractBlock(
      production,
      'body-placement',
      'src/components/characters/CharacterRig.tsx',
    ),
  };
};

export const digest = (s) => crypto.createHash('sha256').update(s).digest('hex');

if (process.argv[1]?.endsWith('check-body-motion-lock.mjs')) {
  const lockPath = 'docs/body-motion-lock.json';
  const inputs = bodyLockInputs();
  if (process.argv.includes('--update')) {
    const updated = {
      version: 'rig-v4',
      status:
        'Updated to approved Rig V4 editorial & anatomical baseline (ref-ep01-leads craft, sloped trapezius, tapered brows, sculpted eyes/noses/lips, rolled sleeves, tailored costumes).',
      sha256: Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, digest(value)]),
      ),
    };
    fs.writeFileSync(lockPath, JSON.stringify(updated, null, 2) + '\n');
    console.log('BODY LOCK UPDATED: Rig V4 baseline hashes saved.');
  } else {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    for (const [key, value] of Object.entries(inputs)) {
      assert.equal(
        digest(value),
        lock.sha256[key],
        `APPROVED BODY LOCK: ${key} changed. Do not regenerate the baseline without user approval.`,
      );
    }
    console.log(
      'BODY LOCK VERIFIED: approved Rig V2 motion schedule, geometry, arms, cast, drawing and production placement unchanged.',
    );
  }
}
