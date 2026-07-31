import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoadsPage from "./pages/loads/LoadsPage";
import NewLoadPage from "./pages/loads/NewLoadPage";
import LoadDetailPage from "./pages/loads/LoadDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PageTransition from "./components/motion/PageTransition";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/loads" replace />} />

        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        <Route path="/loads" element={
          <ProtectedRoute><PageTransition><LoadsPage /></PageTransition></ProtectedRoute>
        } />
        <Route path="/loads/new" element={
          <ProtectedRoute><PageTransition><NewLoadPage /></PageTransition></ProtectedRoute>
        } />
        <Route path="/loads/:loadId" element={
          <ProtectedRoute><PageTransition><LoadDetailPage /></PageTransition></ProtectedRoute>
        } />

        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}