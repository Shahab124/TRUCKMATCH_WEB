import { Star } from "lucide-react";
import { motion } from "framer-motion";

const SIZES = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };

/**
 * Read-only when `onChange` is omitted, an interactive radio group when given.
 * One component instead of a separate display and input pair.
 */
export default function Stars({ value = 0, onChange, size = "md", label }) {
  const interactive = Boolean(onChange);
  const cls = SIZES[size];

  if (!interactive) {
    return (
      <span className="inline-flex items-center gap-0.5" role="img"
            aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            aria-hidden="true"
            className={`${cls} ${n <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"}`}
          />
        ))}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label={label ?? "Rating"} className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          // Hit target stays finger-sized even though the glyph is small.
          className="p-1.5 rounded-md touch-manipulation
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <Star
            aria-hidden="true"
            className={`${cls} transition-colors ${n <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-300"}`}
          />
        </motion.button>
      ))}
    </div>
  );
}
