export default function Badge({ text, color = "slate" }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ring-1 capitalize ${styles[color]}`}>
      {text}
    </span>
  );
}