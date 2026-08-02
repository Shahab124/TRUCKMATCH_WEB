import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, PackageCheck } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import StatusTimeline from "../components/bookings/StatusTimeline";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Stars from "../components/ui/Stars";
import { getBooking, completeBooking, rateBooking } from "../api/bookings";
import { errorMessage } from "../lib/errors";
import { useFetch } from "../hooks/useFetch";
import { statusColor } from "../lib/status";
import { fadeUp } from "../components/motion/variants";

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const { data: booking, loading, error, reload } = useFetch(
    () => getBooking(bookingId), [bookingId]
  );

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [stars, setStars] = useState(0);
  const [note, setNote] = useState("");
  const [rated, setRated] = useState(false);

  async function handleComplete() {
    setBusy(true);
    setActionError("");
    try {
      await completeBooking(bookingId);
      reload();
    } catch (err) {
      setActionError(errorMessage(err, "Could not mark this delivered. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleRate(e) {
    e.preventDefault();
    if (stars === 0) {
      setActionError("Pick a star rating first.");
      return;
    }
    setBusy(true);
    setActionError("");
    try {
      await rateBooking(bookingId, { stars, note: note.trim() || null });
      setRated(true);
      reload();
    } catch (err) {
      setActionError(errorMessage(err, "Could not save your rating. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  const canComplete = booking?.status === "accepted";
  const canRate = booking?.status === "completed" && !rated;

  return (
    <AppLayout width="max-w-2xl">
      <Link to="/bookings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600
                       hover:text-slate-900 transition-colors mb-6 rounded
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to bookings
      </Link>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-600" aria-live="polite">
          <Spinner className="w-5 h-5" />
          <span className="text-sm font-medium">Loading booking…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center" role="alert">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && booking && (
        <motion.div variants={fadeUp} initial="initial" animate="animate">
          <header className="flex items-start justify-between gap-4 mb-8">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{booking.origin} to {booking.destination}</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Booking #{booking.id.slice(-6)}</p>
            </div>
            <Badge text={booking.status} color={statusColor(booking.status)} />
          </header>

          {actionError && (
            <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5 mb-5" role="alert" aria-live="polite">
              <p className="text-sm text-red-700">{actionError}</p>
            </div>
          )}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
            <h2 className="text-sm font-bold text-slate-900 mb-5">Progress</h2>
            <StatusTimeline events={booking.events} />
          </section>

          <AnimatePresence mode="wait">
            {canComplete && (
              <motion.section
                key="complete"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <h2 className="text-sm font-bold text-slate-900 mb-1">Delivered?</h2>
                <p className="text-sm text-slate-600 mb-4">
                  Confirm once the load has arrived. Either party can confirm.
                </p>
                <Button variant="accent" onClick={handleComplete} disabled={busy}>
                  {busy ? <Spinner /> : <PackageCheck className="w-4 h-4" aria-hidden="true" />}
                  {busy ? "Confirming…" : "Mark as delivered"}
                </Button>
              </motion.section>
            )}

            {canRate && (
              <motion.form
                key="rate"
                onSubmit={handleRate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <h2 className="text-sm font-bold text-slate-900 mb-1">How did it go?</h2>
                <p className="text-sm text-slate-600 mb-4">
                  Your rating helps others know who to work with.
                </p>

                <Stars value={stars} onChange={setStars} size="lg" label="Rate this booking" />

                <label htmlFor="rating-note" className="block text-xs font-semibold text-slate-700 mt-5 mb-1.5">
                  Add a note <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <textarea
                  id="rating-note"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="On time, cargo in good condition…"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                             text-slate-900 placeholder:text-slate-400 resize-none transition-colors
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600
                             focus-visible:border-emerald-600"
                />

                <Button type="submit" variant="accent" disabled={busy} className="mt-4">
                  {busy && <Spinner />}
                  {busy ? "Saving…" : "Submit rating"}
                </Button>
              </motion.form>
            )}

            {rated && (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-6 text-center"
                aria-live="polite"
              >
                <Stars value={stars} size="md" />
                <p className="text-sm font-semibold text-slate-900 mt-2">Thanks for the feedback</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AppLayout>
  );
}
