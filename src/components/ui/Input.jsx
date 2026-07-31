export default function Input({ label, error, className = "", ...rest }) {
  const base = `w-full px-4 py-2.5 rounded-lg border bg-white text-sm
                placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`;

  const state = error
    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
    : "border-slate-300 focus:ring-emerald-500 focus:border-emerald-500";

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      )}
      <input className={`${base} ${state}`} {...rest} />
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}