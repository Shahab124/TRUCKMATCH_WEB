import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

// Controlled create form for a trip. Needs the driver's trucks for the picker.
// Selecting a truck pre-fills available capacity with that truck's capacity.
export default function TripForm({ trucks, onSubmit, saving, formError }) {
  const [form, setForm] = useState({
    truck_id: trucks[0]?.id ?? "",
    origin: "",
    destination: "",
    travel_date: "",
    available_capacity: trucks[0]?.capacity_tons ?? "",
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function selectTruck(id) {
    const truck = trucks.find((t) => t.id === id);
    setForm((prev) => ({
      ...prev,
      truck_id: id,
      // Only overwrite capacity if the driver hasn't typed their own.
      available_capacity: prev.available_capacity === "" ? truck?.capacity_tons ?? "" : prev.available_capacity,
    }));
  }

  function validate() {
    const e = {};
    if (!form.truck_id) e.truck_id = "Pick a truck";
    if (!form.origin.trim()) e.origin = "Required";
    if (!form.destination.trim()) e.destination = "Required";
    if (form.origin.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      e.destination = "Must differ from origin";
    }
    if (!form.travel_date) e.travel_date = "Required";
    if (!form.available_capacity) e.available_capacity = "Required";
    else if (Number(form.available_capacity) <= 0) e.available_capacity = "Must be greater than 0";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSubmit({
      truck_id: form.truck_id,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      travel_date: form.travel_date,
      available_capacity: Number(form.available_capacity),
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

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Truck</label>
        <select
          value={form.truck_id}
          onChange={(e) => selectTruck(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                     text-slate-700 cursor-pointer focus:outline-none focus:ring-2
                     focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        >
          {trucks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.registration_number} · {t.truck_type} · {t.capacity_tons}t
            </option>
          ))}
        </select>
        {errors.truck_id && <p className="text-xs text-red-600 mt-1.5">{errors.truck_id}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Origin"
          value={form.origin}
          onChange={(e) => update("origin", e.target.value)}
          error={errors.origin}
          placeholder="Lahore"
        />
        <Input
          label="Destination"
          value={form.destination}
          onChange={(e) => update("destination", e.target.value)}
          error={errors.destination}
          placeholder="Karachi"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Travel date"
          type="date"
          value={form.travel_date}
          onChange={(e) => update("travel_date", e.target.value)}
          error={errors.travel_date}
        />
        <Input
          label="Available capacity (tons)"
          type="number"
          step="0.5"
          min="0"
          value={form.available_capacity}
          onChange={(e) => update("available_capacity", e.target.value)}
          error={errors.available_capacity}
          placeholder="18"
        />
      </div>

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving && <Spinner />}
        {saving ? "Posting..." : "Post trip"}
      </Button>
    </form>
  );
}
