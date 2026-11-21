---
name: openfilm-engine
description: Author and inspect OpenFilm HTML-based films, page shots and timelines using the installed OpenFilm manual.
---
# OpenFilm implementation

## Read current manual first
Run `npx -y openfilm@latest` or installed `openfilm` and consult `openfilm skill film`, `openfilm skill edit`, and other available skills. Verify current syntax before creating a project. Official docs: https://openfilm.dev/docs/manual/ .

## Project model
`film.html` is the timeline, HTML pages are shots, `assets/` holds media. Each animated page must derive its visible state from the supplied timeline time `frame(t)` as specified by the installed version. HTML/CSS/SVG/canvas/three.js are valid drawing surfaces; browser-based CSS animation should not be used as a substitute for deterministic time-driven motion.

## Workflow
1. Inspect existing film and project; do not overwrite user edits.
2. Write storyboard and decide track placement.
3. Implement shots as HTML pages with deterministic frame(t) functions.
4. Assemble `film.html` according to the current SPEC, not guessed attributes.
5. Use `openfilm open` to inspect in Studio; `openfilm look` for frames/contact sheets; `openfilm render` for video; `openfilm doctor` for environment diagnostics.
6. Validate output and reframe variants independently.

## Caveat
The illustrative `examples/openfilm/shot.html` is a page animation concept, not a complete valid film timeline. Generate film.html using the current official manual/SPEC.

Reference: https://github.com/openfilm/openfilm
