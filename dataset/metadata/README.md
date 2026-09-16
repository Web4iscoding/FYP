# Comprehensive CUHK Speakalong reference dataset

This dataset is derived only from publicly accessible pages and static media linked
by <https://app.speakalongcuhk.com/tc/>. It is organized for academic research and
future pronunciation-assessment use. The source site's copyright remains with its
owner; confirm permission before publishing or redistributing its media.

## Scope and source structure

The live public navigation exposes two pronunciation systems and one language-
conversion section:

- `輔音`: 18 initial targets (`b d g gw p t k kw m n ng f h j l z c s`)
- `尾韻`: 6 final targets (`-p -t -k -m -n -ng`)
- `語文轉換`: 10 illustrated books with 口語 and 書面語 audio per page

For every target, all publicly linked `single`, `word`, `sentence`, and `story`
items configured by the page are enumerated. `intro` embeds are recorded but not
downloaded because they are third-party YouTube resources. The challenge activity
is present only in commented-out markup and is not crawled or guessed.

The activity pages contain an inline `game_names` array and per-sound item counts.
Their own JavaScript constructs paired first-party paths:

```text
/assets/pics/{sound}/{activity_number}-{item}.{extension}
/assets/voices/{sound}/{activity_number}-{item}.mp3
```

Book pages expose a maximum page index and construct:

```text
/assets/books/{book_id}/{page}.jpg
/assets/books/{book_id}/{page}.mp3     # 口語
/assets/books/{book_id}/{page}s.mp3    # 書面語
```

No REST/GraphQL API or public JSON lexical manifest was found. Every exact URL is
retained in `raw_manifest.json`, `dataset.csv`, and `dataset.json`.

## Data layers

- `../raw/`: cached responses, source artwork, raw discovery, download results, and
  unmodified source-side information
- `../processed/`: joined, validated metadata for successfully collected MP3s
- `../application/`: compact `by_sound.json` lookup for a future backend
- `../audio/`: original MP3 bytes; files are never transcoded, normalized, trimmed,
  denoised, resampled, or otherwise modified
- `./`: publication metadata, validation, failure, duplicate, and source manifests

`dataset.csv` contains stable IDs, source IDs, phonological fields, activity/book
context, exact URLs, local paths, original filenames, variants, duration, sample
rate, channels, byte size, SHA-256, and provenance notes.

## Metadata boundary

The source conveys lexical content through artwork and audio but does not expose
machine-readable Chinese text, Jyutping, romanization, or tone fields. Existing
human-curated labels cover only a subset of visually unambiguous records and are
explicitly marked as derived. Other lexical and linguistic fields remain empty;
they are not invented. A native-Cantonese review is required before curated labels
are treated as orthographic ground truth.

## Validation and duplicates

Every collected MP3 is checked for existence, non-zero size, MP3 signature, absence
of an HTML error payload, decodability, positive duration, codec, sample rate,
channels, byte size, and SHA-256. HTTP status, response MIME type, retries, final URL,
and timestamp are retained in the raw download manifest.

Exact duplicate recordings remain separate records, as required for source
traceability. `duplicates.csv` reports both files, their shared hash, and source
information. Unavailable candidates remain in `raw_manifest.json` and are listed
in `download_failures.csv`; they are never silently replaced.

## Reproduction

Install `requirements.txt`, then run:

```bash
python3 scripts/inspect_site.py
python3 scripts/discover_pages.py
python3 scripts/discover_data.py
python3 scripts/discover_audio.py
python3 scripts/download_audio.py
python3 scripts/validate_audio.py
python3 scripts/deduplicate.py
python3 scripts/build_dataset.py
python3 scripts/generate_report.py
python3 scripts/check_consistency.py
```

The HTTP client uses disk caching, persistent connections, request delays, bounded
retries with exponential backoff, atomic partial files, and resumable deterministic
paths. Duration/codec validation uses `ffprobe` when available and macOS `afinfo`
otherwise.
