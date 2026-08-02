import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "shipper",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      await login(form.email, form.password);
      navigate("/", { replace: true }); // HomeRedirect routes by role
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => `${d.loc?.at(-1)}: ${d.msg}`).join(" · "));
      } else {
        setError("Could not create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                      placeholder:text-slate-400 focus:outline-none focus:ring-2
                      focus:ring-emerald-500 focus:border-emerald-500 transition-all`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-center gap-2 mb-8">
          <Truck className="w-7 h-7 text-emerald-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">TruckMatch</span>
        </div>

        <form onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h1 className="text-lg font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">Move freight or find loads.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">I am a</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["shipper", "driver"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => updateField("role", role)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold capitalize border transition-all
                  ${form.role === role
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
              >
                {role}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label>
          <input value={form.name} onChange={(e) => updateField("name", e.target.value)}
                 placeholder="Ali Raza" className={`${inputClass} mb-4`} required />

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)}
                 placeholder="you@example.com" className={`${inputClass} mb-4`} required />

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
          <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)}
                 placeholder="03001234567" className={`${inputClass} mb-4`} required />

          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
          <input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)}
                 placeholder="At least 8 characters" className={`${inputClass} mb-6`} required minLength={8} />

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Spinner />}
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}