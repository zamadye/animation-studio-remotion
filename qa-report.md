# QA report — Studio Satir framework

## Status

**FRAMEWORK CHECKS: PASS** for source extraction, schema/continuity tests, TypeScript typecheck, Vite build, SVG structure, and dependency audit. The Studio server is live; only HTTP shell/assets have been checked. Character and motion artwork remains concept-grade and not art-directed.

**VIDEO OUTPUT: PARTIAL.** A browser-free silent 2D animatic MP4 now exists for Episode 01. Its duration and six shot-boundary timestamps match the source. Opening-frame and ending-scene layout spot checks passed. The updated cut removes the stage-card enclosure, uses full-bleed location backgrounds with moving outdoor layers, shot-specific actor blocking, varied supporting-character silhouettes/wardrobe, in-world props, and an inferred on-screen buyer in scene 3. It is not the full Remotion composition render or a final voiced/art-directed cartoon; dialogue is estimated and full contact-sheet/playback QA remains incomplete.

## Executed checks

- `npm run extract:scripts` — PASS: 8 DOCX, 48 shots; dialogue, camera, action, animation and SFX fields parsed separately. Validator confirms notes do not leak into dialogue.
- `npm run generate:assets` — PASS: generated SVG sheet with eight episode cast rows and six lead-expression studies per row; XML parse valid.
- Source asset/type checks — PASS: 16 lead/counterpart designs, 8 palette sets, three structural storyboard variants, and frame-driven props/acting code compile.
- `npm run typecheck` — PASS.
- `npm test` — PASS: 48 scene records, integer frame conversion, 90-second sequence boundaries, no overlap/gaps, dialogue extraction, three template IDs, audio-cue placeholders and output status.
- `npm run build` — PASS: Vite transformed 46 modules. Advisory warning remains: minified studio JS chunk exceeds 500 kB.
- Vite dev server on `0.0.0.0:5174`; HTTP shell and character SVG endpoint responded — PASS as HTTP smoke checks only.
- `npm audit` — PASS, 0 vulnerabilities.
- Remotion bundling compiles the entry/source. Composition render stops when Remotion requests Chrome Headless Shell from `remotion.media`; TLS connection is blocked by this environment's host allowlist.
- `npm run render:ep01:offline` — PASS: creates a silent H.264 MP4 at 720×1280 / 15 fps / exactly 90 seconds (1350 frames). Shot boundaries are 00:00, 00:12, 00:26, 00:40, 00:56, 01:12 and 01:30 from episode source data. Opening (frame 30) and roadside exchange (frame 450) spot checks confirmed world background, scene labels, buyer/Darto blocking and dialogue panel; this is not full visual acceptance.

## Not verified / unresolved

- Actual browser visual inspection, player playback, rendered keyframes, title/caption readability, transitions, 3-ratio safe-area validation — UNKNOWN / NOT RUN.
- Final Remotion MP4, audio checks, rendered contact sheet and full scene-boundary visual review — NOT RUN. Offline MP4 stream metadata reports H.264, 720×1280, 15 fps, 90.00 seconds, video-only; its authored shot boundaries were checked against source timing.
- VO timing, mouth sync, audio peaks/loudness/mix/licensing — NOT RUN; no recordings or audio assets were supplied. Dialogue timing is estimated by the source scripts.
- Character acting continuity, art-direction approval, full model turnarounds, per-character expression coverage and all named speaking roles — NOT APPROVED / INCOMPLETE. Up to two source-listed scene characters are staged with stable generated profiles; complete individually approved models/turnarounds for every role are still missing.
- Sourced push/snap-zoom, rack-focus, whip-pan, tracking and explicit tilt notes map to restrained frame-driven stage scale/offset/focus effects. A source-cued 8-pose in-place gait is implemented but foot-lock/contact quality is not visually reviewed. Direct hand-to-prop contact remains unimplemented; visual approval is still blocked.
- Platform UI overlays/safe-zone numbers are unknown and remain configurable placeholders.

## Remaining blockers / defects

1. Render browser unavailable: provide supported Chrome Headless Shell in an environment that can access the official Remotion download, then smoke-render before a full episode.
2. Three variants and three ratios have structural source coverage but still need rendered boundary/long-short-text/reduced-motion test passes before template production readiness.
3. Additional cast/turnaround rigging and final VO/SFX/music are outstanding.
4. Split the studio bundle if loading performance becomes an issue; current >500 kB advisory is not a build failure.

All source stories retain their supplied “fictional satire” disclosure. No third-party templates, footage, music, fonts, or factual visual sources were imported.
