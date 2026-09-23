export type PhonologicalSystem = "輔音" | "母音" | "聲調";
export type Mode = "assessment" | "practice";
export interface PronunciationItem {
  id: string;
  phonologicalSystem: PhonologicalSystem;
  sound: string;
  character: string;
  word?: string;
  jyutping?: string;
  tone?: number;
  audioSource?: number | { uri: string };
  audioPath?: string;
  sourceUrl?: string;
  sourceNotes?: string;
  metadataOrigin: "demo-curated" | "source";
}
export interface LocalRecording {
  uri: string;
  durationMs: number;
  isDemo: boolean;
}
export interface PronunciationResult {
  itemId: string;
  similarity: number;
  status: "表現良好" | "可以再練習一下";
  notes: string[];
  isMock: true;
  visualizationSeed: number;
}
export interface Feedback {
  heading: string;
  steps: string[];
  isMock: true;
}
export interface Activity {
  id: string;
  character: string;
  system: PhonologicalSystem;
  mode: Mode;
  time: string;
}
