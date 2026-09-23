import { PronunciationItem, PhonologicalSystem } from "../types";

// These are explicitly demo-curated linguistic labels, not metadata supplied by Speakalong.
const audio = {
  eight: require("../../assets/audio/eight.mp3"),
  horse: require("../../assets/audio/horse.mp3"),
  egg: require("../../assets/audio/egg.mp3"),
  nine: require("../../assets/audio/nine.mp3"),
  flower: require("../../assets/audio/flower.mp3"),
  smoke: require("../../assets/audio/smoke.mp3"),
  drum: require("../../assets/audio/drum.mp3"),
  one: require("../../assets/audio/one.mp3"),
  mouth: require("../../assets/audio/mouth.mp3"),
  sheep: require("../../assets/audio/sheep.mp3"),
  eat: require("../../assets/audio/eat.mp3"),
  cover: require("../../assets/audio/cover.mp3"),
};
const root = "https://app.speakalongcuhk.com/assets/voices/";
const item = (
  id: string,
  phonologicalSystem: PhonologicalSystem,
  sound: string,
  character: string,
  jyutping: string,
  key: keyof typeof audio,
  source: string,
  tone?: number,
): PronunciationItem => ({
  id,
  phonologicalSystem,
  sound,
  character,
  jyutping,
  audioSource: audio[key],
  sourceUrl: root + source,
  metadataOrigin: "demo-curated",
  tone,
});
export const mockDataset: PronunciationItem[] = [
  item("consonant-b", "輔音", "b", "八", "baat3", "eight", "b/1-10.mp3"),
  item("consonant-d", "輔音", "d", "蛋", "daan6", "egg", "d/1-3.mp3"),
  item("consonant-g", "輔音", "g", "九", "gau2", "nine", "g/1-7.mp3"),
  item("consonant-m", "輔音", "m", "馬", "maa5", "horse", "m/1-1.mp3"),
  item("consonant-f", "輔音", "f", "花", "faa1", "flower", "f/1-2.mp3"),
  item("vowel-aa", "母音", "aa", "八", "baat3", "eight", "b/1-10.mp3"),
  item("vowel-i", "母音", "i", "煙", "jin1", "smoke", "j/1-6.mp3"),
  item("vowel-u", "母音", "u", "鼓", "gu2", "drum", "g/1-3.mp3"),
  item("tone-1", "聲調", "1 · 陰平", "煙", "jin1", "smoke", "j/1-6.mp3", 1),
  item("tone-2", "聲調", "2 · 陰上", "口", "hau2", "mouth", "h/1-1.mp3", 2),
  item("tone-3", "聲調", "3 · 陰去", "蓋", "goi3", "cover", "g/1-9.mp3", 3),
  item("tone-4", "聲調", "4 · 陽平", "羊", "joeng4", "sheep", "j/1-8.mp3", 4),
  item("tone-5", "聲調", "5 · 陽上", "馬", "maa5", "horse", "m/1-1.mp3", 5),
  item("tone-6", "聲調", "6 · 陽去", "蛋", "daan6", "egg", "d/1-3.mp3", 6),
  item("tone-7", "聲調", "7 · 陰入", "一", "jat1", "one", "-t/1-2.mp3", 7),
  item("tone-8", "聲調", "8 · 中入", "八", "baat3", "eight", "b/1-10.mp3", 8),
  item("tone-9", "聲調", "9 · 陽入", "食", "sik6", "eat", "-k/1-3.mp3", 9),
];
export const categories = [
  {
    system: "輔音" as const,
    count: 19,
    unit: "個音",
    caption: "留意每個字的開頭聲音",
    english: "INITIAL SOUNDS",
  },
  {
    system: "母音" as const,
    count: 11,
    unit: "個音",
    caption: "聽一聽聲音的不同形狀",
    english: "VOWEL SOUNDS",
  },
  {
    system: "聲調" as const,
    count: 9,
    unit: "個聲調",
    caption: "一起探索聲音的高低起伏",
    english: "TONE PATTERNS",
  },
];
export const itemsFor = (system: PhonologicalSystem) =>
  mockDataset.filter((x) => x.phonologicalSystem === system);
export const findItem = (id: string) =>
  mockDataset.find((x) => x.id === id) ?? mockDataset[0]!;
export const nextItem = (id: string) => {
  const current = findItem(id);
  const items = itemsFor(current.phonologicalSystem);
  return items[(items.findIndex((x) => x.id === id) + 1) % items.length]!;
};
