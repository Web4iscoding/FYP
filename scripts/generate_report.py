#!/usr/bin/env python3
"""Generate comprehensive coverage, quality, and limitation statistics."""

from __future__ import annotations

import csv
from collections import Counter, defaultdict
from pathlib import Path

from common import DATASET, METADATA, RAW, ROOT, read_json


def csv_rows(path: Path) -> list[dict]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    rows = csv_rows(METADATA / "dataset.csv")
    raw = read_json(RAW / "raw_manifest.json")
    failures = csv_rows(METADATA / "download_failures.csv")
    duplicates = csv_rows(METADATA / "duplicates.csv")
    validation = csv_rows(METADATA / "audio_validation.csv")
    endpoints = read_json(METADATA / "source_manifest.json")
    total_duration = sum(float(row["duration_seconds"]) for row in rows)
    dataset_size = sum(path.stat().st_size for path in DATASET.rglob("*") if path.is_file())
    unique_characters = {row["character"] for row in rows if row["character"]}
    unique_words = {row["word"] for row in rows if row["word"]}
    valid_audio = sum(row["valid"].lower() == "true" for row in validation)
    collected_ids = {row["source_id"] for row in rows}

    raw_by_system = Counter(item["phonological_system"] for item in raw["records"])
    rows_by_system = Counter(row["phonological_system"] for row in rows)
    systems = list(dict.fromkeys(item["phonological_system"] for item in raw["records"]))
    raw_by_sound = Counter(item["sound"] for item in raw["records"] if item["sound"])
    rows_by_sound = Counter(row["sound"] for row in rows if row["sound"])
    chars_by_sound = defaultdict(set)
    for row in rows:
        if row["sound"] and row["character"]:
            chars_by_sound[row["sound"]].add(row["character"])

    lines = [
        "# Comprehensive Speakalong Dataset Report", "", "## Overall", "",
        f"- Configured source records discovered: {len(raw['records'])}",
        f"- Records collected and technically valid: {len(rows)}",
        f"- Unique characters with curated labels: {len(unique_characters)}",
        f"- Unique words with curated labels: {len(unique_words)}",
        f"- Unique target sounds: {len(raw_by_sound)}",
        f"- Phonological/content systems: {len(systems)}",
        f"- Selected audio files: {len(rows)}",
        f"- Valid audio files: {valid_audio}",
        f"- Failed/unavailable audio candidates: {len(failures)}",
        f"- Exact duplicate audio pairs: {len(duplicates)} (preserved)",
        f"- Total selected audio duration: {total_duration:.3f} seconds ({total_duration/60:.2f} minutes)",
        f"- Total dataset directory size: {dataset_size:,} bytes ({dataset_size/1024/1024:.2f} MiB)",
        f"- Overall configured-to-valid coverage: {len(rows)/len(raw['records'])*100:.2f}%", "",
        "## By phonological/content system", "",
        "| System | Number of target sounds | Discovered records | Collected audio | Coverage |",
        "|---|---:|---:|---:|---:|",
    ]
    for system in systems:
        sound_count = len({item["sound"] for item in raw["records"] if item["phonological_system"] == system and item["sound"]})
        discovered = raw_by_system[system]; collected = rows_by_system[system]
        lines.append(f"| {system} | {sound_count} | {discovered} | {collected} | {collected/discovered*100:.2f}% |")

    lines.extend(["", "## By sound", "", "| Sound | Discovered | Collected audio | Unique labeled characters | Coverage |", "|---|---:|---:|---:|---:|"])
    for sound in raw_by_sound:
        discovered = raw_by_sound[sound]; collected = rows_by_sound[sound]
        lines.append(f"| {sound} | {discovered} | {collected} | {len(chars_by_sound[sound])} | {collected/discovered*100:.2f}% |")

    activity_discovered = Counter((item["record_family"], item["activity"]) for item in raw["records"])
    activity_collected = Counter((row["phonological_system"] == "語文轉換" and "language_conversion" or "pronunciation", row["activity"]) for row in rows)
    lines.extend(["", "## By activity", "", "| Family | Activity | Discovered | Collected |", "|---|---|---:|---:|"])
    for key, count in activity_discovered.items():
        lines.append(f"| {key[0]} | {key[1]} | {count} | {activity_collected[key]} |")

    no_examples = [sound for sound in raw_by_sound if rows_by_sound[sound] == 0]
    fewer_than_ten = [sound for sound in raw_by_sound if rows_by_sound[sound] < 10]
    missing_lexical = [row["source_id"] for row in rows if not (row["character"] or row["word"] or row["phrase"])]
    lines.extend([
        "", "## Missing data", "",
        f"- Sounds with no collected examples: {', '.join(no_examples) if no_examples else 'None'}",
        f"- Sounds with fewer than 10 collected examples: {', '.join(fewer_than_ten) if fewer_than_ten else 'None'}",
        f"- Collected entries without a machine-readable or curated lexical label: {len(missing_lexical)}",
        f"- Download failures/unavailable configured media: {len(failures)}",
        "", "See `metadata/download_failures.csv` for every failed URL and retry result.",
        "", "## Duplicate audio", "",
        f"Exact duplicate pairs: {len(duplicates)}. They are retained as separate source-traceable records.",
        "See `metadata/duplicates.csv` for hashes and both source URLs.",
        "", "## Source endpoints", "",
    ])
    for endpoint in endpoints["endpoint_groups"]:
        label = "/".join(x for x in (endpoint["phonological_system"], endpoint["sound"], endpoint["activity"], endpoint["variant"]) if x)
        lines.append(f"- `{endpoint['endpoint_pattern']}` — {label}: {endpoint['discovered_items']} configured items; sample `{endpoint['sample_url']}`")
    lines.extend([
        "", "## Limitations", "",
        "- The public pronunciation navigation exposes 18 initial consonants and 6 final consonants. It exposes no vowel or tone category.",
        "- The site provides item counts and media paths in inline JavaScript, but no machine-readable Chinese lexical labels, Jyutping, romanization, or tones.",
        "- Existing curated labels cover a subset of visually unambiguous items. Unlabeled fields remain empty rather than being invented.",
        "- `kw` single items 4–10 are configured by the page but redirect to HTML rather than media; each is recorded as a failure.",
        "- Intro activities embed external YouTube videos. Their URLs are recorded in `source_manifest.json`, but third-party media was not downloaded.",
        "- The challenge activity appears only in commented-out navigation and was not treated as publicly linked content.",
        "- `/robots.txt` redirects to the home page; linked copyright/disclaimer routes return the site's 404 view. Only public first-party media was requested at a conservative rate.",
    ])
    report = "\n".join(lines) + "\n"
    (DATASET / "dataset_report.md").write_text(report, encoding="utf-8")
    (ROOT / "dataset_report.md").write_text(report, encoding="utf-8")
    print(f"Wrote comprehensive report: {len(rows)}/{len(raw['records'])} records, {total_duration:.3f}s")


if __name__ == "__main__":
    main()
