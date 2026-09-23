import React from "react";
import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Card, styles, Tag } from "./ui";
import { colors } from "../theme";
// Seeded illustration only. No PCM, FFT, or recorded audio is used here.
function Plot({ seed }: { seed: number }) {
  const palette = [
    "#172744",
    "#243B64",
    "#3D5884",
    "#698AB0",
    "#B4C0A7",
    "#E4CF86",
    "#F6C66A",
  ];
  return (
    <Svg
      width="100%"
      height={116}
      viewBox="0 0 320 112"
      accessibilityLabel="示範聲譜圖，並非實際聲音分析"
    >
      <Rect width={320} height={112} fill={palette[0]} rx={10} />
      {Array.from({ length: 640 }, (_, i) => {
        const x = i % 40;
        const y = Math.floor(i / 40);
        const envelope = Math.max(0, Math.sin((x / 40) * Math.PI));
        const harmonic = Math.pow(
          Math.max(0, Math.sin(y * 1.43 + x * 0.065 + seed * 0.2)),
          5,
        );
        const noise = (Math.sin(i * 13.7 + seed) + 1) * 0.12;
        const level = Math.min(
          6,
          Math.floor((harmonic * 0.75 + noise) * envelope * 7),
        );
        return (
          <Rect
            key={i}
            x={x * 8}
            y={y * 7}
            width={8.2}
            height={7.2}
            fill={palette[level]}
          />
        );
      })}
    </Svg>
  );
}
export function SpectrogramCard({ seed }: { seed: number }) {
  return (
    <Card>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={styles.heading}>聲音分析</Text>
        <Tag text="示範視覺" />
      </View>
      <Text style={styles.small}>示意錄音與參考聲音的特徵比較</Text>
      {["你的發音", "標準發音"].map((label, i) => (
        <View key={label} style={{ gap: 8 }}>
          <Text style={styles.body}>{label}</Text>
          <View style={styles.row}>
            <Text style={[styles.small, { fontSize: 10 }]}>
              高頻{"\n\n\n"}低頻
            </Text>
            <View style={{ flex: 1 }}>
              <Plot seed={seed + i} />
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Text style={styles.small}>0 s</Text>
                <Text style={styles.small}>時間 →</Text>
                <Text style={styles.small}>1 s</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      <Text style={styles.small}>
        兩幅圖均為預設示意，未對你的錄音進行 STFT 分析。
      </Text>
    </Card>
  );
}
