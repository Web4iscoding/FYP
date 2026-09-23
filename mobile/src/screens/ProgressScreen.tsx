import React from "react";
import { Text, View } from "react-native";
import { useProgress } from "../hooks/useProgress";
import { colors, systemStyle } from "../theme";
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
export function ProgressScreen() {
  const { activities, count } = useProgress();
  const frequency = activities.reduce<Record<string, number>>(
    (all, item) => {
      all[item.system] = (all[item.system] ?? 0) + 1;
      return all;
    },
    { 輔音: 4, 母音: 1, 聲調: 1 },
  );
  const most = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]![0];
  return (
    <Page
      eyebrow="EVERY TRY COUNTS"
      title="我的進度"
      subtitle="記下每一次小小的進步。"
    >
      <Tag text="示範數據 + 本次使用紀錄" />
      <Card style={{ backgroundColor: colors.blue, borderColor: colors.blue }}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={[styles.heading, { color: "white" }]}>本週練習</Text>
          <Icon name="calendar-outline" color="white" />
        </View>
        <Text style={{ fontSize: 48, fontWeight: "800", color: "white" }}>
          {6 + count}
          <Text style={{ fontSize: 16 }}> / 10 次</Text>
        </Text>
        <ProgressBar value={(6 + count) / 10} color={colors.yellow} />
        <Text style={{ fontSize: 13, color: "#E0E8FF" }}>
          每次願意開口，都是值得記錄的進步。
        </Text>
      </Card>
      <View style={{ flexDirection: "row", gap: 14 }}>
        <Card style={{ flex: 1 }}>
          <Icon name="checkmark-done-outline" color={colors.green} />
          <Text style={{ fontSize: 31, fontWeight: "800", color: colors.ink }}>
            {24 + count}
          </Text>
          <Text style={styles.small}>完成項目（次數）</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Icon name="chatbubbles-outline" color={colors.purple} />
          <Text style={{ fontSize: 29, fontWeight: "800", color: colors.ink }}>
            {most}
          </Text>
          <Text style={styles.small}>最常練習</Text>
        </Card>
      </View>
      <SectionTitle detail="本機 · 本次使用">最近活動</SectionTitle>
      <Card>
        {activities.slice(0, 8).map((activity, index) => (
          <View
            key={activity.id}
            style={[
              styles.row,
              {
                borderTopWidth: index ? 1 : 0,
                borderColor: colors.border,
                paddingTop: index ? 15 : 0,
                paddingBottom: 6,
              },
            ]}
          >
            <View
              style={{
                width: 49,
                height: 49,
                backgroundColor: systemStyle[activity.system].background,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 26, color: colors.ink }}>
                {activity.character}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={styles.body}>
                {activity.system} ·{" "}
                {activity.mode === "assessment" ? "測試" : "練習"}
              </Text>
              <Text style={styles.small}>{activity.time}</Text>
            </View>
            <Tag text="已完成" color={colors.green} background={colors.mint} />
          </View>
        ))}
      </Card>
      <Notice>
        6 次／24
        項為示範起始數據。新增紀錄只在本次使用保留，重啟後重設；不含錄音或個人資料。
      </Notice>
    </Page>
  );
}
