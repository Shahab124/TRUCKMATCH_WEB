import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Check, X, ArrowRight } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { formatDate } from "../../lib/format";
import { listItem } from "../motion/variants";
import { statusColor } from "../../lib/status";

// One booking row. Accept/Reject show only for a driver on a pending request;
// everyone else just sees the current status.
export default function BookingCard({ booking, canRespond, onAccept, onReject, busy }) {
  const pending = booking.status === "pending";

  return (
    <motion.div
      layout
      variants={listItem}
      exit="exit"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-slate-900 min-w-0">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <h3 className="font-bold leading-tight truncate">
            {booking.origin} → {booking.destination}
          </h3>
        </div>
        <Badge text={booking.status} color={statusColor(booking.status)} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Calendar className="w-3 h-3" aria-hidden="true" />
        Requested {formatDate(booking.created_at)}
      </div>

      <Link
        to={`/bookings/${booking.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700
                   hover:text-emerald-800 rounded transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        View progress
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>

      {canRespond && pending && (
        <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
          <Button variant="accent" onClick={() => onAccept(booking.id)} disabled={busy} className="flex-1">
            {busy ? <Spinner /> : <Check className="w-4 h-4" aria-hidden="true" />} Accept
          </Button>
          <Button variant="outline" onClick={() => onReject(booking.id)} disabled={busy} className="flex-1">
            <X className="w-4 h-4" aria-hidden="true" /> Decline
          </Button>
        </div>
      )}
    </motion.div>
  );
}
