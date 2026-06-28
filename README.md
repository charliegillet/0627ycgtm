# YC GTM Hackathon — Artifacts

Working repo for the AI Growth Hackathon. Reference material lives in [`docs/`](docs/);
a small audio-to-Markdown transcription tool lives at the repo root.

## docs/

- [`AI-Growth-Hackathon-Kickoff-Presentation.pdf`](docs/AI-Growth-Hackathon-Kickoff-Presentation.pdf) — the kickoff slide deck.
- [`hackathon-kickoff-speaker-notes.md`](docs/hackathon-kickoff-speaker-notes.md) — notes from the kickoff talks (schedule, rules, judging, prizes/credits).
- `transcripts/` — generated Markdown transcripts (output of the tool below).

## Hackathon research and ideation

A full research and ideation package for the AI Growth (YC GTM) Hackathon lives under
[`docs/research/`](docs/research/) and [`docs/debate/`](docs/debate/):

- [`docs/research/RESEARCH-BRIEF.md`](docs/research/RESEARCH-BRIEF.md): the decisive synthesis (objective function, judge profiles, the Q&A takeaways, candidate idea bank). Start here.
- [`docs/research/00-ground-truth.md`](docs/research/00-ground-truth.md): everything extracted from the kickoff deck, transcript, and notes (judges, criteria, prizes, sponsors, the DETECT to ENRICH to SCORE to ACT frame).
- [`docs/research/judges/`](docs/research/judges/), [`docs/research/sponsors/`](docs/research/sponsors/), [`docs/research/topics/`](docs/research/topics/): 18 deep dossiers (judges, sponsors, GTM topics, the AI-GTM landscape, a buying-signals playbook, a recent-trends scan).
- [`docs/debate/FINAL-recommendation.md`](docs/debate/FINAL-recommendation.md): the capstone. The Q&A-aware final shortlist, the #1 build-call, the passion play, and a devil's-advocate red-team. Read this for the answer.
- [`docs/debate/top-10-ideas.md`](docs/debate/top-10-ideas.md), [`docs/debate/team-debate-transcript.md`](docs/debate/team-debate-transcript.md), [`docs/debate/domain-ideas-nba-running-music.md`](docs/debate/domain-ideas-nba-running-music.md): the EV-ranked ideas, the full 6-persona debate, and the NBA/running/music domain exploration.
- [`docs/cursor-lopus-qa-transcript.md`](docs/cursor-lopus-qa-transcript.md): the dinner Q&A with the two confirmed judges (primary source).

## Transcribing audio to Markdown

`transcribe.py` turns audio files into Markdown transcripts using
[Deepgram](https://deepgram.com)'s pre-recorded speech-to-text API. It uses the
**Python standard library only** — no `pip install` needed.

### Setup

```bash
export DEEPGRAM_API_KEY=your_key_here
```

### Usage

Drop audio files into `audio/`, then:

```bash
python3 transcribe.py audio/            # transcribe everything in audio/
python3 transcribe.py talk.mp3          # a single file
python3 transcribe.py audio/ --diarize  # label speakers (great for panels/Q&A)
```

Each input produces `docs/transcripts/<name>.md` with a metadata header and the
transcript. Useful flags:

| Flag | Purpose |
| --- | --- |
| `--diarize` | Attribute paragraphs to speakers (`**Speaker 0:** ...`). |
| `--out DIR` | Change the output directory (default `docs/transcripts`). |
| `--model NAME` | Deepgram model (default `nova-3`). |
| `--language CODE` | Force a language (e.g. `en`); `multi` for multilingual. |
| `--force` | Overwrite existing transcripts. |
| `--raw-json` | Also save Deepgram's raw JSON response. |

Supported audio: mp3, wav, m4a, mp4, aac, flac, ogg, opus, webm.

### Why Deepgram

Fast (faster than real-time), inexpensive (~$0.0043/min on Nova), and it returns
smart formatting, paragraphs, and speaker diarization out of the box. If you ever
need an offline/free option, local Whisper (via the already-installed `ffmpeg`) is
the fallback; OpenAI's `gpt-4o-transcribe` is another hosted alternative.
