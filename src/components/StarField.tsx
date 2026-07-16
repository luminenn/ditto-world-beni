import { useMemo } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
  type: "dot" | "sparkle";
  rot: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function SparkleIcon({ size = 14, color = "#FFF5FB" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
        fill={color}
        stroke="#1A122B"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarField({ count = 60, seed = 7 }: { count?: number; seed?: number }) {
  const stars = useMemo<Star[]>(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }).map((_, i) => {
      const isSparkle = rand() < 0.28;
      return {
        id: i,
        x: rand() * 100,
        y: rand() * 100,
        size: isSparkle ? 10 + rand() * 12 : 1 + rand() * 3,
        opacity: 0.3 + rand() * 0.7,
        dur: 2.4 + rand() * 4.5,
        delay: rand() * 5,
        type: isSparkle ? "sparkle" : "dot",
        rot: rand() * 60 - 30,
      };
    });
  }, [count, seed]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
            transform: `rotate(${s.rot}deg)`,
            // @ts-expect-error CSS vars
            "--tw-dur": `${s.dur}s`,
            "--tw-min": `${Math.max(s.opacity - 0.4, 0.15)}`,
            "--tw-max": `${Math.min(s.opacity + 0.1, 1)}`,
            animationDelay: `${s.delay}s`,
            filter: s.type === "dot" ? "blur(0.3px)" : "drop-shadow(0 0 4px rgba(255,220,255,0.6))",
          }}
        >
          {s.type === "dot" ? (
            <span
              className="block rounded-full bg-white"
              style={{
                width: s.size,
                height: s.size,
                boxShadow: "0 0 6px rgba(255,255,255,0.7)",
              }}
            />
          ) : (
            <SparkleIcon size={s.size} color={Math.random() > 0.5 ? "#FFF5FB" : "#F8C8FF"} />
          )}
        </span>
      ))}
    </div>
  );
}

export function Doodle({
  className,
  children,
  rotate = 0,
}: {
  className?: string;
  children: React.ReactNode;
  rotate?: number;
}) {
  return (
    <span
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, display: "inline-block" }}
    >
      {children}
    </span>
  );
}
