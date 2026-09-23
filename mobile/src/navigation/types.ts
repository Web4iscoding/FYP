import { NavigatorScreenParams } from "@react-navigation/native";
import {
  LocalRecording,
  PhonologicalSystem,
  PronunciationResult,
} from "../types";
export type FlowParams = {
  Category: undefined;
  Sounds: { system: PhonologicalSystem };
  Item: { itemId: string };
  Analysis: { itemId: string; recording: LocalRecording };
  Result: { itemId: string; result: PronunciationResult; sessionId: string };
  Complete: { itemId: string; sessionId: string };
};
export type TabParams = {
  Home: undefined;
  Assessment: NavigatorScreenParams<FlowParams>;
  Practice: NavigatorScreenParams<FlowParams>;
  Progress: undefined;
};
