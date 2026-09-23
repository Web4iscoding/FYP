export const colors = {
  background: "#F7F8FA",
  surface: "#FFFFFF",
  ink: "#182D46",
  muted: "#657487",
  blue: "#3767DA",
  blueLight: "#EAF0FF",
  mint: "#DDF3EB",
  green: "#287965",
  yellow: "#F4C661",
  yellowLight: "#FFF3D5",
  coral: "#EA927C",
  border: "#E6EAF0",
  danger: "#B94347",
  dangerLight: "#FFF0F0",
  purple: "#8E70BB",
  purpleLight: "#F0EAF8",
};
export const systemStyle = {
  輔音: {
    color: colors.blue,
    background: colors.blueLight,
    icon: "chatbubble-ellipses-outline" as const,
  },
  母音: {
    color: colors.green,
    background: colors.mint,
    icon: "musical-notes-outline" as const,
  },
  聲調: {
    color: colors.purple,
    background: colors.purpleLight,
    icon: "pulse-outline" as const,
  },
};
export const appName = "粵語小聲音";
export const disclaimer =
  "本應用只作初步發音評估及練習用途，不能取代專業言語治療或臨床評估。";
