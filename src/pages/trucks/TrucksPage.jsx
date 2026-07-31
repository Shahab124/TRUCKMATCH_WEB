import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Truck } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import TruckCard from "../../components/trucks/TruckCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getMyTrucks, deleteTruck } from "../../api/trucks";
import { errorMessage } from "../../lib/errors";
import { useFetch } from "../../hooks/useFetch";
import { listContainer, fadeUp } from "../../components/motion/variants";

export default function TrucksPage() {
  const { data: trucks, loading, error, setData } = useFetch(getMyTrucks);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function handleDelete(id) {
    setDeletingId(id);
    setActionError("");
    try {
      await deleteTruck(id);
      setData((prev) => prev.filter((t) => t.id !== id)); // optimistic remove
    } catch (err) {
      setActionError(errorMessage(err, "Could not remove this truck."));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppLayout>
      <motion.div variants={fadeUp} initial="initial" animate="animate"
                  className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Trucks</h1>
          <p className="text-slate-500 mt-1">
            {loading ? "Loading your fleet..." : `${trucks?.length ?? 0} truck${trucks?.length === 1 ? "" : "s"} in your fleet`}
          </p>
        </div>
        <Link to="/trucks/new">
          <Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add truck</span></Button>
        </Link>
      </motion.div>

      {actionError && (
        <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5 mb-5">
          <p className="text-sm text-red-700">{actionError}</p>
        </div>
      )}

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

      {!loading && !error && trucks?.length === 0 && (
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center py-20">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No trucks yet</p>
          <p className="text-slate-400 text-sm mt-1 mb-5">Add a truck before you can post a trip.</p>
          <Link to="/trucks/new"><Button><Plus className="w-4 h-4" />Add your first truck</Button></Link>
        </motion.div>
      )}

      {!loading && !error && trucks?.length > 0 && (
        <motion.div variants={listContainer} initial="initial" animate="animate"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {trucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onDelete={handleDelete}
                deleting={deletingId === truck.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AppLayout>
  );
}
