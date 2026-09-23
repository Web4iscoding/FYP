# 粵語小聲音

Cantonese Pronunciation Practice — a polished, backend-free FYP demo for primary-school-aged children and caregivers. Built with Expo SDK 55, React Native, TypeScript, React Navigation tabs/native stacks, expo-audio, expo-file-system, and React Native SVG.

## Install and run

Use current **Node 22 LTS** and npm. From the repository root:

```sh
cd mobile
npm install
npx expo start
```

`npm ci` is also available for reproducible installs using the committed lockfile. Commands must run from `mobile`, not the dataset repository root.

### Physical phone

Install a version of Expo Go compatible with SDK 55. Connect the phone and computer to the same Wi-Fi, start Expo, and scan the QR code with the iPhone camera or Expo Go on Android. Allow microphone permission only when you tap 開始錄音. If the installed Expo Go targets a different SDK, use a matching Android Expo Go build or create an Expo development build. The iOS App Store normally offers only the current Expo Go version.

### Android emulator

Install Android Studio and its Android SDK, create and start an Android Virtual Device, then press `a` in the Expo terminal (or `npm run android`). Enable microphone input in emulator settings if you want actual recording; otherwise select 使用模擬錄音示範.

### iOS simulator

On macOS, install Xcode and an iOS simulator runtime, launch the simulator, and press `i` (or `npm run ios`). A development build can be launched with `npx expo run:ios` if Expo Go compatibility requires it. Simulator microphone behavior varies; a physical phone is the preferred final recording check.

### Browser preview

```sh
npm run web
```

Use localhost or HTTPS for browser microphone access. A plain HTTP LAN address usually cannot access the microphone. Browser settings control website permission; the permission recovery button links to instructions. For custom native development builds, `app.json` provides the Chinese microphone permission explanation and disables background recording/playback.

## Presentation flow

首頁 → 開始測試 → 輔音 → b → 八 / baat3 → 播放標準發音 → 開始錄音 → wait at least one second → 停止 → 開始分析 → simulated analysis steps → 發音測試結果 → 查看聲音分析 → 查看練習建議 → 再練習 → record again → 完成練習 → 下一題 (蛋 / daan6).

For reliable rehearsal without a microphone, tap **使用模擬錄音示範** before recording. This does not collect audio; it explicitly marks the recording as simulated and disables 播放我的錄音. Real recording is the default. Both modes require at least one second before stopping.

The separate 練習 tab supports category selection, listening, local recording/playback, retries, completion, and the next item. 進度 updates after completed tests/practices and retains no voice files.

## Implemented screens and behavior

- Home: greeting, assessment/practice/progress cards, weekly goal.
- Categories: the proposed 19 consonants / 11 vowels / 9 tones, with honest available-demo counts.
- Sound selection: 5 consonant, 3 vowel, and 9 tone examples.
- Item/recording: large target character, Jyutping, bundled reference playback, microphone permission, recording pulse/timer, playback, retry, recording tips, privacy notice.
- Analysis: cancellable 2.6-second simulated progress and four workflow steps.
- Result: fixed 82% demo similarity, non-clinical status, explanatory notes, expandable mock spectrograms and predefined tips, practice/next/home actions.
- Practice completion: repeat, next, progress, home.
- Progress: seeded weekly/completion statistics plus deduplicated in-memory activities for this session.
- Recovery: denied microphone access, recording under one second, unavailable audio with timeout/retry, analysis/feedback retry paths.

## Architecture

```text
App.tsx                     Providers only
src/navigation/             Tabs, flow stacks, typed route contracts
src/screens/                Individual screens
src/components/             Buttons, cards, progress, target, spectrogram
src/services/audioService   Shared reference/local playback hook
src/services/recordingService Local recorder and temporary-file ownership
src/services/analysisService PronunciationAnalysisService + mock implementation
src/services/feedbackService FeedbackService + mock implementation
src/data/                   Demo items and snake_case dataset adapter
src/hooks/                  Session progress context
src/types/                  Dataset, recording, result, feedback contracts
src/theme/                  Colors, category styling, app name
src/utils/                  Timing helpers
assets/audio/               12 bundled Speakalong reference clips
tests/                      Service contracts + browser end-to-end checks
```

Recording states are IDLE → RECORDING → RECORDED → ANALYZING (analysis route) → RESULT (result route). Analysis takes ownership of the temporary recording on navigation; the item screen owns it otherwise. Cleanup occurs on retry, item blur/unmount, analysis exit, or app backgrounding while actively recording. Interrupted recordings are discarded, not silently resumed. OS cache eviction also applies; an OS kill cannot guarantee execution of JavaScript cleanup.

## What is real and what is mocked?

Reference MP3 playback and microphone recording/playback are real. Twelve small MP3s are copied from the existing local dataset, without modifying the originals. Source URLs are tracked per item. Source: [Speakalong / 樂語路](https://app.speakalongcuhk.com/tc/). Audio belongs to its original rights holders; inclusion here does not establish permission for public redistribution or commercial use. Confirm licensing before release.

Characters, Jyutping, and the three-category presentation are **demo-curated labels**. The source dataset does not supply Jyutping or tone annotations; do not treat these demo labels as source-verified research annotations. Formal deployment requires linguistic review. Nine-tone classification includes entering tones; Jyutping uses six numeric tone labels, so entering tones 7/8/9 map to 1/3/6 respectively. Demo planning counts do not imply that all 39 sounds are implemented.

Analysis always returns a predefined 82%, regardless of the recorded speech. It does not inspect audio, calculate STFT, assess disorders, or call Flask. Both spectrogram panels are seeded SVG illustrations, not acoustic features extracted from either recording. Feedback is predefined, not generated by Qwen. All are marked as demo in the UI.

Initial progress (6 weekly / 24 completed) and two recent activities are seeded examples. Completed operations add session-only metadata; closing/reloading resets the new activities. There is no database, account, upload, analytics, cloud storage, third-party AI request, or collection of personal information.

## Replace the demo dataset

The UI consumes `PronunciationItem[]` from `src/data/mockDataset.ts`. `adaptDataset` maps a JSON array with `phonological_system`, `sound`, `character`, `word`, `jyutping`, `tone`, `audio_path`, `audio_url`, and `source_url` into that contract. Serve relative audio paths from a phone-accessible HTTPS base URL or bundle clips with static `require` calls; phones cannot read your repository filesystem.

```ts
import rows from './dataset.json';
import { adaptDataset } from './datasetAdapter';
export const mockDataset = adaptDataset(rows, 'https://your-server.example/dataset');
```

Keep the helper exports (`itemsFor`, `findItem`, `nextItem`) while replacing the array; a later rename to `pronunciationItems` can update imports without screen changes. Unknown categories and rows with no readable lexical label are deliberately excluded. No empty label, Jyutping, or tone is invented. Source notes are retained and human-curated labels stay flagged.

The actual collected dataset has 輔音 / 尾韻 / 語文轉換 rather than the proposal's three UI categories, and has many blank labels. Do not remap 尾韻 to 母音, or assume the current data supplies 11 vowels / 9 tones. Curate/validate an appropriate subset first. Progress denominators should eventually come from the validated inventory rather than proposed scope constants.

## Replace analysis with Flask

Implement `PronunciationAnalysisService.analyzeRecording(recording, reference, signal)` and swap the exported `analysisService` instance. A future API can send the local clip and stable reference ID as multipart form data, honor AbortSignal, validate a structured result, and return actual similarity/status/notes plus feature assets. The current type deliberately requires `isMock: true`; introduce a discriminated `isMock: false` production result and update labels/components together when real analysis exists. Likewise replace the illustrative spectrogram component with actual computed feature data. Do not simply remove the demo badges while retaining mock calculations.

Before enabling uploads, add caregiver consent, access controls, pseudonymous identifiers, transport protection, explicit retention/deletion policies, and independent validation. The demo currently sends nothing.

## Replace feedback with Qwen

Implement `FeedbackService.generateFeedback(result, signal)` using an HTTP call to your Flask backend. Flask should validate/minimize structured assessment data before requesting Qwen. Keep model credentials on the server, constrain feedback to safe practice guidance, validate responses, and retain a graceful fallback. Expand the mock-only feedback type and UI labels only when the backend is genuinely connected. No Qwen configuration is needed for this demo.

## Verification

```sh
npm run type-check
npm test
npm run build
npx expo export --platform ios --platform android --output-dir dist-native
```

Browser integration tests use isolated Chromium and a synthetic WebAudio input stream:

```sh
npx playwright install chromium
# Terminal 1, from mobile:
python3 -m http.server 8088 --bind 127.0.0.1 --directory dist
# Terminal 2:
npm run test:e2e
```

Build `dist` first. Tests cover the full assessment/practice loop, progress updates, short-recording recovery, denied permission, unavailable reference audio, and actual browser MediaRecorder/playback with synthetic WebAudio input. They also verify that rerecording and leaving an active recording stop all input tracks and revoke temporary recording URLs. This host could not acquire Chromium's fake OS microphone, so the recorder test injects a MediaStream; it does not validate OS permission or physical microphone behavior. Native export checks bundle compilation only; physical iOS/Android hardware recording still needs a device smoke test. No Xcode/Android emulator installation is assumed in this workspace.

`npm audit` currently reports moderate transitive Expo build-tool advisories involving `xcode`/`uuid`. No high/critical advisories were reported during implementation. Do not use `npm audit fix --force`: its suggested Expo downgrade would break this SDK. Recheck/upstream-update before production; do not expose development servers publicly.

The separate full project proposal was not supplied; implementation follows the project title, scope, and proposal excerpts in the pasted request.
