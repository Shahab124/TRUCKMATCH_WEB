import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Play, MapPin, Info } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TripMap from "../components/map/TripMap";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { getMyTrips, getActiveLocations } from "../api/trips";
import { useFetch } from "../hooks/useFetch";
import { useSimulatedPositions } from "../hooks/useSimulatedPositions";
import { useAuth } from "../context/AuthContext";
import { cityLatLng } from "../lib/cities";
import { listContainer, listItem, fadeUp } from "../components/motion/variants";

export default function MapPage() {
  const { user } = useAuth();
  const isDriver = user?.role === "driver";

  // Demo mode simulates movement; live mode shows real reported positions.
  const [demo, setDemo] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Drivers map their own trips; shippers see every trip reporting a position.
  const { data, loading, error, reload } = useFetch(
    () => (isDriver ? getMyTrips() : getActiveLocations()),
    [isDriver]
  );

  const trips = useMemo(() => data ?? [], [data]);

  // Only trips whose cities we can place can appear on the map.
  const mappable = useMemo(
    () => trips.filter((t) => cityLatLng(t.origin) && cityLatLng(t.destination)),
    [trips]
  );

  const simulated = useSimulatedPositions(mappable, { enabled: demo });

  // Real positions come straight off the API payload.
  const live = useMemo(() => {
    const out = {};
    for (const t of trips) {
      if (t.current_lat != null && t.current_lng != null) out[t.id] = [t.current_lat, t.current_lng];
    }
    return out;
  }, [trips]);

  const positions = demo ? simulated : live;

  // Poll for fresh positions in live mode. THIS is the real feed.
  useEffect(() => {
    if (demo) return;
    const id = setInterval(reload, 10000);
    return () => clearInterval(id);
  }, [demo, reload]);

  const visible = mappable.filter((t) => positions[t.id]);

  return (
    <AppLayout width="max-w-7xl">
      <motion.div variants={fadeUp} initial="initial" animate="animate"
                  className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Map</h1>
          <p className="text-slate-500 mt-1">
            {loading ? "Loading trips..." : `${visible.length} truck${visible.length === 1 ? "" : "s"} on the map`}
          </p>
        </div>

        {/* Demo vs live is an explicit, visible choice — never pretend simulated data is GPS. */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100" role="group" aria-label="Position source">
          <button
            onClick={() => setDemo(true)}
            aria-pressed={demo}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all
              ${demo ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Play className="w-3.5 h-3.5" /> Simulate
          </button>
          <button
            onClick={() => setDemo(false)}
            aria-pressed={!demo}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all
              ${!demo ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Radio className="w-3.5 h-3.5" /> Live
          </button>
        </div>
      </motion.div>

      {/* Be honest about what the user is looking at. */}
      <motion.div variants={fadeUp} initial="initial" animate="animate"
                  className={`flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-sm ring-1
                    ${demo ? "bg-amber-50 ring-amber-200 text-amber-800" : "bg-slate-50 ring-slate-200 text-slate-600"}`}>
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          {demo
            ? "Demo mode. Positions are simulated along each route, not real GPS. Use it to show the map working without hardware."
            : "Live mode. Showing the last position each driver reported. Trucks appear here once a driver reports in."}
        </p>
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
          <Spinner className="w-5 h-5" /><span className="text-sm font-medium">Loading trips...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
          <TripMap
            trips={mappable}
            positions={positions}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="h-[24rem] sm:h-[32rem] lg:h-[36rem]"
          />

          {/* Trip list — tap one to draw its route. */}
          <motion.div variants={listContainer} initial="initial" animate="animate" className="space-y-3">
            <AnimatePresence mode="popLayout">
              {visible.map((trip) => (
                <motion.button
                  key={trip.id}
                  layout
                  variants={listItem}
                  exit="exit"
                  onClick={() => setSelectedId(selectedId === trip.id ? null : trip.id)}
                  aria-pressed={selectedId === trip.id}
                  className={`w-full text-left rounded-2xl border p-4 transition-all
                    ${selectedId === trip.id
                      ? "bg-emerald-50 border-emerald-300 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {trip.origin} → {trip.destination}
                      </span>
                    </div>
                    <Badge text={trip.status} color={trip.status === "open" ? "emerald" : "amber"} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {trip.available_capacity} tons available
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>

            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-sm font-semibold text-slate-600 mb-1">No trucks reporting</p>
                <p className="text-xs text-slate-400">
                  {demo
                    ? "Post a trip between two known cities to see it move."
                    : "Switch to Simulate for a demo, or have a driver report a position."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
