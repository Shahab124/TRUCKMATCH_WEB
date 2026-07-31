import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PackageOpen, CheckCircle2, Truck } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import TripCard from "../../components/trips/TripCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { getLoad } from "../../api/loads";
import { searchTrips } from "../../api/trips";
import { createBooking } from "../../api/bookings";
import { errorMessage } from "../../lib/errors";
import { useFetch } from "../../hooks/useFetch";
import { formatWeight } from "../../lib/format";
import { listContainer, fadeUp } from "../../components/motion/variants";

export default function MatchesPage() {
  const { loadId } = useParams();

  // One fetch, two calls: the load, then trips that fit its route + weight.
  const { data, loading, error } = useFetch(async () => {
    const load = await getLoad(loadId);
    const trips = await searchTrips({
      origin: load.origin,
      destination: load.destination,
      min_capacity: load.weight_tons,
    });
    return { load, trips };
  }, [loadId]);

  const [bookingId, setBookingId] = useState(null); // trip currently being booked
  const [booked, setBooked] = useState(null);        // the trip we successfully booked
  const [bookError, setBookError] = useState("");

  async function handleBook(trip) {
    setBookingId(trip.id);
    setBookError("");
    try {
      await createBooking({ trip_id: trip.id, load_id: loadId });
      setBooked(trip);
    } catch (err) {
      setBookError(errorMessage(err, "Could not book this trip. Try again."));
    } finally {
      setBookingId(null);
    }
  }

  const load = data?.load;
  const trips = data?.trips ?? [];
  const alreadyBooked = load && load.status !== "pending";

  return (
    <AppLayout>
      <Link to={`/loads/${loadId}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500
                       hover:text-slate-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to load
      </Link>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
          <Spinner className="w-5 h-5" /><span className="text-sm font-medium">Finding trucks...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && load && (
        <>
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find Trucks</h1>
            <p className="text-slate-500 mt-1">
              Trips going <span className="font-semibold text-slate-700">{load.origin} → {load.destination}</span> with
              room for <span className="font-semibold text-slate-700">{formatWeight(load.weight_tons)}</span>
            </p>
          </motion.div>

          {/* Success state after booking */}
          <AnimatePresence mode="wait">
            {booked ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-8 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-lg font-bold text-slate-900 mb-1">Booking requested</p>
                <p className="text-sm text-slate-600 mb-6">
                  Sent to the driver on {booked.origin} → {booked.destination}. They'll accept or decline it.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link to="/bookings"><Button>View my bookings</Button></Link>
                  <Link to="/loads"><Button variant="outline">Back to loads</Button></Link>
                </div>
              </motion.div>
            ) : alreadyBooked ? (
              <motion.div key="taken" variants={fadeUp} initial="initial" animate="animate"
                          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
                <Badge text={load.status} color="amber" />
                <p className="text-slate-700 font-semibold mt-3 mb-1">This load is already booked</p>
                <p className="text-slate-400 text-sm mb-5">You can track it from your bookings.</p>
                <Link to="/bookings"><Button>View my bookings</Button></Link>
              </motion.div>
            ) : (
              <motion.div key="list">
                {bookError && (
                  <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5 mb-5">
                    <p className="text-sm text-red-700">{bookError}</p>
                  </div>
                )}

                {trips.length === 0 ? (
                  <div className="text-center py-20">
                    <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-semibold">No matching trips yet</p>
                    <p className="text-slate-400 text-sm mt-1">
                      No driver has posted a trip on this route with enough room. Check back soon.
                    </p>
                  </div>
                ) : (
                  <motion.div variants={listContainer} initial="initial" animate="animate"
                              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {trips.map((trip) => (
                        <TripCard
                          key={trip.id}
                          trip={trip}
                          action={
                            <Button
                              onClick={() => handleBook(trip)}
                              disabled={bookingId === trip.id}
                              className="w-full"
                            >
                              {bookingId === trip.id ? <Spinner /> : <Truck className="w-4 h-4" />}
                              {bookingId === trip.id ? "Booking..." : "Book this trip"}
                            </Button>
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AppLayout>
  );
}
