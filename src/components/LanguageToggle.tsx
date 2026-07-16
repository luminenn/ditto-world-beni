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
      className="relative flex h-9 items-center gap-2 rounded-md px-3 text-sm font-bold transition-colors"
      style={{
        background: "#EADCF7",
        color: "#2E1547",
        border: "2px solid #1A122B",
        boxShadow: "3px 3px 0 0 #1A122B",
        borderRadius: 6,
      }}
    >
      <span
        className="flex h-6 w-8 items-center justify-center text-[11px] font-extrabold"
        style={{
          background: "#4F357A",
          color: "#FFFFFF",
          border: "2px solid #1A122B",
          borderRadius: 4,
        }}
      >
        {isJa ? "JA" : "EN"}
      </span>
      <span className="tracking-wide">{isJa ? "日本語" : "English"}</span>
    </motion.button>
  );
}
