import React from "react";
import { Pressable, Text, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParams } from "../navigation/types";
import { appName, colors, disclaimer } from "../theme";
import {
  Card,
  Icon,
  Notice,
  Page,
  ProgressBar,
  SectionTitle,
  styles,
  Tag,
} from "../components/ui";
import { useProgress } from "../hooks/useProgress";
export function HomeScreen({
  navigation,
}: BottomTabScreenProps<TabParams, "Home">) {
  const progress = useProgress();
  const actions = [
    {
      title: "開始測試",
      detail: "進行粵語發音測試",
      icon: "mic-outline" as const,
      color: colors.blue,
      background: colors.blueLight,
      action: () => navigation.navigate("Assessment", { screen: "Category" }),
    },
    {
      title: "發音練習",
      detail: "練習常見粵語音",
      icon: "headset-outline" as const,
      color: colors.green,
      background: colors.mint,
      action: () => navigation.navigate("Practice", { screen: "Category" }),
    },
    {
      title: "我的進度",
      detail: "查看最近的練習結果",
      icon: "bar-chart-outline" as const,
      color: "#927121",
      background: colors.yellowLight,
      action: () => navigation.navigate("Progress"),
    },
  ];
  return (
    <Page>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={styles.row}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 15,
              backgroundColor: colors.blue,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="pulse" color="white" />
          </View>
          <View>
            <Text
              style={{ fontSize: 22, color: colors.ink, fontWeight: "800" }}
            >
              {appName}
            </Text>
            <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>
              Cantonese Pronunciation Practice
            </Text>
          </View>
        </View>
        <Tag text="DEMO" />
      </View>
      <Card
        style={{
          backgroundColor: colors.yellowLight,
          borderColor: colors.yellowLight,
          marginTop: 8,
          paddingVertical: 26,
        }}
      >
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={[styles.eyebrow, { color: "#886624" }]}>
              一字一句，一起進步
            </Text>
            <Text style={[styles.title, { fontSize: 27 }]}>今日想做甚麼？</Text>
            <Text style={styles.body}>
              聽一聽、讀一讀，{"\n"}探索你的粵語小聲音。
            </Text>
          </View>
          <View
            style={{
              width: 75,
              height: 100,
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.yellow,
              borderRadius: 36,
              transform: [{ rotate: "8deg" }],
            }}
          >
            {[22, 40, 62, 40, 22].map((height, i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height,
                  borderRadius: 4,
                  backgroundColor: colors.ink,
                }}
              />
            ))}
          </View>
        </View>
      </Card>
      {actions.map((action) => (
        <Pressable
          key={action.title}
          accessibilityRole="button"
          accessibilityLabel={action.title}
          onPress={action.action}
          style={({ pressed }) => [
            styles.card,
            styles.row,
            { padding: 18, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <View
            style={{
              backgroundColor: action.background,
              width: 54,
              height: 54,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={action.icon} color={action.color} size={27} />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={styles.heading}>{action.title}</Text>
            <Text style={styles.small}>{action.detail}</Text>
          </View>
          <Icon name="chevron-forward" color={colors.muted} size={20} />
        </Pressable>
      ))}
      <SectionTitle detail="小步前進，也很棒">本週練習</SectionTitle>
      <Card>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.body}>
            已完成 {6 + progress.count} / 10 個練習
          </Text>
          <Icon name="sparkles-outline" color="#927121" />
        </View>
        <ProgressBar value={(6 + progress.count) / 10} color={colors.green} />
        <Text style={styles.small}>起始數字為示範；本次完成會即時更新。</Text>
      </Card>
      <Notice>{disclaimer}</Notice>
    </Page>
  );
}
