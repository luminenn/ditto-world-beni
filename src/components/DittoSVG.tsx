import type { CSSProperties } from "react";

/**
 * Classic Pokémon Ditto: soft organic asymmetrical blob, two small dark-purple
 * bead eyes placed far apart, thin wavy horizontal mouth in the middle.
 * viewBox 0 0 220 190 is shared with Playground accessory coordinates.
 */
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
  const INK = "#4A2C5B";
  const EYE = "#3A2148";

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
        <radialGradient id="dittoBody" cx="40%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#FCDCEB" />
          <stop offset="55%" stopColor="#F0A9CF" />
          <stop offset="100%" stopColor="#C87BAF" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="112" cy="176" rx="74" ry="7" fill={INK} opacity="0.16" />

      {/*
        Soft asymmetrical blob body. Two tiny nubs on top (Ditto's signature
        little ears), a wider left cheek, a slightly rounder right side.
      */}
      <path
        d="
          M 96 26
          C 100 20, 112 20, 116 26
          C 118 30, 116 33, 113 35
          C 128 34, 145 40, 158 52
          C 175 66, 184 88, 180 112
          C 176 138, 154 158, 124 165
          C 118 166, 116 170, 110 170
          C 104 170, 102 166, 96 165
          C 66 158, 44 138, 40 112
          C 36 88, 45 66, 62 52
          C 74 42, 90 36, 105 35
          C 100 33, 96 30, 96 26 Z
        "
        fill="url(#dittoBody)"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Little top nub highlights */}
      <path d="M 96 26 C 100 22, 112 22, 116 26" fill="none" stroke={INK} strokeWidth="0" />

      {/* Belly highlight — soft blush on upper-left */}
      <ellipse cx="80" cy="68" rx="26" ry="12" fill="#FDE6F1" opacity="0.55" />

      {/* Bead eyes — wide-set, small circles */}
      {mood === "joy" ? (
        <>
          <path d="M 74 96 q 8 -9 16 0" stroke={EYE} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 130 96 q 8 -9 16 0" stroke={EYE} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "wink" ? (
        <>
          <path d="M 74 98 q 8 -6 16 0" stroke={EYE} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="138" cy="98" r="5" fill={EYE} />
        </>
      ) : (
        <>
          <circle cx="82" cy="98" r="5" fill={EYE} />
          <circle cx="138" cy="98" r="5" fill={EYE} />
        </>
      )}

      {/* Thin wavy mouth right between the eyes horizontally */}
      {mood === "sad" ? (
        <path
          d="M 96 128 q 7 -8 14 0 q 7 8 14 0"
          stroke={EYE}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 96 120 q 7 6 14 0 q 7 -6 14 0"
          stroke={EYE}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
