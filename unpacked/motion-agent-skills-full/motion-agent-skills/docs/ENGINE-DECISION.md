# Engine selection

| Situation | Preferred | Rationale |
|---|---|---|
| Programmatic batch videos from structured data | Remotion | React components, props, composition registry and rendering APIs |
| TypeScript-heavy product animation | Remotion | Typed reusable components and parameterized timelines |
| Editable browser-first film pages | OpenFilm | film.html tracks, per-shot HTML pages and Studio |
| Existing HTML/SVG/Canvas/three.js shot | OpenFilm | Native browser page rendering via frame(t) |
| Many aspect ratios from a shared component system | Remotion, or OpenFilm with explicit layout variants | Must test crop and typography |
| Fast manual visual adjustments in Studio | OpenFilm | Editor workflow |

Do not assert one engine renders faster without benchmarking the actual project. Use ffmpeg as a post-processing and QC tool, not a substitute for timeline design.

References:
https://www.remotion.dev/docs
https://www.remotion.dev/docs/ai/skills
https://openfilm.dev/docs/manual/
https://github.com/openfilm/openfilm
