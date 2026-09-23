import React, { createContext, useContext, useState } from "react";
import { Activity, Mode, PronunciationItem } from "../types";
const initial: Activity[] = [
  {
    id: "seed-1",
    character: "八",
    system: "輔音",
    mode: "practice",
    time: "示範 · 今天",
  },
  {
    id: "seed-2",
    character: "三",
    system: "聲調",
    mode: "practice",
    time: "示範 · 昨天",
  },
];
const Context = createContext<{
  activities: Activity[];
  count: number;
  add: (item: PronunciationItem, mode: Mode, sessionId: string) => void;
}>({ activities: initial, count: 0, add: () => {} });
export function ProgressProvider({ children }: React.PropsWithChildren) {
  const [sessions, setSessions] = useState<Activity[]>([]);
  const add = (item: PronunciationItem, mode: Mode, sessionId: string) =>
    setSessions((previous) =>
      previous.some((x) => x.id === sessionId)
        ? previous
        : [
            {
              id: sessionId,
              character: item.character,
              system: item.phonologicalSystem,
              mode,
              time: "本次使用 · 剛剛",
            },
            ...previous,
          ],
    );
  return (
    <Context.Provider
      value={{
        activities: [...sessions, ...initial],
        count: sessions.length,
        add,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useProgress = () => useContext(Context);
