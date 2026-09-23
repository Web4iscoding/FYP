import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlowParams } from "../navigation/types";
import { analysisService } from "../services/analysisService";
import { findItem } from "../data/mockDataset";
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
import { colors } from "../theme";
import { deleteLocalRecording } from "../services/recordingService";
export function AnalysisScreen({
  route,
  navigation,
}: NativeStackScreenProps<FlowParams, "Analysis">) {
  const [step, setStep] = useState(0),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStep(0);
    setError(false);
    const timer = setInterval(
      () => setStep((previous) => Math.min(3, previous + 1)),
      650,
    );
    analysisService
      .analyzeRecording(
        route.params.recording,
        findItem(route.params.itemId),
        controller.signal,
      )
      .then((result) => {
        if (!controller.signal.aborted)
          navigation.replace("Result", {
            itemId: route.params.itemId,
            result,
            sessionId: String(Date.now()),
          });
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [attempt, navigation, route.params.itemId]);
  useEffect(
    () => () => {
      void deleteLocalRecording(route.params.recording.uri);
    },
    [route.params.recording.uri],
  );
  return (
    <Page
      onBack={navigation.goBack}
      eyebrow="A MOMENT OF DISCOVERY"
      title="正在分析你的發音"
      subtitle="稍等一下，示範結果快準備好了。"
    >
      <Tag text="模擬分析 · 不處理錄音內容" />
      <Card style={{ paddingVertical: 38, alignItems: "center" }}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.blueLight,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
        <Text style={styles.heading}>每次嘗試，都是進步</Text>
        <View style={{ width: "100%", marginTop: 10 }}>
          <ProgressBar value={(step + 1) / 4} />
        </View>
      </Card>
      <Card>
        {["已完成錄音", "分析聲音", "比較標準發音", "整理結果"].map(
          (text, index) => (
            <View key={text} style={[styles.row, { minHeight: 40 }]}>
              <Icon
                name={
                  index < step
                    ? "checkmark-circle"
                    : index === step
                      ? "radio-button-on"
                      : "ellipse-outline"
                }
                color={
                  index < step
                    ? colors.green
                    : index === step
                      ? colors.blue
                      : colors.muted
                }
              />
              <Text
                style={[
                  styles.body,
                  { fontWeight: index === step ? "700" : "400" },
                ]}
              >
                {text}
              </Text>
            </View>
          ),
        )}
      </Card>
      {error && (
        <Button
          title="分析未完成，再試一次"
          onPress={() => setAttempt((x) => x + 1)}
        />
      )}
      <Notice>這是流程示範。尚未連接 Flask、聲學比較或任何 AI 模型。</Notice>
    </Page>
  );
}
