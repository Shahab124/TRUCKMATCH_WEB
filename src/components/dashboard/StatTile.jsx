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

export default function StatTile({ icon: Icon, label, value, accent = false }) {
  return (
    <motion.div
      variants={listItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-2xl border p-5 shadow-sm ${
        accent ? "bg-emerald-600 border-emerald-600" : "bg-white border-slate-200"
      }`}
    >
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-4
                      ${accent ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className={`text-3xl font-bold tracking-tight ${accent ? "text-white" : "text-slate-900"}`}>
        <CountUp value={value} />
      </p>
      <p className={`text-sm mt-1 ${accent ? "text-emerald-50" : "text-slate-500"}`}>{label}</p>
    </motion.div>
  );
}
