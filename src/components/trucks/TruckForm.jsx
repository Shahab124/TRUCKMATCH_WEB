import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { TRUCK_TYPES } from "../../lib/constants";

const EMPTY = {
  registration_number: "",
  truck_type: TRUCK_TYPES[0],
  capacity_tons: "",
  model: "",
  year: "",
};

// Controlled create form for a truck. Parent handles the API call + navigation.
export default function TruckForm({ onSubmit, saving, formError }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.registration_number.trim()) e.registration_number = "Required";
    if (!form.model.trim()) e.model = "Required";
    if (!form.capacity_tons) e.capacity_tons = "Required";
    else if (Number(form.capacity_tons) <= 0) e.capacity_tons = "Must be greater than 0";
    if (!form.year) e.year = "Required";
    else if (Number(form.year) < 1980 || Number(form.year) > new Date().getFullYear() + 1) {
      e.year = "Enter a real year";
    }
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSubmit({
      registration_number: form.registration_number.trim().toUpperCase(),
      truck_type: form.truck_type,
      capacity_tons: Number(form.capacity_tons),
      model: form.model.trim(),
      year: Number(form.year),
    });
  }

  return (
    <form onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      {formError && (
        <div className="rounded-lg bg-red-50 ring-1 ring-red-200 px-3 py-2.5">
          <p className="text-sm text-red-700">{formError}</p>
        </div>
      )}

      <Input
        label="Registration number"
        value={form.registration_number}
        onChange={(e) => update("registration_number", e.target.value)}
        error={errors.registration_number}
        placeholder="LEA-1234"
      />

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Truck type</label>
        <select
          value={form.truck_type}
          onChange={(e) => update("truck_type", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                     text-slate-700 cursor-pointer focus:outline-none focus:ring-2
                     focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        >
          {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Model"
          value={form.model}
          onChange={(e) => update("model", e.target.value)}
          error={errors.model}
          placeholder="Hino 500"
        />
        <Input
          label="Capacity (tons)"
          type="number"
          step="0.5"
          min="0"
          value={form.capacity_tons}
          onChange={(e) => update("capacity_tons", e.target.value)}
          error={errors.capacity_tons}
          placeholder="20"
        />
      </div>

      <Input
        label="Year"
        type="number"
        value={form.year}
        onChange={(e) => update("year", e.target.value)}
        error={errors.year}
        placeholder="2019"
        className="sm:max-w-[10rem]"
      />

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving && <Spinner />}
        {saving ? "Adding..." : "Add truck"}
      </Button>
    </form>
  );
}
