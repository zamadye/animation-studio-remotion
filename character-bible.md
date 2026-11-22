# Character Bible — Studio Satir (concept v0.3)

## Scope and fidelity
All model shapes in this repository are editable original vector concepts, not final approved designs. Episode 01's source addresses the service clerk as “Bu”; the new concept therefore stages Petugas as an adult woman in a tied-back bun, shaped face, fitted public-service blouse and knee-length skirt. Darto is a working-class adult man with a heavier brow, rough cropped hair, stubble, worn work shirt, patched pocket, trousers and work shoes. The roadside buyer is a separate adult man with short curls, a stockier frame and earth-toned overshirt. These are intentional presentation/costume choices for visual readability, not claims about real people.

## Editable design source
- `src/components/characters/cast-data.json` supplies typed design tokens for skin, hair, uniform, hair silhouette, body silhouette, gender presentation, outfit type and lower garment.
- `src/components/characters/cast.ts` defines the profile contract and stable fallback resolution.
- `src/components/characters/CharacterRig.tsx` is the Remotion SVG rig, including role-specific torso details, skirt option, workwear, service-uniform details, face shapes, brows, lashes, mouth and hierarchical limbs.
- `scripts/episode01_actor.py` is the independent offline-render model builder. It mirrors the Episode 01 role choices with separate Darto/Petugas/PEMBELI head shapes, hair, facial detail, clothing construction and footwear.
- `scripts/generate-character-sheets.mjs` regenerates `public/assets/character-sheets.svg` from the design tokens, including the Episode 01 distinctions.

## Episode 01 silhouette and costume keys
- **Darto:** masculine-coded broad/average working silhouette; short, uneven crop; squarer jaw; darker skin; beard/stubble texture and eye creases; worn teal work shirt, collar, placket, chest pocket, reinforced patch/cuffs; dark trousers and practical lace-up work shoes. Acting leans forward and reaches with an open hand when pleading.
- **Petugas:** feminine presentation supported by the source's “Bu”; slimmer shoulder/waist silhouette; oval/tapered face, bun and lash detail; slate public-service uniform with light collar, shoulder boards, buttons, name badge and pocket; straight skirt and low pumps. Acting is contained, procedural and reaction-led.
- **Pembeli:** masculine-coded stockier frame; short curl silhouette; moustache; tan canvas overshirt, dark work trousers and heavy shoes. He is staged as a distinct on-screen speaker in the roadside scene.
- **Anak / Pengeras suara:** remain off-screen as the source requires; phone and PA subtitles/audio do not create invented bodies.

## Rig and animation limits
The React rig is 360×540 with hips/knees, shoulder/elbow groups, head pivot and deterministic pose input. The offline character art is a separate rasterized vector-like implementation at low render scale, then upscaled for the final MP4. Do not imply both renderers are visually identical. Poses are limited cutout key poses and frame cycles; hands are mitten-like, no finger posing, no full turn-around, and no perspective/volume deformation. Eye blinks/gaze and facial expressions are deterministic. Generated dialogue is now line-cued, but mouth shapes use coarse vowel cycling—not phoneme alignment or verified lip-sync.

## Continuity/QA still open
- Validate the new character designs in the **actual Remotion render**; the browser renderer has not yet been validated in this environment.
- The offline full episode was reviewed at representative timestamps after the revised costumes; comprehensive all-frame silhouette, collision, clipping and motion QC remains to be done.
- Additional distinct models for any new named speaker, approved turnarounds, culturally informed wardrobe review, fine facial animation and hand/prop contact remain production work.
