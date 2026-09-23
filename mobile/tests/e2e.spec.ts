import { test, expect, Page } from "@playwright/test";
async function openEight(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "開始測試", exact: true }).click();
  await page.getByRole("button", { name: "輔音", exact: true }).click();
  await page.getByRole("button", { name: "b", exact: true }).click();
  await expect(page.getByText("baat3", { exact: true }).last()).toBeVisible();
}
test("complete assessment, spectrogram, feedback and practice loop", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.screenshot({ path: "test-results/home.png" });
  await openEight(page);
  await page.getByRole("button", { name: "播放標準發音", exact: true }).click();
  await page
    .getByRole("button", { name: "使用模擬錄音示範", exact: true })
    .click();
  await page.getByRole("button", { name: "開始錄音", exact: true }).click();
  await expect(page.getByText("● 正在錄音（模擬）")).toBeVisible();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "停止", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "播放我的錄音", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "開始分析", exact: true }).click();
  await expect(page.getByText("模擬分析 · 不處理錄音內容")).toBeVisible();
  await expect(page.getByText("發音測試結果", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "查看聲音分析", exact: true }).click();
  await expect(
    page.getByText("兩幅圖均為預設示意，未對你的錄音進行 STFT 分析。"),
  ).toBeVisible();
  await page.getByRole("button", { name: "查看練習建議", exact: true }).click();
  await expect(page.getByText("注意開頭的聲音", { exact: true })).toBeVisible();
  await page.screenshot({ path: "test-results/result.png", fullPage: true });
  await page.getByRole("button", { name: "再練習", exact: true }).click();
  await expect(page.getByText("今天練習", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "使用模擬錄音示範", exact: true })
    .click();
  await page.getByRole("button", { name: "開始錄音", exact: true }).click();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "停止", exact: true }).click();
  await page.getByRole("button", { name: "完成練習", exact: true }).click();
  await expect(page.getByText("完成練習！", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "下一題", exact: true }).click();
  await expect(page.getByText("daan6", { exact: true }).last()).toBeVisible();
  await page.getByRole("tab", { name: /進度/ }).click();
  await expect(page.getByText("8 / 10 次", { exact: true })).toBeVisible();
  await expect(page.getByText("26", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test("short rehearsal recording has a working retry", async ({ page }) => {
  await openEight(page);
  await page
    .getByRole("button", { name: "使用模擬錄音示範", exact: true })
    .click();
  await page.getByRole("button", { name: "開始錄音", exact: true }).click();
  await page.getByRole("button", { name: "停止", exact: true }).click();
  await expect(page.getByText("錄音時間太短", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "再試一次", exact: true }).click();
  await expect(page.getByText("● 正在錄音（模擬）")).toBeVisible();
});
test("denied microphone permission explains the recovery", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Permission denied", "NotAllowedError");
    };
  });
  await openEight(page);
  await page.getByRole("button", { name: "開始錄音", exact: true }).click();
  await expect(page.getByText("需要使用麥克風", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "查看權限設定方法" }),
  ).toBeVisible();
});
test("browser MediaRecorder can record and replay synthetic input locally", async ({
  page,
}) => {
  // This host cannot acquire Chromium's fake OS microphone. Supply a real
  // WebAudio MediaStream instead; Expo still uses the browser MediaRecorder.
  await page.addInitScript(() => {
    const audit = { tracks: [] as MediaStreamTrack[], revoked: 0 };
    (window as unknown as { recordingAudit: typeof audit }).recordingAudit =
      audit;
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = (uri) => {
      audit.revoked++;
      revoke(uri);
    };
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const destination = context.createMediaStreamDestination();
      oscillator.connect(destination);
      oscillator.start();
      await context.resume();
      destination.stream.getTracks().forEach((track) => {
        audit.tracks.push(track);
        const stop = track.stop.bind(track);
        track.stop = () => {
          stop();
          oscillator.stop();
          void context.close();
        };
      });
      return destination.stream;
    };
    navigator.mediaDevices.enumerateDevices = async () => [];
  });
  await openEight(page);
  await page.getByRole("button", { name: "開始錄音", exact: true }).click();
  await expect(page.getByText("● 正在錄音", { exact: true })).toBeVisible();
  await page.waitForTimeout(1300);
  await page.getByRole("button", { name: "停止", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "播放我的錄音", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "播放我的錄音", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "正在播放我的錄音", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "重新錄音", exact: true }).click();
  await expect(page.getByText("● 正在錄音", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: /首頁/ }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const audit = (
          window as unknown as {
            recordingAudit: { tracks: MediaStreamTrack[]; revoked: number };
          }
        ).recordingAudit;
        return {
          live: audit.tracks.filter((track) => track.readyState === "live")
            .length,
          revoked: audit.revoked,
        };
      }),
    )
    .toEqual({ live: 0, revoked: 2 });
});

test("missing reference audio times out with retry", async ({ page }) => {
  await page.route("**/*.mp3", (route) => route.abort());
  await openEight(page);
  await page.getByRole("button", { name: "播放標準發音", exact: true }).click();
  await expect(
    page.getByText("暫時無法播放標準發音", { exact: true }),
  ).toBeVisible({ timeout: 12000 });
  await expect(
    page.getByRole("button", { name: "再試一次", exact: true }),
  ).toBeEnabled();
});
