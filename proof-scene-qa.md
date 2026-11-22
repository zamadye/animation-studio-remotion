# Proof 01 V4 — QA handoff

## Build / render
- Composition: `Proof-01-Opening-Scene`, 360 frames at 30 fps, 1080×1920 (12 s).
- `npm run typecheck`: passed.
- `npm test`: passed.
- `npm run build`: passed; Vite emits its chunk-size advisory only.
- Silent acting/final proof: `Proof-01-V4-12s.mp4` (no dialogue or music track).
- Debug render: `Proof-01-V4-Rig-HandTarget-Debug.mp4`.
- Hand-target still: `Proof-01-V4-Hand-Targets.png` (frame 110, target rings shown).
- Pose contact sheet: `Proof-01-V4-Pose-Contact-Sheet.jpg`.

## Revisions after re-reading the technical brief and animation skill
- Staging/blocking first: Darto is in the visitor/front plane; Petugas remains behind the desk. The five windows are exact: 0–75 two-shot, 75–150 form/hand insert, 150–225 Petugas, 225–300 Darto, 300–360 return medium.
- Interaction path: Darto carries the folder at his side → offers it to the surface → pauses/releases → Petugas reaches, picks up and raises it to read → returns it to the counter → Darto reaches, reclaims and lowers it to his torso. Contact points are explicitly aligned; travel uses deterministic eased frame interpolation.
- Body before face: walk is now limited to the moving entrance beat, decelerates into a stop, and uses alternating stance targets so the planted feet compensate against root travel. Timed pose curves ease the torso, head, arm and gaze instead of snapping at beat thresholds.
- Face: expression and gaze shift along hopeful → uncertain → shocked → frustrated → defeated; Petugas neutral → evaluating → dismissive. Facing cues use 2D face depth/near-far eye asymmetry, not a true 3D model.
- Camera after blocking/acting: designed focal positions and distinct coverage, including a character-free insert with isolated forearms/hands.
- No dialogue sync was added: this is a silent acting proof, as requested. Do not invent lip timing without a recorded track.

## Visual review performed
The rendered clip was inspected via representative frames across all five shots plus selected frames around walk stop, offer/release, pickup/read, return and reclaim (including 0, 6, 12, 18, 24, 30, 35, 36, 45, 74, 75, 80, 90, 100, 108, 120, 150, 198, 225, 228, 240, 258, 300 and 359). Frame 110 hand-target debug overlay was inspected. This is not a manual inspection of all 360 frames or a full human 1× playback with audio.

## Acceptance matrix
- Spatial blocking/opposite desk sides: **PASS in reviewed stills**.
- Prop movement/contact: **PARTIAL** — path/ownership are continuous and targets visually align, but stylized hands are simplified and do not articulate individual fingers; full-speed playback still needs user review.
- Walk/grounding: **PARTIAL** — stance-target compensation and stop easing are implemented; a still sheet cannot establish flawless foot-lock perception at 1× speed.
- Body acting: **PARTIAL** — posture, torso lean, arm, gaze and head beats now ease; expressive performance remains limited by the simple rig.
- Facial acting/facing: **PARTIAL** — emotion states and a 2D three-quarter cue are present; it is not a true profile/3D turn.
- Five-shot coverage/reframing: **PASS in reviewed frames** — insert, clerk, Darto and return medium differ from the establishing two-shot.
- Dialogue sync/audio/phonemes: **NOT PRODUCED / NOT APPLICABLE** — silent proof; no recorded dialogue provided.
- Full 360-frame, phone-size, ffprobe, audio, black-frame and full playback audit: **NOT RUN**. No audio asset is in this composition; no claim is made about audio QA.

## Disposition
The previous V4's major visual failures (cut-off entrance, same-size coverage, uncontrolled holding positions, pose threshold pops and walk continuing after travel) have been addressed in this pass. This is a **revised review render, not unconditional final approval**. Watch the proof at 1× speed and judge the hand contact/foot-lock. Do not start the 90-second episode until that proof is explicitly approved.
