import { PronunciationItem } from "../types";
export interface DatasetRow {
  id: string;
  phonological_system: string;
  sound: string;
  character?: string;
  word?: string;
  jyutping?: string;
  tone?: string | number;
  audio_path?: string;
  audio_url?: string;
  source_url?: string;
  notes?: string;
}
// An API/static server base is required: a phone cannot read a repository-relative path.
// Unknown systems (e.g. 尾韻 / 語文轉換) are preserved outside this demo's three-category UI.
export function adaptDataset(
  rows: DatasetRow[],
  audioBaseUrl: string,
): PronunciationItem[] {
  return rows
    .filter(
      (row) =>
        ["輔音", "母音", "聲調"].includes(row.phonological_system) &&
        Boolean(row.character || row.word),
    )
    .map((row) => ({
      id: row.id,
      phonologicalSystem:
        row.phonological_system as PronunciationItem["phonologicalSystem"],
      sound: row.sound,
      character: row.character ?? "",
      word: row.word,
      jyutping: row.jyutping || undefined,
      tone:
        row.tone && Number.isFinite(Number(row.tone))
          ? Number(row.tone)
          : undefined,
      audioPath: row.audio_path,
      audioSource: {
        uri:
          row.audio_url ||
          `${audioBaseUrl.replace(/\/$/, "")}/${row.audio_path ?? ""}`,
      },
      sourceUrl: row.source_url || row.audio_url,
      sourceNotes: row.notes,
      metadataOrigin: row.notes?.includes("human-curated")
        ? "demo-curated"
        : "source",
    }));
}
