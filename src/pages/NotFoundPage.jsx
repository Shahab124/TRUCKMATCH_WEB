import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-5xl font-bold text-slate-300 mb-2">404</p>
        <p className="text-slate-600 font-semibold mb-1">Page not found</p>
        <p className="text-slate-400 text-sm mb-6">That route doesn't exist yet.</p>
        <Link to="/loads" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          Back to my loads
        </Link>
      </div>
    </div>
  );
}