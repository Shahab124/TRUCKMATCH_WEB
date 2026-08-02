import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoadsPage from "./pages/loads/LoadsPage";
import NewLoadPage from "./pages/loads/NewLoadPage";
import LoadDetailPage from "./pages/loads/LoadDetailPage";
import MatchesPage from "./pages/loads/MatchesPage";
import TrucksPage from "./pages/trucks/TrucksPage";
import NewTruckPage from "./pages/trucks/NewTruckPage";
import TripsPage from "./pages/trips/TripsPage";
import NewTripPage from "./pages/trips/NewTripPage";
import BookingsPage from "./pages/BookingsPage";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PageTransition from "./components/motion/PageTransition";

// Send each role to its own home instead of dumping everyone on /loads
// (which is shipper-only and 403s for drivers).
function HomeRedirect() {
  return <Navigate to="/dashboard" replace />;
}

// Wrap a page in the protected + transition chrome once instead of per-route.
function Page({ children, guard = true }) {
  const content = <PageTransition>{children}</PageTransition>;
  return guard ? <ProtectedRoute>{content}</ProtectedRoute> : content;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />

        <Route path="/login" element={<Page guard={false}><Login /></Page>} />
        <Route path="/register" element={<Page guard={false}><Register /></Page>} />

        <Route path="/dashboard" element={<Page><Dashboard /></Page>} />

        <Route path="/loads" element={<Page><LoadsPage /></Page>} />
        <Route path="/loads/new" element={<Page><NewLoadPage /></Page>} />
        <Route path="/loads/:loadId" element={<Page><LoadDetailPage /></Page>} />
        <Route path="/loads/:loadId/matches" element={<Page><MatchesPage /></Page>} />

        <Route path="/trucks" element={<Page><TrucksPage /></Page>} />
        <Route path="/trucks/new" element={<Page><NewTruckPage /></Page>} />
        <Route path="/trips" element={<Page><TripsPage /></Page>} />
        <Route path="/trips/new" element={<Page><NewTripPage /></Page>} />

        <Route path="/bookings" element={<Page><BookingsPage /></Page>} />
        <Route path="/map" element={<Page><MapPage /></Page>} />

        <Route path="*" element={<Page guard={false}><NotFoundPage /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}
