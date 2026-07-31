import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import TripForm from "../../components/trips/TripForm";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getMyTrucks } from "../../api/trucks";
import { createTrip } from "../../api/trips";
import { errorMessage } from "../../lib/errors";
import { useFetch } from "../../hooks/useFetch";

export default function NewTripPage() {
  const navigate = useNavigate();
  const { data: trucks, loading, error } = useFetch(getMyTrucks);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(payload) {
    setSaving(true);
    setFormError("");
    try {
      await createTrip(payload);
      navigate("/trips");
    } catch (err) {
      setFormError(errorMessage(err, "Could not post this trip. Try again."));
      setSaving(false);
    }
  }

  return (
    <AppLayout width="max-w-xl">
      <Link to="/trips"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500
                       hover:text-slate-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to my trips
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Post a Trip</h1>
      <p className="text-slate-500 mb-8">Offer your spare capacity on a route.</p>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
          <Spinner className="w-5 h-5" /><span className="text-sm font-medium">Loading your trucks...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Can't post a trip without a truck — send them to add one first. */}
      {!loading && !error && trucks?.length === 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold mb-1">Add a truck first</p>
          <p className="text-slate-400 text-sm mb-5">A trip needs a truck to carry the load.</p>
          <Link to="/trucks/new"><Button>Add a truck</Button></Link>
        </div>
      )}

      {!loading && !error && trucks?.length > 0 && (
        <TripForm trucks={trucks} onSubmit={handleSubmit} saving={saving} formError={formError} />
      )}
    </AppLayout>
  );
}
