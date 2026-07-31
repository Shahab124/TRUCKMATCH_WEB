import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoadsPage from "./pages/loads/LoadsPage";
import NewLoadPage from "./pages/loads/NewLoadPage";
import LoadDetailPage from "./pages/loads/LoadDetailPage";
import TrucksPage from "./pages/trucks/TrucksPage";
import NewTruckPage from "./pages/trucks/NewTruckPage";
import TripsPage from "./pages/trips/TripsPage";
import NewTripPage from "./pages/trips/NewTripPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PageTransition from "./components/motion/PageTransition";
import { useAuth } from "./context/AuthContext";

// Send each role to its own home instead of dumping everyone on /loads
// (which is shipper-only and 403s for drivers).
function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.role === "driver" ? "/trips" : "/loads"} replace />;
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

        <Route path="/loads" element={<Page><LoadsPage /></Page>} />
        <Route path="/loads/new" element={<Page><NewLoadPage /></Page>} />
        <Route path="/loads/:loadId" element={<Page><LoadDetailPage /></Page>} />

        <Route path="/trucks" element={<Page><TrucksPage /></Page>} />
        <Route path="/trucks/new" element={<Page><NewTruckPage /></Page>} />
        <Route path="/trips" element={<Page><TripsPage /></Page>} />
        <Route path="/trips/new" element={<Page><NewTripPage /></Page>} />

        <Route path="*" element={<Page guard={false}><NotFoundPage /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}
