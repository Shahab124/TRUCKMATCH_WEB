import { motion, useReducedMotion } from "framer-motion";
import { Check, X, Package, Truck, Star } from "lucide-react";
import { formatDateTime } from "../../lib/format";

// Tones match lib/status.js so a state reads the same colour everywhere.
const STEP = {
  pending: { icon: Package, label: "Booking requested", tone: "amber" },
  accepted: { icon: Check, label: "Driver accepted", tone: "emerald" },
  rejected: { icon: X, label: "Driver declined", tone: "slate" },
  completed: { icon: Truck, label: "Delivered", tone: "violet" },
  rated: { icon: Star, label: "Rated", tone: "amber" },
};

const TONE = {
  emerald: "bg-emerald-600 text-white ring-emerald-100",
  violet: "bg-violet-600 text-white ring-violet-100",
  amber: "bg-amber-500 text-white ring-amber-100",
  slate: "bg-slate-400 text-white ring-slate-100",
};

export default function StatusTimeline({ events = [] }) {
  const reduce = useReducedMotion();

  if (events.length === 0) return null;

  return (
    <ol className="relative">
      {events.map((event, i) => {
        const step = STEP[event.status] ?? { icon: Package, label: event.status, tone: "slate" };
        const Icon = step.icon;
        const last = i === events.length - 1;

        return (
          <motion.li
            key={`${event.status}-${event.at}-${i}`}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {/* Connector grows downward as the next entry arrives. */}
            {!last && (
              <motion.span
                aria-hidden="true"
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, delay: i * 0.09 + 0.15, ease: "easeOut" }}
                className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-200 origin-top"
              />
            )}

            <span className={`relative z-10 shrink-0 inline-flex items-center justify-center
                              w-8 h-8 rounded-full ring-4 ${TONE[step.tone]}`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
            </span>

            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-slate-900">{step.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatDateTime(event.at)}
                {event.by ? ` by ${event.by}` : ""}
              </p>
              {event.note && (
                <p className="text-xs text-slate-600 mt-1">{event.note}</p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
