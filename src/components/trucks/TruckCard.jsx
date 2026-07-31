import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Weight, Calendar, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import { formatWeight } from "../../lib/format";
import { listItem } from "../motion/variants";
import { statusColor } from "../../lib/status";

// Presentational card. Delete lives in the parent; the card just asks + calls back.
export default function TruckCard({ truck, onDelete, deleting }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <motion.div
      layout
      variants={listItem}
      exit="exit"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-slate-900 min-w-0">
          <Truck className="w-4 h-4 text-slate-400 shrink-0" />
          <h3 className="font-bold leading-tight truncate">{truck.registration_number}</h3>
        </div>
        <Badge
          text={truck.is_active ? "active" : "inactive"}
          color={statusColor(truck.is_active ? "active" : "closed")}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-slate-400 mb-1">Type</p>
          <p className="text-sm font-semibold text-slate-700 truncate">{truck.truck_type}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Weight className="w-3 h-3" /> Capacity
          </p>
          <p className="text-sm font-semibold text-slate-700">{formatWeight(truck.capacity_tons)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3" /> Year
          </p>
          <p className="text-sm font-semibold text-slate-700">{truck.year}</p>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">{truck.model}</p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500
                     hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Remove
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-slate-700 flex-1">Remove this truck?</p>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            Keep
          </button>
          <button
            onClick={() => onDelete(truck.id)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            {deleting && <Spinner />}
            {deleting ? "Removing..." : "Remove"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
