import { Feedback, PronunciationResult } from "../types";
import { delay } from "../utils/format";
export interface FeedbackService {
  generateFeedback(
    result: PronunciationResult,
    signal?: AbortSignal,
  ): Promise<Feedback>;
}
export class MockFeedbackService implements FeedbackService {
  async generateFeedback(
    _result: PronunciationResult,
    signal?: AbortSignal,
  ): Promise<Feedback> {
    await delay(350, signal);
    return {
      heading: "練習小貼士",
      steps: [
        "先聽一次標準發音",
        "注意開頭的聲音",
        "慢慢讀一次",
        "再錄一次比較",
      ],
      isMock: true,
    };
  }
}
// Future Qwen calls belong behind the Flask service, never API keys in the app.
export const feedbackService: FeedbackService = new MockFeedbackService();
