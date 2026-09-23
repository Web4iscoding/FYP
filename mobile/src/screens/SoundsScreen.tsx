import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlowParams } from "../navigation/types";
import { itemsFor } from "../data/mockDataset";
import { colors, systemStyle } from "../theme";
import { Icon, Notice, Page, styles, Tag } from "../components/ui";
export function SoundsScreen({
  route,
  navigation,
}: NativeStackScreenProps<FlowParams, "Sounds">) {
  const { system } = route.params;
  const items = itemsFor(system);
  const tint = systemStyle[system];
  return (
    <Page
      onBack={navigation.goBack}
      eyebrow="CHOOSE A SOUND"
      title={`一起探索${system}`}
      subtitle="選一個聲音，先聽，再讀。"
    >
      <Tag
        text={`${items.length} 個精選示範`}
        color={tint.color}
        background={tint.background}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.sound}
            onPress={() => navigation.navigate("Item", { itemId: item.id })}
            style={({ pressed }) => [
              styles.card,
              {
                width: "47.8%",
                alignItems: "center",
                padding: 18,
                gap: 8,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={{
                fontSize: system === "聲調" ? 15 : 28,
                fontWeight: "800",
                color: tint.color,
              }}
            >
              {item.sound}
            </Text>
            <Text style={{ fontSize: 42, color: colors.ink }}>
              {item.character}
            </Text>
            <Text style={styles.small}>{item.jyutping}</Text>
            <Icon
              name="arrow-forward-circle-outline"
              color={tint.color}
              size={21}
            />
          </Pressable>
        ))}
      </View>
      <Notice>
        {system === "聲調"
          ? "九聲分類包含入聲；粵拼以六個調號標記，陰入／中入／陽入分別使用 1／3／6。"
          : "例字與粵拼為 demo 人工編選，正式研究仍需語言專家覆核。"}
      </Notice>
    </Page>
  );
}
