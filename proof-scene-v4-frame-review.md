# Proof Scene V4 frame review (2026-11-21)

## Candidate and review scope
Reviewed `Proof-01-V4-12s.mp4` after lowering the desk/counter staging by 100 scene units, shifting props and hand targets, and selecting the IK elbow branch that keeps elbows outside the torso. Typecheck and project validation pass. Rendered selected frames at 0, 58, 75, 90, 100, 120, 150, 198, 228, 240, 258, 300, and 359; contact sheet at `/tmp/v4fixhands/sheet.jpg`.

## Visual inspection
The wide scene proportions are improved: characters and counter align more plausibly. However, the waist-level counter overlaps the characters around the lower torso and the full-body framing is too small for evaluating finger/prop contact. Close-up frame 150 (`/tmp/v4fixhands/f150.png`) shows the clerk's bent forearm rising nearly vertically with hand and document close to face level, an implausible interaction; elbow branch selection alone did not resolve the arm bend, and the offered/received paper arrangement remains awkward. Several middle frames are cropped to props/arms due to the animated camera scale/position, preventing confident motion QA. Character hand silhouettes are readable as small palms/fingers in static frame but contact posture remains poor.

## Decision
Not approved. Do not upload as a finished proof, do not begin 90-second episode production, and do not claim hand/arm acceptance. Next iteration should solve the actual posed elbow/wrist geometry and document-hand contact through sampled renders (inspect target in rig coordinates with overlays if useful), while restoring consistent camera framing and verifying the counter occlusion plane. Then request user review. Character variation concept sheet is a separate preliminary deliverable at `character-variation-concepts.png`, not proof approval.
