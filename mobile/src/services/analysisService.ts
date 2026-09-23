import {
  LocalRecording,
  PronunciationItem,
  PronunciationResult,
} from "../types";
import { delay } from "../utils/format";
export interface PronunciationAnalysisService {
  analyzeRecording(
    recording: LocalRecording,
    reference: PronunciationItem,
    signal?: AbortSignal,
  ): Promise<PronunciationResult>;
}
export class MockPronunciationAnalysisService implements PronunciationAnalysisService {
  async analyzeRecording(
    _recording: LocalRecording,
    reference: PronunciationItem,
    signal?: AbortSignal,
  ): Promise<PronunciationResult> {
    await delay(2600, signal);
    return {
      itemId: reference.id,
      similarity: 82,
      status: "表現良好",
      notes: [
        "你的錄音與參考發音在部分聲音特徵上相近。",
        "建議多聽幾次標準發音，再重新練習。",
      ],
      isMock: true,
      visualizationSeed: 3,
    };
  }
}
// Replace this instance with an authenticated Flask implementation; keep uploads opt-in.
export const analysisService: PronunciationAnalysisService =
  new MockPronunciationAnalysisService();
