#!/usr/bin/env python3
"""Build processed and application metadata from raw discovery and validation layers."""

from __future__ import annotations

import csv
from collections import defaultdict

from common import DATASET, METADATA, RAW, read_json, write_json


PROCESSED = DATASET / "processed"
APPLICATION = DATASET / "application"
FIELDS = [
    "id", "phonological_system", "category", "sound", "initial", "final", "vowel",
    "tone", "tone_number", "tone_name", "character", "word", "phrase", "jyutping",
    "romanization", "audio_path", "audio_url", "source_url", "source_page", "source_id",
    "original_filename", "audio_format", "codec", "duration_seconds", "sample_rate",
    "channels", "file_size_bytes", "sha256", "recording_variant", "language", "activity",
    "book_id", "book_title", "variant_label", "notes",
]


def main() -> None:
    raw = read_json(RAW / "raw_manifest.json")
    downloads = {item["source_id"]: item for item in read_json(RAW / "download_manifest.json")}
    validation = {item["source_id"]: item for item in read_json(RAW / "validation_results.json")}
    labels_path = RAW / "labels.json"
    labels = read_json(labels_path) if labels_path.exists() else {}
    rows = []
    for source in raw["records"]:
        downloaded = downloads.get(source["source_id"])
        checked = validation.get(source["source_id"])
        if not downloaded or downloaded["audio_result"]["status"] == "failed" or not checked or not checked["valid"]:
            continue
        label_key = f"{source['sound']}:{source['activity']}:{source['source_index']}"
        label = labels.get(label_key, {})
        derived_label = bool(label.get("character") or label.get("word") or label.get("phrase"))
        notes = []
        if derived_label:
            notes.append("Lexical label is human-curated from source artwork/category; it is not textual metadata supplied by the site.")
            if label.get("notes"): notes.append(label["notes"])
        else:
            notes.append("The site supplies no machine-readable lexical/Jyutping/tone text for this item; fields remain empty rather than inferred.")
        family = source["record_family"]
        system = source["phonological_system"]
        rows.append({
            "id": f"SA-{len(rows)+1:05d}", "phonological_system": system,
            "category": system, "sound": source["sound"],
            "initial": source["sound"] if system == "輔音" else "",
            "final": source["sound"] if system == "尾韻" else "",
            "vowel": "", "tone": "", "tone_number": "", "tone_name": "",
            "character": label.get("character", ""), "word": label.get("word", ""),
            "phrase": label.get("phrase", ""), "jyutping": "", "romanization": "",
            "audio_path": downloaded["audio_path"], "audio_url": source["audio_url"],
            "source_url": source["source_url"], "source_page": source["source_page"],
            "source_id": source["source_id"], "original_filename": source["original_filename"],
            "audio_format": "mp3", "codec": checked["codec"],
            "duration_seconds": checked["duration"], "sample_rate": checked["sample_rate"],
            "channels": checked["channels"], "file_size_bytes": checked["file_size"],
            "sha256": checked["sha256"], "recording_variant": source["recording_variant"],
            "language": "yue-Hant", "activity": source["activity"],
            "book_id": source.get("book_id", ""), "book_title": source.get("book_title", ""),
            "variant_label": source.get("variant_label", ""), "notes": " ".join(notes),
        })

    METADATA.mkdir(parents=True, exist_ok=True); PROCESSED.mkdir(parents=True, exist_ok=True); APPLICATION.mkdir(parents=True, exist_ok=True)
    for destination in (METADATA / "dataset.csv", PROCESSED / "dataset.csv"):
        with destination.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=FIELDS); writer.writeheader(); writer.writerows(rows)
    write_json(METADATA / "dataset.json", rows)
    write_json(PROCESSED / "dataset.json", rows)

    by_sound = defaultdict(list)
    for row in rows:
        if row["sound"]:
            by_sound[row["sound"]].append({
                "id": row["id"], "character": row["character"], "word": row["word"],
                "phrase": row["phrase"], "activity": row["activity"],
                "audio_path": row["audio_path"], "source_url": row["source_url"],
            })
    write_json(APPLICATION / "by_sound.json", dict(sorted(by_sound.items())))
    print(f"Wrote {len(rows)} collected/valid records from {len(raw['records'])} configured source records")


if __name__ == "__main__":
    main()
