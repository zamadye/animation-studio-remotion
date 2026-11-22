# Character rig integration — review build

## Integrated paths

- `src/components/characters/CharacterRig.tsx` is the production entry point used by `StoryFrame` and `ProofScene`. It now delegates drawing to the reviewed proportion rig rather than the previous large-head renderer.
- `src/components/characters/cast-data.json` is the canonical source for the 16 named characters: palette, presentation, body shape, height variation, child flag, existing hair and costume options. Lineup sheets no longer apply their own palette/body overrides.
- `src/animation/ProportionCharacterRig.tsx` shares role clothing and articulated arms between sheets and production. It accepts `pose`, `arms`, and an embedded viewport mode. Hip/knee/ankle sections accept leg rotations; waist carries shoulder and neck hierarchy. Blink, mouth, gaze, brow expressions, and head tilt are connected.
- `src/animation/ArticulatedArm.tsx` uses shoulder → elbow → wrist parenting with shared 77/66-unit segment lengths and sleeve overlap.
- `src/components/characters/rigGeometry.ts` shares shoulder measurements and segment constants between drawing and IK. Unreachable targets are clamped and labeled when target debug is enabled.

## Coordinate contract

`CharacterRig` retains its 360×540 public viewport and `scale` prop. The new skeleton is placed using translate(27,20), scale(0.85). Height variation is applied about y=620 in rig coordinates. Targets are public viewport coordinates **before root translation**, not CSS pixels after actor scale. Existing world-to-local staging code remains responsible for removing the actor's world and root offsets.

IK reverses viewport mapping, body-height mapping, then torso rotation about (180,350). A hand target controls the wrist pivot, not the mitten tip or an automatic grasp point. Prop attachment offsets must be authored explicitly.

`actingPose.armLeft/Right` are angular offsets from the relaxed shoulders (+6° left, −6° right). `elbowLeft/Right` are local rotations. Clip curves authored for the old diagonal rest limbs need visual retargeting. `facing` currently adjusts eye-line only; this is not a full three-quarter body turn. The separate offline Python renderer and static generated asset sheets are not migrated by this React integration.

## Verification performed

- `npm run typecheck`: pass.
- `npm test`: project validation plus 96 numerical IK/FK endpoint round-trips (16 designs × 2 sides × 3 torso leans), including child height mapping and unreachable-target finite/clamped checks: pass.
- `npm run build`: pass; Vite reports a non-blocking bundle-size warning.
- `Character-Integration-Check`: rendered 180 frames at 30 fps (6 seconds), all 16 characters through arm lift, recovery, IK transition, hold and recovery. Uses production `CharacterRig`, not direct study rendering.
- Visually inspected selected integration frames 29, 75, 105, 135, 165 and earlier IK samples. Selected samples show connected shoulders/elbows and intact role identifiers. This is sampled inspection, not frame-by-frame or full-episode approval.
- Rendered a `StoryFrame` sample (`Episode-02-vertical`, frame 100): new Nina/HR designs are used. Existing scene staging still floats actors above the floor and needs separate blocking correction.
- Rendered `Proof-01-Opening-Scene`, frame 150: new proportions are used. Document/wrist contact and the medium-shot crop are not acceptable yet; old interaction targets/camera blocking require re-authoring.

## Still gated before episode production

No full 90-second episode was rendered or approved. Remaining work: retarget old acting clips, correct floor/camera blocking, fix document attachment/contact with the new wrist pivots, validate both arms throughout motion, exercise walking and seated garment overlap, and run grayscale/silhouette/50%-scale checks. Knee motion is connected but foot planting has not been qualified; props/accessories do not yet have secondary motion. Numerical IK success is not a substitute for contact or garment visual QA.

## Commands

```sh
npm run typecheck
npm test
npm run build
npx remotion render src/remotion-entry.ts Character-Integration-Check character-integration-check.mp4 --codec h264 --crf 23 --public-dir public
```

In this sandbox the render also needs `--browser-executable=/tmp/chromium` and `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64`.

## Follow-up: synchronized full-rig catalog

The subsequent `Full-Rig-Catalog` build adds the left arm, both legs, ankle compensation, pelvis overlap, sit/stand root compensation, and seated waist/arm exercises for all 16 characters using one motion index. See `docs/full-rig-catalog.md` and `docs/rig-motion-index.json` for the 13 movements. The earlier verification and pending list above describe the initial integration pass; seated mechanics now have dedicated catalog coverage, while episode blocking, document contact and locomotion foot-lock remain pending.
