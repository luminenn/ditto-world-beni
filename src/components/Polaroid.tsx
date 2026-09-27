import { motion } from "framer-motion";
import { useState } from "react";
import { Camera } from "lucide-react";

const TAPE_COLORS = ["rgba(243,165,255,0.55)", "rgba(163,230,210,0.55)", "rgba(253,240,166,0.6)", "rgba(200,182,240,0.6)"];

export function Polaroid({
  src,
  alt,
  caption,
  rotate = 0,
  className = "",
  tapeIndex = 0,
}: {
  src?: string;
  alt: string;
  caption?: string;
  rotate?: number;
  className?: string;
  tapeIndex?: number;
}) {
  const [broken, setBroken] = useState(false);
  const showPlaceholder = !src || broken;

  return (
    <motion.div
      className={`pointer-events-auto select-none ${className}`}
      style={{
        rotate,
        background: "#FFFFFF",
        borderRadius: 4,
        padding: "10px 10px 22px",
        boxShadow: "0 14px 28px rgba(46,21,71,0.18)",
      }}
      whileHover={{ rotate: 0, scale: 1.06, boxShadow: "0 18px 34px rgba(46,21,71,0.26)" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 -translate-x-1/2"
        style={{
          width: 44,
          height: 16,
          background: TAPE_COLORS[tapeIndex % TAPE_COLORS.length],
          border: "1px solid rgba(255,255,255,0.5)",
          transform: "translateX(-50%) rotate(-2deg)",
        }}
      />
      <div
        className="relative overflow-hidden"
        style={{ width: "100%", aspectRatio: "4 / 5", background: "var(--muted)" }}
      >
        {!showPlaceholder && (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setBroken(true)}
          />
        )}
        {showPlaceholder && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[var(--muted-foreground)] opacity-60">
            <Camera size={20} />
            <span className="text-[9px] font-bold">photo soon</span>
          </div>
        )}
      </div>
      {caption && (
        <p className="mt-1.5 text-center text-[10px] font-bold text-[var(--ditto-deep)]">{caption}</p>
      )}
    </motion.div>
  );
}
