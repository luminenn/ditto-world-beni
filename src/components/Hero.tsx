import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";

export function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="mx-auto mt-10 grid w-[min(1100px,94%)] gap-8 md:mt-16 md:grid-cols-2 md:items-center">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[var(--color-ink)] bg-[var(--butter)] px-3 py-1 text-xs font-bold shadow-[3px_3px_0_0_var(--color-ink)]"
        >
          ✨ Transform · Squish · Play
        </motion.div>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          {t("hero_title")}
        </h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">{t("hero_sub")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#playground" className="pill-btn pill-btn-hover" style={{ background: "var(--ditto-pink)" }}>
            🫧 {t("hero_cta1")}
          </a>
          <a href="#gallery" className="pill-btn pill-btn-hover" style={{ background: "var(--sky)" }}>
            🎨 {t("hero_cta2")}
          </a>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, var(--ditto-pink) 0, transparent 60%)",
          }}
        />
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <DittoSVG size={340} />
        </motion.div>
        <motion.span
          className="absolute left-4 top-6 text-4xl"
          animate={{ rotate: [0, 20, -10, 0], y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute right-6 bottom-6 text-4xl"
          animate={{ rotate: [0, -20, 10, 0], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🌸
        </motion.span>
      </div>
    </section>
  );
}
