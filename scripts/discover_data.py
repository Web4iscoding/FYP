#!/usr/bin/env python3
"""Extract every configured item from publicly linked activity and book pages."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import PurePosixPath

from bs4 import BeautifulSoup

from common import BASE_URL, METADATA, RAW, CachedSession, read_json, write_json


GAME_RE = re.compile(r'"(?P<sound>-?[a-z]+)":\{"qno": \[(?P<qno>[^]]+)\], "type": \[(?P<types>[^]]+)\]')
BOOK_RE = re.compile(r'"(?P<book>\d+)":\{"content":\s*(?P<content>\d+)\}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=0.75)
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()
    pages = read_json(RAW / "page_manifest.json")
    inspection = read_json(RAW / "site_inspection.json")
    sound_system = {
        item["sound"]: system["name"]
        for system in inspection["categories"]
        for item in system["sounds"]
    }
    client = CachedSession(delay=args.delay)
    discovered_at = datetime.now(timezone.utc).isoformat()
    records = []
    external = []

    for page in pages:
        url = page["page_url"]
        if "/scontent/" not in url:
            continue
        sound, activity = PurePosixPath(url).parts[-2:]
        html = client.text(url, use_cache=not args.refresh)
        soup = BeautifulSoup(html, "html.parser")
        if activity == "intro":
            for iframe in soup.select("iframe[src]"):
                external.append(
                    {
                        "source_page": url,
                        "sound": sound,
                        "resource_type": "embedded_intro_video",
                        "url": iframe["src"],
                        "downloaded": False,
                        "reason": "External YouTube media is recorded for traceability but is outside the first-party crawl/download boundary.",
                    }
                )
            continue
        match = next((item for item in GAME_RE.finditer(html) if item.group("sound") == sound), None)
        if not match:
            raise RuntimeError(f"No inline game configuration for {url}")
        game_names_match = re.search(r'game_names\s*=\s*(\[[^;]+\])', html)
        if not game_names_match:
            raise RuntimeError(f"No game_names array for {url}")
        game_names = json.loads(game_names_match.group(1))
        game_index = game_names.index(activity)
        counts = [int(value.strip()) for value in match.group("qno").split(",")]
        types = json.loads(f"[{match.group('types')}]")
        for index in range(1, counts[game_index] + 1):
            audio_url = f"{BASE_URL}/assets/voices/{sound}/{game_index}-{index}.mp3"
            image_url = f"{BASE_URL}/assets/pics/{sound}/{game_index}-{index}.{types[game_index]}"
            records.append(
                {
                    "source_id": f"sound:{sound}:{activity}:{index}",
                    "record_family": "pronunciation",
                    "phonological_system": sound_system[sound],
                    "sound": sound,
                    "activity": activity,
                    "source_index": index,
                    "recording_variant": 1,
                    "audio_url": audio_url,
                    "image_url": image_url,
                    "source_url": audio_url,
                    "source_page": url,
                    "original_filename": PurePosixPath(audio_url).name,
                    "discovered_at": discovered_at,
                    "raw_metadata": {
                        "game_index": game_index,
                        "configured_count": counts[game_index],
                        "configured_image_type": types[game_index],
                    },
                }
            )

    for page in pages:
        url = page["page_url"]
        if "/bcontent/" not in url:
            continue
        book_id = PurePosixPath(url).name
        html = client.text(url, use_cache=not args.refresh)
        match = next((item for item in BOOK_RE.finditer(html) if item.group("book") == book_id), None)
        if not match:
            raise RuntimeError(f"No inline book configuration for {url}")
        max_index = int(match.group("content"))
        title_match = re.search(r'<div class="btn btn-lg btn-warning fs-3">([^<]+)</div>', html)
        title = title_match.group(1).strip() if title_match else page["page_title"]
        for index in range(0, max_index + 1):
            image_url = f"{BASE_URL}/assets/books/{book_id}/{index}.jpg"
            for variant, suffix, label in ((1, "", "口語"), (2, "s", "書面語")):
                audio_url = f"{BASE_URL}/assets/books/{book_id}/{index}{suffix}.mp3"
                records.append(
                    {
                        "source_id": f"book:{book_id}:{index}:{label}",
                        "record_family": "language_conversion",
                        "phonological_system": "語文轉換",
                        "sound": "",
                        "activity": "book",
                        "book_id": int(book_id),
                        "book_title": title,
                        "source_index": index,
                        "recording_variant": variant,
                        "variant_label": label,
                        "audio_url": audio_url,
                        "image_url": image_url,
                        "source_url": audio_url,
                        "source_page": url,
                        "original_filename": PurePosixPath(audio_url).name,
                        "discovered_at": discovered_at,
                        "raw_metadata": {"configured_max_page_index": max_index},
                    }
                )

    document = {
        "source_home": inspection["source_home"],
        "discovered_at": discovered_at,
        "records": records,
        "external_references": external,
        "notes": "Records are enumerated only from publicly linked pages and their inline first-party JavaScript configuration.",
    }
    write_json(RAW / "raw_manifest.json", document)
    write_json(METADATA / "raw_manifest.json", document)
    print(f"Configured records discovered: {len(records)}; external intro references: {len(external)}")


if __name__ == "__main__":
    main()
