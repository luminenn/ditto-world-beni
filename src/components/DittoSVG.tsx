import type { CSSProperties } from "react";

/** Classic Pokémon Ditto: pink blob, bead eyes, thin wavy mouth. */
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
      viewBox="0 0 220 190"
      width={size}
      height={size * (190 / 220)}
      className={className}
      style={style}
      aria-label="Ditto"
    >
      <defs>
        <radialGradient id="dittoBody" cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#FBD3E4" />
          <stop offset="55%" stopColor="#EFA8CE" />
          <stop offset="100%" stopColor="#C97BAE" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="110" cy="175" rx="72" ry="7" fill="#4A2C5B" opacity="0.18" />

      {/* Ditto blob body — lumpy, wider than tall, with two little nubs on top */}
      <path
        d="M110 22
           c 14 -2 22 4 24 12
           c 1 6 -2 10 -6 12
           c 10 2 22 8 30 18
           c 12 14 16 32 12 50
           c -4 20 -22 34 -46 40
           c -6 2 -8 6 -14 6
           c -6 0 -8 -4 -14 -6
           c -24 -6 -42 -20 -46 -40
           c -4 -18 0 -36 12 -50
           c 8 -10 20 -16 30 -18
           c -4 -2 -7 -6 -6 -12
           c 2 -8 10 -14 24 -12 Z"
        fill="url(#dittoBody)"
        stroke="#4A2C5B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* subtle belly highlight */}
      <ellipse cx="88" cy="72" rx="22" ry="10" fill="#FDE6F1" opacity="0.55" />

      {/* bead eyes — signature wide-set goofy dots */}
      {mood === "joy" ? (
        <>
          <path d="M74 96 q7 -8 14 0" stroke="#3A2148" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M132 96 q7 -8 14 0" stroke="#3A2148" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "wink" ? (
        <>
          <path d="M74 98 q7 -6 14 0" stroke="#3A2148" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="139" cy="98" r="5" fill="#3A2148" />
        </>
      ) : (
        <>
          <circle cx="81" cy="98" r="5" fill="#3A2148" />
          <circle cx="139" cy="98" r="5" fill="#3A2148" />
        </>
      )}

      {/* thin wavy mouth */}
      {mood === "sad" ? (
        <path d="M96 128 q7 -8 14 0 q7 8 14 0" stroke="#3A2148" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M96 122 q7 8 14 0 q7 -8 14 0" stroke="#3A2148" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
