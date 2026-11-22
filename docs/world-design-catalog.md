# World design catalog — richer vector direction

## Scope

New world modules live in `src/world/`. This batch is a design-direction catalog for all eight episodes, not final episode blocking. Forty-one unique episode/location pairs from the existing script (48 shots) are explicitly mapped; unknown locations throw instead of silently using a random background.

The library shares 16 environment families: service office, interview/office, drain, bridge, minimarket, stockroom, flooded neighborhood/wall, community center/posko, home, school gate, classroom, school hall/administration, bus stop, street, service exterior, minimarket exterior. Related script locations deliberately share architecture; these are not 41 independently bespoke illustrations. Night variants follow source location names. Close-up metadata is reserved for future camera work; close-up locations currently retain the wide master layout.

## Visual direction

Warm muted colors and brown outlines remain compatible with the approved characters. Detail is increased through wood joins, frames, noticeboards, binders, shelf products, fabric cushions, tiles, deterministic paper grain, vegetation, roof lines, overhead cables, water marks/ripples and role-specific signage. These are scalable SVG assets, not raster-generated backdrops. No character rig, body motion, cast design, or expression curves were changed.

Eight master views:

1. Civic service office: waiting chairs, paperwork board, archive shelves and public counter.
2. Interview office: recruitment signage, HR door, folders, waiting area and desk.
3. Drain-side street: neighborhood houses, trees, overhead cables, drainage channel and warning marker.
4. School hall/admin: chalkboard, flag, notice area, administration door and desk.
5. Flooded neighborhood: simple house, laundry line, complex wall, water, floating debris.
6. Family home: sofa, cushions, framed wall decor, lamp, television and rug.
7. Damaged bridge: river landscape, boards, rail and visibly damaged span.
8. Minimarket cashier: product shelves, promo marker, scanner/register and foreground counter.

## Layer API

- `WorldArt` supports `background`, `foreground`, or `all`.
- `WorldStage` places background at z=0, caller-supplied characters at z=1, foreground furniture/edge dressing at z=2.
- Desks/counters used by service, office, school, community and shop are foreground assets. Actors can be occluded by them without changing the rig. Other fixed set dressing remains in the background plane for this design pass.
- Reusable exports: `WorldDesk`, `WorldPlant`, `WorldWindow`, `WorldSign`.
- Each location has draft floor/actor/interaction anchors. `debug` draws guides without mounting extra actors.

```tsx
import {WorldStage, resolveWorld} from '../world';
import {StoryScene} from '../story';

const world = resolveWorld('01', 'Kantor pelayanan');
// scene contains only the characters explicitly selected for the story.
<WorldStage episodeId="01" location="Kantor pelayanan">
  <StoryScene scene={scene} floorY={world.floorY} />
</WorldStage>
```

The working coordinate canvas is 1920×1080. Registry actor zones are center anchors; StoryActor's `x` is a left edge, so subtract `180 * actorScale` when placing an actor on a center anchor. Other aspect ratios need an authored camera/crop and matching actor-coordinate mapping; stretching the art alone is not enough.

## Deliberate review gates

The existing legacy `SceneSet` has NOT been automatically replaced across every episode. This preserves current story behavior until world design is reviewed. Use the new `WorldStage` API for the new world pipeline.

Current anchors are placeholders for blocking review, not validated collision-free navigation. The flood environment needs a waterline/leg occlusion layer before actors wade; bridge board gaps/rails need authored navigation and occlusion; drain-edge hand/body contact needs staging; chairs and counters need exact seat/hand offsets. Night variants are color/light-direction studies, not a full lighting system. No 90-second episode was rendered.

## Outputs and QA

`World-Design-Catalog`: eight primary episode views, 84 frames each at 24 fps, 28-second slideshow. `World-Location-Atlas`: all 41 mapped location variants, one frame per location at 1 fps, used to generate the review PDF.

`npm run test:world` checks every source shot resolves, IDs are unique, night flags are consistent, SVGs for all locations render without invalid values, foreground is transparent, and the world preserves the supplied actor slot without creating characters. Existing body hash lock, character, face and story sync tests still pass. Build passes with the existing non-blocking bundle-size warning.

Render: `npm run render:world-catalog`. In this sandbox add `--browser-executable=/tmp/chromium` and use `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64`.

### Visual review in this batch

All eight master views were inspected in an overview, plus selected corridor, school gate, bus-stop night, stockroom night, shop facade and bridge-night variants. The corridor sign was moved clear of the doors and the minimarket exterior was differentiated with a retail glass frontage/striped canopy. Final PDF pages were regenerated from the final atlas render.

`World-Character-Scale-Check` is a separate single-frame integration check using only Darto and Petugas through `StoryScene` inside `WorldStage`. It verifies the current visual scale, floor contact and counter foreground ordering without editing the locked rig. It does not certify document contact, navigation or all location blocking.
