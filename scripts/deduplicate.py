#!/usr/bin/env python3
"""Report exact duplicate source audio without deleting or excluding any entry."""

from __future__ import annotations

import csv
from collections import defaultdict

from common import METADATA, RAW, read_json


FIELDS = ["file_a", "file_b", "sha256", "reason", "source_information"]


def main() -> None:
    validation = read_json(RAW / "validation_results.json")
    manifest = {item["source_id"]: item for item in read_json(RAW / "download_manifest.json")}
    groups = defaultdict(list)
    for item in validation:
        if item["valid"]:
            groups[item["sha256"]].append(item)
    rows = []
    for digest, items in groups.items():
        if len(items) < 2:
            continue
        first = items[0]
        for other in items[1:]:
            sources = {
                "source_id_a": first["source_id"], "source_url_a": manifest[first["source_id"]]["audio_url"],
                "source_id_b": other["source_id"], "source_url_b": manifest[other["source_id"]]["audio_url"],
            }
            rows.append({
                "file_a": first["audio_path"], "file_b": other["audio_path"], "sha256": digest,
                "reason": "exact duplicate audio bytes", "source_information": str(sources),
            })
    with (METADATA / "duplicates.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader(); writer.writerows(rows)
    print(f"Exact duplicate audio pairs: {len(rows)} (preserved)")


if __name__ == "__main__":
    main()
