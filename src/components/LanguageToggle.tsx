import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const isJa = lang === "ja";
  return (
    <button
      onClick={() => setLang(isJa ? "en" : "ja")}
      className="relative flex h-11 w-24 items-center rounded-full border-[2.5px] border-[var(--color-ink)] bg-card px-1 shadow-[3px_3px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
      aria-label="Toggle language"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="absolute top-1 flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-[var(--color-ink)] bg-[var(--ditto-pink)] text-[11px] font-bold text-white"
        style={{ left: isJa ? "calc(100% - 2.25rem)" : "0.25rem" }}
      >
        {isJa ? "JA" : "EN"}
      </motion.span>
      <span className="ml-10 text-xs font-semibold tracking-wide">
        {isJa ? "日本語" : "EN"}
      </span>
    </button>
  );
}
