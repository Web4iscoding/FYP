import React, { useEffect, useRef } from "react";
import { Animated, Linking, Platform, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlowParams } from "../navigation/types";
import { useMode } from "../navigation/FlowContext";
import { categories, findItem, itemsFor } from "../data/mockDataset";
import { PronunciationCard } from "../components/PronunciationCard";
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
import { useReferenceAudio } from "../services/audioService";
import { useRecordingService } from "../services/recordingService";
import { formatTime } from "../utils/format";
export function ItemScreen({
  route,
  navigation,
}: NativeStackScreenProps<FlowParams, "Item">) {
  const item = findItem(route.params.itemId);
  const mode = useMode();
  const category = categories.find(
    (x) => x.system === item.phonologicalSystem,
  )!;
  const reference = useReferenceAudio(item.audioSource);
  const recording = useRecordingService();
  const playback = useReferenceAudio(
    recording.recording && !recording.recording.isDemo
      ? { uri: recording.recording.uri }
      : undefined,
  );
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (recording.state !== "RECORDING") {
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [recording.state, pulse]);
  const start = () => {
    reference.pause();
    playback.pause();
    void recording.start();
  };
  return (
    <Page
      onBack={navigation.goBack}
      eyebrow={
        mode === "practice"
          ? "A LITTLE PRACTICE, EVERY DAY"
          : "YOUR TURN TO SPEAK"
      }
      title={mode === "practice" ? "今天練習" : "聽一聽，讀一讀"}
    >
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={styles.small}>
          第{" "}
          {itemsFor(item.phonologicalSystem).findIndex(
            (x) => x.id === item.id,
          ) + 1}{" "}
          / {category.count} 個 · 研究規劃
        </Text>
        <Tag text={recording.demo ? "模擬錄音" : "本機錄音"} />
      </View>
      <PronunciationCard item={item} />
      <Button
        title={reference.playing ? "正在播放標準發音" : "播放標準發音"}
        icon="volume-high-outline"
        secondary
        onPress={() => void reference.play()}
        disabled={recording.state === "RECORDING"}
        busy={reference.loading}
      />
      {reference.error && (
        <Card style={{ backgroundColor: colors.dangerLight }}>
          <Text style={styles.heading}>暫時無法播放標準發音</Text>
          <Button
            title="再試一次"
            onPress={() => void reference.play()}
            secondary
          />
        </Card>
      )}
      <Card style={{ alignItems: "center", paddingVertical: 24 }}>
        {recording.state === "RECORDING" ? (
          <>
            <Animated.View
              style={{
                opacity: pulse,
                backgroundColor: colors.dangerLight,
                width: 66,
                height: 66,
                borderRadius: 33,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="mic" color={colors.danger} size={30} />
            </Animated.View>
            <Text style={styles.heading}>請讀出：{item.character}</Text>
            <Text style={[styles.small, { color: colors.danger }]}>
              ● 正在錄音{recording.demo ? "（模擬）" : ""}
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontVariant: ["tabular-nums"],
                fontWeight: "700",
                color: colors.ink,
              }}
            >
              {formatTime(recording.elapsed)}
            </Text>
            <View style={{ width: "100%" }}>
              <Button
                title="停止"
                icon="stop"
                onPress={() => void recording.stop()}
                busy={recording.busy}
              />
            </View>
          </>
        ) : recording.state === "RECORDED" ? (
          <>
            <View style={styles.row}>
              <Icon name="checkmark-circle" color={colors.green} />
              <Text style={styles.heading}>錄音完成</Text>
              <Text style={styles.small}>{formatTime(recording.elapsed)}</Text>
            </View>
            {recording.recording?.isDemo && (
              <Text style={styles.small}>模擬狀態，沒有收集聲音。</Text>
            )}
            <View style={{ width: "100%", gap: 12 }}>
              <Button
                title={playback.playing ? "正在播放我的錄音" : "播放我的錄音"}
                icon="play-outline"
                secondary
                disabled={recording.recording?.isDemo}
                busy={playback.loading}
                onPress={() => void playback.play()}
              />
              {playback.error && (
                <Text style={{ color: colors.danger }}>
                  暫時無法播放，請重新錄音。
                </Text>
              )}
              <Button
                title="重新錄音"
                icon="refresh-outline"
                secondary
                onPress={start}
                busy={recording.busy}
              />
              <Button
                title={mode === "assessment" ? "開始分析" : "完成練習"}
                icon={
                  mode === "assessment"
                    ? "sparkles-outline"
                    : "checkmark-outline"
                }
                onPress={() => {
                  playback.pause();
                  reference.pause();
                  if (!recording.recording) return;
                  if (mode === "assessment") {
                    recording.handoff();
                    navigation.navigate("Analysis", {
                      itemId: item.id,
                      recording: recording.recording,
                    });
                  } else
                    navigation.navigate("Complete", {
                      itemId: item.id,
                      sessionId: String(Date.now()),
                    });
                }}
              />
            </View>
          </>
        ) : (
          <>
            <Icon name="mic-outline" size={32} />
            <Text style={styles.heading}>準備好嗎？</Text>
            <Text style={styles.small}>準備好後，按下按鈕錄音。</Text>
            <View style={{ width: "100%" }}>
              <Button
                title="開始錄音"
                icon="mic"
                onPress={start}
                busy={recording.busy}
              />
            </View>
          </>
        )}
      </Card>
      {recording.error && (
        <Card
          style={{
            backgroundColor: colors.dangerLight,
            borderColor: colors.dangerLight,
          }}
        >
          <Text style={styles.heading}>
            {recording.error === "permission"
              ? "需要使用麥克風"
              : recording.error === "short"
                ? "錄音時間太短"
                : "暫時無法錄音"}
          </Text>
          <Text style={styles.body}>
            {recording.error === "permission"
              ? "請允許麥克風權限，才能進行發音錄音。"
              : recording.error === "short"
                ? "請再讀一次，錄音至少 1 秒。"
                : "請檢查麥克風，然後再試一次。"}
          </Text>
          {recording.error === "permission" && (
            <Button
              title={Platform.OS === "web" ? "查看權限設定方法" : "開啟設定"}
              secondary
              onPress={() =>
                Platform.OS === "web"
                  ? Linking.openURL(
                      "https://support.google.com/chrome/answer/2693767",
                    )
                  : Linking.openSettings()
              }
            />
          )}
          <Button
            title={recording.error === "permission" ? "返回" : "再試一次"}
            secondary
            onPress={
              recording.error === "permission" ? navigation.goBack : start
            }
          />
        </Card>
      )}
      <Card>
        <Text style={styles.heading}>錄音小貼士</Text>
        {[
          "找一個安靜的地方",
          "將手機放在正常說話距離",
          "清楚讀出畫面上的字",
          "如果錄音不清楚，可以重新錄音",
        ].map((text, i) => (
          <View key={text} style={styles.row}>
            <Text style={{ color: colors.blue, fontWeight: "700" }}>
              0{i + 1}
            </Text>
            <Text style={[styles.small, { flex: 1 }]}>{text}</Text>
          </View>
        ))}
      </Card>
      <Notice>
        錄音只留在本機，離開錄音／分析流程或重新錄音時刪除。不會上傳，也不會用來計算
        demo 分數。
      </Notice>
      {recording.state === "IDLE" && (
        <Button
          title={recording.demo ? "切換至真實麥克風" : "使用模擬錄音示範"}
          disabled={recording.busy}
          secondary
          icon="flask-outline"
          onPress={() => {
            recording.setDemo(!recording.demo);
            recording.clearError();
          }}
        />
      )}
    </Page>
  );
}
