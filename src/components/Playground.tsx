import { motion } from "framer-motion";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useLang, type TKey } from "@/lib/i18n";
import { ACCESSORIES, type AccessoryKey } from "./DittoAccessories";
import { Ditto3D } from "./Ditto3D";

const LABELS: Record<AccessoryKey, TKey> = {
  hat: "acc_hat",
  glasses: "acc_glasses",
  scarf: "acc_scarf",
};

export function Playground() {
  const { t } = useLang();
  const [worn, setWorn] = useState<AccessoryKey[]>([]);

  const toggle = (k: AccessoryKey) =>
    setWorn((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const keys: AccessoryKey[] = ["hat", "glasses", "scarf"];

  return (
    <section id="playground" className="mx-auto mt-16 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("playground_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("playground_sub")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="card-doodle relative overflow-hidden p-6">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(var(--ditto-purple) 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative mx-auto h-[460px] w-full max-w-[540px]">
            <Ditto3D accessories={worn} />
          </div>
        </div>

        <aside className="card-doodle-sm flex flex-col gap-3 p-4">
          <h3 className="text-lg font-bold">{t("accessory_box")}</h3>
          <div className="grid grid-cols-1 gap-3">
            {keys.map((k) => {
              const active = worn.includes(k);
              return (
                <motion.button
                  key={k}
                  whileHover={{ y: -3, rotate: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => toggle(k)}
                  className="card-doodle-sm flex items-center gap-3 p-3 text-sm font-semibold"
                  style={{
                    boxShadow: "3px 3px 0 0 var(--color-ink)",
                    background: active ? "var(--ditto-pink, #F4C2D7)" : undefined,
                  }}
                >
                  <span className="flex h-10 w-14 items-center justify-center">
                    {ACCESSORIES[k].render(44)}
                  </span>
                  <span>{t(LABELS[k])}</span>
                </motion.button>
              );
            })}
          </div>
          <button
            onClick={() => setWorn([])}
            className="pill-btn pill-btn-hover mt-2 justify-center text-sm"
          >
            <RotateCcw size={14} /> {t("reset")}
          </button>
          <p className="text-xs text-muted-foreground">
            Click Ditto to squish · Drag to rotate · Tap accessories to wear
          </p>
        </aside>
      </div>
    </section>
  );
}
