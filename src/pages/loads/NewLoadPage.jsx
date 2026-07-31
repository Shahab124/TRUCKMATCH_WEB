import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { createLoad } from "../../api/loads";
import { GOODS_TYPES } from "../../lib/constants";

const EMPTY_FORM = {
  origin: "",
  destination: "",
  pickup_date: "",
  weight_tons: "",
  goods_type: GOODS_TYPES[0],
  description: "",
};

export default function NewLoadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.origin.trim()) errors.origin = "Required";
    if (!form.destination.trim()) errors.destination = "Required";
    if (form.origin.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      errors.destination = "Must differ from origin";
    }
    if (!form.pickup_date) errors.pickup_date = "Required";
    if (!form.weight_tons) errors.weight_tons = "Required";
    else if (Number(form.weight_tons) <= 0) errors.weight_tons = "Must be greater than 0";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await createLoad({
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        pickup_date: form.pickup_date,
        weight_tons: Number(form.weight_tons),
        goods_type: form.goods_type,
        description: form.description.trim() || null,
      });
      navigate("/loads");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        const mapped = {};
        detail.forEach((d) => {
          const field = d.loc?.at(-1);
          if (field) mapped[field] = d.msg;
        });
        setFieldErrors(mapped);
        setError("Please fix the highlighted fields.");
      } else {
        setError(typeof detail === "string" ? detail : "Could not post this load. Try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-10">
        <Link to="/loads"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500
                         hover:text-slate-800 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to my loads
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Post a Load</h1>
        <p className="text-slate-500 mb-8">Tell drivers what you need moved.</p>

        <form onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">

          {error && (
            <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Origin"
              value={form.origin}
              onChange={(e) => updateField("origin", e.target.value)}
              error={fieldErrors.origin}
              placeholder="Lahore"
            />
            <Input
              label="Destination"
              value={form.destination}
              onChange={(e) => updateField("destination", e.target.value)}
              error={fieldErrors.destination}
              placeholder="Karachi"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Pickup date"
              type="date"
              value={form.pickup_date}
              onChange={(e) => updateField("pickup_date", e.target.value)}
              error={fieldErrors.pickup_date}
            />
            <Input
              label="Weight (tons)"
              type="number"
              step="0.1"
              min="0"
              value={form.weight_tons}
              onChange={(e) => updateField("weight_tons", e.target.value)}
              error={fieldErrors.weight_tons}
              placeholder="18"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Goods type</label>
            <select
              value={form.goods_type}
              onChange={(e) => updateField("goods_type", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                         text-slate-700 cursor-pointer focus:outline-none focus:ring-2
                         focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              {GOODS_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Description <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              placeholder="Handling notes, packaging, equipment needed..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                         placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2
                         focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving && <Spinner />}
              {saving ? "Posting..." : "Post load"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/loads")}>
              Cancel
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
}