import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "e2e.spec.ts",
  workers: 1,
  timeout: 35000,
  use: {
    baseURL: "http://127.0.0.1:8088",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      args: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },
});
