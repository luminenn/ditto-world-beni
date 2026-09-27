import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { useLang, type TKey } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";
import { ACCESSORIES, type AccessoryKey } from "./DittoAccessories";
import { useDittoCustomization, type PlacedAccessory as Placed } from "@/lib/dittoCustomization";
import { DittoJumper } from "./DittoJumper";
import { DittoQuiz } from "./DittoQuiz";

const LABELS: Record<AccessoryKey, TKey> = {
  hat: "acc_hat",
  glasses: "acc_glasses",
  scarf: "acc_scarf",
  lollipop: "acc_lollipop",
  detective: "acc_detective",
  pixelshades: "acc_pixelshades",
  chef: "acc_chef",
  ribbon: "acc_ribbon",
  crown: "acc_crown",
  beanie: "acc_beanie",
  propeller: "acc_propeller",
  pizza: "acc_pizza",
  pokeball: "acc_pokeball",
  bowtie: "acc_bowtie",
  moustache: "acc_moustache",
  bunnyears: "acc_bunnyears",
  catears: "acc_catears",
  monocle: "acc_monocle",
  greenscarf: "acc_greenscarf",
  piratehat: "acc_piratehat",
  astrohelmet: "acc_astrohelmet",
  chocobar: "acc_chocobar",
  sword: "acc_sword",
  rainbowpop: "acc_rainbowpop",
  rubberduck: "acc_rubberduck",
  boba: "acc_boba",
  balloon: "acc_balloon",
  hpglasses: "acc_hpglasses",
  diamondcrown: "acc_diamondcrown",
  shortcake: "acc_shortcake",
};

function SquishyDitto() {
  const controls = useAnimationControls();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rot, setRot] = useState(0);
  const drag = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origRot: number;
    shift: boolean;
    moved: boolean;
  } | null>(null);

  const squish = () => {
    controls.start({
      scaleX: 1.3,
      scaleY: 0.6,
      transition: { type: "spring", stiffness: 300, damping: 10, mass: 0.5 },
    });
  };
  const release = () => {
    controls.start({
      scaleX: [1.15, 0.9, 1.06, 0.98, 1],
      scaleY: [0.88, 1.12, 0.96, 1.02, 1],
      transition: { duration: 0.9, ease: "easeOut" },
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      origRot: rot,
      shift: e.shiftKey,
      moved: false,
    };
    squish();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (!drag.current.moved && Math.hypot(dx, dy) > 4) {
      drag.current.moved = true;
      // cancel squish visual by resetting scale so rotate/translate reads clean
      controls.start({ scaleX: 1, scaleY: 1, transition: { duration: 0.15 } });
    }
    if (!drag.current.moved) return;
    if (drag.current.shift) {
      setPos({ x: drag.current.origX + dx, y: drag.current.origY + dy });
    } else {
      // rotate based on horizontal drag primarily, plus vertical for full spin
      setRot(drag.current.origRot + dx * 0.6 + dy * 0.3);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    if (!drag.current.moved) {
      release();
    } else {
      controls.start({ scaleX: 1, scaleY: 1, transition: { duration: 0.2 } });
    }
    drag.current = null;
  };

  return (
    <motion.div
      animate={{ ...{}, x: pos.x, y: pos.y, rotate: rot }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="pointer-events-auto select-none"
      style={{ willChange: "transform" }}
    >
      <motion.div
        animate={controls}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="cursor-grab active:cursor-grabbing"
        style={{ transformOrigin: "50% 90%", willChange: "transform", touchAction: "none" }}
      >
        <DittoSVG size={300} />
      </motion.div>
    </motion.div>
  );
}

function DraggableAccessory({
  placed,
  bounds,
  onMove,
  onRemove,
}: {
  placed: Placed;
  bounds: React.RefObject<HTMLDivElement | null>;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}) {
  const meta = ACCESSORIES[placed.type];
  const x = useMotionValue(placed.x);
  const y = useMotionValue(placed.y);

  // Keep motion values in sync when state changes from an external source (reset, add, etc.)
  useEffect(() => {
    x.set(placed.x);
    y.set(placed.y);
  }, [placed.x, placed.y, x, y]);

  return (
    <motion.button
      drag
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(event, info) => {
        // Compute drop position relative to the playground bounding rect
        // using the pointer's final client coordinates so the accessory
        // stays exactly where the user released it (no jump / teleport).
        const stage = bounds.current?.getBoundingClientRect();
        let nx = x.get();
        let ny = y.get();
        if (stage) {
          const btn = (event.currentTarget as HTMLElement | null)?.getBoundingClientRect();
          if (btn) {
            nx = btn.left - stage.left;
            ny = btn.top - stage.top;
          } else {
            nx = placed.x + info.offset.x;
            ny = placed.y + info.offset.y;
          }
        }
        x.set(nx);
        y.set(ny);
        onMove(placed.id, nx, ny);
      }}
      onDoubleClick={() => onRemove(placed.id)}
      whileTap={{ scale: 1.08 }}
      whileHover={{ scale: 1.04 }}
      className="absolute left-0 top-0 z-30 cursor-grab bg-transparent active:cursor-grabbing"
      style={{
        x,
        y,
        touchAction: "none",
        filter: "drop-shadow(2px 3px 0 rgba(74,44,91,0.35))",
      }}
      title="Drag freely · Double-click to remove"
    >
      {meta.render(meta.w)}
    </motion.button>
  );
}


export function Playground() {
  const { t } = useLang();
  const stageRef = useRef<HTMLDivElement>(null);
  const { placed, setPlaced } = useDittoCustomization();
  const [stageSize, setStageSize] = useState({ w: 520, h: 440 });

  useEffect(() => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setStageSize({ w: rect.width, h: rect.height });
  }, []);

  const add = (type: AccessoryKey) => {
    // Drop new accessories near the center of the stage so users can drag them freely.
    const w = ACCESSORIES[type].w;
    const x = Math.max(8, stageSize.w / 2 - w / 2);
    const y = Math.max(8, stageSize.h / 2 - w / 2);
    setPlaced((p) => [...p, { id: crypto.randomUUID(), type, x, y }]);
  };
  const move = (id: string, x: number, y: number) =>
    setPlaced((p) => p.map((a) => (a.id === id ? { ...a, x, y } : a)));
  const remove = (id: string) => setPlaced((p) => p.filter((a) => a.id !== id));

  const keys: AccessoryKey[] = [
    "hat", "detective", "chef", "beanie", "crown", "propeller", "piratehat", "astrohelmet", "diamondcrown",
    "glasses", "pixelshades", "hpglasses", "monocle", "moustache", "bunnyears", "catears",
    "ribbon", "bowtie", "scarf", "greenscarf",
    "lollipop", "rainbowpop", "pizza", "chocobar", "shortcake", "boba", "rubberduck",
    "pokeball", "sword", "balloon",
  ];

  return (
    <section id="playground" className="mx-auto mt-16 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("playground_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("playground_sub")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="card-doodle relative overflow-hidden p-6" style={{ background: "linear-gradient(160deg, #4A3D73 0%, #362B58 100%)", color: "#F6EFFF" }}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgba(215,161,249,0.5) 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div ref={stageRef} className="relative mx-auto h-[440px] w-full max-w-[520px]">
            <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center pb-4">
              <SquishyDitto />
            </div>
            {placed.map((a) => (
              <DraggableAccessory
                key={a.id}
                placed={a}
                bounds={stageRef}
                onMove={move}
                onRemove={remove}
              />
            ))}
          </div>
        </div>

        <aside className="card-doodle-sm flex flex-col gap-3 p-4" style={{ background: "rgba(58,42,84,0.9)", backdropFilter: "blur(6px)", color: "#F6EFFF", boxShadow: "4px 4px 0 0 var(--color-ink), 0 0 22px rgba(194,158,227,0.3)" }}>
          <h3 className="text-lg font-bold">{t("accessory_box")}</h3>
          <div
            className="cosmic-scroll grid grid-cols-3 gap-2 overflow-y-auto pr-1"
            style={{ maxHeight: "296px" }}
          >
            {keys.map((k) => (
              <motion.button
                key={k}
                whileHover={{ y: -3, rotate: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => add(k)}
                className="card-doodle-sm flex aspect-square flex-col items-center justify-center gap-1 p-2 text-[10px] font-semibold leading-tight"
                style={{ boxShadow: "3px 3px 0 0 var(--color-ink)", background: "#FFFFFF", color: "var(--ditto-deep)" }}
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden [&>svg]:!h-9 [&>svg]:!w-auto [&>svg]:max-w-9">
                  {ACCESSORIES[k].render(34)}
                </span>
                <span className="text-center">{t(LABELS[k])}</span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setPlaced([])}
            className="pill-btn pill-btn-hover mt-2 justify-center text-sm"
          >
            <RotateCcw size={14} /> {t("reset")}
          </button>
          <p className="text-xs text-muted-foreground">
            Click + drag Ditto to spin · Shift + drag to move · Tap for squish · Drag accessories freely
          </p>
        </aside>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <DittoJumper />
        <DittoQuiz />
      </div>
    </section>
  );
}
