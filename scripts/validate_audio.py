#!/usr/bin/env python3
"""Validate every collected MP3 and emit machine-readable technical metadata."""

from __future__ import annotations

import csv
import hashlib
import re
import shutil
import subprocess

from common import DATASET, METADATA, RAW, read_json, write_json


FIELDS = ["source_id", "audio_path", "valid", "format", "codec", "duration", "sample_rate", "channels", "file_size", "sha256", "error"]


def inspect_audio(path) -> dict:
    if shutil.which("ffprobe"):
        proc = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration,format_name:stream=codec_name,sample_rate,channels", "-of", "default=nw=1", str(path)],
            capture_output=True, text=True, check=False,
        )
        values = dict(line.split("=", 1) for line in proc.stdout.splitlines() if "=" in line)
        return {
            "duration": float(values.get("duration", 0) or 0),
            "sample_rate": int(values.get("sample_rate", 0) or 0),
            "channels": int(values.get("channels", 0) or 0),
            "codec": values.get("codec_name", ""), "format": values.get("format_name", ""),
            "tool_error": proc.stderr.strip(),
        }
    if shutil.which("afinfo"):
        proc = subprocess.run(["afinfo", str(path)], capture_output=True, text=True, check=False)
        text = proc.stdout + proc.stderr
        duration = re.search(r"estimated duration:\s*([0-9.]+) sec", text)
        data_format = re.search(r"Data format:\s*(\d+) ch,\s*([0-9.]+) Hz,\s*([^\s]+)", text)
        file_type = re.search(r"File type ID:\s*(\S+)", text)
        return {
            "duration": float(duration.group(1)) if duration else 0,
            "channels": int(data_format.group(1)) if data_format else 0,
            "sample_rate": int(float(data_format.group(2))) if data_format else 0,
            "codec": data_format.group(3) if data_format else "",
            "format": file_type.group(1) if file_type else "",
            "tool_error": "" if proc.returncode == 0 else text.strip(),
        }
    return {"duration": 0, "sample_rate": 0, "channels": 0, "codec": "", "format": "", "tool_error": "No ffprobe or afinfo available"}


def main() -> None:
    manifest = read_json(RAW / "download_manifest.json")
    results = []
    for item in manifest:
        if item["audio_result"]["status"] == "failed":
            continue
        path = DATASET / item["audio_path"]
        exists = path.is_file()
        data = path.read_bytes() if exists else b""
        prefix = data[:512]
        is_html = b"<html" in prefix.lower() or b"<!doctype" in prefix.lower()
        is_mp3 = prefix.startswith(b"ID3") or (len(prefix) >= 2 and prefix[0] == 0xFF and prefix[1] & 0xE0 == 0xE0)
        technical = inspect_audio(path) if exists else {"duration": 0, "sample_rate": 0, "channels": 0, "codec": "", "format": "", "tool_error": "file missing"}
        error_parts = []
        if not exists: error_parts.append("file missing")
        if not data: error_parts.append("empty file")
        if is_html: error_parts.append("HTML payload")
        if not is_mp3: error_parts.append("MP3 signature missing")
        if technical["duration"] <= 0: error_parts.append("non-positive/unreadable duration")
        if technical["sample_rate"] <= 0: error_parts.append("sample rate unavailable")
        if technical["channels"] <= 0: error_parts.append("channel count unavailable")
        if technical.get("tool_error"): error_parts.append(technical["tool_error"])
        results.append({
            "source_id": item["source_id"], "audio_path": item["audio_path"],
            "valid": not error_parts, "format": technical["format"], "codec": technical["codec"],
            "duration": technical["duration"], "sample_rate": technical["sample_rate"],
            "channels": technical["channels"], "file_size": len(data),
            "sha256": hashlib.sha256(data).hexdigest() if data else "", "error": "; ".join(error_parts),
        })
    write_json(RAW / "validation_results.json", results)
    with (METADATA / "audio_validation.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader(); writer.writerows(results)
    print(f"Valid audio: {sum(item['valid'] for item in results)}/{len(results)}")


if __name__ == "__main__":
    main()
