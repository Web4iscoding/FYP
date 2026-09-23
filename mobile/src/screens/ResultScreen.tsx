import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { FlowParams, TabParams } from "../navigation/types";
import { findItem, nextItem } from "../data/mockDataset";
import { feedbackService } from "../services/feedbackService";
import { Feedback } from "../types";
import { useProgress } from "../hooks/useProgress";
import { SpectrogramCard } from "../components/SpectrogramCard";
import {
  Button,
  Card,
  Icon,
  Notice,
  Page,
  ProgressBar,
  styles,
  Tag,
} from "../components/ui";
import { colors, disclaimer } from "../theme";
export function ResultScreen({
  route,
  navigation,
}: NativeStackScreenProps<FlowParams, "Result">) {
  const { result, itemId, sessionId } = route.params;
  const item = findItem(itemId);
  const progress = useProgress();
  const [showPlot, setShowPlot] = useState(false),
    [showTips, setShowTips] = useState(false),
    [feedback, setFeedback] = useState<Feedback>(),
    [feedbackError, setFeedbackError] = useState(false),
    [feedbackAttempt, setFeedbackAttempt] = useState(0);
  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    progress.add(item, "assessment", sessionId);
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [sessionId]);
  useEffect(() => {
    if (!showTips) return;
    const controller = new AbortController();
    setFeedbackError(false);
    feedbackService
      .generateFeedback(result, controller.signal)
      .then(setFeedback)
      .catch(() => {
        if (!controller.signal.aborted) setFeedbackError(true);
      });
    return () => controller.abort();
  }, [showTips, feedbackAttempt]);
  const parent = () =>
    navigation.getParent<BottomTabNavigationProp<TabParams>>();
  return (
    <Page
      onBack={() => navigation.popTo("Category")}
      eyebrow="WELL DONE FOR TRYING"
      title="發音測試結果"
    >
      <Tag text="DEMO · 非真實評分" />
      <Animated.View style={{ opacity: fade }}>
        <Card
          style={{
            alignItems: "center",
            backgroundColor: colors.mint,
            borderColor: colors.mint,
          }}
        >
          <Icon
            name="checkmark-circle-outline"
            size={42}
            color={colors.green}
          />
          <Text style={[styles.title, { fontSize: 25 }]}>{result.status}</Text>
          <Text style={styles.body}>
            發音音 {item.sound}　·　目標字 {item.character}
          </Text>
          <Text
            style={{ fontSize: 62, fontWeight: "800", color: colors.green }}
          >
            {result.similarity}
            <Text style={{ fontSize: 24 }}>%</Text>
          </Text>
          <Text style={styles.small}>聲音相似度 · 預設示範數值</Text>
          <View style={{ width: "100%" }}>
            <ProgressBar value={result.similarity / 100} color={colors.green} />
          </View>
        </Card>
      </Animated.View>
      <Card>
        <Text style={styles.heading}>分析提示</Text>
        {result.notes.map((note) => (
          <Text key={note} style={styles.body}>
            {note}
          </Text>
        ))}
        <Text style={styles.small}>
          以上為預設 DEMO 訊息，不代表錄音的實際表現。
        </Text>
      </Card>
      <Button
        title={showPlot ? "收起聲音分析" : "查看聲音分析"}
        icon="pulse-outline"
        secondary
        onPress={() => setShowPlot(!showPlot)}
      />
      {showPlot && <SpectrogramCard seed={result.visualizationSeed} />}
      <Button
        title={showTips ? "收起練習建議" : "查看練習建議"}
        icon="bulb-outline"
        secondary
        onPress={() => setShowTips(!showTips)}
      />
      {showTips && (
        <Card>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <Text style={styles.heading}>練習小貼士</Text>
            <Tag text="預設 · 非 AI 生成" />
          </View>
          {feedback ? (
            feedback.steps.map((text, index) => (
              <View key={text} style={styles.row}>
                <View
                  style={{
                    width: 29,
                    height: 29,
                    borderRadius: 10,
                    backgroundColor: colors.yellowLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#886624", fontWeight: "700" }}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.body}>{text}</Text>
              </View>
            ))
          ) : feedbackError ? (
            <Button
              title="重新載入建議"
              secondary
              onPress={() => setFeedbackAttempt((x) => x + 1)}
            />
          ) : (
            <ActivityIndicator color={colors.blue} />
          )}
        </Card>
      )}
      <Button
        title="再練習"
        icon="mic-outline"
        onPress={() =>
          parent()?.navigate("Practice", { screen: "Item", params: { itemId } })
        }
      />
      <Button
        title="下一題"
        secondary
        icon="arrow-forward"
        onPress={() =>
          navigation.replace("Item", { itemId: nextItem(itemId).id })
        }
      />
      <Button
        title="返回首頁"
        secondary
        onPress={() => parent()?.navigate("Home")}
      />
      <Notice>{disclaimer}</Notice>
    </Page>
  );
}
