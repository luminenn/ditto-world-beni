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
      {/* shine */}
      <circle cx="18" cy="18" r="3" fill="#C9A8E8" opacity="0.7" />
      <circle cx="66" cy="18" r="3" fill="#C9A8E8" opacity="0.7" />
    </svg>
  );
}

export function ScarfSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 60" width={size} height={size * (60 / 84)} aria-label="Cozy scarf">
      <path
        d="M6 22 Q42 6 78 22 L74 34 Q42 20 10 34 Z"
        fill="#EC7CD2"
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M22 32 L14 56 L28 50 L26 32 Z"
        fill="#C9A8E8"
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* stitches */}
      <path d="M18 26 q30 -8 48 0" stroke={INK} strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
    </svg>
  );
}

export type AccessoryKey = "hat" | "glasses" | "scarf";

export const ACCESSORIES: Record<
  AccessoryKey,
  { w: number; render: (s: number) => JSX.Element; defaultPos: { x: number; y: number } }
> = {
  hat: { w: 84, render: (s) => <HatSVG size={s} />, defaultPos: { x: 155, y: 8 } },
  glasses: { w: 110, render: (s) => <GlassesSVG size={s} />, defaultPos: { x: 140, y: 110 } },
  scarf: { w: 130, render: (s) => <ScarfSVG size={s} />, defaultPos: { x: 130, y: 220 } },
};
