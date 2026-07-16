import { createContext, useContext, useState, type ReactNode } from "react";

export type Tab = "home" | "shop" | "study";

const TabCtx = createContext<{ tab: Tab; setTab: (t: Tab) => void }>({
  tab: "home",
  setTab: () => {},
});

export function TabProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<Tab>("home");
  const setTab = (t: Tab) => {
    setTabState(t);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <TabCtx.Provider value={{ tab, setTab }}>{children}</TabCtx.Provider>;
}

export const useTab = () => useContext(TabCtx);
