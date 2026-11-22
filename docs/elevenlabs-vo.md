# ElevenLabs VO via GitHub Actions

Workflow: `.github/workflows/elevenlabs-vo.yml`. Key is read only from the repository Actions secret `ELEVENLABS_API_KEY`; never commit it or paste it in chat. Repository administrators can set it at Settings → Secrets and variables → Actions. The key needs voice-list and text-to-speech permissions, quota and permission for the selected voice.

The workflow runs once on this session branch when its workflow/client script changes. It also supports manual workflow_dispatch with mode `discover` (no synthesis) or `probe` (one paid synthesis request, at most 280 characters). GitHub may require the workflow to exist on the default branch before manual dispatch is available; the branch push trigger is included for the initial test without switching branches.

Output artifact: `voices.json`, and on synthesis success `vo-test-id.mp3` + `take.json`. Artifacts expire after seven days. The workflow uses `eleven_multilingual_v2`, Indonesian `language_code: id`, MP3 44.1kHz/128kbps. Empty voice ID selects the first returned premade voice for technical review only; no personal cloned voice is auto-selected. For a specific cast voice, copy an actual ID from the artifact into the manual input. This is not a final cast-voice decision.

No credential or API error body is printed. The client does not automatically retry the paid synthesis request. A failure may still consume quota upstream; inspect the run before retrying. The workflow does not commit generated audio or alter approved rig/face/motion assets. It is a VO audio audition, not a lip-sync alignment pass. Review pronunciation, pacing and character suitability before integration.

Direct ElevenLabs access is not available from this sandbox's network; the API call executes on the GitHub-hosted runner. `gh secret list` may be disallowed even when Actions can consume an existing secret. A missing secret produces an explicit configuration error in the run, without exposing a key.

## Reference-repo comparison and corrected diagnostics

Reviewed on the user-specified branch `arena/66ec29bf-content-production`:
- https://github.com/Scryptexai/content-production/blob/arena%2F66ec29bf-content-production/.github/workflows/eleven-audio.yml
- https://github.com/Scryptexai/content-production/blob/arena%2F66ec29bf-content-production/ODDCHAPTER_BRAND/tools/eleven_audio.py
- `ODDCHAPTER_BRAND/tools/voice.json` on that branch is now INTERNAL Arena TTS (`voice-04` / `arena-tts`); it is not a usable ElevenLabs voice configuration. Do not transplant it into this workflow.

The reference and this client both use `xi-api-key` against `https://api.elevenlabs.io/v1` and POST JSON to `/text-to-speech/{voice_id}`. Node vs Python does not change that protocol. Corrections adopted: trim credential edge whitespace, support `ELEVENLABS_KEY` alias, set explicit Accept headers, and do not require voice-list metadata access before synthesis when an explicit voice ID is supplied. Set that ID using manual input or repository variable `ELEVENLABS_VOICE_ID` (not a credential).

HTTP 401 alone does NOT establish a bad key. The client now parses an allowlisted `detail.status` and reports the endpoint plus a safe explanation (invalid credential vs missing permission vs quota vs unusual-activity/account-network restriction). Unknown response bodies and arbitrary provider text are not logged, so credential/PII echoes cannot leak into logs. The reference prints bounded raw error bodies; we intentionally do not copy that behavior. No paid-request automatic retry is enabled.

The voice-list endpoint remains required for `discover` mode or automatic voice selection; without an explicit ID there is no safe basis to choose a voice when discovery fails. Do not adopt the other channel's historical voice as this animation cast's approved voice.

### Live diagnosis after reference comparison

Run 45030782365 returned `HTTP 401 at /v1/voices; code=missing_permissions`. This is endpoint permission denial, not `invalid_api_key`. To test TTS independently, the workflow now defaults to the historical reference-workflow voice `ojz6ro9PB1xDu44lymdM` only when neither an input nor repository variable is configured. This ID is explicitly present in the reference YAML/script; it is NOT taken from the currently internal `voice.json`. It is a technical trial, not an approved character voice. Set `ELEVENLABS_VOICE_ID` repository variable to override it. The actual provider response will establish whether this key can synthesize that voice.

### Confirmed result

Run https://github.com/zamadye/animation-studio-remotion/actions/runs/45030862811 SUCCEEDED: the explicit historical reference voice synthesized the short Indonesian sample. Voice-list metadata still reports `missing_permissions`; the TTS capability itself is confirmed. The earlier assertion that HTTP 401 established an invalid credential was not justified. Do not request a replacement key based on the metadata failure alone.

The artifact blob host is inaccessible from this sandbox, as the reference repo also documents. A separate `elevenlabs-collect.yml` workflow downloads that exact successful run's artifact on GitHub and preserves just the small MP3 plus nonsecret take metadata on this session branch. It performs no new synthesis and consumes no additional TTS credit. This one-time recovery is separate from the generation workflow so unrelated source commits never regenerate paid takes.
