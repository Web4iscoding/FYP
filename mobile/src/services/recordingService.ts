import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { File } from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";
import { LocalRecording } from "../types";
export type RecordingState = "IDLE" | "RECORDING" | "RECORDED";
export type RecordingError = "permission" | "short" | "unavailable" | null;
export async function deleteLocalRecording(uri?: string) {
  if (!uri || uri.startsWith("demo:")) return;
  try {
    if (Platform.OS === "web") URL.revokeObjectURL(uri);
    else {
      const file = new File(uri);
      if (file.exists) file.delete();
    }
  } catch {
    /* OS may already have removed its cache file. */
  }
}
export function useRecordingService() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const focused = useIsFocused();
  const [state, setState] = useState<RecordingState>("IDLE");
  const [elapsed, setElapsed] = useState(0);
  const [recording, setRecording] = useState<LocalRecording>();
  const [error, setError] = useState<RecordingError>(null);
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState(false);
  const active = useRef(false),
    mounted = useRef(true),
    started = useRef(0),
    fileUri = useRef<string | undefined>(undefined),
    demoRef = useRef(false);
  const focusedRef = useRef(focused);
  focusedRef.current = focused;
  const stopAndDiscard = async () => {
    if (active.current && !demoRef.current) {
      try {
        await recorder.stop();
        await deleteLocalRecording(recorder.uri ?? undefined);
      } catch {}
    }
    active.current = false;
    await deleteLocalRecording(fileUri.current);
    fileUri.current = undefined;
  };
  useEffect(() => {
    mounted.current = true;
    const subscription = AppState.addEventListener("change", (next) => {
      if (next !== "active" && active.current) {
        void stopAndDiscard().then(() => {
          if (mounted.current) {
            setState("IDLE");
            setRecording(undefined);
            setElapsed(0);
          }
        });
      }
    });
    return () => {
      mounted.current = false;
      subscription.remove();
      void stopAndDiscard();
    };
  }, []);
  useEffect(() => {
    if (!focused)
      void stopAndDiscard().then(() => {
        if (mounted.current) {
          setState("IDLE");
          setRecording(undefined);
          setElapsed(0);
        }
      });
  }, [focused]);
  useEffect(() => {
    if (state !== "RECORDING") return;
    const timer = setInterval(
      () => setElapsed(Date.now() - started.current),
      100,
    );
    return () => clearInterval(timer);
  }, [state]);
  async function start() {
    setBusy(true);
    setError(null);
    try {
      await deleteLocalRecording(fileUri.current);
      fileUri.current = undefined;
      setRecording(undefined);
      setState("IDLE");
      demoRef.current = demo;
      if (!demo) {
        const permission = await AudioModule.requestRecordingPermissionsAsync();
        if (!mounted.current || !focusedRef.current) return;
        if (!permission.granted) {
          setError("permission");
          return;
        }
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync();
        recorder.record();
        active.current = true;
      }
      if (!mounted.current || !focusedRef.current) {
        await stopAndDiscard();
        return;
      }
      demoRef.current = demo;
      active.current = true;
      started.current = Date.now();
      setElapsed(0);
      setState("RECORDING");
    } catch {
      setError("unavailable");
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function stop() {
    setBusy(true);
    const durationMs = Date.now() - started.current;
    try {
      if (!demoRef.current) await recorder.stop();
      active.current = false;
      const uri = demoRef.current ? `demo:${Date.now()}` : recorder.uri;
      if (!uri) throw new Error("No recording");
      if (durationMs < 1000) {
        await deleteLocalRecording(uri);
        setError("short");
        setState("IDLE");
        return;
      }
      fileUri.current = uri;
      setRecording({ uri, durationMs, isDemo: demoRef.current });
      setElapsed(durationMs);
      setState("RECORDED");
    } catch {
      active.current = false;
      setState("IDLE");
      setError("unavailable");
    } finally {
      setBusy(false);
    }
  }
  // Transfer temporary-file ownership to Analysis before the item loses focus.
  const handoff = () => {
    fileUri.current = undefined;
  };
  return {
    state,
    elapsed,
    recording,
    error,
    clearError: () => setError(null),
    busy,
    demo,
    setDemo,
    start,
    stop,
    handoff,
  };
}
