---
name: audio-typography
description: Align visual events, subtitles and kinetic typography to narration, beats and sound design.
---
# Audio, captions and kinetic type

## Timeline data
Prefer word-level timestamps from forced alignment when available. If timestamps are approximate, mark confidence and avoid exact syllable-sync claims. Keep audio source, transcript, word intervals, music cues and visual events in one timebase.

## Captions
Maximize readable phrase groups, sensible line breaks and contrast. Avoid covering faces or evidence. Use per-platform layout. Subtitle words must follow speech; don't invent words missing from the VO.

## Audio
Preserve speech intelligibility, check music ducking and SFX masking. Inspect integrated loudness and true peak with ffmpeg or another analyzer; choose delivery targets per platform and content, not one universal value.

## Kinetic typography
Animate the semantically important word or phrase, not every word. Make typography settle long enough to read. Avoid bouncing sensitive factual claims or charts in a way that distorts their meaning.
