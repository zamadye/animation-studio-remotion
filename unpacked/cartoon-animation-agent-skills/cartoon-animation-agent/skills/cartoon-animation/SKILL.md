---
name: cartoon-animation
description: Design, implement, animate, and quality-check short-form 2D cartoon videos using reusable rigs, storyboard timing, Remotion, and optionally OpenFilm.
---
# Cartoon Animation Production Skill

## Scope and evidence
Produce original stylized 2D cartoon animation for Shorts/Reels/TikTok. The referenced YouTube Short has NOT been visually inspected: do not claim to reproduce its exact style, characters, pacing, or effects. Request video or frames for reference-matching. Never copy identifiable proprietary characters without authorization.

## Inputs
Required: concept/story or script, target duration, aspect ratio. Defaults: 9:16, 1080x1920, 30fps, 15–30 seconds, original vector cartoon style. Optional: character sheets, reference frames, dialogue audio, SFX, palette, brand kit, subtitle policy, engine (Remotion/OpenFilm).

## Output contract
Produce `creative-brief.md`, `storyboard.json`, `characters/*.svg` or equivalent layered assets, `shots/*.tsx` for Remotion OR a separate OpenFilm implementation, `audio-cues.json`, rendered MP4, contact sheet, and `qa-report.md`. If rendering is unavailable, label source-only deliverables as unrendered.

## Pipeline
1. Analyze narrative: hook (0–2 s), setup, escalation, payoff, final hold/loop. Record exact on-screen action, not only dialogue.
2. Design character bible: silhouette, proportions, pivot positions, 6–10 facial expressions, mouth shapes (rest, open, wide, round, closed), hands, costume, palette, and layer order. Maintain model-sheet continuity.
3. Storyboard shot by shot. Specify start/end frames, camera scale/position, staging, character acting, speech, SFX, background and transitions. Keep the focal subject in the safe area.
4. Animatic: rough timed panels with scratch audio; validate comprehensibility without final polish.
5. Rig characters using hierarchical transforms: body/root → torso → head → eyes/mouth; shoulder → arm → hand; hip → leg → foot. Set transform origins at joints. Use separate SVG layers or image layers, not a single flattened sprite if articulation is needed.
6. Animate key poses first, then breakdowns and in-betweens. Prefer anticipation → action → overshoot → settle; use squash/stretch conservatively; preserve perceived mass and ground contact.
7. Acting: eye darts, blinking, head turns, eyebrow poses, hand gestures, mouth sync. Avoid random continuous motion. Dialogue beats drive gestures; silence can be an intentional hold.
8. Camera: deliberate push, pan, tracking, or static hold; avoid simultaneous unnecessary camera and character motion. For vertical crop, recompose rather than blindly crop.
9. Sound: align phoneme approximations or syllabic mouth openings to dialogue; frame-accurate impact SFX, footsteps and whooshes. Maintain intelligibility and avoid clipping.
10. Render preview, inspect sampled frames and motion, fix defects, then export final. Record any unverified aspect.

## Motion grammar
- Timing at 30fps: blink 3–5 frames closed; anticipation 4–10 frames; reaction hold 6–18 frames; impact 1–3 frames; settle 5–12 frames. These are starting ranges, not universal rules.
- Easing: use ease-out for arrival, ease-in for departure, ease-in-out for neutral travel, overshoot/spring for comic impact. Do not apply spring to everything.
- Smears and multiples: only for fast movement, typically 1–2 frames, with legibility checks.
- Squash/stretch: preserve approximate visual volume; attach deformation to action, not idle loops.
- Secondary action should lag primary action (hair, clothing, accessories), with deterministic delay.
- Avoid interpolating every expression continuously; discrete pose swaps often read better.
- Screen-space readability: mobile-first faces, strong silhouettes, simple backgrounds, captions away from key acting.

## Visual templates (choose, do not stack all)
1. Expressive dialogue: 2D puppet rig, reaction closeups, lip sync, eyebrow changes.
2. Slapstick gag: anticipation, speed smear, impact squash, delayed reaction.
3. Explainer mascot: presenter character, animated callouts, diagram inserts.
4. Cutout comedy: articulated paper-like shapes, stepped poses, bold outlines.
5. Motion-comic: panel layouts, parallax, limited character movement, dramatic holds.
6. Kinetic cartoon captions: text responds to speech and impact, never blocks faces.
7. Looping micro-story: end pose transitions cleanly into opening pose.
8. Sticker/pop animation: snappy elastic motion, outlined props, high contrast.
9. Character walk cycle: contact, down, passing, up poses, correct foot locks.
10. Morph gag: shape interpolation with topology-compatible vectors or crossfades.
11. Reaction zoom: short camera punch with readable settle.
12. Multi-character dialogue: eyelines, turn-taking, clean screen direction.

## Technical rules: Remotion
- Use React + TypeScript; one composition with explicit width, height, fps and durationInFrames.
- Animation must be a deterministic pure function of frame, props, and fixed seed. No `Date.now()`, `Math.random()` during render, unmanaged timers, CSS autoplay or network dependencies.
- Use `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, `spring()`, `Sequence` / `Series` and `staticFile()` where appropriate. Clamp interpolation where needed.
- Keep character rigs and shot definitions separate from rendering. Use typed props and data-driven timing.
- Audio/video assets must be licensed and preflighted. Synchronize to frame boundaries; explicitly account for audio offsets.
- For a shot local frame: `const local = frame - startFrame`; clamp values to avoid animation extrapolation.
- Reframe using authored focal points and separate per-aspect camera/layout parameters. Avoid `object-fit: cover` as the only strategy.
- Export MP4 H.264, yuv420p, 1080x1920 for standard vertical delivery unless specified otherwise.

## Technical rules: OpenFilm
- Treat OpenFilm as a separate renderer, not as Remotion-compatible React code.
- Before implementation inspect installed package version, examples and actual API. Do not invent methods. Implement only supported frame-driven HTML/CSS/SVG/Canvas operations.
- Keep shot assets and timing data engine-neutral, but write engine-specific adapters. Validate a minimal 2-second smoke test before porting a full episode.

## Data schema
Storyboard JSON is an array of shots with: `id`, `startFrame`, `durationFrames`, `description`, `characters`, `poses`, `camera`, `dialogue`, `sfx`, `background`, `safeArea`, `transition`. Validate non-overlapping shot intervals unless overlap is intentional and explicitly described.

## QA gates
- Narrative: first 2 seconds understandable; punchline legible; dialogue matched to on-screen action.
- Identity: proportions, costume, palette, line width and eye placement remain consistent.
- Animation: no pivot drift, broken joints, foot sliding, pop-through, accidental jitter, missing layers or bad interpolation.
- Composition: no clipped heads, mouths, captions or key gestures; safe areas checked for 9:16 and any alternate aspect.
- Audio: no clipped speech, no SFX masking punchlines, mouth timing visually plausible.
- Engineering: no missing assets, frame errors, nondeterministic output, type errors, render failures.
- Deliver contact sheet (at least first, middle, final frame per shot) and short motion preview. A still contact sheet alone cannot validate temporal motion.

## Failure policy
If the video reference cannot be inspected, label style assumptions as hypotheses. If audio has no transcript, do not invent exact lip-sync timing. If assets are missing, use explicitly labeled placeholders. If rendering cannot be run, do not claim the MP4 or visual QA passed.
