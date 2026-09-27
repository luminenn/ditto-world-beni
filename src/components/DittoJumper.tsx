import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import { DittoSVG } from "./DittoSVG";
import { ACCESSORIES } from "./DittoAccessories";
import { useDittoCustomization, STAGE_W, STAGE_H } from "@/lib/dittoCustomization";

const AREA_H = 360;
const DITTO_SIZE = 52;
const DITTO_X_RATIO = 0.26; // fixed horizontal position, as a fraction of area width
const GRAVITY = 1500; // px/s^2
const FLAP_VELOCITY = -430; // px/s
const MAX_FALL_SPEED = 620;
const PIPE_WIDTH = 54;
const GAP_HEIGHT = 158;
const PIPE_SPEED = 170; // px/s
const SPAWN_DISTANCE = 260; // px between pipe spawns
const BEST_KEY = "dittoland_jumper_best_v1";

// The sandbox stage renders Ditto at size 300 within a 520x440 box, bottom-aligned with 16px padding.
const SANDBOX_DITTO_SIZE = 300;
const SANDBOX_DITTO_LEFT = (STAGE_W - SANDBOX_DITTO_SIZE) / 2;
const SANDBOX_DITTO_TOP = STAGE_H - SANDBOX_DITTO_SIZE - 16;

type Pipe = { id: number; x: number; gapY: number; passed: boolean };
type GameState = "ready" | "playing" | "over";

function MiniCustomDitto({ size }: { size: number }) {
  const { placed } = useDittoCustomization();
  const scale = size / SANDBOX_DITTO_SIZE;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <DittoSVG size={size} />
      {placed.map((a) => {
        const meta = ACCESSORIES[a.type];
        const left = (a.x - SANDBOX_DITTO_LEFT) * scale;
        const top = (a.y - SANDBOX_DITTO_TOP) * scale;
        return (
          <div key={a.id} className="absolute left-0 top-0" style={{ transform: `translate(${left}px, ${top}px)` }}>
            {meta.render(meta.w * scale)}
          </div>
        );
      })}
    </div>
  );
}

export function DittoJumper() {
  const [state, setState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [dittoY, setDittoY] = useState(AREA_H / 2 - DITTO_SIZE / 2);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [areaW, setAreaW] = useState(340);

  const areaRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const dittoYRef = useRef(dittoY);
  const scoreRef = useRef(0);
  const lastSpawnXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const nextPipeId = useRef(0);
  const stateRef = useRef<GameState>("ready");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const stored = Number(localStorage.getItem(BEST_KEY) ?? 0);
    if (!Number.isNaN(stored)) setBest(stored);
  }, []);

  useEffect(() => {
    if (!areaRef.current) return;
    const update = () => setAreaW(areaRef.current?.getBoundingClientRect().width ?? 340);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(areaRef.current);
    return () => ro.disconnect();
  }, []);

  const dittoX = areaW * DITTO_X_RATIO;

  const endGame = useCallback((finalScore: number) => {
    setState("over");
    setBest((prevBest) => {
      const next = Math.max(prevBest, finalScore);
      localStorage.setItem(BEST_KEY, String(next));
      return next;
    });
  }, []);

  const flap = useCallback(() => {
    if (stateRef.current === "ready") {
      velocityRef.current = FLAP_VELOCITY;
      dittoYRef.current = AREA_H / 2 - DITTO_SIZE / 2;
      lastSpawnXRef.current = 0;
      nextPipeId.current = 0;
      scoreRef.current = 0;
      setPipes([]);
      setScore(0);
      setState("playing");
    } else if (stateRef.current === "playing") {
      velocityRef.current = FLAP_VELOCITY;
    }
  }, []);

  const restart = useCallback(() => {
    setState("ready");
    setDittoY(AREA_H / 2 - DITTO_SIZE / 2);
    dittoYRef.current = AREA_H / 2 - DITTO_SIZE / 2;
    velocityRef.current = 0;
    scoreRef.current = 0;
    setPipes([]);
    setScore(0);
  }, []);

  useEffect(() => {
    if (state !== "playing") {
      lastTsRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;

      velocityRef.current = Math.min(velocityRef.current + GRAVITY * dt, MAX_FALL_SPEED);
      dittoYRef.current += velocityRef.current * dt;

      let collided = false;
      if (dittoYRef.current <= 0) {
        dittoYRef.current = 0;
        collided = true;
      }
      if (dittoYRef.current + DITTO_SIZE >= AREA_H) {
        dittoYRef.current = AREA_H - DITTO_SIZE;
        collided = true;
      }

      setDittoY(dittoYRef.current);

      setPipes((prev) => {
        let scoredThisFrame = 0;
        const next = prev
          .map((p) => ({ ...p, x: p.x - PIPE_SPEED * dt }))
          .filter((p) => p.x + PIPE_WIDTH > -10);

        for (const p of next) {
          const overlapsX = dittoX + DITTO_SIZE > p.x + 6 && dittoX + 6 < p.x + PIPE_WIDTH;
          if (overlapsX) {
            const hitsTop = dittoYRef.current < p.gapY;
            const hitsBottom = dittoYRef.current + DITTO_SIZE > p.gapY + GAP_HEIGHT;
            if (hitsTop || hitsBottom) collided = true;
          }
          if (!p.passed && p.x + PIPE_WIDTH < dittoX) {
            p.passed = true;
            scoredThisFrame += 1;
          }
        }

        const last = next[next.length - 1];
        if (!last || last.x < areaW - SPAWN_DISTANCE) {
          const margin = 40;
          const gapY = margin + Math.random() * (AREA_H - GAP_HEIGHT - margin * 2);
          next.push({ id: nextPipeId.current++, x: areaW + PIPE_WIDTH, gapY, passed: false });
        }

        if (scoredThisFrame > 0) {
          scoreRef.current += scoredThisFrame;
          setScore(scoreRef.current);
        }
        return next;
      });

      if (collided) {
        endGame(scoreRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, areaW, dittoX, endGame]);

  const onInteract = () => {
    if (state === "over") return;
    flap();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state === "over") restart();
        else flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, flap, restart]);

  return (
    <div className="card-doodle p-5" style={{ background: "var(--cream)" }}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: "#1A122B" }}>
          Ditto Sky Jump
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#6B5A85" }}>
          <Trophy size={13} /> Best: {best}
        </div>
      </div>
      <p className="mb-3 text-xs" style={{ color: "#6B5A85" }}>
        Click, tap, or press Space to flap and dodge the pipes. Your Ditto keeps whatever accessories you've equipped above!
      </p>

      <div
        ref={areaRef}
        onClick={onInteract}
        onTouchStart={(e) => {
          e.preventDefault();
          onInteract();
        }}
        className="relative w-full cursor-pointer select-none overflow-hidden rounded-md border-[2.5px]"
        style={{ height: AREA_H, borderColor: "#1A122B", background: "linear-gradient(180deg, #DCEBFF 0%, #F3E9FF 100%)" }}
      >
        {pipes.map((p) => (
          <div key={p.id}>
            <div
              className="absolute rounded-b-sm border-[2.5px] border-t-0"
              style={{
                left: p.x,
                top: 0,
                width: PIPE_WIDTH,
                height: p.gapY,
                background: "var(--mint)",
                borderColor: "#1A122B",
              }}
            />
            <div
              className="absolute rounded-t-sm border-[2.5px] border-b-0"
              style={{
                left: p.x,
                top: p.gapY + GAP_HEIGHT,
                width: PIPE_WIDTH,
                height: AREA_H - (p.gapY + GAP_HEIGHT),
                background: "var(--mint)",
                borderColor: "#1A122B",
              }}
            />
          </div>
        ))}

        <div
          className="absolute"
          style={{ left: dittoX, top: dittoY, transform: `rotate(${Math.min(Math.max(velocityRef.current / 14, -25), 70)}deg)` }}
        >
          <MiniCustomDitto size={DITTO_SIZE} />
        </div>

        <div className="absolute left-3 top-2 rounded-full border-[2px] border-[#1A122B] bg-white/85 px-2.5 py-0.5 text-sm font-extrabold" style={{ color: "#1A122B" }}>
          {score}
        </div>

        {state !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1A122B]/35 text-center">
            <div className="rounded-md border-[2.5px] border-[#1A122B] bg-white px-4 py-3 shadow-[3px_3px_0_0_#1A122B]">
              {state === "ready" ? (
                <>
                  <p className="text-sm font-bold" style={{ color: "#1A122B" }}>
                    Tap to start!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold" style={{ color: "#1A122B" }}>
                    Game over — score {score}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      restart();
                    }}
                    className="pill-btn pill-btn-hover mt-2 text-xs"
                    style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
