import { createContext, useContext, useState, type ReactNode } from "react";
import type { AccessoryKey } from "@/components/DittoAccessories";

export type PlacedAccessory = { id: string; type: AccessoryKey; x: number; y: number };

/** The sandbox stage is a fixed 520x440 box — positions below are relative to that. */
export const STAGE_W = 520;
export const STAGE_H = 440;

type Ctx = {
  placed: PlacedAccessory[];
  setPlaced: React.Dispatch<React.SetStateAction<PlacedAccessory[]>>;
};

const DittoCustomizationCtx = createContext<Ctx>({
  placed: [],
  setPlaced: () => {},
});

export function DittoCustomizationProvider({ children }: { children: ReactNode }) {
  const [placed, setPlaced] = useState<PlacedAccessory[]>([]);
  return <DittoCustomizationCtx.Provider value={{ placed, setPlaced }}>{children}</DittoCustomizationCtx.Provider>;
}

export const useDittoCustomization = () => useContext(DittoCustomizationCtx);
