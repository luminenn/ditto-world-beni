import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useTab, type Tab } from "@/lib/tabs";
import { DittoSVG } from "./DittoSVG";
import { LanguageToggle } from "./LanguageToggle";

export function NavBar() {
  const { t } = useLang();
  const { tab, setTab } = useTab();
  const tabs: { key: Tab; label: "nav_playground" | "nav_shop" | "nav_study" }[] = [
    { key: "home", label: "nav_playground" },
    { key: "shop", label: "nav_shop" },
    { key: "study", label: "nav_study" },
  ];
  return (
    <header
      className="sticky top-4 z-40 mx-auto mt-4 flex w-[min(1100px,94%)] flex-wrap items-center justify-between gap-3 rounded-md border-[3px] border-[var(--color-ink)] px-4 py-2 backdrop-blur"
      style={{
        background: "rgba(46, 21, 71, 0.85)",
        boxShadow: "5px 5px 0 0 var(--color-ink), 0 0 24px rgba(243,165,255,0.25)",
      }}
    >
      <button
        onClick={() => setTab("home")}
        className="flex items-center gap-2 border-[2px] border-[var(--color-ink)] px-3 py-1"
        style={{
          background: "#EADCF7",
          color: "#2E1547",
          boxShadow: "3px 3px 0 0 var(--color-ink)",
          borderRadius: 6,
        }}
      >
        <motion.span
          animate={{ y: [0, -4, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <DittoSVG size={36} />
        </motion.span>
        <span className="text-base font-bold">{t("brand")}</span>
      </button>
      <nav className="flex flex-1 flex-wrap justify-center gap-2">
        {tabs.map((tb, i) => {
          const active = tab === tb.key;
          return (
            <motion.button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              whileHover={{ y: -2, rotate: i % 2 ? 1.5 : -1.5 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-md px-4 py-2 text-sm font-bold transition-colors"
              style={{
                background: active ? "#4F357A" : "#EADCF7",
                color: active ? "#FFFFFF" : "#2E1547",
                border: `2px solid #1A122B`,
                boxShadow: active
                  ? "4px 4px 0 0 #1A122B"
                  : "3px 3px 0 0 #1A122B",
              }}
            >
              {t(tb.label)}
            </motion.button>
          );
        })}
      </nav>
      <LanguageToggle />
    </header>
  );
}
