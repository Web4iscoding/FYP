#!/usr/bin/env python3
"""Crawl only first-party, publicly linked Speakalong dataset pages."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from common import HOME_URL, RAW, CachedSession, read_json, write_json


def page_record(url: str, parent: str, title: str, category: str, subcategory: str, timestamp: str) -> dict:
    return {
        "page_url": url,
        "parent_url": parent,
        "page_title": title,
        "category": category,
        "subcategory": subcategory,
        "discovered_at": timestamp,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=0.75)
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()
    inspection = read_json(RAW / "site_inspection.json")
    client = CachedSession(delay=args.delay)
    timestamp = datetime.now(timezone.utc).isoformat()
    pages = [page_record(HOME_URL, "", "樂語路 Speakalong", "home", "", timestamp)]

    for system in inspection["categories"]:
        for target in system["sounds"]:
            sound_url = target["url"]
            html = client.text(sound_url, use_cache=not args.refresh)
            soup = BeautifulSoup(html, "html.parser")
            pages.append(page_record(sound_url, HOME_URL, target["sound"], system["name"], target["sound"], timestamp))
            for link in soup.select(".sound-game a[href*='/scontent/']"):
                url = urljoin(HOME_URL, link["href"])
                activity = url.rstrip("/").split("/")[-1]
                pages.append(page_record(url, sound_url, f"{target['sound']} / {activity}", system["name"], activity, timestamp))

    for book in inspection.get("books", []):
        pages.append(page_record(book["url"], HOME_URL, book["title"], "語文轉換", "book", timestamp))

    unique = {item["page_url"]: item for item in pages}
    write_json(RAW / "page_manifest.json", list(unique.values()))
    print(f"Discovered {len(unique)} relevant public pages")


if __name__ == "__main__":
    main()
