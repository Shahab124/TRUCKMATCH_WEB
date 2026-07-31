import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/loads", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                      placeholder:text-slate-400 focus:outline-none focus:ring-2
                      focus:ring-emerald-500 focus:border-emerald-500 transition-all`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-center gap-2 mb-8">
          <Truck className="w-7 h-7 text-emerald-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">TruckMatch</span>
        </div>

        <form onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h1 className="text-lg font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to manage your freight.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="shipper@test.com" className={`${inputClass} mb-4`} required />

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••" className={`${inputClass} mb-6`} required />

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Spinner />}
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-slate-500 mt-5">
            No account?{" "}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Create one
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}