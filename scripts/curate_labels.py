#!/usr/bin/env python3
"""Write the human-reviewed lexical labels visible in the paired source artwork.

The source site does not publish textual labels. These transcriptions are therefore
kept in a separate curation file and never represented as source-supplied metadata.
"""

from __future__ import annotations

from common import RAW, write_json


SINGLE = {
    "b": ["餅", "波", "筆", "鼻", "病", "簿", "逼", "包", "冰", "八"],
    "d": ["碟", "多", "蛋", "豆", "大", "彈", "笛", "袋", "刀", "跌"],
    "g": ["角", "腳", "鼓", "街", "菇", "高", "九", "叫", "蓋", "攰"],
    "gw": ["瓜", "掘", "龜", "跪", "櫃", "摑", "罐", "棍", "骨", "光"],
    "p": ["怕", "趴", "抱", "被", "爬", "跑", "豹", "派", "盆", "拋"],
    "t": ["呔", "梯", "跳", "枱", "兔", "推", "踢", "天", "糖", "剔"],
    "k": ["騎", "溪", "箍", "棋", "扣", "拳", "企", "旗", "橋", "傾"],
    "kw": ["跨", "框", "裙"],
    "m": ["馬", "摸", "買", "貓", "帽", "門", "尾", "襪", "蚊", "麵"],
    "n": ["你", "泥", "鬧", "尿", "奶", "諗", "鈕", "難", "嬲", "腦"],
    "ng": ["牙", "鵝", "矮", "咬", "蟻", "牛", "眼", "鴨", "岩", "愛"],
    "f": ["F", "花", "啡", "火", "褲", "灰", "肥", "浮", "吠", "飛"],
    "h": ["口", "蝦", "河", "輕", "汽", "敲", "猴", "海", "好", "鞋"],
    "j": ["耳", "藥", "魚", "葉", "二", "煙", "影", "羊", "鷹", "熱"],
    "l": ["路", "六", "梨", "老", "褸", "鹿", "鏈", "領", "狼", "亂"],
    "z": ["紙", "樽", "遮", "豬", "獎", "追", "蕉", "嘴", "剪", "接"],
    "c": ["叉", "車", "坐", "臭", "草", "菜", "猜", "床", "蟲", "鏟"],
    "s": ["S", "沙", "蛇", "C", "梳", "書", "水", "手", "四", "上"],
    "-p": ["碟", "葉", "業", "鴨", "喼", "盒", "塔", "十", "鴿", "汁"],
    "-t": ["八", "一", "筆", "咳", "襪", "掘", "切", "熱", "跌", "雪"],
    "-k": ["壁", "賊", "食", "曲", "鹿", "木", "竹", "綠", "錫", "腳"],
    "-m": ["點", "喊", "藍", "啱", "心", "尖", "針", "掩", "舔", "三"],
    "-n": ["門", "碗", "天", "蛋", "飯", "信", "盆", "鏟", "眼", "板"],
    "-ng": ["燈", "床", "鏡", "窗", "釘", "橙", "星", "餅", "羊", "冰"],
}

WORDS = {
    "gw": ["瓜子"],
    "kw": ["頭盔", "短裙", "圓規", "困難", "葵扇", "昆蟲", "群眾"],
}


def main() -> None:
    labels = {}
    for sound, values in SINGLE.items():
        for index, value in enumerate(values, start=1):
            is_latin = value in {"F", "S", "C"}
            labels[f"{sound}:single:{index}"] = {
                "character": "" if is_latin else value,
                "word": value if is_latin else "",
                "notes": "Source artwork depicts a Latin letter." if is_latin else "",
            }
    for sound, values in WORDS.items():
        for index, value in enumerate(values, start=1):
            labels[f"{sound}:word:{index}"] = {
                "character": "",
                "word": value,
                "notes": "Word-activity replacement selected because configured single media were unavailable or duplicated.",
            }
    write_json(RAW / "labels.json", labels)
    print(f"Wrote {len(labels)} curated labels")


if __name__ == "__main__":
    main()
