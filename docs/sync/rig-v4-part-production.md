# Rig V4 + Drive VO production sync

Integrated user remote commit `a9052012b39f12ac994a61cd47793d7e0784b256` with local delivered Part1/Part2 setup saved in `919cd24`.

- User implementations under src/components/characters and src/animation retained exactly, including dedicated Raka/Nisa biometrics, costumes, character registry and reference art. No fallback to previous Ayah/Mira aliases.
- User engine/evaluator/coordinates, updated body-lock baseline and official Gajian composition/tests remain canonical.
- Local source VO/SRT, source hashes, Part1/Part2 compositions, original timing, props and render commands preserved. Seat option added to user's StoryActor/types to support existing native world furniture without discarding state.x/facing/engine coordinates.
- Merged optional headerTag from user with bank/video/notebook/lunchbox/wallet prop variants from delivered parts.
- Canonical conflicting user files build-gajian-timeline.py, test-gajian.mjs and GajianEpisode.tsx retained. Superseded contextual draft counterparts saved under build-contextual-draft-timeline.py, test-contextual-draft.mjs, ContextualDraftEpisode.tsx rather than overwriting user versions.
- Character tests now assert new Raka/Nisa identities instead of obsolete Ayah/Mira equality. Comparison proof now uses actual Rig V4 characters at both scales.
- All npm tests (including engine, Gajian, biometrics and Part1/Part2), typecheck and Vite production build pass. Build has a non-blocking >500kB bundle warning.
- Previous Drive videos are historical renders of pre-V4 artwork; synchronizing code does not update their content. No full episode re-render or new VO performed as part of this sync.
