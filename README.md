# Studio Satir — Remotion framework

An editable, frame-driven studio/animatic foundation for the eight supplied Indonesian satirical episode scripts. Includes original concept vector character rigs, a cast/model sheet, location staging and animated props. It is **not a finished cartoon episode**: dialogue and timing are draft estimates, the concept art is not yet approved, and there are no recorded voices, music or SFX.

## Start the browser studio

```sh
npm install
npm run studio
```

Open the Vite URL. Select an episode, switch the explicit 9:16 / 1:1 / 16:9 re-compositions, play/seek, or click a shot block to jump to that scene. The timeline is 90 seconds at 30 fps. All rendered motion derives from Remotion frame state; layout and scene notes are data-driven.

## Render (when the render browser is available)

Remotion compositions are named `Episode-01-vertical`, `Episode-01-square`, `Episode-01-landscape` through Episode 08. Example:

```sh
npx remotion render src/remotion-entry.ts Episode-01-vertical render.mp4
```

Remotion needs its supported Chrome Headless Shell. The current sandbox could not download it from `remotion.media` because that host is outside the available network allowlist, so no MP4/contact sheet is claimed. Use `npx remotion browser ensure` in an environment with the official download host enabled, then run the render command and ffprobe/contact-sheet QA.

## Edit content / extend

- `src/data/episodes.json`: normalized script source, 8 episodes / 48 shots, parsed from the provided DOCX files.
- `src/components/StoryFrame.tsx`: deterministic scene renderer, shot cuts, scene stage and captions.
- `src/components/characters/CharacterRig.tsx`: original layered vector puppet with frame-derived blink, mouth shapes, acting cues and gesture timing.
- `src/components/characters/cast.ts`: 16 distinct lead/counterpart palette-and-costume profiles.
- `src/components/SceneSet.tsx`, `src/components/SceneProp.tsx`: reusable location sets and 48 scene-aware animated prop cards.
- `public/assets/character-sheets.svg`: editable source-generated character bible / expression and palette reference; open at `/assets/character-sheets.svg`.
- `scripts/generate-character-sheets.mjs`: regenerates the SVG model sheet.
- `src/design/tokens.ts`: typed palette, type, motion, and safe-margin tokens.
- `src/remotion.tsx`: registers 24 compositions across three independently sized ratios.
- `src/main.tsx` and `src/studio.css`: browser-based episode selector, preview, shot navigation, and metadata.
- `scripts/extract-episodes.py` → `scripts/enrich-episodes.mjs`: reproducibly parse the provided DOCX into clean shot data (dialogue/camera/action/audio kept in separate fields) and assign structural scene variants.
- `scripts/build-docs.mjs`: regenerates `brief.json`, `creative-brief.md`, `storyboard.md` + `storyboard.json`, `shotlist.json`, `audio-cues.json`, and `assets-manifest.json`.
- `scripts/validate-project.mjs`: checks all 48 scene records, exact contiguous frame boundaries, extracted field integrity, template coverage and honest missing-render status.
- `src/motion/primitives.ts`: typed pure functions for fade, slide, scale and reveal; accepts local frame spans and reduced-motion behavior.

## Engine/template choice

Remotion 4.0.545 was selected per the supplied `ENGINE-DECISION.md`: this is TypeScript-heavy, data-driven animation with multiple layout variants. Chosen custom template ID: `CARTOON-CUTOUT-EDITORIAL`, adapted from the supplied cartoon skill's motion-comic/caption concepts. This names our framework design pattern, not an installed or downloadable third-party template. Vite 7.3.8 / React 19.2.3 / TypeScript 5.9.3 are pinned in `package.json`.
