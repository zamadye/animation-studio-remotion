# Experimental rig cutout inspection

Inspected assembled layer composites after regenerating the PNGs.

- The first generated package was broken: layer alpha masks were applied in source coordinates but then resized from the entire source canvas while being positioned as though each layer were cropped to the foreground bounds. This displaced the sprites completely. `scripts/prepare-v3-rig-assets.py` now crops the foreground bounding box before scaling and positioning the layer; rerunning the generator fixes the assembled neutral composites.
- Current neutral composite checks: Darto and Petugas both assemble as recognizable full-figure front-view characters on transparent backgrounds. The visible pieces line up at rest; the assembled characters remain essentially the source illustration, not a tested articulated animation.
- Important limitations remain: polygon masks are hand-authored estimates, limbs/torso/head are still fragments from one flattened pose, and there are no clean joint overlaps, independent painted turnarounds, prop grips, or tested rotations. The Darto worried and Petugas refusal head variants are not guaranteed to register to the neutral head; Petugas's rejection reference is a desk/folder interaction, not an isolated figure. These files are experimental cutout proofs only and must not be represented as production-ready rigs.
- Rebuild composites with `./.venv/bin/python scripts/prepare-v3-rig-assets.py`; compare each layer package against its concept/front source before any animation acceptance review.
