import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import BookingCard from "../components/bookings/BookingCard";
import Spinner from "../components/ui/Spinner";
import { getMyBookings, acceptBooking, rejectBooking } from "../api/bookings";
import { errorMessage } from "../lib/errors";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { listContainer, fadeUp } from "../components/motion/variants";

export default function BookingsPage() {
  const { user } = useAuth();
  const isDriver = user?.role === "driver";

  const { data: bookings, loading, error, setData } = useFetch(getMyBookings);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function respond(id, action) {
    setBusyId(id);
    setActionError("");
    try {
      await action(id);
      const status = action === acceptBooking ? "accepted" : "rejected";
      setData((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch (err) {
      setActionError(errorMessage(err, "Could not update this booking."));
    } finally {
      setBusyId(null);
    }
  }

  // Drivers see incoming requests to act on; put pending ones first.
  const sorted = bookings
    ? [...bookings].sort((a, b) => (a.status === "pending" ? -1 : 1) - (b.status === "pending" ? -1 : 1))
    : [];

  return (
    <AppLayout>
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isDriver ? "Booking Requests" : "My Bookings"}
        </h1>
        <p className="text-slate-500 mt-1">
          {loading
            ? "Loading..."
            : isDriver
              ? "Shippers who want to book your trips."
              : "Trips you've requested to book."}
        </p>
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

      {!loading && !error && sorted.length === 0 && (
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center py-20">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No bookings yet</p>
          <p className="text-slate-400 text-sm mt-1">
            {isDriver ? "Requests appear here when a shipper books a trip." : "Book a trip and it shows up here."}
          </p>
        </motion.div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <motion.div variants={listContainer} initial="initial" animate="animate"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {sorted.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                canRespond={isDriver}
                onAccept={(id) => respond(id, acceptBooking)}
                onReject={(id) => respond(id, rejectBooking)}
                busy={busyId === booking.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AppLayout>
  );
}
