import { motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useLang, type TKey } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";
import { ACCESSORIES, type AccessoryKey } from "./DittoAccessories";

type Placed = { id: string; type: AccessoryKey; x: number; y: number };

const LABELS: Record<AccessoryKey, TKey> = {
  hat: "acc_hat",
  glasses: "acc_glasses",
  scarf: "acc_scarf",
  lollipop: "acc_lollipop",
};

function SquishyDitto() {
  const controls = useAnimationControls();
  const [pressed, setPressed] = useState(false);

  const squish = () => {
    setPressed(true);
    controls.start({
      scaleX: 1.3,
      scaleY: 0.6,
      transition: { type: "spring", stiffness: 300, damping: 10, mass: 0.5 },
    });
  };
  const release = () => {
    setPressed(false);
    controls.start({
      scaleX: [1.15, 0.9, 1.06, 0.98, 1],
      scaleY: [0.88, 1.12, 0.96, 1.02, 1],
      transition: { duration: 0.9, ease: "easeOut" },
    });
  };

  return (
    <motion.div
      animate={controls}
      whileHover={pressed ? undefined : { scale: 1.04, y: -6 }}
      onPointerDown={squish}
      onPointerUp={release}
      onPointerLeave={() => pressed && release()}
      className="pointer-events-auto cursor-grab select-none active:cursor-grabbing"
      style={{ transformOrigin: "50% 90%", willChange: "transform" }}
    >
      <DittoSVG size={300} />
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
  return (
    <motion.button
      drag
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0.15}
      onDragEnd={(_, info) =>
        onMove(placed.id, placed.x + info.offset.x, placed.y + info.offset.y)
      }
      onDoubleClick={() => onRemove(placed.id)}
      whileTap={{ scale: 1.1 }}
      whileHover={{ scale: 1.06, rotate: -3 }}
      className="absolute z-30 cursor-grab bg-transparent active:cursor-grabbing"
      style={{
        left: placed.x,
        top: placed.y,
        filter: "drop-shadow(2px 3px 0 rgba(74,44,91,0.35))",
      }}
      title="Drag to move · Double-click to remove"
    >
      {meta.render(meta.w)}
    </motion.button>
  );
}

export function Playground() {
  const { t } = useLang();
  const stageRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);

  const add = (type: AccessoryKey) => {
    const pos = ACCESSORIES[type].defaultPos;
    setPlaced((p) => [...p, { id: crypto.randomUUID(), type, x: pos.x, y: pos.y }]);
  };
  const move = (id: string, x: number, y: number) =>
    setPlaced((p) => p.map((a) => (a.id === id ? { ...a, x, y } : a)));
  const remove = (id: string) => setPlaced((p) => p.filter((a) => a.id !== id));

  const keys: AccessoryKey[] = ["hat", "glasses", "scarf", "lollipop"];

  return (
    <section id="playground" className="mx-auto mt-16 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("playground_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("playground_sub")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="card-doodle relative overflow-hidden p-6" style={{ background: "linear-gradient(160deg, #2A1740 0%, #1C0F30 100%)", color: "#F4EFFF" }}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgba(215,161,249,0.55) 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div ref={stageRef} className="relative mx-auto h-[440px] w-full max-w-[520px]">
            <div className="absolute inset-0 z-10 flex items-end justify-center pb-4">
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

        <aside className="card-doodle-sm flex flex-col gap-3 p-4" style={{ background: "rgba(46,26,64,0.75)", backdropFilter: "blur(6px)", color: "#F4EFFF", boxShadow: "4px 4px 0 0 var(--color-ink), 0 0 22px rgba(215,161,249,0.35)", borderColor: "#D7A1F9" }}>
          <h3 className="text-lg font-bold">{t("accessory_box")}</h3>
          <div className="grid grid-cols-1 gap-3">
            {keys.map((k) => (
              <motion.button
                key={k}
                whileHover={{ y: -3, rotate: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => add(k)}
                className="card-doodle-sm flex items-center gap-3 p-3 text-sm font-semibold"
                style={{ boxShadow: "3px 3px 0 0 var(--color-ink)", background: "#3A2554", color: "#F4EFFF", borderColor: "#D7A1F9" }}

              >
                <span className="flex h-10 w-14 items-center justify-center">
                  {ACCESSORIES[k].render(40)}
                </span>
                <span>{t(LABELS[k])}</span>
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
            Click Ditto to squish · Drag accessories onto him · Double-click to remove
          </p>
        </aside>
      </div>
    </section>
  );
}
