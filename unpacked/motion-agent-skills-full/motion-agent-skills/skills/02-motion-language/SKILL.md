---
name: motion-language
description: Apply modern motion principles, easing, hierarchy, timing and reusable motion primitives.
---
# Motion Language

## Timing system
Use seconds for creative specification, convert to integer frames at the engine boundary. At 30fps, 0.2s=6 frames; 0.4s=12 frames; 0.8s=24 frames. These are starting points, not universal standards.

Entrance → settle → hold → exit. Build transitions around attention transfer. Prefer short, subtle movements for dense information; stronger movement for scene changes.

## Easing
- Ease-out: enter / reveal.
- Ease-in: leave / accelerate.
- Ease-in-out: camera moves and spatial relocation.
- Spring: physical or elastic feedback only; tune damping to prevent accidental overshoot.
- Linear: clocks, timelines, steady panning and data-progress only when appropriate.

## Primitive contracts
`fade`, `slide`, `scale`, `maskReveal`, `stagger`, `followPath`, `countUp`, `parallax`, `cameraPush`, `focus`, `wipe`, `typeReveal`. Each primitive must accept startFrame, durationFrames, easing and reducedMotion where relevant; no hidden global clocks.

## Typography
Use clear type hierarchy, controlled line breaks, high contrast and language-aware wrapping. Animate meaningful phrases rather than every character by default. Check legibility at phone-sized preview.

## Visual system
Tokens: background, surface, text, muted, accent, alert, grid spacing, corner radius, font scale, stroke width, shadow and motion duration. Avoid adding color or ornament without information function.
