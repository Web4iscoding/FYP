# Comprehensive Speakalong Dataset Report

## Overall

- Configured source records discovered: 1158
- Records collected and technically valid: 1140
- Unique characters with curated labels: 209
- Unique words with curated labels: 11
- Unique target sounds: 24
- Phonological/content systems: 3
- Selected audio files: 1140
- Valid audio files: 1140
- Failed/unavailable audio candidates: 18
- Exact duplicate audio pairs: 1 (preserved)
- Total selected audio duration: 3902.851 seconds (65.05 minutes)
- Total dataset directory size: 267,674,712 bytes (255.27 MiB)
- Overall configured-to-valid coverage: 98.45%

## By phonological/content system

| System | Number of target sounds | Discovered records | Collected audio | Coverage |
|---|---:|---:|---:|---:|
| 輔音 | 18 | 654 | 643 | 98.32% |
| 尾韻 | 6 | 220 | 217 | 98.64% |
| 語文轉換 | 0 | 284 | 280 | 98.59% |

## By sound

| Sound | Discovered | Collected audio | Unique labeled characters | Coverage |
|---|---:|---:|---:|---:|
| b | 37 | 37 | 10 | 100.00% |
| d | 36 | 36 | 10 | 100.00% |
| g | 35 | 35 | 10 | 100.00% |
| gw | 35 | 34 | 10 | 97.14% |
| p | 35 | 35 | 10 | 100.00% |
| t | 36 | 36 | 10 | 100.00% |
| k | 35 | 35 | 10 | 100.00% |
| kw | 37 | 30 | 3 | 81.08% |
| m | 36 | 36 | 10 | 100.00% |
| n | 36 | 36 | 10 | 100.00% |
| ng | 35 | 35 | 10 | 100.00% |
| f | 35 | 35 | 9 | 100.00% |
| h | 39 | 39 | 10 | 100.00% |
| j | 36 | 35 | 10 | 97.22% |
| l | 38 | 38 | 10 | 100.00% |
| z | 36 | 36 | 10 | 100.00% |
| c | 41 | 41 | 10 | 100.00% |
| s | 36 | 34 | 8 | 94.44% |
| -p | 35 | 35 | 10 | 100.00% |
| -t | 36 | 36 | 10 | 100.00% |
| -k | 36 | 36 | 10 | 100.00% |
| -m | 39 | 36 | 10 | 92.31% |
| -n | 35 | 35 | 10 | 100.00% |
| -ng | 39 | 39 | 10 | 100.00% |

## By activity

| Family | Activity | Discovered | Collected |
|---|---|---:|---:|
| pronunciation | single | 250 | 243 |
| pronunciation | word | 240 | 238 |
| pronunciation | sentence | 240 | 240 |
| pronunciation | story | 144 | 139 |
| language_conversion | book | 284 | 280 |

## Missing data

- Sounds with no collected examples: None
- Sounds with fewer than 10 collected examples: None
- Collected entries without a machine-readable or curated lexical label: 899
- Download failures/unavailable configured media: 18

See `metadata/download_failures.csv` for every failed URL and retry result.

## Duplicate audio

Exact duplicate pairs: 1. They are retained as separate source-traceable records.
See `metadata/duplicates.csv` for hashes and both source URLs.

## Source endpoints

- `/assets/books/{book_id}/{page}[s].mp3` — 語文轉換/book/口語: 142 configured items; sample `https://app.speakalongcuhk.com/assets/books/1/0.mp3`
- `/assets/books/{book_id}/{page}[s].mp3` — 語文轉換/book/書面語: 142 configured items; sample `https://app.speakalongcuhk.com/assets/books/1/0s.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-k/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-k/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-k/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-k/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-k/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-k/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-k/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-k/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-m/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-m/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-m/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-m/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-m/story: 9 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-m/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-m/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-m/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-n/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-n/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-n/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-n/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-n/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-n/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-n/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-n/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-ng/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-ng/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-ng/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-ng/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-ng/story: 9 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-ng/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-ng/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-ng/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-p/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-p/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-p/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-p/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-p/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-p/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-p/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-p/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-t/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-t/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-t/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-t/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-t/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-t/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 尾韻/-t/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/-t/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/b/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/b/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/b/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/b/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/b/story: 7 configured items; sample `https://app.speakalongcuhk.com/assets/voices/b/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/b/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/b/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/c/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/c/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/c/single: 15 configured items; sample `https://app.speakalongcuhk.com/assets/voices/c/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/c/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/c/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/c/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/c/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/d/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/d/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/d/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/d/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/d/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/d/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/d/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/d/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/f/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/f/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/f/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/f/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/f/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/f/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/f/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/f/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/g/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/g/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/g/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/g/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/g/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/g/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/g/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/g/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/gw/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/gw/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/gw/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/gw/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/gw/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/gw/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/gw/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/gw/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/h/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/h/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/h/single: 15 configured items; sample `https://app.speakalongcuhk.com/assets/voices/h/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/h/story: 4 configured items; sample `https://app.speakalongcuhk.com/assets/voices/h/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/h/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/h/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/j/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/j/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/j/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/j/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/j/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/j/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/j/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/j/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/k/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/k/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/k/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/k/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/k/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/k/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/k/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/k/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/kw/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/kw/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/kw/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/kw/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/kw/story: 7 configured items; sample `https://app.speakalongcuhk.com/assets/voices/kw/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/kw/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/kw/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/l/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/l/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/l/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/l/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/l/story: 8 configured items; sample `https://app.speakalongcuhk.com/assets/voices/l/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/l/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/l/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/m/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/m/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/m/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/m/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/m/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/m/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/m/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/m/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/n/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/n/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/n/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/n/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/n/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/n/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/n/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/n/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/ng/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/ng/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/ng/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/ng/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/ng/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/ng/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/ng/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/ng/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/p/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/p/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/p/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/p/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/p/story: 5 configured items; sample `https://app.speakalongcuhk.com/assets/voices/p/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/p/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/p/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/s/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/s/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/s/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/s/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/s/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/s/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/s/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/s/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/t/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/t/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/t/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/t/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/t/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/t/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/t/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/t/2-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/z/sentence: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/z/4-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/z/single: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/z/1-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/z/story: 6 configured items; sample `https://app.speakalongcuhk.com/assets/voices/z/5-1.mp3`
- `/assets/voices/{sound}/{activity_number}-{item}.mp3` — 輔音/z/word: 10 configured items; sample `https://app.speakalongcuhk.com/assets/voices/z/2-1.mp3`

## Limitations

- The public pronunciation navigation exposes 18 initial consonants and 6 final consonants. It exposes no vowel or tone category.
- The site provides item counts and media paths in inline JavaScript, but no machine-readable Chinese lexical labels, Jyutping, romanization, or tones.
- Existing curated labels cover a subset of visually unambiguous items. Unlabeled fields remain empty rather than being invented.
- `kw` single items 4–10 are configured by the page but redirect to HTML rather than media; each is recorded as a failure.
- Intro activities embed external YouTube videos. Their URLs are recorded in `source_manifest.json`, but third-party media was not downloaded.
- The challenge activity appears only in commented-out navigation and was not treated as publicly linked content.
- `/robots.txt` redirects to the home page; linked copyright/disclaimer routes return the site's 404 view. Only public first-party media was requested at a conservative rate.
