import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import TruckForm from "../../components/trucks/TruckForm";
import { createTruck } from "../../api/trucks";
import { errorMessage } from "../../lib/errors";

export default function NewTruckPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(payload) {
    setSaving(true);
    setError("");
    try {
      await createTruck(payload);
      navigate("/trucks");
    } catch (err) {
      setError(errorMessage(err, "Could not add this truck. Try again."));
      setSaving(false);
    }
  }

  return (
    <AppLayout width="max-w-xl">
      <Link to="/trucks"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500
                       hover:text-slate-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to my trucks
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Add a Truck</h1>
      <p className="text-slate-500 mb-8">Register a vehicle so you can post trips with it.</p>

      <TruckForm onSubmit={handleSubmit} saving={saving} formError={error} />
    </AppLayout>
  );
}
