#!/usr/bin/env python3
"""Build review-only contact sheets from the downloaded source images."""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

from common import RAW, read_json


def main() -> None:
    manifest = read_json(RAW / "download_manifest.json")
    by_sound = defaultdict(list)
    for item in manifest:
        if item.get("record_family") != "pronunciation" or item["image_result"]["status"] == "failed":
            continue
        path = RAW.parent / item["image_path"].removeprefix("dataset/")
        if path.exists():
            by_sound[item["sound"]].append((item["activity"], item["source_index"], path))

    output = RAW / "review_contact_sheets"
    output.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default(size=24)
    for sound, items in by_sound.items():
        items.sort()
        thumb_w, thumb_h, label_h, columns = 300, 240, 36, 5
        rows = (len(items) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * thumb_w, rows * (thumb_h + label_h)), "white")
        draw = ImageDraw.Draw(sheet)
        for position, (activity, index, path) in enumerate(items):
            image = Image.open(path).convert("RGB")
            image = ImageOps.contain(image, (thumb_w, thumb_h))
            x = (position % columns) * thumb_w
            y = (position // columns) * (thumb_h + label_h)
            sheet.paste(image, (x + (thumb_w - image.width) // 2, y + (thumb_h - image.height) // 2))
            draw.rectangle((x, y + thumb_h, x + thumb_w, y + thumb_h + label_h), fill="white")
            label = f"{sound}:{index}" if activity == "single" else f"{sound}:{activity}:{index}"
            draw.text((x + 8, y + thumb_h + 4), label, fill="black", font=font)
        sheet.save(output / f"{sound.replace('-', 'final_')}.jpg", quality=92)
    print(f"Wrote {len(by_sound)} contact sheets to {output}")


if __name__ == "__main__":
    main()
