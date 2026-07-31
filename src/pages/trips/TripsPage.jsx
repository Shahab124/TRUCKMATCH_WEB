import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Route } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import TripCard from "../../components/trips/TripCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getMyTrips } from "../../api/trips";
import { useFetch } from "../../hooks/useFetch";
import { listContainer, fadeUp } from "../../components/motion/variants";

export default function TripsPage() {
  const { data: trips, loading, error } = useFetch(getMyTrips);

  return (
    <AppLayout>
      <motion.div variants={fadeUp} initial="initial" animate="animate"
                  className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Trips</h1>
          <p className="text-slate-500 mt-1">
            {loading ? "Loading your trips..." : `${trips?.length ?? 0} posted trip${trips?.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link to="/trips/new">
          <Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Post a Trip</span></Button>
        </Link>
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
          <Spinner className="w-5 h-5" /><span className="text-sm font-medium">Loading...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && trips?.length === 0 && (
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center py-20">
          <Route className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No trips posted yet</p>
          <p className="text-slate-400 text-sm mt-1 mb-5">Post a trip and shippers can book it.</p>
          <Link to="/trips/new"><Button><Plus className="w-4 h-4" />Post your first trip</Button></Link>
        </motion.div>
      )}

      {!loading && !error && trips?.length > 0 && (
        <motion.div variants={listContainer} initial="initial" animate="animate"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </AppLayout>
  );
}
