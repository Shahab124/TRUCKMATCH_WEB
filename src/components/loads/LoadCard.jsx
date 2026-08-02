import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Package, Weight, Calendar } from "lucide-react";
import Badge from "../ui/Badge";
import { formatWeight, formatDate } from "../../lib/format";
import { listItem, liftOnHover } from "../motion/variants";
import { statusColor } from "../../lib/status";

export default function LoadCard({ load }) {
  return (
    <motion.div layout variants={listItem} exit="exit" {...liftOnHover}>
      <Link
        to={`/loads/${load.id}`}
        className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm
                   hover:shadow-xl hover:border-emerald-300 transition-shadow duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600
                   focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-slate-900 min-w-0">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <h3 className="font-bold leading-tight truncate">
              {load.origin} → {load.destination}
            </h3>
          </div>
         <Badge text={load.status} color={statusColor(load.status)} />
        </div>

        {load.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{load.description}</p>
        )}

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="min-w-0">
            <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Package className="w-3 h-3" /> Goods
            </p>
            <p className="text-sm font-semibold text-slate-700 truncate">{load.goods_type}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Weight className="w-3 h-3" /> Weight
            </p>
            <p className="text-sm font-semibold text-slate-700">{formatWeight(load.weight_tons)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3" /> Pickup
            </p>
            <p className="text-sm font-semibold text-slate-700">{formatDate(load.pickup_date)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}