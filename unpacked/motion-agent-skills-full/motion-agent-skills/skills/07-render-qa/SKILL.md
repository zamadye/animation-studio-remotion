---
name: render-qa
description: Validate motion graphics through frame-level visual checks, timing checks and audio/video diagnostics.
---
# Rendering and QA

## Automated checks
- Build/typecheck, missing assets, font loading, render completion, expected duration and resolution.
- Use ffprobe for stream metadata, fps, duration and audio presence.
- Detect unexpected black/blank frames, frozen frames and abrupt loudness spikes; verify intentional black cuts separately.
- Capture first, middle, last and every cut boundary (+/- 2 frames); build contact sheet.
- Check captions are inside safe zones, no visual overlaps, no cropped subject, no illegible contrast.

## Human/agent review
Watch at 1x speed with audio, then muted, then phone-sized. Audit whether every transition is motivated, text can be read, cuts match VO, and reframe doesn't lose information.

## Report
Record pass/fail/unknown for: correctness, readability, rhythm, safe areas, audio, frame continuity, asset licensing and reproducibility. Include timestamps and screenshot evidence for defects. Never mark unexecuted checks PASS.
