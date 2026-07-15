import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLang, type TKey } from "@/lib/i18n";

type Scene = { id: string; titleKey: TKey; bg: string; emoji: string; extra?: string };

const SCENES: Scene[] = [
  { id: "a", titleKey: "scene_a", bg: "#FBD8E7", emoji: "🫖", extra: "💤" },
  { id: "b", titleKey: "scene_b", bg: "#E2D3F7", emoji: "🐱" },
  { id: "c", titleKey: "scene_c", bg: "#FDE7C4", emoji: "🍜" },
  { id: "d", titleKey: "scene_d", bg: "#C9E4F5", emoji: "☔️" },
  { id: "e", titleKey: "scene_e", bg: "#2D2A4E", emoji: "✨", extra: "🌙" },
  { id: "f", titleKey: "scene_f", bg: "#FFF2D6", emoji: "🍡" },
];

function Hearts({ trigger }: { trigger: number }) {
  if (!trigger) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => {
        const dx = (Math.random() - 0.5) * 200;
        return (
          <span
            key={`${trigger}-${i}`}
            className="absolute left-1/2 top-1/2 text-2xl"
            style={{
              animation: `heart-float 1s ease-out forwards`,
              animationDelay: `${i * 40}ms`,
              // @ts-expect-error CSS var
              "--dx": `calc(-50% + ${dx}px)`,
            }}
          >
            {i % 2 ? "💖" : "⭐️"}
          </span>
        );
      })}
    </div>
  );
}

export function Gallery() {
  const { t } = useLang();
  const [open, setOpen] = useState<Scene | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [burst, setBurst] = useState(0);

  const like = (id: string) => {
    setLikes((l) => ({ ...l, [id]: (l[id] ?? 0) + 1 }));
    setBurst(Date.now());
  };

  return (
    <section id="gallery" className="mx-auto mt-20 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("gallery_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("gallery_sub")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SCENES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => setOpen(s)}
            whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
            whileTap={{ scale: 0.97 }}
            className="card-doodle group relative aspect-square overflow-hidden p-0"
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: s.bg }}
            >
              <div className="relative flex flex-col items-center">
                <span className="text-6xl">🟣</span>
                <span className="absolute -right-4 -top-2 text-4xl">{s.emoji}</span>
                {s.extra && <span className="absolute -left-4 top-0 text-3xl">{s.extra}</span>}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t-[3px] border-[var(--color-ink)] bg-[var(--cream)] px-3 py-2 text-left text-sm font-semibold">
              {t(s.titleKey)}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="card-doodle relative w-full max-w-md overflow-hidden"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative flex aspect-[4/3] items-center justify-center"
                style={{ background: open.bg }}
              >
                <div className="relative flex flex-col items-center">
                  <span className="text-[7rem] leading-none">🟣</span>
                  <span className="absolute -right-8 -top-4 text-6xl">{open.emoji}</span>
                  {open.extra && <span className="absolute -left-8 top-2 text-5xl">{open.extra}</span>}
                </div>
                <Hearts trigger={burst} />
              </div>
              <div className="flex items-center justify-between gap-3 border-t-[3px] border-[var(--color-ink)] p-4">
                <div>
                  <div className="text-lg font-bold">{t(open.titleKey)}</div>
                  <div className="text-xs text-muted-foreground">
                    💖 {likes[open.id] ?? 0}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => like(open.id)} className="pill-btn pill-btn-hover text-sm" style={{ background: "var(--ditto-pink)" }}>
                    💖 {t("like")}
                  </button>
                  <button onClick={() => setOpen(null)} className="pill-btn pill-btn-hover text-sm">
                    {t("close")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
