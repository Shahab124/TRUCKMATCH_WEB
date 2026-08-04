import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * The API is on a free tier that sleeps after inactivity, so the very first
 * request of a visit can take up to a minute while the container wakes.
 * A spinner alone reads as "broken", so once a request has been pending for
 * a few seconds we say what is actually happening.
 *
 * Delete this component if the API moves to an always-on plan.
 */
export default function WakingNotice({ pending, delay = 4000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!pending) {
      setShow(false);
      return;
    }
    const id = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(id);
  }, [pending, delay]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          role="status"
          aria-live="polite"
          className="flex items-start gap-2.5 rounded-xl bg-amber-50 ring-1 ring-amber-200
                     px-4 py-3 text-sm text-amber-900"
        >
          <Loader2 className="w-4 h-4 mt-0.5 shrink-0 animate-spin" aria-hidden="true" />
          <p>
            Waking the server. The demo runs on a free plan that sleeps when idle,
            so the first load can take up to a minute. Later pages are fast.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
