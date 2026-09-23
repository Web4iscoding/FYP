import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { ProgressProvider } from "./src/hooks/useProgress";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ProgressProvider>
        <AppNavigator />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
