# EP001 — Part 2 / original user VO

Source folder: RameFrame/BARU GAJIHAN UANG HABIS (Drive 1SVNzrYhk3WPaenkJNv0fOcowf69VHG-W).
Source MP3: 1fxaa4QXQJNDSpQgbDx1Dyi-UF3XW3Jbx. SRT: 1sCi4neZq3Jdq6QEcV5si-EYAKd3ief4p. Blueprint: EP001_Full_Scene_Animation_Breakdown.pdf, Part02 sections02.01–02.03 (pages5–6), extracted earlier in this conversation.

## Source and continuity
- Source audio preserved byte-for-byte in public/audio/gajian-part2, SHA256 in source.json. 56.0 decoded seconds, 1344 frames at24fps; eight original SRT cues retained verbatim here. No synthesis, new dialogue, speed change, removed sentences, music or SFX.
- Raka uses exact Ayah design, Nisa exact Mira design, preserving catalog costume identity. Unnamed colleague uses existing Pria design, not a new lead-character casting.
- Raka mouth animation uses original cue boundaries plus decoded audio amplitude and text-estimated shapes; NOT forced phoneme alignment. Nisa/colleague remain silent while Raka recounts events.
- No automatic SRT spelling errors burned as subtitles. On-object notebook copy is concise authored visual content, not a replacement script.

## Visual sequence
0–6.8: held notebook, discretionary coffee and bought-lunch lines are crossed out only (not fixed bills).
6.8–9.53: closed lunchbox attached to left hand, brought from home.
9.53–13.45: worn patched bag retained.
13.45–23.51: hopeful Raka, small savings Rp5k/10k/15k progressively revealed, not fabricated guaranteed daily earnings or a monthly balance.
23.51–31.15: savings jar, commute.
31.15–36.22: quick work/bekal/home/record montage, synchronized to cue5.
36.22–44.61: colleague's invitation, Raka's refusal via approved gesture.
44.61–50.19: wife concerned, not an antagonist.
50.19–56: Raka's resolve.

Native1080×1920; camera crops same continuous scene and socket-held objects. Approved body motions reused without edits. No bespoke writing, finger typing, food-to-mouth or money-deposit manipulation is claimed; notebook changes and open-lunchbox are editorial object-state changes. Simple new lunchbox prop shares existing attachment/grip infrastructure. Jar and patched bag are in-world set props.

## QA
Typecheck, entire npm test suite and body-lock pass. All1344 scene frames validated for actor visibility, speech, silent listeners and valid held props. Source hash matches downloaded MP3. Complete output MP4 decoded successfully with no errors.18 actual output samples inspected across all16 shots, plus9 authoring stills. Not a claim of full perceptual audio/phoneme certification.

Build source: `.venv/bin/python scripts/build-gajian-part2.py` (local PCM analysis only, no API).
Render: `npm run render:part2`.
