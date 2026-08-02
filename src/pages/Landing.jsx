import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Truck, ArrowRight, MapPin, Search, Handshake, Radio } from "lucide-react";
import TripMap from "../components/map/TripMap";
import Button from "../components/ui/Button";
import { useSimulatedPositions } from "../hooks/useSimulatedPositions";

// Real routes on a real map, positions simulated client side. Nothing here
// calls the API, so the landing page works signed out.
const DEMO_TRIPS = [
  { id: "d1", origin: "Karachi", destination: "Lahore", status: "open", available_capacity: 24 },
  { id: "d2", origin: "Multan", destination: "Islamabad", status: "open", available_capacity: 12 },
  { id: "d3", origin: "Quetta", destination: "Sukkur", status: "booked", available_capacity: 8 },
  { id: "d4", origin: "Peshawar", destination: "Faisalabad", status: "open", available_capacity: 18 },
];

const STEPS = [
  {
    icon: MapPin,
    title: "Post what you need moved",
    body: "Shippers list a load with its route, weight and pickup date. Drivers post the trips they are already running.",
  },
  {
    icon: Search,
    title: "See only the trucks that fit",
    body: "We match on route and remaining capacity, so a 15 ton load never shows a truck that cannot carry it.",
  },
  {
    icon: Handshake,
    title: "Book, confirm, deliver",
    body: "The driver accepts or declines. Both sides watch the same status timeline until the load is delivered and rated.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const ROLES = [
  {
    who: "For shippers",
    line: "Post a load and see every truck already heading that way with room to spare.",
    points: ["Post loads in under a minute", "Matched on route and capacity", "Track the load to delivery"],
    dark: true,
  },
  {
    who: "For drivers",
    line: "Fill the empty leg. Publish the trip you are running and let the freight come to you.",
    points: ["List your trucks and trips", "Accept or decline every request", "Build a rating that travels with you"],
    dark: false,
  },
];

export default function Landing() {
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState(null);
  const positions = useSimulatedPositions(DEMO_TRIPS, { enabled: !reduce });

  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-600" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight text-slate-900">TruckMatch</span>
          </span>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="outline">Sign in</Button></Link>
            <Link to="/register"><Button variant="accent">Get started</Button></Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero: asymmetric split, copy left, the real product right */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
            <motion.div
              initial={reduce ? false : reveal.initial}
              animate={reveal.animate}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter
                             text-slate-900 leading-[1.05]">
                Freight that finds
                <span className="text-emerald-600"> its truck</span>
              </h1>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-[46ch]">
                Pakistan runs on trucks that drive back empty. TruckMatch fills them.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/register">
                  <Button variant="accent" className="px-5 py-3">
                    Get started
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="px-5 py-3">Sign in</Button>
                </Link>
              </div>
            </motion.div>

            {/* The actual TripMap component, not a mockup of one. */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <TripMap
                trips={DEMO_TRIPS}
                positions={positions}
                selectedId={selectedId}
                onSelect={setSelectedId}
                className="h-[19rem] sm:h-[24rem] lg:h-[27rem]"
              />
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                Live tracking view. Positions on this page are simulated for demonstration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How it works: vertical numbered flow, not three equal cards */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <motion.h2
              initial={reduce ? false : reveal.initial}
              whileInView={reveal.animate}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-12"
            >
              How it works
            </motion.h2>

            <ol className="space-y-10">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-[auto_1fr] gap-5 sm:gap-7 items-start"
                >
                  <span className="shrink-0 inline-flex items-center justify-center w-11 h-11
                                   rounded-2xl bg-emerald-600 text-white">
                    <step.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1.5 text-slate-600 leading-relaxed max-w-[60ch]">{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Two sides of the marketplace */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-6">
            {ROLES.map((col, i) => (
              <motion.div
                key={col.who}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl p-7 sm:p-9 ${col.dark
                  ? "bg-slate-900"
                  : "bg-white border border-slate-200"}`}
              >
                <h3 className={`text-2xl font-bold tracking-tight ${col.dark ? "text-white" : "text-slate-900"}`}>
                  {col.who}
                </h3>
                <p className={`mt-3 leading-relaxed ${col.dark ? "text-slate-300" : "text-slate-600"}`}>
                  {col.line}
                </p>
                <ul className="mt-6 space-y-3">
                  {col.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0
                                        ${col.dark ? "bg-emerald-400" : "bg-emerald-600"}`}
                            aria-hidden="true" />
                      <span className={`text-sm ${col.dark ? "text-slate-200" : "text-slate-700"}`}>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Closing band, same CTA intent as the hero */}
        <section className="border-t border-slate-200 bg-slate-50">
          <motion.div
            initial={reduce ? false : reveal.initial}
            whileInView={reveal.animate}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Start moving freight
            </h2>
            <p className="mt-3 text-slate-600">Free to join as a shipper or a driver.</p>
            <Link to="/register" className="inline-block mt-7">
              <Button variant="accent" className="px-6 py-3">
                Get started
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <span className="font-bold tracking-tight text-slate-900">TruckMatch</span>
          </span>
          <p className="text-sm text-slate-500">Freight matching for Pakistan.</p>
        </div>
      </footer>
    </div>
  );
}
