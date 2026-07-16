import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useTab, type Tab } from "@/lib/tabs";
import { DittoSVG } from "./DittoSVG";
import { LanguageToggle } from "./LanguageToggle";

export function NavBar() {
  const { t } = useLang();
  const { tab, setTab } = useTab();
  const tabs: { key: Tab; label: "brand" | "nav_shop" | "nav_study" }[] = [
    { key: "home", label: "brand" },
    { key: "shop", label: "nav_shop" },
    { key: "study", label: "nav_study" },
  ];
  return (
    <header className="sticky top-4 z-40 mx-auto mt-4 flex w-[min(1100px,94%)] flex-wrap items-center justify-between gap-3 rounded-[2rem] border-[3px] border-[var(--color-ink)] bg-[var(--cream)]/95 px-4 py-2 shadow-[5px_5px_0_0_var(--color-ink)] backdrop-blur">
      <button onClick={() => setTab("home")} className="flex items-center gap-2">
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <DittoSVG size={44} />
        </motion.span>
        <span className="text-lg font-bold">{t("brand")}</span>
      </button>
      <nav className="flex flex-1 flex-wrap justify-center gap-2">
        {tabs.map((tb) => {
          const active = tab === tb.key;
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className="pill-btn pill-btn-hover text-sm transition-colors"
              style={{
                background: active ? "var(--ditto-pink)" : "var(--cream)",
                color: active ? "white" : "var(--color-ink)",
              }}
            >
              {t(tb.label)}
            </button>
          );
        })}
      </nav>
      <LanguageToggle />
    </header>
  );
}
