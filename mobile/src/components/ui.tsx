import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  color = colors.blue,
  size = 24,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Button({
  title,
  onPress,
  icon,
  secondary,
  disabled,
  busy,
  testID,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
  busy?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: Boolean(disabled || busy), busy }}
      testID={testID}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (disabled || busy) && { opacity: 0.48 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={secondary ? colors.blue : "white"} />
      ) : (
        icon && (
          <Icon
            name={icon}
            size={21}
            color={secondary ? colors.blue : "white"}
          />
        )
      )}
      <Text style={[styles.buttonText, secondary && { color: colors.blue }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Page({
  children,
  title,
  eyebrow,
  subtitle,
  onBack,
}: React.PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  onBack?: () => void;
}>) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 28 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.page}>
        {onBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="返回"
            onPress={onBack}
            style={styles.back}
          >
            <Icon name="arrow-back" size={21} />
            <Text style={styles.small}>返回</Text>
          </Pressable>
        )}
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        {title && (
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
        )}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
      </View>
    </ScrollView>
  );
}
export function Card({
  children,
  style,
}: React.PropsWithChildren<{
  style?: React.ComponentProps<typeof View>["style"];
}>) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function Tag({
  text,
  color = colors.blue,
  background = colors.blueLight,
}: {
  text: string;
  color?: string;
  background?: string;
}) {
  return (
    <View style={[styles.tag, { backgroundColor: background }]}>
      <Text style={{ color, fontSize: 12, fontWeight: "700" }}>{text}</Text>
    </View>
  );
}
export function ProgressBar({
  value,
  color = colors.blue,
}: {
  value: number;
  color?: string;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={styles.track}
    >
      <View
        style={{
          height: "100%",
          width: `${Math.min(1, Math.max(0, value)) * 100}%`,
          backgroundColor: color,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
export function Notice({ children }: React.PropsWithChildren) {
  return (
    <View style={styles.notice}>
      <Icon name="information-circle-outline" size={18} color={colors.muted} />
      <Text style={[styles.small, { flex: 1, lineHeight: 21 }]}>
        {children}
      </Text>
    </View>
  );
}
export function SectionTitle({
  children,
  detail,
}: React.PropsWithChildren<{ detail?: string }>) {
  return (
    <View
      style={[styles.row, { justifyContent: "space-between", marginTop: 8 }]}
    >
      <Text style={styles.heading}>{children}</Text>
      {detail && <Text style={styles.small}>{detail}</Text>}
    </View>
  );
}
export const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 18,
  },
  title: { fontSize: 29, lineHeight: 40, fontWeight: "800", color: colors.ink },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.blue,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 25,
    color: colors.muted,
    marginTop: -8,
  },
  heading: { fontSize: 18, fontWeight: "700", color: colors.ink },
  body: { fontSize: 15, color: colors.ink, lineHeight: 25 },
  small: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  card: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    gap: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  button: {
    minHeight: 56,
    borderRadius: 17,
    paddingHorizontal: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.blue,
  },
  secondary: { backgroundColor: colors.blueLight },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    alignSelf: "flex-start",
  },
  track: {
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  back: {
    minHeight: 44,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: -8,
  },
  notice: {
    flexDirection: "row",
    gap: 9,
    alignItems: "flex-start",
    paddingHorizontal: 2,
  },
});
