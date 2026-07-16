import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Hand, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useTab } from "@/lib/tabs";
import { DittoSVG } from "./DittoSVG";
import dittoWaving3d from "@/assets/ditto-waving-3d.png";

export function Hero() {
  const { t } = useLang();
  const { setTab } = useTab();
  return (
    <section
      id="top"
      className="mx-auto mt-10 grid w-[min(1100px,94%)] gap-8 md:mt-16 md:grid-cols-2 md:items-center"
    >
      <div className="relative">
        {/* hand-drawn doodles */}
        <motion.span
          aria-hidden
          className="absolute -left-6 -top-4 text-[#FDF0A6]"
          animate={{ rotate: [0, 18, -6, 0], y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          <Star size={22} fill="currentColor" />
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute right-6 top-14 text-[#F3A5FF]"
          animate={{ rotate: [0, -20, 10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles size={20} />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          whileHover={{ rotate: 1, y: -3 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mb-4 inline-block rounded-full border-[3px] border-[var(--color-ink)] px-5 py-2 text-2xl font-bold shadow-[4px_4px_0_0_var(--color-ink)] sm:text-3xl"
          style={{ background: "#2E1547", color: "#FFFFFF" }}
        >
          {t("welcome")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 1.5 }}
          className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[var(--color-ink)] px-3 py-1 text-xs font-bold shadow-[3px_3px_0_0_var(--color-ink)]"
          style={{ background: "#2E1547", color: "#FFFFFF" }}
        >
          <Sparkles size={14} /> {t("tagline")}
        </motion.div>
        <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-[3.25rem]">
          {t("hero_title")}
        </h2>
        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">{t("hero_sub")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ y: -3, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTab("home")}
            className="pill-btn pill-btn-hover"
            style={{ background: "var(--ditto-pink)", color: "#1A122B" }}
          >
            <Hand size={16} /> {t("hero_cta1")}
          </motion.button>
          <motion.button
            whileHover={{ y: -3, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTab("shop")}
            className="pill-btn pill-btn-hover"
            style={{ background: "var(--sky)", color: "#1A122B" }}
          >
            <ShoppingBag size={16} /> {t("hero_cta2")}
          </motion.button>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        {/* Big warm ambient glow behind Ditto */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,200,240,0.55) 0%, rgba(243,165,255,0.35) 30%, rgba(183,140,224,0.18) 55%, transparent 75%)",
            filter: "blur(28px)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 55% 20% at 50% 88%, rgba(215,161,249,0.65) 0%, rgba(183,140,224,0.35) 40%, transparent 75%)",
            filter: "blur(14px)",
          }}
        />

        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <DittoSVG size={340} />
        </motion.div>

        {/* Hand-drawn doodles around Ditto */}
        <motion.span
          className="absolute left-4 top-6 text-[#FDF0A6]"
          animate={{ rotate: [0, 20, -10, 0], y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles size={36} />
        </motion.span>
        <motion.span
          className="absolute right-6 bottom-6 text-[var(--ditto-pink)]"
          animate={{ rotate: [0, -20, 10, 0], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Sparkles size={30} />
        </motion.span>
        <motion.span
          className="absolute right-2 top-16 text-white"
          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Star size={16} fill="currentColor" />
        </motion.span>
        <motion.span
          className="absolute left-10 bottom-16 text-[#F8C8FF]"
          animate={{ rotate: [0, 25, 0], y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          <Star size={14} fill="currentColor" />
        </motion.span>

        {/* Wobbly arrow doodle */}
        <svg
          aria-hidden
          className="absolute -left-2 bottom-2 opacity-70"
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
        >
          <path
            d="M4 30 Q 20 6, 40 20 T 74 14"
            stroke="#FDF0A6"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M68 8 L74 14 L66 20"
            stroke="#FDF0A6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}
