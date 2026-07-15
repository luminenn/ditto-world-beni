import type { CSSProperties } from "react";

/** A cute vector Ditto blob. Colors follow the design system. */
export function DittoSVG({
  size = 260,
  mood = "happy",
  style,
  className,
}: {
  size?: number;
  mood?: "happy" | "joy" | "sad" | "wink";
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 160"
      width={size}
      height={size * 0.8}
      className={className}
      style={style}
      aria-label="Ditto"
    >
      <defs>
        <radialGradient id="dittoGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FBD8E7" />
          <stop offset="55%" stopColor="#F4C2D7" />
          <stop offset="100%" stopColor="#D89EC5" />
        </radialGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="100" cy="150" rx="70" ry="7" fill="#2D2A2E" opacity="0.15" />
      {/* body */}
      <path
        d="M100 20
           C 150 20, 180 55, 178 95
           C 176 130, 145 148, 100 148
           C 55 148, 24 130, 22 95
           C 20 55, 50 20, 100 20 Z"
        fill="url(#dittoGrad)"
        stroke="#2D2A2E"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* cheeks */}
      <ellipse cx="55" cy="100" rx="10" ry="6" fill="#E88BB0" opacity="0.55" />
      <ellipse cx="145" cy="100" rx="10" ry="6" fill="#E88BB0" opacity="0.55" />
      {/* eyes */}
      {mood === "wink" ? (
        <>
          <path d="M70 82 q6 -6 12 0" stroke="#2D2A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="128" cy="82" rx="4.5" ry="6" fill="#2D2A2E" />
          <circle cx="129.5" cy="80" r="1.4" fill="#fff" />
        </>
      ) : (
        <>
          <ellipse cx="76" cy="82" rx="4.5" ry={mood === "joy" ? 3 : 6} fill="#2D2A2E" />
          <ellipse cx="124" cy="82" rx="4.5" ry={mood === "joy" ? 3 : 6} fill="#2D2A2E" />
          <circle cx="77.5" cy="80" r="1.4" fill="#fff" />
          <circle cx="125.5" cy="80" r="1.4" fill="#fff" />
        </>
      )}
      {/* mouth */}
      {mood === "sad" ? (
        <path d="M88 108 q12 -8 24 0" stroke="#2D2A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === "joy" ? (
        <path d="M85 102 q15 18 30 0" stroke="#2D2A2E" strokeWidth="3" fill="#F8A9C5" strokeLinejoin="round" />
      ) : (
        <path d="M88 104 q12 10 24 0" stroke="#2D2A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
