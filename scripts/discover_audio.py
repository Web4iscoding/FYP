#!/usr/bin/env python3
"""Summarize the exact first-party endpoint families discovered in the raw manifest."""

from __future__ import annotations

from collections import Counter, defaultdict

from common import METADATA, RAW, read_json, write_json


def main() -> None:
    document = read_json(RAW / "raw_manifest.json")
    groups = defaultdict(list)
    for item in document["records"]:
        key = (item["record_family"], item["phonological_system"], item["sound"], item["activity"], item.get("variant_label", ""))
        groups[key].append(item)
    endpoints = []
    for key, items in sorted(groups.items()):
        family, system, sound, activity, variant = key
        sample = items[0]
        endpoints.append(
            {
                "source_page": sample["source_page"],
                "endpoint_pattern": (
                    "/assets/voices/{sound}/{activity_number}-{item}.mp3"
                    if family == "pronunciation"
                    else "/assets/books/{book_id}/{page}[s].mp3"
                ),
                "resource_type": "audio",
                "record_family": family,
                "phonological_system": system,
                "sound": sound,
                "activity": activity,
                "variant": variant,
                "discovered_items": len(items),
                "sample_url": sample["audio_url"],
            }
        )
    result = {
        "source_home": document["source_home"],
        "endpoint_groups": endpoints,
        "resource_totals": dict(Counter(item["record_family"] for item in document["records"])),
        "external_references": document["external_references"],
    }
    write_json(METADATA / "source_manifest.json", result)
    print(f"Wrote {len(endpoints)} endpoint groups for {len(document['records'])} candidate recordings")


if __name__ == "__main__":
    main()
