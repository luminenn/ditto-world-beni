import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const isJa = lang === "ja";
  return (
    <motion.button
      onClick={() => setLang(isJa ? "en" : "ja")}
      whileHover={{ y: -2, rotate: -1.5 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Toggle language"
      className="relative flex h-9 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors"
      style={{
        background: "#EADCF7",
        color: "#2E1547",
        border: "2px solid #1A122B",
        boxShadow: "3px 3px 0 0 #1A122B",
      }}
    >
      <span
        className="flex h-6 w-8 items-center justify-center rounded-sm text-[11px] font-extrabold"
        style={{
          background: "#F3A5FF",
          color: "#2E1547",
          border: "2px solid #1A122B",
        }}
      >
        {isJa ? "JA" : "EN"}
      </span>
      <span className="tracking-wide">{isJa ? "日本語" : "English"}</span>
    </motion.button>
  );
}
