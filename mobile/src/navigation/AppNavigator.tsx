import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FlowParams, TabParams } from "./types";
import { FlowContext } from "./FlowContext";
import { Mode } from "../types";
import { colors } from "../theme";
import { Icon, IconName } from "../components/ui";
import { HomeScreen } from "../screens/HomeScreen";
import { CategoryScreen } from "../screens/CategoryScreen";
import { SoundsScreen } from "../screens/SoundsScreen";
import { ItemScreen } from "../screens/ItemScreen";
import { AnalysisScreen } from "../screens/AnalysisScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { CompleteScreen } from "../screens/CompleteScreen";
import { ProgressScreen } from "../screens/ProgressScreen";
const Tab = createBottomTabNavigator<TabParams>();
const Stack = createNativeStackNavigator<FlowParams>();
function Flow({ mode }: { mode: Mode }) {
  return (
    <FlowContext.Provider value={mode}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Sounds" component={SoundsScreen} />
        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Complete" component={CompleteScreen} />
      </Stack.Navigator>
    </FlowContext.Provider>
  );
}
function Assessment() {
  return <Flow mode="assessment" />;
}
function Practice() {
  return <Flow mode="practice" />;
}
const icons: Record<keyof TabParams, IconName> = {
  Home: "home-outline",
  Assessment: "mic-outline",
  Practice: "headset-outline",
  Progress: "bar-chart-outline",
};
export function AppNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.blue,
          background: colors.background,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.blue,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopColor: colors.border,
            height: 76 + insets.bottom,
            paddingTop: 10,
            paddingBottom: 10 + insets.bottom,
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "700", marginTop: 3 },
          tabBarIcon: ({ color }) => (
            <Icon name={icons[route.name]} color={color} size={23} />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "首頁" }}
        />
        <Tab.Screen
          name="Assessment"
          component={Assessment}
          options={{ title: "測試" }}
        />
        <Tab.Screen
          name="Practice"
          component={Practice}
          options={{ title: "練習" }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ title: "進度" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
