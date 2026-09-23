import React from "react";
import { Text, View } from "react-native";
import { PronunciationItem } from "../types";
import { colors, systemStyle } from "../theme";
import { Card, Tag, styles } from "./ui";
export function PronunciationCard({ item }: { item: PronunciationItem }) {
  const tint = systemStyle[item.phonologicalSystem];
  return (
    <Card
      style={{
        alignItems: "center",
        paddingVertical: 26,
        backgroundColor: tint.background,
        borderColor: tint.background,
      }}
    >
      <View
        style={[styles.row, { width: "100%", justifyContent: "space-between" }]}
      >
        <Tag
          text={item.phonologicalSystem}
          color={tint.color}
          background="white"
        />
        <Text style={[styles.small, { color: tint.color, fontWeight: "700" }]}>
          發音音 · {item.sound}
        </Text>
      </View>
      <Text style={styles.small}>請讀出這個字</Text>
      <Text
        style={{
          fontSize: 110,
          lineHeight: 132,
          fontWeight: "700",
          color: colors.ink,
        }}
      >
        {item.character || item.word}
      </Text>
      <Text
        style={{
          fontSize: 24,
          color: tint.color,
          fontWeight: "600",
          letterSpacing: 2,
        }}
      >
        {item.jyutping ?? "粵拼尚待核實"}
      </Text>
    </Card>
  );
}
