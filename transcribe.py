#!/usr/bin/env python3
"""Transcribe audio files to Markdown using Deepgram's pre-recorded API.

Standard library only — no `pip install` required. Set DEEPGRAM_API_KEY and run:

    export DEEPGRAM_API_KEY=...        # your Deepgram key
    python3 transcribe.py audio/      # transcribes every audio file in audio/

Output Markdown lands in docs/transcripts/ by default (one .md per audio file),
with a metadata header, a smart-formatted transcript, and optional speaker
labels when you pass --diarize.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API_URL = "https://api.deepgram.com/v1/listen"

# Audio extensions Deepgram accepts, mapped to a sensible Content-Type.
CONTENT_TYPES = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".mp4": "audio/mp4",
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".ogg": "audio/ogg",
    ".opus": "audio/opus",
    ".webm": "audio/webm",
}


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


def collect_audio_files(inputs: list[str]) -> list[Path]:
    """Expand files and directories into a sorted, de-duplicated audio list."""
    files: list[Path] = []
    for raw in inputs:
        p = Path(raw)
        if p.is_dir():
            files.extend(
                f for f in sorted(p.rglob("*"))
                if f.is_file() and f.suffix.lower() in CONTENT_TYPES
            )
        elif p.is_file():
            if p.suffix.lower() in CONTENT_TYPES:
                files.append(p)
            else:
                log(f"  skip (unsupported type): {p}")
        else:
            log(f"  skip (not found): {p}")
    # De-dupe while preserving order.
    seen: set[Path] = set()
    unique: list[Path] = []
    for f in files:
        rp = f.resolve()
        if rp not in seen:
            seen.add(rp)
            unique.append(f)
    return unique


def build_url(model: str, language: str | None, diarize: bool) -> str:
    params = {
        "model": model,
        "smart_format": "true",  # punctuation, capitalization, numbers, dates
        "punctuate": "true",
        "paragraphs": "true",    # split into readable paragraphs
        "utterances": "true",
    }
    if language:
        params["language"] = language
    if diarize:
        params["diarize"] = "true"
    return f"{API_URL}?{urllib.parse.urlencode(params)}"


def transcribe_file(path: Path, api_key: str, url: str, content_type: str,
                    timeout: int) -> dict:
    """POST raw audio bytes to Deepgram and return the parsed JSON response."""
    body = path.read_bytes()
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Token {api_key}",
            "Content-Type": content_type,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"Deepgram returned HTTP {e.code}: {detail}") from None
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error reaching Deepgram: {e.reason}") from None


def format_duration(seconds: float | None) -> str:
    if not seconds:
        return "unknown"
    total = int(round(seconds))
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def extract_transcript(result: dict, diarize: bool) -> str:
    """Build a Markdown transcript body from the Deepgram response.

    Prefers speaker-attributed paragraphs when diarization is on, then falls
    back to Deepgram's pre-formatted paragraph transcript, then to the raw
    flat transcript.
    """
    try:
        alt = result["results"]["channels"][0]["alternatives"][0]
    except (KeyError, IndexError):
        return "_(no transcript returned)_"

    paragraphs_obj = alt.get("paragraphs") or {}
    paragraphs = paragraphs_obj.get("paragraphs") or []

    if diarize and paragraphs:
        chunks: list[str] = []
        for para in paragraphs:
            text = " ".join(s.get("text", "") for s in para.get("sentences", [])).strip()
            if not text:
                continue
            speaker = para.get("speaker")
            if speaker is not None:
                chunks.append(f"**Speaker {speaker}:** {text}")
            else:
                chunks.append(text)
        if chunks:
            return "\n\n".join(chunks)

    if paragraphs_obj.get("transcript", "").strip():
        return paragraphs_obj["transcript"].strip()

    flat = alt.get("transcript", "").strip()
    return flat if flat else "_(empty transcript)_"


def render_markdown(path: Path, result: dict, model: str, diarize: bool) -> str:
    metadata = result.get("metadata", {})
    duration = metadata.get("duration")
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    transcript = extract_transcript(result, diarize)

    header = [
        f"# Transcript — {path.stem}",
        "",
        f"- **Source file:** `{path.name}`",
        f"- **Duration:** {format_duration(duration)}",
        f"- **Model:** {model}" + (" (diarized)" if diarize else ""),
        f"- **Transcribed:** {generated} via Deepgram",
        "",
        "---",
        "",
    ]
    return "\n".join(header) + transcript + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Transcribe audio files to Markdown using Deepgram.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "inputs", nargs="*", default=["audio"],
        help="Audio files and/or directories to transcribe.",
    )
    parser.add_argument(
        "-o", "--out", default="docs/transcripts",
        help="Directory to write .md transcripts into.",
    )
    parser.add_argument("--model", default="nova-3", help="Deepgram model.")
    parser.add_argument(
        "--language", default=None,
        help="Language code (e.g. en, es). Omit to let the model decide. "
             "Use 'multi' with nova-3 for multilingual audio.",
    )
    parser.add_argument(
        "--diarize", action="store_true",
        help="Label paragraphs by speaker.",
    )
    parser.add_argument(
        "--force", action="store_true",
        help="Overwrite existing .md transcripts.",
    )
    parser.add_argument(
        "--api-key", default=None,
        help="Deepgram API key (defaults to $DEEPGRAM_API_KEY).",
    )
    parser.add_argument(
        "--timeout", type=int, default=600,
        help="Per-file request timeout in seconds.",
    )
    parser.add_argument(
        "--raw-json", action="store_true",
        help="Also save Deepgram's raw JSON next to each transcript.",
    )
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("DEEPGRAM_API_KEY")
    if not api_key:
        log("ERROR: no Deepgram API key. Set DEEPGRAM_API_KEY or pass --api-key.")
        return 2

    files = collect_audio_files(args.inputs)
    if not files:
        log(f"No audio files found in: {', '.join(args.inputs)}")
        log(f"Supported types: {', '.join(sorted(CONTENT_TYPES))}")
        return 1

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    url = build_url(args.model, args.language, args.diarize)

    log(f"Transcribing {len(files)} file(s) -> {out_dir}/\n")
    ok = 0
    failed = 0
    for i, path in enumerate(files, 1):
        out_path = out_dir / f"{path.stem}.md"
        if out_path.exists() and not args.force:
            log(f"[{i}/{len(files)}] skip (exists, use --force): {out_path}")
            continue

        size_mb = path.stat().st_size / 1_048_576
        log(f"[{i}/{len(files)}] {path.name} ({size_mb:.1f} MB) ...")
        content_type = CONTENT_TYPES[path.suffix.lower()]
        try:
            result = transcribe_file(path, api_key, url, content_type, args.timeout)
        except RuntimeError as e:
            log(f"    FAILED: {e}")
            failed += 1
            continue

        out_path.write_text(render_markdown(path, result, args.model, args.diarize),
                            encoding="utf-8")
        if args.raw_json:
            (out_dir / f"{path.stem}.json").write_text(
                json.dumps(result, indent=2), encoding="utf-8")
        log(f"    -> {out_path}")
        ok += 1

    log(f"\nDone. {ok} written, {failed} failed.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
