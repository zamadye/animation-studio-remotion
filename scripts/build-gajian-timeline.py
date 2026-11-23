"""Measure real Gajian dialogue MP3s with ffmpeg and generate frame-accurate
scene timelines and energy-gated viseme cues in src/episodes/gajian/gajian-timeline.json.
"""
import array
import json
import math
import subprocess
from pathlib import Path

FPS = 24
RATE = 24000
TAIL_HOLD = {"gajian": 14, "uang-ke-mana": 16, "hitungan-terakhir": 28}
VISEME_MAP = {
    "a": "A",
    "e": "E",
    "i": "E",
    "o": "O",
    "u": "U",
    "b": "MBP",
    "p": "MBP",
    "m": "MBP",
    "f": "FV",
    "v": "FV",
    "l": "L",
}


def decode_energies(mp3_path: Path):
    raw = subprocess.check_output(
        [
            "ffmpeg",
            "-i",
            str(mp3_path),
            "-f",
            "s16le",
            "-ac",
            "1",
            "-ar",
            str(RATE),
            "-loglevel",
            "error",
            "-",
        ]
    )
    samples = array.array("h", raw)
    step = RATE // FPS
    energies = [
        math.sqrt(
            sum(v * v for v in samples[i : i + step])
            / max(1, len(samples[i : i + step]))
        )
        for i in range(0, len(samples), step)
    ]
    return energies


def main():
    script = json.loads(Path("src/episodes/gajian/script.json").read_text("utf-8"))
    audio_dir = Path("public/audio/gajian")
    scenes_out = []
    cursor_frame = 0

    for scene in script["scenes"]:
        sid = scene["id"]
        mp3_path = audio_dir / f"{sid}.mp3"
        meta = json.loads((audio_dir / f"{sid}.json").read_text("utf-8"))
        aligned_path = audio_dir / f"{sid}-aligned.json"
        has_forced_align = aligned_path.exists()
        aligned_data = (
            json.loads(aligned_path.read_text("utf-8")) if has_forced_align else None
        )

        energies = decode_energies(mp3_path)
        audio_frames = len(energies)
        peak = max(energies) or 1.0
        active_indices = [i for i, e in enumerate(energies) if e > peak * 0.04]
        first_sec = (min(active_indices) / FPS) if active_indices else 0.0
        last_sec = (
            ((max(active_indices) + 1) / FPS)
            if active_indices
            else audio_frames / FPS
        )

        segs = meta["voice_segments"]
        align = (
            aligned_data if aligned_data else meta["alignment"]
        )
        chars = align["characters"]
        c_starts = align["character_start_times_seconds"]
        c_ends = align["character_end_times_seconds"]

        seg_start0 = segs[0]["start_time_seconds"]
        seg_end0 = segs[-1]["end_time_seconds"]
        if has_forced_align:
            scale = 1.0
            offset = 0.0
        else:
            span = max(0.01, seg_end0 - seg_start0)
            scale = (last_sec - first_sec) / span
            offset = first_sec - seg_start0 * scale

        def map_time(sec: float) -> float:
            return sec * scale + offset

        char_triples = [
            (c.lower(), map_time(s), map_time(e))
            for c, s, e in zip(chars, c_starts, c_ends)
        ]

        lines_out = []
        prev_end = 0
        for idx, (line_meta, seg) in enumerate(zip(meta["lines"], segs)):
            s_sec = map_time(seg["start_time_seconds"])
            e_sec = map_time(seg["end_time_seconds"])
            start_f = max(prev_end, min(audio_frames - 1, round(s_sec * FPS)))
            end_f = max(start_f + 1, min(audio_frames, round(e_sec * FPS)))
            prev_end = end_f

            c_lo = seg["character_start_index"]
            c_hi = seg["character_end_index"]
            seg_chars = char_triples[c_lo:c_hi]

            visemes = []
            for local_f in range(end_f - start_f):
                abs_f = start_f + local_f
                t_sec = (abs_f + 0.5) / FPS
                ch = next(
                    (c for c, cs, ce in seg_chars if cs <= t_sec < ce),
                    "",
                )
                energy = energies[abs_f] if abs_f < audio_frames else 0.0
                shape = VISEME_MAP.get(ch, "A" if ch.isalpha() else "rest")
                if energy < peak * 0.065:
                    shape = "rest"
                openness = (
                    round(min(1.0, (energy / peak) * 1.8), 3)
                    if shape != "rest"
                    else 0.0
                )
                visemes.append(
                    {
                        "start": local_f,
                        "end": local_f + 1,
                        "viseme": shape,
                        "openness": openness,
                    }
                )

            lines_out.append(
                {
                    "id": f"gajian-{sid}-{idx + 1:02d}",
                    "speaker": line_meta["speaker"],
                    "text": line_meta["text"],
                    "start": start_f,
                    "end": end_f,
                    "visemes": visemes,
                }
            )

        tail = TAIL_HOLD.get(sid, 16)
        duration_frames = audio_frames + tail
        scenes_out.append(
            {
                "id": sid,
                "title": scene["title"],
                "audio": f"audio/gajian/{sid}.mp3",
                "alignmentMode": (
                    "elevenlabs-forced-alignment"
                    if has_forced_align
                    else "elevenlabs-dialogue-timestamps-scaled-energy"
                ),
                "startFrame": cursor_frame,
                "audioFrames": audio_frames,
                "durationFrames": duration_frames,
                "lines": lines_out,
            }
        )
        cursor_frame += duration_frames

    payload = {
        "id": script["id"],
        "title": script["title"],
        "location": script["location"],
        "fps": FPS,
        "totalFrames": cursor_frame,
        "scenes": scenes_out,
    }
    out_path = Path("src/episodes/gajian/gajian-timeline.json")
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", "utf-8")
    summary = [
        {
            "id": s["id"],
            "startFrame": s["startFrame"],
            "audioFrames": s["audioFrames"],
            "durationFrames": s["durationFrames"],
            "lines": len(s["lines"]),
        }
        for s in scenes_out
    ]
    print(json.dumps({"totalFrames": cursor_frame, "seconds": round(cursor_frame / FPS, 2), "scenes": summary}, indent=2))


if __name__ == "__main__":
    main()
