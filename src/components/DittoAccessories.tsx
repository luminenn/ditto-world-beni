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
      <path d="M6 40 Q40 32 74 40 L74 48 Q40 52 6 48 Z" fill="#8B6B4A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 40 Q40 14 66 40 Z" fill="#A88055" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 30 h6 v6 h-6z M36 26 h6 v6 h-6z M48 30 h6 v6 h-6z M30 36 h6 v6 h-6z M42 36 h6 v6 h-6z" fill="#6B4A2E" opacity="0.55" />
      <circle cx="40" cy="22" r="3" fill="#6B4A2E" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

export function PixelSunglassesSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 36" width={size} height={size * (36 / 96)} aria-label="Pixel sunglasses" shapeRendering="crispEdges">
      <rect x="4" y="10" width="38" height="18" fill="#111" stroke={INK} strokeWidth="2" />
      <rect x="54" y="10" width="38" height="18" fill="#111" stroke={INK} strokeWidth="2" />
      <rect x="42" y="16" width="12" height="6" fill="#111" stroke={INK} strokeWidth="2" />
      <rect x="8" y="14" width="4" height="4" fill="#fff" />
      <rect x="14" y="14" width="4" height="4" fill="#fff" />
      <rect x="58" y="14" width="4" height="4" fill="#fff" />
    </svg>
  );
}

export function ChefHatSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 72 80" width={size} height={size * (80 / 72)} aria-label="Chef hat">
      <circle cx="22" cy="28" r="16" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="50" cy="28" r="16" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="36" cy="18" r="16" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
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
    </svg>
  );
}

/* --- NEW 20 ACCESSORIES --- */

export function PropellerHatSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 74" width={size} height={size * (74 / 84)} aria-label="Propeller hat">
      <path d="M14 48 Q42 22 70 48 Z" fill="#EC5B5B" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="8" y="46" width="68" height="8" rx="3" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="42" cy="20" r="3" fill="#4A2C5B" stroke={INK} strokeWidth="1.5" />
      <path d="M42 20 L18 12 Q14 20 42 20 L66 12 Q70 20 42 20" fill="#F6C948" stroke={INK} strokeWidth="2" />
      <circle cx="42" cy="20" r="1.5" fill={INK} />
      <path d="M20 46 h44" stroke="#EC5B5B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}

export function PizzaSVG({ size = 76 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 76" width={size} height={size * (76 / 80)} aria-label="Pizza slice">
      <path d="M8 8 L72 8 L40 68 Z" fill="#F6C948" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 14 L66 14 L40 62 Z" fill="#EC5B5B" opacity="0.85" />
      <circle cx="30" cy="26" r="5" fill="#A82929" stroke={INK} strokeWidth="1.5" />
      <circle cx="50" cy="30" r="5" fill="#A82929" stroke={INK} strokeWidth="1.5" />
      <circle cx="38" cy="46" r="4.5" fill="#A82929" stroke={INK} strokeWidth="1.5" />
      <circle cx="42" cy="20" r="2" fill="#FBFAFF" opacity="0.9" />
    </svg>
  );
}

export function PokeballSVG({ size = 68 }: { size?: number }) {
  return (
    <svg viewBox="0 0 68 68" width={size} height={size} aria-label="Pokeball">
      <circle cx="34" cy="34" r="30" fill="#FBFAFF" stroke={INK} strokeWidth="3" />
      <path d="M4 34 A30 30 0 0 1 64 34 Z" fill="#EC3B3B" stroke={INK} strokeWidth="3" />
      <rect x="4" y="30" width="60" height="8" fill={INK} />
      <circle cx="34" cy="34" r="8" fill="#FBFAFF" stroke={INK} strokeWidth="3" />
      <circle cx="34" cy="34" r="3" fill="#FBFAFF" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

export function BowtieSVG({ size = 76 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 48" width={size} height={size * (48 / 80)} aria-label="Bowtie">
      <path d="M40 24 L10 6 L14 24 L10 42 Z" fill="#A82929" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 24 L70 6 L66 24 L70 42 Z" fill="#A82929" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="34" y="16" width="12" height="16" rx="2" fill="#7A1F1F" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

export function MoustacheSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 36" width={size} height={size * (36 / 84)} aria-label="Moustache">
      <path d="M42 18 Q30 4 14 8 Q4 12 8 20 Q14 30 26 26 Q36 22 42 18 Q48 22 58 26 Q70 30 76 20 Q80 12 70 8 Q54 4 42 18 Z" fill="#3A2515" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function BunnyEarsSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 72 84" width={size} height={size * (84 / 72)} aria-label="Bunny ears">
      <ellipse cx="20" cy="34" rx="10" ry="28" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="52" cy="34" rx="10" ry="28" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="20" cy="38" rx="4" ry="18" fill="#F8B4D9" />
      <ellipse cx="52" cy="38" rx="4" ry="18" fill="#F8B4D9" />
    </svg>
  );
}

export function CatEarsSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 56" width={size} height={size * (56 / 84)} aria-label="Cat ears">
      <path d="M8 50 L22 8 L36 50 Z" fill="#3A2148" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 50 L62 8 L76 50 Z" fill="#3A2148" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 42 L22 22 L28 42 Z" fill="#F8B4D9" />
      <path d="M56 42 L62 22 L68 42 Z" fill="#F8B4D9" />
    </svg>
  );
}

export function MonocleSVG({ size = 68 }: { size?: number }) {
  return (
    <svg viewBox="0 0 72 72" width={size} height={size} aria-label="Monocle">
      <circle cx="34" cy="34" r="24" fill="rgba(255,255,255,0.4)" stroke="#C9A83A" strokeWidth="4" />
      <circle cx="34" cy="34" r="24" fill="none" stroke={INK} strokeWidth="1.5" />
      <path d="M34 58 Q34 66 46 68" stroke="#C9A83A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="24" r="4" fill="#FBFAFF" opacity="0.85" />
    </svg>
  );
}

export function GreenScarfSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 60" width={size} height={size * (60 / 84)} aria-label="Green winter scarf">
      <path d="M6 22 Q42 6 78 22 L74 34 Q42 20 10 34 Z" fill="#3F9E6E" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M22 32 L14 56 L28 50 L26 32 Z" fill="#66C48E" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M18 26 q30 -8 48 0" stroke="#FBFAFF" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
      <path d="M22 40 h4 M30 40 h4 M42 38 h4 M54 40 h4" stroke="#FBFAFF" strokeWidth="1.5" />
    </svg>
  );
}

export function PirateHatSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 60" width={size} height={size * (60 / 96)} aria-label="Pirate hat">
      <path d="M8 44 Q48 12 88 44 Q80 52 48 52 Q16 52 8 44 Z" fill="#161122" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="48" cy="30" r="7" fill="#FBFAFF" stroke={INK} strokeWidth="1.8" />
      <circle cx="45" cy="29" r="1.4" fill={INK} />
      <circle cx="51" cy="29" r="1.4" fill={INK} />
      <path d="M40 40 L56 40 M42 38 L54 42 M42 42 L54 38" stroke="#FBFAFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AstroHelmetSVG({ size = 92 }: { size?: number }) {
  return (
    <svg viewBox="0 0 92 92" width={size} height={size} aria-label="Astronaut helmet">
      <circle cx="46" cy="46" r="40" fill="rgba(200,220,255,0.35)" stroke={INK} strokeWidth="3" />
      <circle cx="46" cy="46" r="40" fill="none" stroke="#FBFAFF" strokeWidth="1.5" opacity="0.7" />
      <path d="M20 30 Q36 18 52 22" stroke="#FBFAFF" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M22 36 Q34 28 46 30" stroke="#FBFAFF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <rect x="12" y="42" width="8" height="10" rx="2" fill="#C9A8E8" stroke={INK} strokeWidth="2" />
      <rect x="72" y="42" width="8" height="10" rx="2" fill="#C9A8E8" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

export function ChocobarSVG({ size = 76 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 88" width={size} height={size * (88 / 60)} aria-label="Chocolate bar">
      <path d="M6 4 L54 4 L58 20 L54 84 L6 84 L2 20 Z" fill="#C9A8E8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 24 L46 24 L46 80 L14 80 Z" fill="#5A3520" stroke={INK} strokeWidth="2" />
      <path d="M14 40 h32 M14 56 h32 M14 72 h32 M22 24 v56 M30 24 v56 M38 24 v56" stroke="#3A2515" strokeWidth="1.8" />
      <path d="M8 4 L54 4 L52 20 L10 20 Z" fill="#E5D0FA" opacity="0.6" />
    </svg>
  );
}

export function SwordSVG({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 96" width={size} height={size * (96 / 32)} aria-label="Toy sword">
      <path d="M16 4 L22 60 L10 60 Z" fill="#DDE4F0" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="4" y="60" width="24" height="6" rx="2" fill="#C9A83A" stroke={INK} strokeWidth="2" />
      <rect x="13" y="66" width="6" height="20" fill="#7A4E2E" stroke={INK} strokeWidth="2" />
      <circle cx="16" cy="90" r="4" fill="#C9A83A" stroke={INK} strokeWidth="2" />
      <path d="M16 10 L18 40" stroke="#FBFAFF" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}

export function RainbowLollipopSVG({ size = 68 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 88" width={size} height={size * (88 / 64)} aria-label="Rainbow lollipop">
      <rect x="30" y="40" width="4" height="44" rx="2" fill="#FBFAFF" stroke={INK} strokeWidth="2.2" />
      <circle cx="32" cy="26" r="22" fill="#EC5B5B" stroke={INK} strokeWidth="2.6" />
      <circle cx="32" cy="26" r="18" fill="#F39C3B" />
      <circle cx="32" cy="26" r="14.5" fill="#F6C948" />
      <circle cx="32" cy="26" r="11" fill="#3F9E6E" />
      <circle cx="32" cy="26" r="7.5" fill="#5A8CE0" />
      <circle cx="32" cy="26" r="4" fill="#A56BD6" />
      <circle cx="32" cy="26" r="22" fill="none" stroke={INK} strokeWidth="2.6" />
      <ellipse cx="24" cy="16" rx="5" ry="3" fill="#FBFAFF" opacity="0.55" />
    </svg>
  );
}

export function RubberDuckSVG({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 88 76" width={size} height={size * (76 / 88)} aria-label="Rubber duck">
      <ellipse cx="46" cy="52" rx="34" ry="18" fill="#F6C948" stroke={INK} strokeWidth="2.5" />
      <circle cx="66" cy="30" r="16" fill="#F6C948" stroke={INK} strokeWidth="2.5" />
      <path d="M78 30 L88 32 L78 38 Z" fill="#EC7A1F" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="70" cy="26" r="2.5" fill={INK} />
      <path d="M20 46 q6 -4 12 0" stroke={INK} strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  );
}

export function BobaSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 86" width={size} height={size * (86 / 60)} aria-label="Boba milk tea">
      <path d="M8 22 L52 22 L48 82 Q30 86 12 82 Z" fill="#E5C9A3" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="4" y="16" width="52" height="8" rx="2" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
      <rect x="32" y="4" width="6" height="30" rx="2" fill="#EC7CD2" stroke={INK} strokeWidth="2" />
      <circle cx="20" cy="60" r="4" fill={INK} />
      <circle cx="32" cy="66" r="4" fill={INK} />
      <circle cx="42" cy="58" r="4" fill={INK} />
      <circle cx="26" cy="72" r="4" fill={INK} />
      <circle cx="38" cy="74" r="4" fill={INK} />
    </svg>
  );
}

export function BalloonSVG({ size = 68 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 88" width={size} height={size * (88 / 48)} aria-label="Balloon">
      <ellipse cx="24" cy="30" rx="20" ry="24" fill="#EC3B3B" stroke={INK} strokeWidth="2.5" />
      <path d="M20 54 L28 54 L26 60 L22 60 Z" fill="#A82929" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 60 Q30 70 20 78 Q30 82 24 88" stroke={INK} strokeWidth="1.8" fill="none" />
      <ellipse cx="16" cy="20" rx="4" ry="6" fill="#FBFAFF" opacity="0.7" />
    </svg>
  );
}

export function HPGlassesSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 44" width={size} height={size * (44 / 96)} aria-label="Round glasses">
      <circle cx="24" cy="22" r="18" fill="rgba(255,255,255,0.25)" stroke={INK} strokeWidth="3.5" />
      <circle cx="72" cy="22" r="18" fill="rgba(255,255,255,0.25)" stroke={INK} strokeWidth="3.5" />
      <path d="M42 22 h12" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 18 q-6 0 -6 6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90 18 q6 0 6 6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function DiamondCrownSVG({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 88 62" width={size} height={size * (62 / 88)} aria-label="Diamond crown">
      <path d="M8 50 L14 14 L30 34 L44 8 L58 34 L74 14 L80 50 Z" fill="#F6E048" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <rect x="8" y="48" width="72" height="8" fill="#E4B93A" stroke={INK} strokeWidth="2.5" />
      <path d="M14 14 L10 22 L18 22 Z M44 8 L38 20 L50 20 Z M74 14 L70 22 L78 22 Z" fill="#FBFAFF" opacity="0.7" />
      <circle cx="14" cy="14" r="3.5" fill="#B8ECFF" stroke={INK} strokeWidth="1.5" />
      <circle cx="44" cy="8" r="4" fill="#B8ECFF" stroke={INK} strokeWidth="1.5" />
      <circle cx="74" cy="14" r="3.5" fill="#B8ECFF" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

export function ShortcakeSVG({ size = 78 }: { size?: number }) {
  return (
    <svg viewBox="0 0 78 78" width={size} height={size} aria-label="Strawberry shortcake">
      <path d="M8 66 L70 66 L44 12 Z" fill="#F6E5C4" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 60 L66 60 L42 22 Z" fill="#FBFAFF" opacity="0.85" />
      <path d="M20 44 L58 44 M18 52 L60 52" stroke="#EC7CD2" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M36 20 Q44 8 52 20 Q48 26 44 20 Q40 26 36 20 Z" fill="#FBFAFF" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="30" cy="42" r="4" fill="#EC3B3B" stroke={INK} strokeWidth="1.5" />
      <circle cx="48" cy="38" r="4" fill="#EC3B3B" stroke={INK} strokeWidth="1.5" />
      <circle cx="40" cy="54" r="4" fill="#EC3B3B" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

/* --- NEW HATS & OUTFITS --- */

export function WizardHatSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 96" width={size} height={size * (96 / 84)} aria-label="Wizard hat">
      <path d="M10 78 Q42 68 74 78 L70 86 Q42 80 14 86 Z" fill="#4A2C8A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 78 Q36 20 46 4 Q54 24 58 78 Z" fill="#5E3AA8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M38 12 l2 4 l4 -1 l-3 3 l2 4 l-4 -2 l-3 3 l0 -4 l-4 -2 l4 -1 Z" fill="#F6E048" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M44 42 l1.5 3 l3 -0.7 l-2.2 2.2 l1.5 3 l-3 -1.5 l-2.2 2.2 l0 -3 l-3 -1.5 l3 -0.7 Z" fill="#F6E048" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function SantaHatSVG({ size = 76 }: { size?: number }) {
  return (
    <svg viewBox="0 0 76 76" width={size} height={size} aria-label="Santa hat">
      <path d="M14 40 Q18 10 50 8 Q46 30 66 40 Q40 30 14 40 Z" fill="#D33B3B" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="64" cy="38" r="8" fill="#FBFAFF" stroke={INK} strokeWidth="2.2" />
      <rect x="8" y="38" width="60" height="14" rx="6" fill="#FBFAFF" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}

export function CowboyHatSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 56" width={size} height={size * (56 / 96)} aria-label="Cowboy hat">
      <path d="M4 40 Q48 24 92 40 Q80 50 48 50 Q16 50 4 40 Z" fill="#A9764A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 40 Q30 10 48 8 Q66 10 68 40 Z" fill="#BE8957" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="28" y="32" width="40" height="7" fill="#5A3520" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

export function FlowerCrownSVG({ size = 96 }: { size?: number }) {
  const flower = (cx: number, cy: number, color: string) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx - 5} cy={cy} r="4.5" fill={color} stroke={INK} strokeWidth="1.2" />
      <circle cx={cx + 5} cy={cy} r="4.5" fill={color} stroke={INK} strokeWidth="1.2" />
      <circle cx={cx} cy={cy - 5} r="4.5" fill={color} stroke={INK} strokeWidth="1.2" />
      <circle cx={cx} cy={cy + 5} r="4.5" fill={color} stroke={INK} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="3.5" fill="#F6C948" stroke={INK} strokeWidth="1" />
    </g>
  );
  return (
    <svg viewBox="0 0 100 40" width={size} height={size * (40 / 100)} aria-label="Flower crown">
      <path d="M6 26 Q50 6 94 26" stroke="#6B9E4E" strokeWidth="4" fill="none" strokeLinecap="round" />
      {flower(20, 22, "#F8B4D9")}
      {flower(40, 12, "#EC7CD2")}
      {flower(60, 12, "#A56BD6")}
      {flower(80, 22, "#F8B4D9")}
    </svg>
  );
}

export function GradCapSVG({ size = 92 }: { size?: number }) {
  return (
    <svg viewBox="0 0 92 70" width={size} height={size * (70 / 92)} aria-label="Graduation cap">
      <path d="M46 8 L88 28 L46 48 L4 28 Z" fill="#161122" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="30" y="30" width="32" height="16" fill="#2E2440" stroke={INK} strokeWidth="2.2" />
      <path d="M74 30 L74 50" stroke={INK} strokeWidth="2" />
      <circle cx="74" cy="54" r="4" fill="#F6C948" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

export function PartyHatSVG({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 88" width={size} height={size * (88 / 60)} aria-label="Party hat">
      <path d="M30 4 L54 80 L6 80 Z" fill="#5A8CE0" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="22" cy="40" r="3" fill="#F6C948" />
      <circle cx="36" cy="55" r="3" fill="#EC7CD2" />
      <circle cx="26" cy="66" r="3" fill="#F6C948" />
      <circle cx="38" cy="30" r="3" fill="#EC7CD2" />
      <circle cx="30" cy="4" r="6" fill="#FBFAFF" stroke={INK} strokeWidth="2.2" />
    </svg>
  );
}

export function BaseballCapSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 60" width={size} height={size * (60 / 96)} aria-label="Baseball cap">
      <path d="M14 40 Q20 10 48 10 Q76 10 82 40 Z" fill="#5A8CE0" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 10 L48 40" stroke={INK} strokeWidth="1.2" opacity="0.4" />
      <path d="M78 38 Q94 38 92 48 Q76 50 76 42 Z" fill="#4A72C4" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="48" cy="12" r="2.5" fill={INK} />
    </svg>
  );
}

export function CapeSVG({ size = 110 }: { size?: number }) {
  return (
    <svg viewBox="0 0 110 96" width={size} height={size * (96 / 110)} aria-label="Superhero cape">
      <path d="M40 8 Q55 0 70 8 L66 18 Q55 14 44 18 Z" fill="#EC3B3B" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 16 Q10 40 6 90 Q30 76 55 88 Q80 76 104 90 Q100 40 70 16 Q55 24 40 16 Z" fill="#EC3B3B" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M55 22 Q40 44 42 80 M55 22 Q70 44 68 80" stroke="#A82929" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
}

export function HoodieSVG({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 90" width={size} height={size * (90 / 120)} aria-label="Cozy hoodie">
      <path d="M20 30 Q60 4 100 30 L100 84 Q60 96 20 84 Z" fill="#7AA6DE" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M38 28 Q60 14 82 28 Q78 44 60 40 Q42 44 38 28 Z" fill="#5A8CE0" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="60" cy="50" r="3.5" fill="#FBFAFF" stroke={INK} strokeWidth="1.5" />
      <path d="M60 54 v14" stroke="#FBFAFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 36 Q10 50 14 70 M96 36 Q110 50 106 70" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function OverallsSVG({ size = 110 }: { size?: number }) {
  return (
    <svg viewBox="0 0 110 90" width={size} height={size * (90 / 110)} aria-label="Denim overalls">
      <path d="M20 30 L34 30 L34 4 L44 4 L44 20 L66 20 L66 4 L76 4 L76 30 L90 30 L90 84 Q55 96 20 84 Z" fill="#5A8CE0" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="40" y="8" width="8" height="8" rx="1.5" fill="#F6C948" stroke={INK} strokeWidth="1.5" />
      <rect x="62" y="8" width="8" height="8" rx="1.5" fill="#F6C948" stroke={INK} strokeWidth="1.5" />
      <path d="M30 44 h50 M30 58 h50 M30 72 h50" stroke="#3A5FA8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}

export function HeadphonesSVG({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 72" width={size} height={size * (72 / 96)} aria-label="Headphones">
      <path d="M14 40 Q14 4 48 4 Q82 4 82 40" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="4" y="34" width="18" height="28" rx="7" fill="#3A2148" stroke={INK} strokeWidth="2.5" />
      <rect x="74" y="34" width="18" height="28" rx="7" fill="#3A2148" stroke={INK} strokeWidth="2.5" />
      <circle cx="13" cy="48" r="4" fill="#EC7CD2" opacity="0.8" />
      <circle cx="83" cy="48" r="4" fill="#EC7CD2" opacity="0.8" />
    </svg>
  );
}

export function NecklaceSVG({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 84 52" width={size} height={size * (52 / 84)} aria-label="Necklace">
      <path d="M6 6 Q42 46 78 6" stroke="#C9A83A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M32 34 L42 48 L52 34 L42 24 Z" fill="#7AD1F5" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="42" cy="32" r="2" fill="#FBFAFF" opacity="0.8" />
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
  | "beanie"
  | "propeller"
  | "pizza"
  | "pokeball"
  | "bowtie"
  | "moustache"
  | "bunnyears"
  | "catears"
  | "monocle"
  | "greenscarf"
  | "piratehat"
  | "astrohelmet"
  | "chocobar"
  | "sword"
  | "rainbowpop"
  | "rubberduck"
  | "boba"
  | "balloon"
  | "hpglasses"
  | "diamondcrown"
  | "shortcake"
  | "wizardhat"
  | "santahat"
  | "cowboyhat"
  | "flowercrown"
  | "gradcap"
  | "partyhat"
  | "baseballcap"
  | "cape"
  | "hoodie"
  | "overalls"
  | "headphones"
  | "necklace";

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
  propeller: { w: 100, render: (s) => <PropellerHatSVG size={s} />, defaultPos: { x: 145, y: 4 } },
  pizza: { w: 88, render: (s) => <PizzaSVG size={s} />, defaultPos: { x: 150, y: 120 } },
  pokeball: { w: 80, render: (s) => <PokeballSVG size={s} />, defaultPos: { x: 250, y: 150 } },
  bowtie: { w: 90, render: (s) => <BowtieSVG size={s} />, defaultPos: { x: 150, y: 210 } },
  moustache: { w: 100, render: (s) => <MoustacheSVG size={s} />, defaultPos: { x: 145, y: 160 } },
  bunnyears: { w: 88, render: (s) => <BunnyEarsSVG size={s} />, defaultPos: { x: 150, y: 0 } },
  catears: { w: 100, render: (s) => <CatEarsSVG size={s} />, defaultPos: { x: 145, y: 8 } },
  monocle: { w: 76, render: (s) => <MonocleSVG size={s} />, defaultPos: { x: 160, y: 120 } },
  greenscarf: { w: 100, render: (s) => <GreenScarfSVG size={s} />, defaultPos: { x: 140, y: 210 } },
  piratehat: { w: 110, render: (s) => <PirateHatSVG size={s} />, defaultPos: { x: 135, y: 12 } },
  astrohelmet: { w: 110, render: (s) => <AstroHelmetSVG size={s} />, defaultPos: { x: 135, y: 60 } },
  chocobar: { w: 76, render: (s) => <ChocobarSVG size={s} />, defaultPos: { x: 255, y: 140 } },
  sword: { w: 60, render: (s) => <SwordSVG size={s} />, defaultPos: { x: 280, y: 100 } },
  rainbowpop: { w: 74, render: (s) => <RainbowLollipopSVG size={s} />, defaultPos: { x: 260, y: 170 } },
  rubberduck: { w: 92, render: (s) => <RubberDuckSVG size={s} />, defaultPos: { x: 150, y: 240 } },
  boba: { w: 72, render: (s) => <BobaSVG size={s} />, defaultPos: { x: 265, y: 160 } },
  balloon: { w: 60, render: (s) => <BalloonSVG size={s} />, defaultPos: { x: 280, y: 90 } },
  hpglasses: { w: 110, render: (s) => <HPGlassesSVG size={s} />, defaultPos: { x: 140, y: 115 } },
  diamondcrown: { w: 104, render: (s) => <DiamondCrownSVG size={s} />, defaultPos: { x: 140, y: 10 } },
  shortcake: { w: 84, render: (s) => <ShortcakeSVG size={s} />, defaultPos: { x: 150, y: 220 } },
  wizardhat: { w: 84, render: (s) => <WizardHatSVG size={s} />, defaultPos: { x: 145, y: -4 } },
  santahat: { w: 76, render: (s) => <SantaHatSVG size={s} />, defaultPos: { x: 150, y: 6 } },
  cowboyhat: { w: 110, render: (s) => <CowboyHatSVG size={s} />, defaultPos: { x: 130, y: 10 } },
  flowercrown: { w: 100, render: (s) => <FlowerCrownSVG size={s} />, defaultPos: { x: 145, y: 34 } },
  gradcap: { w: 92, render: (s) => <GradCapSVG size={s} />, defaultPos: { x: 140, y: 4 } },
  partyhat: { w: 64, render: (s) => <PartyHatSVG size={s} />, defaultPos: { x: 160, y: -6 } },
  baseballcap: { w: 96, render: (s) => <BaseballCapSVG size={s} />, defaultPos: { x: 140, y: 8 } },
  cape: { w: 110, render: (s) => <CapeSVG size={s} />, defaultPos: { x: 130, y: 120 } },
  hoodie: { w: 120, render: (s) => <HoodieSVG size={s} />, defaultPos: { x: 120, y: 150 } },
  overalls: { w: 110, render: (s) => <OverallsSVG size={s} />, defaultPos: { x: 125, y: 160 } },
  headphones: { w: 96, render: (s) => <HeadphonesSVG size={s} />, defaultPos: { x: 135, y: 70 } },
  necklace: { w: 84, render: (s) => <NecklaceSVG size={s} />, defaultPos: { x: 145, y: 200 } },
};
