import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
export function useReferenceAudio(source?: number | { uri: string }) {
  const player = useAudioPlayer(source ?? null);
  const status = useAudioPlayerStatus(player);
  const focused = useIsFocused();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const cancellation = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    if (!focused) {
      cancellation.current?.();
      player.pause();
    }
    return () => cancellation.current?.();
  }, [focused, player]);
  async function play() {
    setError(false);
    setBusy(true);
    try {
      if (!source) throw new Error("Missing audio");
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
      if (!player.isLoaded) {
        player.replace(source);
        await new Promise<void>((resolve, reject) => {
          const cleanup = () => {
            clearTimeout(timeout);
            subscription.remove();
            cancellation.current = undefined;
          };
          const subscription = player.addListener(
            "playbackStatusUpdate",
            (event) => {
              if (event.isLoaded) {
                cleanup();
                resolve();
              }
            },
          );
          const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Audio unavailable"));
          }, 8000);
          cancellation.current = () => {
            cleanup();
            reject(new Error("cancelled"));
          };
          if (player.isLoaded) {
            cleanup();
            resolve();
          }
        });
      }
      await player.seekTo(0);
      player.play();
    } catch (error) {
      if (!(error instanceof Error && error.message === "cancelled"))
        setError(true);
    } finally {
      setBusy(false);
    }
  }
  return {
    play,
    pause: () => {
      cancellation.current?.();
      player.pause();
    },
    playing: status.playing,
    loading: busy || status.isBuffering,
    error,
  };
}
