import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import WakingNotice from "../components/ui/WakingNotice";
import { errorMessage } from "../lib/errors";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    params.get("expired") ? "Your session expired. Please sign in again." : ""
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/", { replace: true }); // Home routes by role
    } catch (err) {
      setError(errorMessage(err, "Login failed. Check your email and password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your freight.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <WakingNotice pending={loading} />

        {error && (
          <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5"
               role="alert" aria-live="polite">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" variant="accent" disabled={loading} className="w-full">
          {loading && <Spinner />}
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-slate-600 pt-1">
          No account?{" "}
          <Link to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 rounded
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
