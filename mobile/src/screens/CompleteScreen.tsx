import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { FlowParams, TabParams } from "../navigation/types";
import { findItem, nextItem } from "../data/mockDataset";
import { useProgress } from "../hooks/useProgress";
import {
  Button,
  Card,
  Icon,
  Notice,
  Page,
  styles,
  Tag,
} from "../components/ui";
import { colors } from "../theme";
export function CompleteScreen({
  route,
  navigation,
}: NativeStackScreenProps<FlowParams, "Complete">) {
  const { itemId, sessionId } = route.params;
  const item = findItem(itemId);
  const progress = useProgress();
  useEffect(() => {
    progress.add(item, "practice", sessionId);
  }, [sessionId]);
  const parent = () =>
    navigation.getParent<BottomTabNavigationProp<TabParams>>();
  return (
    <Page eyebrow="ONE MORE LITTLE STEP" title="完成練習！">
      <Card
        style={{
          backgroundColor: colors.yellowLight,
          borderColor: colors.yellowLight,
          alignItems: "center",
          paddingVertical: 38,
        }}
      >
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 30,
            backgroundColor: colors.yellow,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="ribbon-outline" size={48} color={colors.ink} />
        </View>
        <Text style={{ fontSize: 72, fontWeight: "700", color: colors.ink }}>
          {item.character}
        </Text>
        <Text style={{ fontSize: 23, color: colors.blue }}>
          {item.jyutping}
        </Text>
        <Tag
          text="今天又多了一次嘗試"
          color={colors.green}
          background={colors.mint}
        />
      </Card>
      <Text style={[styles.body, { textAlign: "center" }]}>
        你可以再聽一次標準發音，{"\n"}然後繼續下一題。
      </Text>
      <Button
        title="再練一次"
        icon="refresh-outline"
        onPress={() => navigation.replace("Item", { itemId })}
      />
      <Button
        title="下一題"
        icon="arrow-forward"
        secondary
        onPress={() =>
          navigation.replace("Item", { itemId: nextItem(itemId).id })
        }
      />
      <Button
        title="查看我的進度"
        secondary
        onPress={() => parent()?.navigate("Progress")}
      />
      <Button
        title="返回首頁"
        secondary
        onPress={() => parent()?.navigate("Home")}
      />
      <Notice>已更新本次使用的進度。錄音不會儲存在練習紀錄中。</Notice>
    </Page>
  );
}
