import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Inbox, Route, Truck, Bell, Plus, ArrowRight } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import StatTile from "../components/dashboard/StatTile";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { getSummary } from "../api/stats";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { listContainer, fadeUp } from "../components/motion/variants";

// Which tiles each role sees, and how to label the raw counts from the API.
const TILES = {
  shipper: [
    { key: "loads_total", label: "Total loads", icon: Package },
    { key: "loads_pending", label: "Awaiting a truck", icon: Clock },
    { key: "loads_booked", label: "Booked", icon: CheckCircle2 },
    { key: "bookings_total", label: "Bookings made", icon: Inbox },
  ],
  driver: [
    { key: "trips_total", label: "Trips posted", icon: Route },
    { key: "trucks_total", label: "Trucks", icon: Truck },
    { key: "requests_pending", label: "Pending requests", icon: Bell, accentWhenNonZero: true },
    { key: "bookings_accepted", label: "Accepted", icon: CheckCircle2 },
  ],
};

const ACTIONS = {
  shipper: [
    { to: "/loads/new", label: "Post a load", primary: true, icon: Plus },
    { to: "/loads", label: "View my loads" },
    { to: "/bookings", label: "View bookings" },
  ],
  driver: [
    { to: "/trips/new", label: "Post a trip", primary: true, icon: Plus },
    { to: "/trucks", label: "My trucks" },
    { to: "/bookings", label: "Booking requests" },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role === "driver" ? "driver" : "shipper";
  const { data, loading, error } = useFetch(getSummary);

  const tiles = TILES[role];
  const actions = ACTIONS[role];
  const stats = data?.stats ?? {};

  return (
    <AppLayout>
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-slate-500 mt-1">
          {role === "driver" ? "Here's your fleet at a glance." : "Here's your freight at a glance."}
        </p>
      </motion.div>

      {loading && (
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 h-32 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-slate-100 mb-4" />
              <div className="h-7 bg-slate-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center mb-10">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <motion.div
          variants={listContainer}
          initial="initial"
          animate="animate"
          className="grid gap-5 grid-cols-2 lg:grid-cols-4 mb-10"
        >
          {tiles.map((t) => (
            <StatTile
              key={t.key}
              icon={t.icon}
              label={t.label}
              value={stats[t.key] ?? 0}
              accent={t.accentWhenNonZero && (stats[t.key] ?? 0) > 0}
            />
          ))}
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div variants={fadeUp} initial="initial" animate="animate"
                  className="flex flex-wrap items-center gap-3">
        {actions.map((a) => (
          <Link key={a.to} to={a.to}>
            {a.primary ? (
              <Button>{a.icon && <a.icon className="w-4 h-4" />}{a.label}</Button>
            ) : (
              <Button variant="outline">
                {a.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </Link>
        ))}
      </motion.div>
    </AppLayout>
  );
}
