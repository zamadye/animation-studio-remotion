# EP001 — Part 1 / source supplied by user

Drive folder: RameFrame/BARU GAJIHAN UANG HABIS (folder name has a trailing space).
PDF: EP001_Full_Scene_Animation_Breakdown.pdf (Drive 1WlV0HNdd_ITpbOEy6PzD68d5vebhIffk), Part 01 pages 2–4 plus production limitations.

- VO-PART-01.mp3 used byte-for-byte, no synthesis, edits, speed change or replaced lines. 74.4 seconds decoded, 1786 frames at 24 fps (last frame pads <17ms).
- Original SRT retained verbatim in this folder; 25 cues drive scene timing. It contains acknowledged automatic transcription errors. No automatic transcript is burned into the image, avoiding publishing unverified corrections.
- Four narrative groups: 0–16.67 influencer/house; 16.67–30.42 self-question/work commute; 30.42–53.86 payday/obligations; 53.86–74.4 calculation/wife/uncertainty.
- CORRECTED after user feedback: Raka speaks the supplied VO from cue 2 onward when visible. SRT boundaries and amplitude-gated text-estimated mouth shapes are used, not forced phoneme alignment. Nisa remains silent because the supplied track is Raka speaking. Opening cue stays with the influencer.
- Prior working visual aliases retained: Raka = approved Ayah design, Nisa = approved Mira design; these are not new user-approved casting decisions. Influencer uses existing Influencer design.
- Approved body catalog untouched. No custom typing, money pickup or finger animation claimed. Props are socket attached; salary camera pushes toward the actual phone, ledger close-up is the same held book. Figures appear only when their source cue is reached. No fabricated Rp520,000 deficit or Rp500,000 transfer from the superseded dialogue script.
- Native portrait 1080×1920, no letterboxing or review labels, no music or added VO. Office and kitchen are explicitly new simple native portrait adaptations, not claimed existing atlas layers.
- Output is a first animation pass for user review, not approved final production.

Render: `npx remotion render src/remotion-entry.ts EP001-Part1-DriveVO ep001-part1-drive-vo.mp4 --codec h264 --crf 19`
Build source manifest without speech generation: `.venv/bin/python scripts/build-gajian-part1.py`

## QA performed
- Full MP4 decode: 1786 frames, 1080×1920, 24fps, AAC audio present, 74.4167s container; no decode errors.
- Source MP3 SHA-256 matches the downloaded Drive audio (manifest records hash).
- Typecheck, existing npm test suite, body-motion lock and Part1 all-frame timing test passed.
- Visually inspected 20 samples extracted from the actual MP4 across all 15 shots, including salary push, staged ledger reveals, work montage, kitchen and ending. Fixed initial scene-local clock visibility and table occlusion before this render.
- No perceptual full-audio listening or phoneme accuracy certification is claimed. Source SRT timing is used as supplied; no forced alignment or new VO performed.


## Correction batch: catalog identity and Raka speech
- Root cause found by rendering neutral catalog/episode comparison: changing design.name from Ayah/Mira to Raka/Nisa removed costume artwork keyed on roleLabel. Story registry aliases now retain the ENTIRE original catalog design identity, including name and role. Story IDs remain raka/nisa. No locked geometry or movement code changed.
- Regression tests compare full design objects AND exact neutral rendered CharacterRig SVG markup against Ayah/Mira. A previous physical-fields-only test missed this name-driven costume regression.
- Calmer expression intensity, less tight face framing. Seated blocking holds approved seated-neutral catalog sample instead of repeating the full leaning cycle for each cut.
- 24s correction proof contains original-source excerpts 12–22s and 58–72s, in that order. No new voice generation. This proof is intentionally edited excerpts, not a contiguous 24s story or the full corrected render.
- Source hash/typecheck/body lock/all-frame mouth tests pass: 1191 active Raka mouth frames in full source; low-energy frames close; no Nisa speech track. Shape timing remains estimated from SRT text, not phoneme-accurate.
- Catalog comparison PNG and updated proof inspected before upload. Full 74.4s re-render deferred pending review of the correction proof.

## Full Part 1 revision — after correction proof accepted
- User accepted character/mouth correction and requested a clearer work moment plus full Part1.
- Work shot expanded to 21.0–23.7 seconds between morning departure and night return, without changing the audio duration or any VO bytes. Native practical workstation with a rekap screen, keyboard, desk, papers and a work document physically attached to Raka's left hand; approved motion 10 for seated lean. No custom typing/finger motion claimed.
- Full 1786-frame MP4 re-rendered with corrected catalog identity and speech tracks. Existing npm test suite, added Part1 tests, typecheck and body lock pass. Entire video decoded without errors. Inspected 16 extracted actual-output samples including work entrance/midpoint/exit, both characters, phone, ledger, close-up and ending.
- Uploaded full revised video to source Drive folder: https://drive.google.com/file/d/1kZy2SCpHe5jYVmBQFXqEmsrIDvH6dKgC/view
- This is the current full Part1 delivery, superseding the earlier full render and excerpt proof. Mouth shape timing remains SRT/text estimated and energy gated, not phoneme-accurate alignment.
