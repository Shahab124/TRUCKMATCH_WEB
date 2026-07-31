import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Package, Weight, Calendar, Trash2, Truck } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getLoad, deleteLoad } from "../../api/loads";
import { formatWeight, formatDate } from "../../lib/format";
import { statusColor } from "../../lib/status";

export default function LoadDetailPage() {
  const { loadId } = useParams();
  const navigate = useNavigate();

  const [load, setLoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    async function fetchLoad() {
      try {
        const data = await getLoad(loadId);
        if (!cancelled) setLoad(data);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.status === 404
          ? "That load no longer exists."
          : "Could not load this shipment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLoad();
    return () => { cancelled = true; };
  }, [loadId]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteLoad(loadId);
      navigate("/loads", { replace: true });
    } catch {
      setError("Could not delete this load.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  const rows = load ? [
    { icon: MapPin, label: "Route", value: `${load.origin} → ${load.destination}` },
    { icon: Calendar, label: "Pickup date", value: formatDate(load.pickup_date) },
    { icon: Weight, label: "Weight", value: formatWeight(load.weight_tons) },
    { icon: Package, label: "Goods type", value: load.goods_type },
  ] : [];

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

        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
            <Spinner className="w-5 h-5" />
            <span className="text-sm font-medium">Loading shipment...</span>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && load && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
                  {load.origin} → {load.destination}
                </h1>
                <p className="text-sm text-slate-400 mt-1">Load #{load.id.slice(-6)}</p>
              </div>
             <Badge text={load.status} color={statusColor(load.status)} />
            </div>

            <dl className="divide-y divide-slate-100">
              {rows.map(({ icon: Icon, label, value }) => (
                <div key={label} className="px-6 py-4 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                  </dt>
                  <dd className="text-sm font-semibold text-slate-800 text-right">{value}</dd>
                </div>
              ))}
            </dl>

            {load.description && (
              <div className="px-6 py-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Notes</p>
                <p className="text-sm text-slate-600 leading-relaxed">{load.description}</p>
              </div>
            )}

            {load.status === "pending" && (
              <div className="px-6 py-4 border-t border-slate-100">
                <Link to={`/loads/${load.id}/matches`}>
                  <Button className="w-full sm:w-auto">
                    <Truck className="w-4 h-4" />
                    Find trucks for this load
                  </Button>
                </Link>
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              {!confirming ? (
                <Button variant="outline" onClick={() => setConfirming(true)}>
                  <Trash2 className="w-4 h-4" />
                  Delete load
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-slate-700 flex-1">Delete permanently?</p>
                  <Button variant="outline" onClick={() => setConfirming(false)} disabled={deleting}>
                    Keep
                  </Button>
                  <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting && <Spinner />}
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}