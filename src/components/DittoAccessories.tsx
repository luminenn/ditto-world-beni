import type React from "react";

/** Simple hand-drawn style SVG accessories that dress up the Ditto SVG. */
const INK = "#4A2C5B";

export function HatSVG({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Top hat">
      <ellipse cx="32" cy="52" rx="26" ry="6" fill="#2E1B3A" stroke={INK} strokeWidth="2.5" />
      <rect x="14" y="16" width="36" height="34" rx="4" fill="#3A2148" stroke={INK} strokeWidth="2.5" />
      <rect x="14" y="36" width="36" height="6" fill="#EC7CD2" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}

export function GlassesSVG({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 48" width={size} height={size * (48 / 96)} aria-label="Round glasses">
      <circle cx="24" cy="24" r="18" fill="#FBFAFF" stroke={INK} strokeWidth="3" />
      <circle cx="72" cy="24" r="18" fill="#FBFAFF" stroke={INK} strokeWidth="3" />
      <path d="M42 24 h12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M6 20 q-6 0 -6 6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90 20 q6 0 6 6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="18" r="3" fill="#C9A8E8" opacity="0.7" />
      <circle cx="66" cy="18" r="3" fill="#C9A8E8" opacity="0.7" />
    </svg>
  );
}

export function ScarfSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 60" width={size} height={size * (60 / 84)} aria-label="Cozy scarf">
      <path d="M6 22 Q42 6 78 22 L74 34 Q42 20 10 34 Z" fill="#EC7CD2" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M22 32 L14 56 L28 50 L26 32 Z" fill="#C9A8E8" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M18 26 q30 -8 48 0" stroke={INK} strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
    </svg>
  );
}

export function LollipopSVG({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 80" width={size} height={size * (80 / 64)} aria-label="Lollipop">
      <rect x="30" y="34" width="4" height="42" rx="2" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="32" cy="24" r="20" fill="#EC7CD2" stroke={INK} strokeWidth="2.8" />
      <path d="M32 8 q10 6 6 16 q-4 10 -14 6 q-10 -4 -6 -14 q4 -10 14 -8" fill="none" stroke="#FBFAFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="18" r="3" fill="#FBFAFF" opacity="0.8" />
    </svg>
  );
}

export function DetectiveHatSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * (60 / 80)} aria-label="Detective hat">
      {/* Deerstalker: front + back brims */}
      <path d="M6 40 Q40 32 74 40 L74 48 Q40 52 6 48 Z" fill="#8B6B4A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 40 Q40 14 66 40 Z" fill="#A88055" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* Checker pattern */}
      <path d="M24 30 h6 v6 h-6z M36 26 h6 v6 h-6z M48 30 h6 v6 h-6z M30 36 h6 v6 h-6z M42 36 h6 v6 h-6z" fill="#6B4A2E" opacity="0.55" />
      {/* Center button */}
      <circle cx="40" cy="22" r="3" fill="#6B4A2E" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

export function PixelSunglassesSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 36" width={size} height={size * (36 / 96)} aria-label="Pixel sunglasses" shapeRendering="crispEdges">
      {/* Solid pixel black shades - "deal with it" style */}
      <rect x="4" y="10" width="38" height="18" fill="#111" stroke={INK} strokeWidth="2" />
      <rect x="54" y="10" width="38" height="18" fill="#111" stroke={INK} strokeWidth="2" />
      <rect x="42" y="16" width="12" height="6" fill="#111" stroke={INK} strokeWidth="2" />
      {/* Pixel highlights */}
      <rect x="8" y="14" width="4" height="4" fill="#fff" />
      <rect x="14" y="14" width="4" height="4" fill="#fff" />
      <rect x="58" y="14" width="4" height="4" fill="#fff" />
    </svg>
  );
}

export function ChefHatSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 72 80" width={size} height={size * (80 / 72)} aria-label="Chef hat">
      {/* Puffy top */}
      <circle cx="22" cy="28" r="16" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="50" cy="28" r="16" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="36" cy="18" r="16" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      {/* Band */}
      <rect x="14" y="46" width="44" height="20" rx="3" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <path d="M14 54 h44" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

export function RibbonBowSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 56" width={size} height={size * (56 / 84)} aria-label="Pink ribbon bow">
      <path d="M42 28 L10 10 L14 28 L10 46 Z" fill="#F8B4D9" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 28 L74 10 L70 28 L74 46 Z" fill="#F8B4D9" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="42" cy="28" rx="8" ry="9" fill="#EC7CD2" stroke={INK} strokeWidth="2.5" />
      <path d="M20 22 q10 6 0 12 M64 22 q-10 6 0 12" stroke="#D77BAE" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CrownSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 60" width={size} height={size * (60 / 84)} aria-label="Golden crown">
      <path d="M8 48 L14 16 L28 36 L42 10 L56 36 L70 16 L76 48 Z" fill="#F6C948" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <rect x="8" y="46" width="68" height="8" fill="#E4A93A" stroke={INK} strokeWidth="2.5" />
      <circle cx="14" cy="16" r="3.5" fill="#EC7CD2" stroke={INK} strokeWidth="1.8" />
      <circle cx="42" cy="10" r="3.5" fill="#7AD1F5" stroke={INK} strokeWidth="1.8" />
      <circle cx="70" cy="16" r="3.5" fill="#A3E6D2" stroke={INK} strokeWidth="1.8" />
      <circle cx="24" cy="50" r="2.5" fill="#B57F1F" />
      <circle cx="42" cy="50" r="2.5" fill="#B57F1F" />
      <circle cx="60" cy="50" r="2.5" fill="#B57F1F" />
    </svg>
  );
}

export function BeanieSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 72 68" width={size} height={size * (68 / 72)} aria-label="Winter beanie">
      <path d="M10 44 Q10 12 36 12 Q62 12 62 44 Z" fill="#6D8FD4" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="6" y="42" width="60" height="14" rx="4" fill="#8FB0EC" stroke={INK} strokeWidth="2.5" />
      <path d="M6 50 h60" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="36" cy="8" r="7" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <path d="M32 6 q4 -3 8 0 M32 10 q4 3 8 0" stroke={INK} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export type AccessoryKey =
  | "hat"
  | "glasses"
  | "scarf"
  | "lollipop"
  | "detective"
  | "pixelshades"
  | "chef"
  | "ribbon"
  | "crown"
  | "beanie";

export const ACCESSORIES: Record<
  AccessoryKey,
  { w: number; render: (s: number) => React.ReactElement; defaultPos: { x: number; y: number } }
> = {
  hat: { w: 84, render: (s) => <HatSVG size={s} />, defaultPos: { x: 155, y: 8 } },
  glasses: { w: 110, render: (s) => <GlassesSVG size={s} />, defaultPos: { x: 140, y: 110 } },
  scarf: { w: 130, render: (s) => <ScarfSVG size={s} />, defaultPos: { x: 130, y: 220 } },
  lollipop: { w: 70, render: (s) => <LollipopSVG size={s} />, defaultPos: { x: 260, y: 180 } },
  detective: { w: 96, render: (s) => <DetectiveHatSVG size={s} />, defaultPos: { x: 140, y: 8 } },
  pixelshades: { w: 118, render: (s) => <PixelSunglassesSVG size={s} />, defaultPos: { x: 135, y: 115 } },
  chef: { w: 90, render: (s) => <ChefHatSVG size={s} />, defaultPos: { x: 150, y: 4 } },
  ribbon: { w: 96, render: (s) => <RibbonBowSVG size={s} />, defaultPos: { x: 150, y: 40 } },
  crown: { w: 100, render: (s) => <CrownSVG size={s} />, defaultPos: { x: 145, y: 12 } },
  beanie: { w: 96, render: (s) => <BeanieSVG size={s} />, defaultPos: { x: 145, y: 10 } },
};
