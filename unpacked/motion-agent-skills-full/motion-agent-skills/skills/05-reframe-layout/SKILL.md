---
name: reframe-layout
description: Adapt 16:9, 9:16 and 1:1 content with subject-aware cropping and responsive layout redesign.
---
# Reframe and responsive composition

## Do not simply crop
For each target aspect ratio: re-evaluate subject anchor, information hierarchy, title wrapping, subtitle area, diagram topology, and cutaway visibility. Recompose elements, not just resize the parent canvas.

## Target profiles
- 1920x1080 16:9 landscape
- 1080x1920 9:16 vertical
- 1080x1080 1:1 square
Use platform-specific safe areas as configurable tokens and verify against current UI overlays; do not hardcode supposedly universal safe-zone dimensions.

## Reframe algorithm
1. Identify face/subject bounding boxes and text boxes (manual annotations or reliable detection).
2. Assign saliency weights: essential text 5, active speaker 5, evidence 4, secondary context 2, background 1.
3. Compute candidate crop center over time with minimum pan/zoom movement.
4. Check essential content stays inside safe rectangle; if impossible, change layout or split shot.
5. Use temporal smoothing and hold zones to avoid oscillating camera movement.
6. Generate per-ratio contact sheets; manually review fast motion, overlays and captions.

## Implementation
Separate semantic scene model from layout variant. Define `layoutFor(width,height)` or explicit variants. Keep typography in pixel dimensions scaled with bounds, not blind `transform:scale()` of 16:9 content.

## Acceptance
No cut-off faces, labels, charts, captions or critical props; layout remains balanced and readable in all delivered ratios.
