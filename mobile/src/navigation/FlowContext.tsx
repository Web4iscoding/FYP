import { createContext, useContext } from "react";
import { Mode } from "../types";
export const FlowContext = createContext<Mode>("assessment");
export const useMode = () => useContext(FlowContext);
