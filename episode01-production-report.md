# Episode 01 production status — updated 21 November 2026

## Deliverables
- `Episode-01-Orang-Miskin-Dilarang-Miskin-Cinematic.mp4` — complete 90-second portrait render, 1080×1920, 30 fps, H.264/AAC. Six staged source-scene blocks, dialogue captions, complete line-level generated dialogue mix, low-level scene ambience, and sparse synthetic foley.
- `Proof-01-Cinematic-Acting.mp4` — separately available 13-second opening proof.
- `audio/ep01-timeline.json` — 18 line-level speaker/text/audio cues with explicit timeline and duration, matched in order to all 18 source dialogue lines.
- `scripts/generate-ep01-audio-bed.py` — deterministic synthetic room tone and timed sound-effect generator.
- Reproduce audio beds with `npm run audio:ep01:generate`; reproduce the episode with `npm run render:ep01:cinematic`.

## Gap and detail fixes
- Replaced grouped later-scene VO cues with individual generated clips for each turn, preserving the dialogue's source order and leaving deliberate reaction/acting gaps rather than overlapping speakers.
- All 18 source dialogue lines now have matching text, character attribution, and a timed speech clip, including the final public-address line. The opening three clips are accelerated 1.06× in the episode mix so the opening exchange lands within its 12-second source scene; this is a modest editorial speed change.
- Added a continuous, very low-level procedural location bed with different office/roadside/porch tones, plus restrained synthetic stamp, failed starter, page-turn, and phone-ring cues. These are generated effects, not location recordings or sourced Foley.
- Added controlled deterministic push-ins per source beat, line-level caption timing, and revised scene-specific Darto reach/gesture poses. Earlier right-edge close-up framing was corrected.

## Visual QA performed
Representative frames were extracted and inspected in the first three scene blocks, the desk return, the later office dialogue, and the final phone/bench scene. Checked the full 90-second encode and frame rate, subtitle legibility in those samples, scene-specific staging, props, and final fade. The output decodes with both video and audio streams.

## Checks
`npm run typecheck`, `npm test`, `npm run build`, `python3 -m py_compile scripts/render-ep01-cinematic.py scripts/generate-ep01-audio-bed.py`, and `git diff --check` pass. The Vite build keeps its non-blocking large-chunk warning.

## Limitations (still material)
- This remains a **stylized animated animatic**, not polished final cartoon animation. The characters have simple graphic shapes and limited joint acting; facial topology, hand detail, secondary action, and emotional nuance remain modest. The scene builds and close-up changes are more purposeful than the previous still presentation, but the camera choreography and acting are not at broadcast-quality level.
- VO now covers every source line, but speaking roles use a small reused set of generated voice identities; notably the child and roadside buyer are not individually bespoke cast performances. Generated speech has not been human-directed or acoustically matched across every line.
- Lip motion remains coarse vowel-class cycling, not forced phoneme alignment, and no exhaustive listen-through or all-frame lip-sync QA has been completed. Opening speed-up is intentional; the remaining clip starts are timestamped but not aligned to phonemes.
- Room tone and Foley are procedural synthetic cues, not authentic recorded ambience. No score is used.
- QA samples representative moments rather than all 2,700 frames. The Remotion full-episode Chromium render remains unvalidated due to the prior browser-runtime download failure. This MP4 is made by the deterministic offline renderer, not Remotion.
- No landscape 16:9 recompose is included.

## Status
The full 90-second edit, complete source-line VO coverage, and a subtle sound bed are delivered for review. The remaining work is refinement toward final animation quality: bespoke performances, phoneme-level lip sync, nuanced rig acting, authentic sound, full-frame QC, and visual validation of the Remotion-rendered output.
