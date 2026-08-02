import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail, Shield } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Stars from "../components/ui/Stars";
import { getMe, updateMe } from "../api/profile";
import { errorMessage } from "../lib/errors";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { fadeUp } from "../components/motion/variants";

export default function ProfilePage() {
  const { data: me, loading, error } = useFetch(getMe);
  const { refreshName } = useAuth();

  const [form, setForm] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Seed the form once the profile arrives.
  useEffect(() => {
    if (me) setForm({ name: me.name ?? "", phone: me.phone ?? "" });
  }, [me]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!form.phone.trim()) next.phone = "Enter a phone number";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateMe({ name: form.name.trim(), phone: form.phone.trim() });
      refreshName(updated.name); // keep the navbar in sync
      setSaved(true);
    } catch (err) {
      setSaveError(errorMessage(err, "Could not save your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout width="max-w-xl">
      <motion.h1 variants={fadeUp} initial="initial" animate="animate"
                 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
        Your profile
      </motion.h1>
      <p className="text-slate-600 mb-8">How shippers and drivers see you.</p>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-600" aria-live="polite">
          <Spinner className="w-5 h-5" /><span className="text-sm font-medium">Loading profile…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center" role="alert">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && me && (
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-5">

          {/* Identity summary. Email and role are shown but not editable. */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full bg-emerald-600 text-white
                              flex items-center justify-center text-xl font-bold"
                   aria-hidden="true">
                {me.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900 truncate">{me.name}</h2>
                  <Badge text={me.role} color="slate" />
                </div>
                <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  {me.email}
                </p>
                {me.rating_count > 0 ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Stars value={me.rating_avg} size="sm" />
                    <span className="text-xs text-slate-600">
                      {me.rating_avg} from {me.rating_count} rating{me.rating_count === 1 ? "" : "s"}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">
                    No ratings yet. Complete a booking to earn your first.
                  </p>
                )}
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Edit details</h2>

            {saveError && (
              <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5" role="alert" aria-live="polite">
                <p className="text-sm text-red-700">{saveError}</p>
              </div>
            )}

            <Input
              label="Full name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
              placeholder="Ali Raza"
            />

            <Input
              label="Phone"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              error={errors.phone}
              placeholder="03001234567"
            />

            <p className="text-xs text-slate-500 flex items-start gap-1.5">
              <Shield className="w-3.5 h-3.5 mt-px shrink-0 text-slate-400" aria-hidden="true" />
              Your email and account type cannot be changed here. Contact support if they are wrong.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" disabled={saving}>
                {saving && <Spinner />}
                {saving ? "Saving…" : "Save changes"}
              </Button>

              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  aria-live="polite"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700"
                >
                  <Check className="w-4 h-4" aria-hidden="true" /> Saved
                </motion.span>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </AppLayout>
  );
}
