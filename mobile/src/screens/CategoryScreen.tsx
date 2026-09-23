import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlowParams } from "../navigation/types";
import { useMode } from "../navigation/FlowContext";
import { categories, itemsFor } from "../data/mockDataset";
import { colors, systemStyle } from "../theme";
import { Icon, Notice, Page, styles, Tag } from "../components/ui";
export function CategoryScreen({
  navigation,
}: NativeStackScreenProps<FlowParams, "Category">) {
  const practice = useMode() === "practice";
  return (
    <Page
      eyebrow={practice ? "LISTEN · SPEAK · REPEAT" : "LET’S FIND YOUR VOICE"}
      title={practice ? "發音練習" : "選擇測試"}
      subtitle={
        practice
          ? "不用急，選一個聲音慢慢練習。"
          : "選擇一項開始測試你的粵語發音。"
      }
    >
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 2 }}>
        {[1, 2, 3].map((x, i) => (
          <View
            key={x}
            style={{
              height: 4,
              borderRadius: 4,
              flex: 1,
              backgroundColor: i === 0 ? colors.blue : colors.border,
            }}
          />
        ))}
      </View>
      {categories.map(({ system, count, unit, caption, english }, i) => {
        const tint = systemStyle[system];
        return (
          <Pressable
            key={system}
            accessibilityRole="button"
            accessibilityLabel={system}
            onPress={() => navigation.navigate("Sounds", { system })}
            style={({ pressed }) => [
              styles.card,
              { padding: 23, gap: 18, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View
                style={{
                  width: 57,
                  height: 57,
                  borderRadius: 19,
                  backgroundColor: tint.background,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={tint.icon} size={29} color={tint.color} />
              </View>
              <Text style={[styles.eyebrow, { color: colors.muted }]}>
                0{i + 1}
              </Text>
            </View>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View style={{ gap: 6 }}>
                <Text style={[styles.title, { fontSize: 25 }]}>
                  {system}{" "}
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.muted,
                      fontWeight: "500",
                    }}
                  >
                    {count} {unit}
                  </Text>
                </Text>
                <Text style={styles.small}>{caption}</Text>
              </View>
              <Icon name="arrow-forward" color={tint.color} />
            </View>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text
                style={{ fontSize: 9, color: colors.muted, letterSpacing: 1.6 }}
              >
                {english}
              </Text>
              <Tag
                text={`${itemsFor(system).length} 個示範項目`}
                color={tint.color}
                background={tint.background}
              />
            </View>
          </Pressable>
        );
      })}
      <Notice>
        研究規劃範圍：19 輔音、11 母音、9 聲調。本 demo
        只開放精選例字，並非完整測試。
      </Notice>
    </Page>
  );
}
