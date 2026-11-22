# Episode 01 — Orang Miskin Dilarang Miskin — complete story review

## Deliverable scope

A complete **90-second / 2160-frame / 24fps / 1080×1920** story review, using the six source shots and all 18 original dialogue lines. Registered as `Episode01-Complete-Review`. `Episode01-Complete-Landscape` is also registered for future layout review; only the portrait master is the deliverable of this batch.

This is NOT final publication approval. Full-story assembly does not resolve every previous blocking/contact gate. Locked body source and SHA baseline remain unchanged.

## Story progression

1. **0–12 s — Permohonan**: Darto asks for assistance; the old motorcycle is declared. Held application sheet and readable document insert.
2. **12–26 s — Punya aset**: the motorcycle is treated as an asset. Readable rejection card with DITUNDA overlay.
3. **26–40 s — Motor dilepas**: buyer asks how Darto will travel to work; he prioritizes food for his child. Motorcycle illustration and readable sale-context card. Buyer is explicitly an offscreen voice; no unapproved extra physical cast is mounted.
4. **40–56 s — Dianggap simpanan**: money from selling the motorcycle is treated as savings. Readable evidence card states that the money was intended for rice.
5. **56–72 s — Bukti usaha**: with no motorcycle, money or work, Darto is asked for proof of independent effort.
6. **72–90 s — Tidak tertinggal?**: child's phone question, Darto's reply, then ironic public-address slogan. Phone insert and a held closing line.

The evidence cards are authored fictional visual summaries, not facsimiles of real government documents or assertions about actual benefit eligibility rules.

## VO production and timing

GitHub workflow `.github/workflows/episode01-vo.yml` calls the verified explicit-ID ElevenLabs TTS-with-timestamps endpoint. It does NOT depend on voice-list permissions. Secrets are only in runner environment; no key is stored in Git.

- `src/episodes/ep01-lines.json`: 18 source-matched lines, 592 text characters total.
- `public/audio/episode01-elevenlabs/`: 18 MP3 takes and provider character-alignment metadata, persisted by the runner to the same session branch.
- Actual VO generation run: https://github.com/zamadye/animation-studio-remotion/actions/runs/45032648193 (success).
- Voice: `ojz6ro9PB1xDu44lymdM`, model `eleven_multilingual_v2`, Indonesian.
- **All roles use ONE technical-review voice.** Slight stability differences are not distinct cast voices. Child/buyer/loudspeaker are not approved voice casting. This batch makes no claim of final pronunciation/performance approval.
- No automatic paid retries. Completed takes are cached by exact line text + voice ID to avoid unnecessary regeneration. Deliberate model/settings changes require invalidating the old takes before production use.

`scripts/build-episode01-timeline.py` decodes the actual MP3s, measures their durations and energy, and generates `src/episodes/ep01-timeline.json`. Speech is scheduled inside the original 0/12/26/40/56/72/90-second shot boundaries with room for reading/reaction holds. If a shot's audio does not fit, the builder fails rather than trimming spoken words or silently speeding them up.

Visemes use provider **character timestamps plus measured energy silence-gating**, not phoneme forced alignment. Silence/listener mouths remain resting. The three offscreen roles have audio and subtitles but no mouth/character instance.

The only background sound is low-level existing synthetic room tone. No new ElevenLabs SFX or music was generated. The room-tone bed is not a full location-specific final mix.

## Modular scene assembly

`src/episodes/episode01.ts` assembles each shot with `character`, `perform`, `hold`, source speech cues and strict world lookup. `Episode01Review.tsx` owns the shot selection, authored speaker reframing, evidence inserts, offscreen labels, subtitles and audio sequencing. Only required Darto/Petugas instances mount; buyer/child/public address stay explicitly offscreen.

Portrait uses an authored crop/reframe of the 1920×1080 world, not a stretched world. Document and phone inserts have separate portrait scaling so their text can be read. Actor speech windows and all audio share the same 24fps timeline.

## Deliberate limitations

- No map handoff or money transfer animation is claimed: these moments use held props and editorial evidence cuts.
- No path-following locomotion, fully authored eye-lines/turning or new seated contact poses were introduced.
- Acting remains a limited selection of approved catalog gestures plus facial tracks; it is not a bespoke final-performance pass.
- Motor sale is communicated through narration/dialogue + motorcycle art + an evidence card, not an animated trade.
- Camera cuts between speaker framing and inserts are editorial cuts, not a simulated 3D camera.
- The phone insert is a fictional call/transcript-style visual, not a real WhatsApp capture.
- Subtitles are dialogue-window captions, not word-level karaoke.
- Evidence readings and reaction pauses intentionally occupy time beyond the ~36 seconds of spoken material. The 90-second source pacing still needs human editorial approval.

## Automated checks

`npm run test:episode01` verifies six shots / 90 seconds / all 18 source dialogue lines, actual audio assets and metadata, nonoverlapping speech, per-shot boundaries, strict world resolution, held-prop text budgets, explicit one-/two-actor cast and listener mouth-rest throughout all 2160 frames. Full project tests and body SHA lock remain mandatory.

`npm run render:episode01-review` renders the portrait master. Sandbox browser: append `-- --browser-executable=/tmp/chromium --quiet` with `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64`.

Review notes, final render inspection and muxed-audio checks are recorded below after completion.

## Completed batch review

- Corrected portrait H.264 render completed: 2160 frames / 90 seconds; decoded muxed audio duration 90.005 seconds (AAC padding).
- Sampled 18 full-render frames across all six scenes, plus full-resolution document/call frames. The first visual pass caught the rejection stamp overlapping its heading, an incorrect default signatory label, a cropped motorcycle and the child's call showing Darto's answer before his cue. Corrected these and regenerated the complete MP4 and review PDF.
- Final focused review confirms unobscured document headings, correct applicant signatory, the motorcycle inside the wide crop, and only the child's line visible before Darto speaks.
- All 18 dialogue windows have active signal in the final mux. PCM16 peak 14253, zero clipped samples. This verifies mux placement/signal, NOT subjective voice performance or final mix approval.
- Typecheck, full `npm test` (including episode checks and the unchanged body SHA lock), production build and diff checks pass. Build retains the existing nonblocking bundle-size warning.
- `docs/episode01-review-qa.json` records audio metrics and reviewed frame numbers.
- Main video: https://drive.google.com/file/d/10hY5RaF5NDvq8Km5Z_wgzDlNvPhjz08C/view
- `episode01-complete-review-frames.pdf`: 18-page sampled frame index from the corrected video. Generated renders/PDFs stay outside Git; source code, timeline, voice takes and QA documentation are committed.
