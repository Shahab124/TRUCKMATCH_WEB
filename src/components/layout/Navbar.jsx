import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Plus, LogOut, Menu, X, Package, Route, Inbox, LayoutDashboard, Map } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";

// Nav is driven by role. Add a link here when its page ships — one source of truth.
const NAV = {
  shipper: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/loads", label: "My Loads", icon: Package },
    { to: "/bookings", label: "Bookings", icon: Inbox },
    { to: "/map", label: "Live Map", icon: Map },
  ],
  driver: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/trips", label: "My Trips", icon: Route },
    { to: "/trucks", label: "My Trucks", icon: Truck },
    { to: "/bookings", label: "Bookings", icon: Inbox },
    { to: "/map", label: "Live Map", icon: Map },
  ],
};

const ACTION = {
  shipper: { to: "/loads/new", label: "Post a Load" },
  driver: { to: "/trips/new", label: "Post a Trip" },
};

const linkBase =
  "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = user?.role === "driver" ? "driver" : "shipper";
  const links = NAV[role];
  const action = ACTION[role];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0">
          <Truck className="w-6 h-6 text-emerald-600" />
          <span className="text-lg font-bold tracking-tight text-slate-900">TruckMatch</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 mr-auto ml-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 pl-1 pr-2 py-1 rounded-full
                         hover:bg-slate-100 transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold
                               flex items-center justify-center" aria-hidden="true">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </span>
              <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              <Badge text={user.role} color="slate" />
            </Link>
          )}

          <Link to={action.to} className="hidden sm:block">
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">{action.label}</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleLogout}
            aria-label="Log out"
            className="hidden md:inline-flex"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg
                       text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={`${linkBase} w-full mb-1 border-b border-slate-100 rounded-none pb-3`}
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold
                                   flex items-center justify-center" aria-hidden="true">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                  <span className="text-slate-800">{user.name}</span>
                  <Badge text={user.role} color="slate" />
                </Link>
              )}

              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} w-full ${isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"}`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}

              <Link
                to={action.to}
                onClick={() => setOpen(false)}
                className={`${linkBase} w-full text-emerald-700 hover:bg-emerald-50`}
              >
                <Plus className="w-4 h-4" />
                {action.label}
              </Link>

              <button
                onClick={handleLogout}
                className={`${linkBase} w-full text-slate-600 hover:bg-slate-50`}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
