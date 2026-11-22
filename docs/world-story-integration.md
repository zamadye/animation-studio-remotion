# World + story integration proof

## Delivered scope

`World-Dialogue-Proof` is a 12-second, 1920×1080, 24 fps office dialogue proof. Only Darto and Petugas are mounted. It combines the new world library, locked body rig, facial expression/speech tracks, existing audio clips and cue-driven subtitles. It is not the 90-second episode or a final acting/contact proof.

`src/world/WorldStoryScene.tsx` provides one reusable entry point: strict location lookup → WorldStage background → StoryScene explicit cast/audio → foreground furniture. The world supplies floorY; actor x/scale remain explicitly authored in the scene, rather than silently changed by draft world anchors.

```tsx
import {WorldStoryScene} from '../world';

<WorldStoryScene
  episodeId="01"
  location="Kantor pelayanan"
  scene={scene}
/>
```

The caller must provide a 1920×1080 canvas with matching scene/composition fps. Existing legacy episode compositions still use their previous environment pipeline; they have not been silently migrated.

## Proof choices

- Both characters remain standing, with Petugas behind the foreground counter. No seated/contact animation is claimed.
- Darto uses the approved right-arm gesture during the opening 60 frames. No locked motion source or baseline was edited.
- Existing speech clips and relative mouth cues are reused without audio regeneration. Both absolute speech windows are shifted earlier by exactly 120 frames: Darto 60–136; Petugas 168–217.
- Facial emotions are independent: Darto sad early; Petugas angry around the reply. Listeners stay mouth-rest.
- Subtitles are cue-window captions, not word-level karaoke.
- Lip sync remains audio-energy-gated text estimation, not forced phoneme alignment.

## QA performed

- Typecheck, full project tests, body SHA lock and production build pass (existing bundle-size warning only).
- Added world-story checks for shared floor, strict unknown-location rejection, unchanged scene reference, audio opt-out, exact two-actor membership, exact shifted speech windows and listener mouth-rest across all 288 frames.
- H.264 render completed successfully, 288 frames / 12 seconds, with muxed speech audio.
- Six rendered frames inspected: opening gesture, both Darto speech samples, pause, Petugas reply and ending. Counter foreground ordering, floor placement and subtitle placement are visible in the review sheet.
- Decoded muxed audio to mono PCM: silence RMS 0 in 0–2.4 s, 5.8–6.9 s and 9.3–12 s; speech RMS ~2418 in both dialogue regions. This checks clip placement and silence, not perceptual phoneme accuracy.

## Remaining gates

Document handoff, exact hand/prop contact, sitting against set chairs, actor-to-actor eyelines/turning, walking/navigation, flood waterline and bridge occlusion remain separate blocking tasks. The proof intentionally makes no claim that those issues are solved. Do not promote this to final episode approval.

## Reproduce

`npm run render:world-dialogue`

Sandbox browser flags: `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64 npm run render:world-dialogue -- --browser-executable=/tmp/chromium --quiet`.
