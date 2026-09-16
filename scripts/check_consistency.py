#!/usr/bin/env python3
"""Check consistency across comprehensive raw, processed, and application layers."""

from __future__ import annotations

import csv
import json
from collections import Counter

from common import AUDIO, DATASET, METADATA, RAW, read_json


def main() -> None:
    with (METADATA / "dataset.csv").open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    json_rows = read_json(METADATA / "dataset.json")
    raw = read_json(RAW / "raw_manifest.json")["records"]
    downloads = read_json(RAW / "download_manifest.json")
    validations = read_json(RAW / "validation_results.json")
    raw_ids = {item["source_id"] for item in raw}
    download_by_id = {item["source_id"]: item for item in downloads}
    validation_by_id = {item["source_id"]: item for item in validations}
    row_by_id = {row["source_id"]: row for row in rows}
    errors = []
    normalized_json = [{field: str(value) for field, value in item.items()} for item in json_rows]
    if rows != normalized_json: errors.append("CSV and JSON differ after scalar string normalization")
    if len(raw_ids) != len(raw): errors.append("duplicate source_id in raw manifest")
    if len(download_by_id) != len(downloads): errors.append("duplicate source_id in download manifest")
    if len(row_by_id) != len(rows): errors.append("duplicate source_id in processed dataset")
    if set(download_by_id) != raw_ids: errors.append("raw/download source ID sets differ")

    expected_rows = {
        source_id for source_id, item in download_by_id.items()
        if item["audio_result"]["status"] != "failed" and validation_by_id.get(source_id, {}).get("valid")
    }
    if set(row_by_id) != expected_rows: errors.append("processed row IDs differ from downloaded-and-valid IDs")
    selected_paths = set()
    for source_id, row in row_by_id.items():
        path = DATASET / row["audio_path"]
        selected_paths.add(path)
        if not path.is_file() or not path.stat().st_size: errors.append(f"missing/empty audio: {path}")
        source = download_by_id[source_id]
        if row["audio_url"] != source["audio_url"] or row["source_page"] != source["source_page"]:
            errors.append(f"source mismatch: {source_id}")
        if row["sha256"] != validation_by_id[source_id]["sha256"]:
            errors.append(f"hash mismatch: {source_id}")
    curated_files = set(AUDIO.rglob("*.mp3"))
    if curated_files != selected_paths:
        errors.append(f"audio tree mismatch: extra={len(curated_files-selected_paths)}, missing={len(selected_paths-curated_files)}")
    if errors:
        raise SystemExit("Consistency check failed:\n- " + "\n- ".join(errors))
    hashes = Counter(row["sha256"] for row in rows)
    print(json.dumps({
        "discovered": len(raw), "collected_valid": len(rows), "failed_or_invalid": len(raw)-len(rows),
        "audio_files": len(curated_files), "unique_audio_hashes": len(hashes),
        "duplicate_hash_groups": sum(count > 1 for count in hashes.values()), "status": "OK",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
