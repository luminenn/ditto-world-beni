import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Star, X, Mail, Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { useLang } from "@/lib/i18n";

type Card = {
  id: string;
  title: string;
  desc: string;
  price: number;
  available: boolean;
  bg: string;
  ink: string;
  monogram: string;
};

const CARDS: Card[] = [
  {
    id: "pikachu-sunset",
    title: "Pikachu at Sunset",
    desc: "A sleepy Pikachu on a warm orange sky. Drawn with soft pastel pencils.",
    price: 18,
    available: true,
    bg: "linear-gradient(160deg, #FFD9A8 0%, #F4A6C0 100%)",
    ink: "#7A3A5B",
    monogram: "P",
  },
  {
    id: "charmander-ember",
    title: "Charmander & Ember",
    desc: "A tiny fire lizard toasting a marshmallow. Little embers dance around.",
    price: 22,
    available: true,
    bg: "linear-gradient(160deg, #FFCBB3 0%, #FF9C7A 100%)",
    ink: "#7A2E1B",
    monogram: "C",
  },
  {
    id: "bulbasaur-garden",
    title: "Bulbasaur in the Garden",
    desc: "A tiny Bulbasaur napping in a moss patch, tulips growing from the bulb.",
    price: 20,
    available: false,
    bg: "linear-gradient(160deg, #D6F0C9 0%, #A9D8B0 100%)",
    ink: "#2E5B3A",
    monogram: "B",
  },
  {
    id: "squirtle-rain",
    title: "Squirtle on a Rainy Day",
    desc: "Squirtle sharing an umbrella with Ditto. Puddles are little mirrors.",
    price: 22,
    available: true,
    bg: "linear-gradient(160deg, #CDE4F5 0%, #99C6E8 100%)",
    ink: "#1E3E63",
    monogram: "S",
  },
  {
    id: "eevee-dreams",
    title: "Eevee's Cozy Dreams",
    desc: "Eevee curled up on a cloud bed with a starry blanket.",
    price: 25,
    available: true,
    bg: "linear-gradient(160deg, #F3DFC7 0%, #D8B37A 100%)",
    ink: "#5B3B1E",
    monogram: "E",
  },
  {
    id: "ditto-selfie",
    title: "Ditto Selfie",
    desc: "The mascot of the shop. A blobby Ditto flashing a peace sign.",
    price: 30,
    available: false,
    bg: "linear-gradient(160deg, #FBD3E4 0%, #EC7CD2 100%)",
    ink: "#4A2C5B",
    monogram: "D",
  },
];

const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(1000),
});

function CardArt({ card }: { card: Card }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: card.bg }}
    >
      {/* dotted texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(${card.ink} 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
        }}
      />
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border-[3px] font-bold sm:h-28 sm:w-28"
        style={{
          borderColor: card.ink,
          color: card.ink,
          fontSize: "3rem",
          background: "rgba(255,255,255,0.55)",
          boxShadow: `3px 3px 0 0 ${card.ink}`,
        }}
      >
        {card.monogram}
      </div>
      <span
        className="absolute bottom-3 right-3 text-[10px] font-bold tracking-widest"
        style={{ color: card.ink }}
      >
        BENI · ORIGINAL
      </span>
    </div>
  );
}

function FloatingStars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => {
        const dx = (Math.random() - 0.5) * 260;
        const delay = i * 55;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 text-[var(--ditto-pink)]"
            style={{
              animation: "heart-float 1.4s ease-out forwards",
              animationDelay: `${delay}ms`,
              // @ts-expect-error CSS var
              "--dx": `calc(-50% + ${dx}px)`,
            }}
          >
            <Star size={20} fill="currentColor" />
          </span>
        );
      })}
    </div>
  );
}

function OrderModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const { t, ts } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    // Simulated send — no backend wired yet.
    setTimeout(() => setState("done"), 900);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card-doodle relative w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.85, y: 30, rotate: -1 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-[var(--color-ink)] bg-white shadow-[2px_2px_0_0_var(--color-ink)]"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="relative aspect-[5/3]">
          <CardArt card={card} />
          {state === "done" && <FloatingStars />}
        </div>

        <div className="border-t-[3px] border-[var(--color-ink)] p-5">
          {state === "done" ? (
            <div className="py-4 text-center">
              <h3 className="text-2xl font-bold">{t("thanks_title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("thanks_sub")}</p>
              <button
                onClick={onClose}
                className="pill-btn pill-btn-hover mx-auto mt-5 text-sm"
                style={{ background: "var(--ditto-pink)", color: "white" }}
              >
                {t("close")}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold leading-tight">{card.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{card.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-bold">${card.price}</div>
                  <span
                    className="mt-1 inline-block rounded-full border-[2px] border-[var(--color-ink)] px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: card.available ? "var(--mint)" : "var(--butter)",
                    }}
                  >
                    {card.available ? t("available") : t("sold_out")}
                  </span>
                </div>
              </div>

              <p className="mb-3 text-sm font-semibold">{t("order_title")}</p>
              <p className="mb-4 text-xs text-muted-foreground">{t("order_sub")}</p>

              <form onSubmit={onSubmit} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold">{t("name")}</span>
                  <input
                    name="name"
                    maxLength={80}
                    placeholder={ts("name_ph")}
                    className="w-full rounded-xl border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none focus:shadow-[3px_3px_0_0_var(--color-ink)]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold">{t("email")}</span>
                  <input
                    name="email"
                    type="email"
                    maxLength={200}
                    placeholder={ts("email_ph")}
                    className="w-full rounded-xl border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none focus:shadow-[3px_3px_0_0_var(--color-ink)]"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold">{t("message")}</span>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder={ts("message_ph")}
                    className="w-full rounded-xl border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none focus:shadow-[3px_3px_0_0_var(--color-ink)]"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </label>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="pill-btn pill-btn-hover w-full justify-center text-sm disabled:opacity-70"
                  style={{ background: "var(--ditto-pink)", color: "white" }}
                >
                  {state === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send size={16} /> {t("send")}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Shop() {
  const { t } = useLang();
  const [open, setOpen] = useState<Card | null>(null);

  return (
    <section id="shop" className="mx-auto mt-20 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("shop_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("shop_sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <motion.button
            key={c.id}
            onClick={() => setOpen(c)}
            whileHover={{ y: -5, rotate: i % 2 ? 1 : -1 }}
            whileTap={{ scale: 0.98 }}
            className="card-doodle group relative flex flex-col overflow-hidden p-0 text-left"
          >
            <div className="aspect-[4/5] w-full">
              <CardArt card={c} />
            </div>
            <div className="flex flex-1 flex-col gap-2 border-t-[3px] border-[var(--color-ink)] bg-[var(--cream)] p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold leading-tight">{c.title}</h3>
                <span
                  className="shrink-0 rounded-full border-[2px] border-[var(--color-ink)] px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: c.available ? "var(--mint)" : "var(--butter)" }}
                >
                  {c.available ? t("available") : t("sold_out")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-bold">${c.price}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ditto-deep)]">
                  <Mail size={12} /> {t("inquire")}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && <OrderModal card={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
