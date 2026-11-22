# ElevenLabs VO via GitHub Actions

Workflow: `.github/workflows/elevenlabs-vo.yml`. Key is read only from the repository Actions secret `ELEVENLABS_API_KEY`; never commit it or paste it in chat. Repository administrators can set it at Settings → Secrets and variables → Actions. The key needs voice-list and text-to-speech permissions, quota and permission for the selected voice.

The workflow runs once on this session branch when its workflow/client script changes. It also supports manual workflow_dispatch with mode `discover` (no synthesis) or `probe` (one paid synthesis request, at most 280 characters). GitHub may require the workflow to exist on the default branch before manual dispatch is available; the branch push trigger is included for the initial test without switching branches.

Output artifact: `voices.json`, and on synthesis success `vo-test-id.mp3` + `take.json`. Artifacts expire after seven days. The workflow uses `eleven_multilingual_v2`, Indonesian `language_code: id`, MP3 44.1kHz/128kbps. Empty voice ID selects the first returned premade voice for technical review only; no personal cloned voice is auto-selected. For a specific cast voice, copy an actual ID from the artifact into the manual input. This is not a final cast-voice decision.

No credential or API error body is printed. The client does not automatically retry the paid synthesis request. A failure may still consume quota upstream; inspect the run before retrying. The workflow does not commit generated audio or alter approved rig/face/motion assets. It is a VO audio audition, not a lip-sync alignment pass. Review pronunciation, pacing and character suitability before integration.

Direct ElevenLabs access is not available from this sandbox's network; the API call executes on the GitHub-hosted runner. `gh secret list` may be disallowed even when Actions can consume an existing secret. A missing secret produces an explicit configuration error in the run, without exposing a key.
