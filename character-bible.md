# Character Bible — Studio Satir (concept v0.2)

## Source and usage
Original vector concepts derived from the supplied fictional scripts. They are editable local React/SVG assets, not traced or externally sourced designs. Do not treat as final model approval. Full named cast per episode is retained in `src/data/episodes.json`; the current playable rig stages only the lead and one counterpart at a time.

## Model sheet
- `public/assets/character-sheets.svg` — eight episode rows, lead/counterpart palette and six lead expression studies (neutral, talk, concern, surprise, frustrated, relief).
- `scripts/generate-character-sheets.mjs` regenerates that sheet.
- `src/components/characters/cast.ts` defines role, skin/hair/costume/accent colors, hair silhouette, glasses and apron.
- `src/components/characters/CharacterRig.tsx` is the layered renderer. Layer order: ground shadow → legs/feet → torso/costume → pivoted arms/hands → neck → ears/head → hair/headwear → brows/eyes → nose/mouth → costume details.

## Rig contract
SVG viewBox: 360×540. Root/body baseline is fixed. Arm root pivots are (122,300) and (238,300); elbow/hand details are currently drawn as a single arm/hand path inside each rotated limb group. Legs and head are static in this prototype. All pose values derive from local scene frame; no ambient time, timers, CSS transitions or random values.

## Acting and mouth keys
Ten typed acting cues exist (`neutral`, `talk`, `concern`, `surprise`, `gesture`, `hold`, `frustrated`, `relief`, `stern`, `delight`). Five mouth/viseme shapes are represented in code (`rest`, `open`, `wide`, `round`, `closed`). They are stylized acting cycles, **not** phoneme alignment; no dialogue recording or timestamps were supplied. Blinks are deterministic; gesture begins with a small anticipation, raises an arm, then settles. Reduced motion freezes gesture/idle interpolation.

## Palette and continuity
Each episode has a stable lead/counterpart palette. Use the same character profile across scenes. `SceneSet` selects a stable episode palette. Wardrobe and silhouette must remain consistent; don't invent a different model per shot.

## Still open
- Full pose turnarounds, 6–10 reviewed expressions for every cast member, and separate elbow/hand/finger controls.
- Child and additional speaking roles should be staged accurately instead of reusing the two-person preview.
- Eye darts, head turns, walk/contact cycles, anticipation per action, impact/reaction and prop hand-contact need authored shot choreography.
- Approve skin/hair/costume choices, culturally/contextually review headwear, facial features and role portrayal.
- Lip sync, mouth timing and audio offsets require recorded VO and alignment; do not claim current approximate mouth cycles are lip sync.
