#!/usr/bin/env python3
"""Shared helpers for the Speakalong data-acquisition pipeline."""

from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parents[1]
DATASET = ROOT / "dataset"
RAW = DATASET / "raw"
METADATA = DATASET / "metadata"
AUDIO = DATASET / "audio"
CACHE = RAW / "cache"
BASE_URL = "https://app.speakalongcuhk.com"
HOME_URL = f"{BASE_URL}/tc/"
USER_AGENT = "CUHK-Speakalong-Academic-Dataset/1.0 (low-rate reproducible collector)"


def ensure_directories() -> None:
    for path in (RAW, METADATA, AUDIO, CACHE):
        path.mkdir(parents=True, exist_ok=True)


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


class CachedSession:
    """Small disk-backed GET client with a deliberate delay between requests."""

    def __init__(self, delay: float = 0.75, timeout: float = 30.0) -> None:
        ensure_directories()
        self.delay = delay
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers["User-Agent"] = USER_AGENT
        self._last_request = 0.0

    @staticmethod
    def _cache_path(url: str) -> Path:
        digest = hashlib.sha256(url.encode("utf-8")).hexdigest()
        return CACHE / f"{digest}.bin"

    def get(self, url: str, *, use_cache: bool = True) -> tuple[bytes, str, int]:
        cache_path = self._cache_path(url)
        meta_path = cache_path.with_suffix(".json")
        if use_cache and cache_path.exists() and meta_path.exists():
            meta = read_json(meta_path)
            return cache_path.read_bytes(), meta.get("content_type", ""), int(meta["status"])

        elapsed = time.monotonic() - self._last_request
        if elapsed < self.delay:
            time.sleep(self.delay - elapsed)
        response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
        self._last_request = time.monotonic()
        response.raise_for_status()
        content_type = response.headers.get("content-type", "")
        cache_path.write_bytes(response.content)
        write_json(
            meta_path,
            {
                "requested_url": url,
                "final_url": response.url,
                "status": response.status_code,
                "content_type": content_type,
            },
        )
        return response.content, content_type, response.status_code

    def text(self, url: str, *, use_cache: bool = True) -> str:
        content, _, _ = self.get(url, use_cache=use_cache)
        return content.decode("utf-8")
