import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Truck } from "lucide-react";
import PhotoPanel from "../ui/PhotoPanel";
import authPhoto from "../../assets/photos/depot.webp";

/**
 * Split screen shell for sign in and sign up. The photo panel is hidden below
 * lg so small screens get the form full width instead of a squeezed image.
 */
export default function AuthLayout({ title, subtitle, children }) {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-2 bg-white">
      {/* Form side */}
      <div className="flex items-center justify-center px-5 sm:px-8 py-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8 rounded
                                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            <Truck className="w-7 h-7 text-emerald-600" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">TruckMatch</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-slate-600 mt-1 mb-7">{subtitle}</p>}

          {children}
        </motion.div>
      </div>

      {/* Photo side */}
      <PhotoPanel
        src={authPhoto}
        alt="A freight truck on a mountain road at dusk"
        overlay="emerald"
        className="hidden lg:block"
      >
        <div className="h-full flex items-end p-12">
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <p className="text-2xl font-bold tracking-tight text-white leading-snug">
              Freight moves when the right truck is already going your way.
            </p>
            <p className="mt-3 text-emerald-100/80 text-sm">
              Match loads to trips across Pakistan.
            </p>
          </motion.blockquote>
        </div>
      </PhotoPanel>
    </div>
  );
}
