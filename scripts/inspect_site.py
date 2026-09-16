#!/usr/bin/env python3
"""Inspect public Speakalong navigation and record the site's exposed structure."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from common import HOME_URL, RAW, CachedSession, ensure_directories, write_json


def inspect(delay: float, refresh: bool) -> dict:
    client = CachedSession(delay=delay)
    html = client.text(HOME_URL, use_cache=not refresh)
    soup = BeautifulSoup(html, "html.parser")

    categories: list[dict] = []
    sound_container = soup.select_one("#divSound")
    current = None
    if sound_container:
        for node in sound_container.find_all(["div", "a"]):
            classes = set(node.get("class", []))
            if node.name == "div" and {"btn", "btn-warning"}.issubset(classes):
                current = {"name": node.get_text(strip=True), "sounds": []}
                categories.append(current)
            elif node.name == "a" and "/sound/" in node.get("href", "") and current:
                current["sounds"].append(
                    {"sound": node.get_text(strip=True), "url": urljoin(HOME_URL, node["href"])}
                )

    books = [
        {"title": link.get_text(strip=True), "url": urljoin(HOME_URL, link["href"])}
        for link in soup.select("#divBook a[href*='/bcontent/']")
    ]

    activities_by_sound = {}
    for category in categories:
        for target in category["sounds"]:
            sound_html = client.text(target["url"], use_cache=not refresh)
            sound_soup = BeautifulSoup(sound_html, "html.parser")
            activities_by_sound[target["sound"]] = [
                {
                    "name": link["href"].rstrip("/").split("/")[-1],
                    "url": urljoin(HOME_URL, link["href"]),
                }
                for link in sound_soup.select(".sound-game a[href*='/scontent/']")
            ]

    # The server redirects /robots.txt to /tc/, so no robots directives are published there.
    robots_content, robots_type, robots_status = client.get(
        "https://app.speakalongcuhk.com/robots.txt", use_cache=not refresh
    )
    robots_is_html = b"<!DOCTYPE html" in robots_content[:200].upper() or b"<html" in robots_content[:500].lower()

    result = {
        "inspected_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_home": HOME_URL,
        "categories": categories,
        "books": books,
        "activities_by_sound": activities_by_sound,
        "robots": {
            "requested_url": "https://app.speakalongcuhk.com/robots.txt",
            "http_status_after_redirect": robots_status,
            "content_type_after_redirect": robots_type,
            "published_robots_file_found": not robots_is_html,
            "notes": "The endpoint redirects to the Traditional Chinese home page; no robots directives were exposed.",
        },
        "observations": {
            "data_transport": "Server-rendered HTML plus inline JavaScript configuration",
            "audio_url_pattern_source": "Inline loadAudio JavaScript on each public activity page",
            "audio_format": "MP3 (audio/mpeg)",
            "lexical_metadata": "No textual character, word, Jyutping, or tone fields exposed; lexical content is conveyed by picture and audio.",
            "multiple_recordings": "Each activity item has one numbered MP3; the same concept may occur in multiple activity types.",
            "tone_information": "No tone category or explicit tone metadata exposed in the pronunciation navigation.",
        },
    }
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=0.75)
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()
    ensure_directories()
    result = inspect(args.delay, args.refresh)
    write_json(RAW / "site_inspection.json", result)
    total = sum(len(category["sounds"]) for category in result["categories"])
    print(f"Discovered {len(result['categories'])} pronunciation categories, {total} target sounds, and {len(result['books'])} books")


if __name__ == "__main__":
    main()
