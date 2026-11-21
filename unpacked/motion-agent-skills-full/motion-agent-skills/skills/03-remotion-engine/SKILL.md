---
name: remotion-engine
description: Write deterministic frame-driven React/TypeScript motion graphics and render with Remotion.
---
# Remotion implementation

## Rules
- Define compositions with explicit id, width, height, fps, durationInFrames and typed defaultProps.
- Drive animation with `useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, `Easing`; use `Sequence`/`Series` for timing and `AbsoluteFill` for layers.
- Use `staticFile` for project assets; use Remotion-supported video/audio components and verified package APIs.
- Keep frame subscription in the smallest component; derive seconds from composition fps.
- For interpolation use explicit extrapolation clamps where needed; check overshoot for springs.
- Avoid CSS animation/transition as render-time animation; do not use timers.
- Test at frame 0, scene boundaries, last frame, and representative middle frames.
- Render CLI commands should be checked against installed version (`npx remotion --help`).

## Example
See `examples/remotion/AnimatedHeadline.tsx` and `examples/remotion/Root.tsx`.

## Build quality
Reusable components with typed props, data separated from visuals, stable key usage, no offscreen text, no unsupported DOM effects, no network dependencies during render.

Official docs: https://www.remotion.dev/docs ; https://www.remotion.dev/docs/spring ; https://www.remotion.dev/docs/interpolate ; https://www.remotion.dev/docs/ai/skills
