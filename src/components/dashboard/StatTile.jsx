import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { listItem } from "../motion/variants";

// Number that counts up from 0 to `value` over ~0.8s (easeOutCubic).
function CountUp({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // rAF is paused while the tab is hidden and pointless under reduced-motion —
    // snap to the real number so it's never stuck at 0.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.hidden) {
      setDisplay(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 800);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span>{display}</span>;
}

// Each metric carries its own icon tint so a row of tiles is readable at a glance.
const TINT = {
  emerald: "bg-emerald-50 text-emerald-700",
  sky: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-600",
};

export default function StatTile({ icon: Icon, label, value, tint = "slate", accent = false }) {
  return (
    <motion.div
      variants={listItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`rounded-2xl border p-5 transition-shadow duration-300
        ${accent
          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-700 shadow-lg shadow-emerald-600/25"
          : "bg-white border-slate-200 shadow-sm hover:shadow-md"}`}
    >
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-4
                      ${accent ? "bg-white/20 text-white" : TINT[tint]}`}>
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <p className={`text-3xl font-bold tracking-tight tabular-nums
                     ${accent ? "text-white" : "text-slate-900"}`}>
        <CountUp value={value} />
      </p>
      <p className={`text-sm mt-1 ${accent ? "text-emerald-50" : "text-slate-600"}`}>{label}</p>
    </motion.div>
  );
}
