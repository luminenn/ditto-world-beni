import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { RotateCcw } from "lucide-react";
import { useLang, type TKey } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";
import { ACCESSORIES, type AccessoryKey } from "./DittoAccessories";

type Placed = { id: string; type: AccessoryKey; x: number; y: number };

const LABELS: Record<AccessoryKey, TKey> = {
  hat: "acc_hat",
  glasses: "acc_glasses",
  scarf: "acc_scarf",
};

function SquishyDitto() {
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const sx = useMotionValue(1);
  const sy = useMotionValue(1);
  const rot = useMotionValue(0);
  const transform = useTransform(
    [sx, sy, rot],
    ([x, y, r]) => `scale(${x}, ${y}) rotate(${r}deg)`,
  );

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = (e.clientX - start.current.x) / 120;
    const dy = (e.clientY - start.current.y) / 120;
    const stretchX = 1 + Math.max(-0.35, Math.min(0.6, dx));
    const stretchY =
      1 - Math.max(-0.35, Math.min(0.6, dx)) * 0.4 + Math.max(-0.35, Math.min(0.6, dy));
    sx.set(stretchX);
    sy.set(Math.max(0.55, Math.min(1.5, stretchY)));
    rot.set(Math.max(-12, Math.min(12, dx * 8)));
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    animate(sx, 1, { type: "spring", stiffness: 260, damping: 8, mass: 0.9 });
    animate(sy, 1, { type: "spring", stiffness: 260, damping: 8, mass: 0.9 });
    animate(rot, 0, { type: "spring", stiffness: 220, damping: 10 });
  };

  return (
    <motion.div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onClick={() => {
        animate(sx, [1, 1.25, 0.85, 1.08, 1], { duration: 0.7 });
        animate(sy, [1, 0.78, 1.2, 0.95, 1], { duration: 0.7 });
      }}
      className="cursor-grab select-none touch-none active:cursor-grabbing"
      style={{ transform, transformOrigin: "50% 90%", willChange: "transform" }}
    >
      <DittoSVG size={280} />
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
      onDragEnd={(_, info) =>
        onMove(placed.id, placed.x + info.offset.x, placed.y + info.offset.y)
      }
      onDoubleClick={() => onRemove(placed.id)}
      whileTap={{ scale: 1.1 }}
      whileHover={{ scale: 1.05, rotate: -3 }}
      className="absolute z-20 cursor-grab bg-transparent active:cursor-grabbing"
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

  const keys: AccessoryKey[] = ["hat", "glasses", "scarf"];

  return (
    <section id="playground" className="mx-auto mt-16 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("playground_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("playground_sub")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="card-doodle relative overflow-hidden p-6">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(var(--ditto-purple) 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div ref={stageRef} className="relative mx-auto h-[420px] w-full max-w-[500px]">
            <div className="absolute inset-0 flex items-end justify-center pb-4">
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

        <aside className="card-doodle-sm flex flex-col gap-3 p-4">
          <h3 className="text-lg font-bold">{t("accessory_box")}</h3>
          <div className="grid grid-cols-1 gap-3">
            {keys.map((k) => (
              <motion.button
                key={k}
                whileHover={{ y: -3, rotate: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => add(k)}
                className="card-doodle-sm flex items-center gap-3 p-3 text-sm font-semibold"
                style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
              >
                <span className="flex h-10 w-14 items-center justify-center">
                  {ACCESSORIES[k].render(44)}
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
            Drag to move · Double-click to remove
          </p>
        </aside>
      </div>
    </section>
  );
}
