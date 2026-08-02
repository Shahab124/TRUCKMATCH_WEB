import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Truck } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { errorMessage } from "../lib/errors";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "shipper", label: "Shipper", hint: "I have freight to move", icon: Package },
  { value: "driver", label: "Driver", hint: "I have a truck", icon: Truck },
];

export default function Register() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", role: "shipper",
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
      navigate("/", { replace: true }); // Home routes by role
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => `${d.loc?.at(-1)}: ${d.msg}`).join(" · "));
      } else {
        setError(errorMessage(err, "Could not create your account. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Move freight or find loads.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5"
               role="alert" aria-live="polite">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Role choice drives every permission in the app, so it leads the form. */}
        <fieldset>
          <legend className="block text-xs font-semibold text-slate-700 mb-1.5">I am a</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {ROLES.map(({ value, label, hint, icon: Icon }) => {
              const active = form.role === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => updateField("role", value)}
                  aria-pressed={active}
                  whileTap={{ scale: 0.97 }}
                  className={`text-left px-3.5 py-3 rounded-xl border-2 touch-manipulation
                              transition-colors duration-200
                              focus-visible:outline-none focus-visible:ring-2
                              focus-visible:ring-emerald-600 focus-visible:ring-offset-2
                    ${active
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${active ? "text-emerald-600" : "text-slate-400"}`}
                        aria-hidden="true" />
                  <span className={`block text-sm font-bold ${active ? "text-emerald-900" : "text-slate-800"}`}>
                    {label}
                  </span>
                  <span className={`block text-xs mt-0.5 ${active ? "text-emerald-700" : "text-slate-500"}`}>
                    {hint}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        <Input
          label="Full name" name="name" autoComplete="name"
          value={form.name} onChange={(e) => updateField("name", e.target.value)}
          placeholder="Ali Raza" required
        />

        <Input
          label="Email" name="email" type="email" inputMode="email"
          autoComplete="email" spellCheck={false}
          value={form.email} onChange={(e) => updateField("email", e.target.value)}
          placeholder="you@example.com" required
        />

        <Input
          label="Phone" name="tel" type="tel" inputMode="tel" autoComplete="tel"
          value={form.phone} onChange={(e) => updateField("phone", e.target.value)}
          placeholder="03001234567" required
        />

        <Input
          label="Password" name="password" type="password" autoComplete="new-password"
          value={form.password} onChange={(e) => updateField("password", e.target.value)}
          placeholder="At least 8 characters" required minLength={8}
          hint="Use at least 8 characters."
        />

        <Button type="submit" variant="accent" disabled={loading} className="w-full">
          {loading && <Spinner />}
          {loading ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-sm text-slate-600 pt-1">
          Already registered?{" "}
          <Link to="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800 rounded
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
