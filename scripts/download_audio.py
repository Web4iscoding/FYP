#!/usr/bin/env python3
"""Resumably download every first-party audio/image candidate in raw_manifest.json."""

from __future__ import annotations

import argparse
import csv
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

import requests

from common import AUDIO, DATASET, METADATA, RAW, USER_AGENT, read_json, write_json


def paths_for(item: dict) -> tuple[Path, Path]:
    if item["record_family"] == "pronunciation":
        family = "consonants" if item["phonological_system"] == "輔音" else "finals"
        sound = item["sound"]
        slug = sound.replace("-", "final_")
        activity_part = "" if item["activity"] == "single" else f"_{item['activity']}"
        stem = f"{slug}{activity_part}_{item['source_index']:03d}"
        audio = AUDIO / family / sound / f"{stem}.mp3"
        image = RAW / "source_images" / family / sound / f"{stem}{PurePosixPath(item['image_url']).suffix}"
        return audio, image
    book = f"book_{item['book_id']:02d}"
    variant = "spoken" if item["variant_label"] == "口語" else "written"
    stem = f"{book}_{item['source_index']:03d}_{variant}"
    audio = AUDIO / "language_conversion" / book / variant / f"{stem}.mp3"
    image = RAW / "source_images" / "language_conversion" / book / f"{book}_{item['source_index']:03d}.jpg"
    return audio, image


def local_media_type(data: bytes) -> str:
    prefix = data[:16]
    if prefix.startswith(b"ID3") or (len(prefix) >= 2 and prefix[0] == 0xFF and prefix[1] & 0xE0 == 0xE0):
        return "audio/mpeg"
    if prefix.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if prefix.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    return "application/octet-stream"


def fetch(session: requests.Session, url: str, path: Path, *, delay: float, retries: int, verify_cached_http: bool) -> dict:
    path.parent.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).isoformat()
    if path.exists() and path.stat().st_size:
        data = path.read_bytes()
        result = {
            "status": "cached", "http_status": "", "final_url": url,
            "content_type": local_media_type(data), "content_type_basis": "local file signature",
            "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
            "retry_count": 0, "timestamp": timestamp,
        }
        if not verify_cached_http:
            return result
        try:
            response = session.head(url, timeout=30, allow_redirects=True)
            time.sleep(delay)
            result.update({
                "http_status": response.status_code, "final_url": response.url,
                "http_content_type": response.headers.get("content-type", ""),
            })
        except requests.RequestException as exc:
            result["remote_check_error"] = str(exc)
        return result

    last_error = ""
    last_status = ""
    final_url = url
    for attempt in range(retries + 1):
        try:
            response = session.get(url, timeout=45, allow_redirects=True)
            last_status = response.status_code
            final_url = response.url
            response.raise_for_status()
            data = response.content
            content_type = response.headers.get("content-type", "")
            detected = local_media_type(data)
            if not data:
                raise ValueError("empty response")
            if "text/html" in content_type.lower() or detected == "application/octet-stream":
                raise ValueError(f"unexpected media payload: HTTP content-type={content_type!r}, detected={detected!r}")
            temporary = path.with_suffix(path.suffix + ".part")
            temporary.write_bytes(data)
            temporary.replace(path)
            time.sleep(delay)
            return {
                "status": "downloaded", "http_status": response.status_code,
                "final_url": response.url, "content_type": content_type,
                "detected_content_type": detected, "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(), "retry_count": attempt,
                "timestamp": timestamp,
            }
        except (requests.RequestException, ValueError) as exc:
            last_error = str(exc)
            time.sleep(delay)
            if attempt < retries:
                time.sleep(2**attempt)
    return {
        "status": "failed", "http_status": last_status, "final_url": final_url,
        "error": last_error, "retry_count": retries, "timestamp": timestamp,
    }


def write_failures(manifest: list[dict]) -> None:
    fields = ["source_id", "source_url", "audio_url", "error", "http_status", "retry_count", "timestamp"]
    with (METADATA / "download_failures.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for item in manifest:
            result = item["audio_result"]
            if result["status"] == "failed":
                writer.writerow({
                    "source_id": item["source_id"], "source_url": item["source_url"],
                    "audio_url": item["audio_url"], "error": result.get("error", ""),
                    "http_status": result.get("http_status", ""),
                    "retry_count": result.get("retry_count", ""),
                    "timestamp": result.get("timestamp", ""),
                })


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=0.25)
    parser.add_argument("--retries", type=int, default=2)
    parser.add_argument("--skip-images", action="store_true")
    parser.add_argument("--verify-cached-http", action="store_true")
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args()
    records = read_json(RAW / "raw_manifest.json")["records"]
    session = requests.Session()
    session.headers["User-Agent"] = USER_AGENT
    manifest = []
    for position, item in enumerate(records, start=1):
        audio_path, image_path = paths_for(item)
        audio_result = fetch(session, item["audio_url"], audio_path, delay=args.delay, retries=args.retries, verify_cached_http=args.verify_cached_http)
        image_result = {"status": "skipped"}
        if not args.skip_images:
            image_result = fetch(session, item["image_url"], image_path, delay=args.delay, retries=args.retries, verify_cached_http=False)
        manifest.append({
            **item, "audio_path": audio_path.relative_to(DATASET).as_posix(),
            "image_path": image_path.relative_to(DATASET).as_posix(),
            "audio_result": audio_result, "image_result": image_result,
        })
        if position % 10 == 0 or position == len(records):
            write_json(RAW / "download_manifest.json", manifest)
            write_failures(manifest)
        if not args.quiet:
            print(f"[{position}/{len(records)}] {item['source_id']} audio={audio_result['status']} image={image_result['status']}", flush=True)
    succeeded = sum(item["audio_result"]["status"] != "failed" for item in manifest)
    print(f"Audio collected: {succeeded}/{len(records)}; failures: {len(records)-succeeded}")


if __name__ == "__main__":
    main()
