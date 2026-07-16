import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Hand } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useTab } from "@/lib/tabs";
import { DittoSVG } from "./DittoSVG";

export function Hero() {
  const { t } = useLang();
  const { setTab } = useTab();
  return (
    <section
      id="top"
      className="mx-auto mt-10 grid w-[min(1100px,94%)] gap-8 md:mt-16 md:grid-cols-2 md:items-center"
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mb-4 inline-block rounded-full border-[3px] border-[var(--color-ink)] px-5 py-2 text-2xl font-bold text-white shadow-[4px_4px_0_0_var(--color-ink)] sm:text-3xl"
          style={{ background: "#2E1547", color: "#FFFFFF" }}
        >
          {t("welcome")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[var(--color-ink)] bg-[var(--butter)] px-3 py-1 text-xs font-bold shadow-[3px_3px_0_0_var(--color-ink)]"
        >
          <Sparkles size={14} /> {t("tagline")}
        </motion.div>
        <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-[3.25rem]">
          {t("hero_title")}
        </h2>
        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">{t("hero_sub")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setTab("home")}
            className="pill-btn pill-btn-hover"
            style={{ background: "var(--ditto-pink)", color: "white" }}
          >
            <Hand size={16} /> {t("hero_cta1")}
          </button>
          <button
            onClick={() => setTab("shop")}
            className="pill-btn pill-btn-hover"
            style={{ background: "var(--sky)" }}
          >
            <ShoppingBag size={16} /> {t("hero_cta2")}
          </button>
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
          className="absolute left-4 top-6 text-[var(--ditto-deep)]"
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
      </div>
    </section>
  );
}
