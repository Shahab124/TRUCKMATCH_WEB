import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const OVERLAY = {
  // Dark scrim for white text. Emerald tint keeps photos on-brand.
  dark: "bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-slate-950/25",
  emerald: "bg-gradient-to-tr from-emerald-950/90 via-emerald-900/50 to-slate-950/40",
  soft: "bg-gradient-to-t from-slate-950/60 to-transparent",
  none: "",
};

/**
 * One photo surface used everywhere: hero bands, role cards, auth pages.
 * `parallax` drifts the image against the scroll, which is the only motion
 * here and it is off under reduced-motion.
 */
export default function PhotoPanel({
  src,
  alt,
  overlay = "dark",
  parallax = false,
  priority = false,
  className = "",
  children,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Drift is small on purpose. Big parallax reads as a gimmick.
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const animate = parallax && !reduce;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        style={animate ? { y, scale: 1.16 } : undefined}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay !== "none" && (
        <div className={`absolute inset-0 ${OVERLAY[overlay]}`} aria-hidden="true" />
      )}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
