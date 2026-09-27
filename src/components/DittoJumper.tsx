import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import { DittoSVG } from "./DittoSVG";
import { ACCESSORIES } from "./DittoAccessories";
import { useDittoCustomization, STAGE_W, STAGE_H } from "@/lib/dittoCustomization";

const AREA_H = 220;
const GROUND_MARGIN = 14; // height of the ground strip
const GROUND_Y = AREA_H - GROUND_MARGIN; // y where Ditto's feet / spike bases sit
const DITTO_SIZE = 46;
const DITTO_X_RATIO = 0.2; // fixed horizontal position, as a fraction of area width
const GRAVITY = 2200; // px/s^2
const JUMP_VELOCITY = -620; // px/s, single jump impulse (grounded-only, no mid-air re-jump)
const MAX_FALL_SPEED = 900;
const SPIKE_W = 30;
const SPIKE_H = 44;
const BASE_SPEED = 230; // px/s
const SPEED_PER_POINT = 5; // difficulty ramps up as score increases
const MAX_SPEED = 420;
const SPAWN_DISTANCE = 230; // min px between obstacle spawns
const SPIN_RATE = 480; // deg/s while airborne
const BEST_KEY = "dittoland_jumper_best_v1";

// The sandbox stage renders Ditto at size 300 within a 520x440 box, bottom-aligned with 16px padding.
const SANDBOX_DITTO_SIZE = 300;
const SANDBOX_DITTO_LEFT = (STAGE_W - SANDBOX_DITTO_SIZE) / 2;
const SANDBOX_DITTO_TOP = STAGE_H - SANDBOX_DITTO_SIZE - 16;

type Obstacle = { id: number; x: number; width: number; count: number; passed: boolean };
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

function SpikeCluster({ count }: { count: number }) {
  return (
    <div className="relative" style={{ width: count * SPIKE_W, height: SPIKE_H }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="absolute bottom-0"
          style={{ left: i * SPIKE_W }}
          width={SPIKE_W}
          height={SPIKE_H}
          viewBox={`0 0 ${SPIKE_W} ${SPIKE_H}`}
        >
          <polygon
            points={`${SPIKE_W / 2},2 2,${SPIKE_H - 2} ${SPIKE_W - 2},${SPIKE_H - 2}`}
            fill="var(--ditto-pink)"
            stroke="#1A122B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

const groundedY = () => GROUND_Y - DITTO_SIZE;

export function DittoJumper() {
  const [state, setState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [dittoY, setDittoY] = useState(groundedY());
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [areaW, setAreaW] = useState(340);

  const areaRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const dittoYRef = useRef(dittoY);
  const groundedRef = useRef(true);
  const spinRef = useRef(0);
  const scoreRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const nextObstacleId = useRef(0);
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

  const start = useCallback(() => {
    dittoYRef.current = groundedY();
    velocityRef.current = 0;
    groundedRef.current = true;
    spinRef.current = 0;
    scoreRef.current = 0;
    nextObstacleId.current = 0;
    setDittoY(dittoYRef.current);
    setObstacles([]);
    setScore(0);
    setState("playing");
  }, []);

  const jump = useCallback(() => {
    if (stateRef.current === "playing" && groundedRef.current) {
      velocityRef.current = JUMP_VELOCITY;
      groundedRef.current = false;
    }
  }, []);

  const restart = useCallback(() => {
    setState("ready");
    dittoYRef.current = groundedY();
    velocityRef.current = 0;
    groundedRef.current = true;
    spinRef.current = 0;
    scoreRef.current = 0;
    setDittoY(dittoYRef.current);
    setObstacles([]);
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

      if (dittoYRef.current <= 0) {
        dittoYRef.current = 0;
        velocityRef.current = 0;
      }
      if (dittoYRef.current >= groundedY()) {
        dittoYRef.current = groundedY();
        velocityRef.current = 0;
        groundedRef.current = true;
        spinRef.current = 0;
      } else {
        groundedRef.current = false;
        spinRef.current += SPIN_RATE * dt;
      }

      setDittoY(dittoYRef.current);

      const speed = Math.min(BASE_SPEED + scoreRef.current * SPEED_PER_POINT, MAX_SPEED);
      let collided = false;

      setObstacles((prev) => {
        let scoredThisFrame = 0;
        const next = prev
          .map((o) => ({ ...o, x: o.x - speed * dt }))
          .filter((o) => o.x + o.width > -20);

        for (const o of next) {
          const overlapsX = dittoX + DITTO_SIZE - 8 > o.x + 6 && dittoX + 8 < o.x + o.width - 6;
          if (overlapsX) {
            const dittoBottom = dittoYRef.current + DITTO_SIZE;
            if (dittoBottom > GROUND_Y - SPIKE_H + 8) collided = true;
          }
          if (!o.passed && o.x + o.width < dittoX) {
            o.passed = true;
            scoredThisFrame += 1;
          }
        }

        const last = next[next.length - 1];
        if (!last || last.x < areaW - SPAWN_DISTANCE) {
          const count = Math.random() < 0.3 ? 2 : 1;
          next.push({ id: nextObstacleId.current++, x: areaW + 40, width: count * SPIKE_W, count, passed: false });
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
  }, [state, areaW, dittoX, endGame]);

  const onInteract = () => {
    if (state === "over") return;
    if (state === "ready") start();
    else jump();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state === "over") restart();
        else if (state === "ready") start();
        else jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, start, jump, restart]);

  return (
    <div className="card-doodle p-5" style={{ background: "var(--cream)" }}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: "#1A122B" }}>
          Ditto Dash
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#6B5A85" }}>
          <Trophy size={13} /> Best: {best}
        </div>
      </div>
      <p className="mb-3 text-xs" style={{ color: "#6B5A85" }}>
        Click, tap, or press Space to jump over the spikes. Your Ditto keeps whatever accessories you've equipped above!
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
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: GROUND_MARGIN, background: "var(--ditto-deep)", borderTop: "2.5px solid #1A122B" }}
        />

        {obstacles.map((o) => (
          <div key={o.id} className="absolute" style={{ left: o.x, bottom: GROUND_MARGIN }}>
            <SpikeCluster count={o.count} />
          </div>
        ))}

        <div
          className="absolute"
          style={{ left: dittoX, top: dittoY, transform: `rotate(${spinRef.current}deg)` }}
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
