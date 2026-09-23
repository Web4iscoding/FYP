import { describe, expect, it, vi } from "vitest";
import { MockPronunciationAnalysisService } from "../src/services/analysisService";
import { MockFeedbackService } from "../src/services/feedbackService";
import { adaptDataset } from "../src/data/datasetAdapter";
import { formatTime } from "../src/utils/format";
import { PronunciationItem } from "../src/types";
const reference: PronunciationItem = {
  id: "b",
  character: "八",
  sound: "b",
  jyutping: "baat3",
  phonologicalSystem: "輔音",
  metadataOrigin: "demo-curated",
};
describe("demo service contracts", () => {
  it("returns an explicitly mock result and feedback", async () => {
    vi.useFakeTimers();
    const resultPromise =
      new MockPronunciationAnalysisService().analyzeRecording(
        { uri: "demo:test", durationMs: 2000, isDemo: true },
        reference,
      );
    await vi.runAllTimersAsync();
    const result = await resultPromise;
    expect(result).toMatchObject({ itemId: "b", similarity: 82, isMock: true });
    const tipsPromise = new MockFeedbackService().generateFeedback(result);
    await vi.runAllTimersAsync();
    expect((await tipsPromise).steps).toHaveLength(4);
    vi.useRealTimers();
  });
  it("cancels analysis when leaving the screen", async () => {
    const controller = new AbortController();
    const promise = new MockPronunciationAnalysisService().analyzeRecording(
      { uri: "demo:test", durationMs: 2000, isDemo: true },
      reference,
      controller.signal,
    );
    controller.abort();
    await expect(promise).rejects.toThrow("cancelled");
  });
  it("adapts snake-case data without inventing missing labels", () => {
    const data = adaptDataset(
      [
        {
          id: "a",
          phonological_system: "輔音",
          sound: "b",
          character: "八",
          audio_path: "audio/b.mp3",
        },
        { id: "missing", phonological_system: "輔音", sound: "d" },
        {
          id: "final",
          phonological_system: "尾韻",
          sound: "-t",
          character: "一",
        },
      ],
      "https://example.org/",
    );
    expect(data).toHaveLength(1);
    expect(data[0]?.audioSource).toEqual({
      uri: "https://example.org/audio/b.mp3",
    });
    expect(data[0]?.jyutping).toBeUndefined();
  });
  it("formats recording duration", () => {
    expect(formatTime(3000)).toBe("00:03");
    expect(formatTime(61000)).toBe("01:01");
  });
});
