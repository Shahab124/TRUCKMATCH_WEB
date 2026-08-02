import { motion } from "framer-motion";
import { MapPin, Weight, Calendar } from "lucide-react";
import Badge from "../ui/Badge";
import { formatWeight, formatDate } from "../../lib/format";
import { listItem, liftOnHover } from "../motion/variants";
import { statusColor } from "../../lib/status";

// A driver's posted trip. Same visual language as LoadCard.
// `action` lets a parent slot in a button (e.g. "Book this trip") without
// TripCard knowing anything about bookings.
export default function TripCard({ trip, action }) {
  return (
    <motion.div
      layout
      variants={listItem}
      exit="exit"
      {...liftOnHover}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm
                 hover:shadow-xl hover:border-emerald-300 transition-shadow duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-slate-900 min-w-0">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <h3 className="font-bold leading-tight truncate">
            {trip.origin} → {trip.destination}
          </h3>
        </div>
        <Badge text={trip.status} color={statusColor(trip.status)} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Weight className="w-3 h-3" /> Available
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {formatWeight(trip.available_capacity)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3" /> Travel date
          </p>
          <p className="text-sm font-semibold text-slate-700">{formatDate(trip.travel_date)}</p>
        </div>
      </div>

      {action && <div className="mt-4 pt-4 border-t border-slate-100">{action}</div>}
    </motion.div>
  );
}
