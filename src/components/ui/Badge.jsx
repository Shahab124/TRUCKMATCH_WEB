// Tints are kept light with a dark text pair so every badge clears WCAG AA.
const STYLES = {
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  sky: "bg-sky-50 text-sky-800 ring-sky-200",
  violet: "bg-violet-50 text-violet-800 ring-violet-200",
  amber: "bg-amber-50 text-amber-900 ring-amber-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Badge({ text, color = "slate" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                  ring-1 capitalize whitespace-nowrap ${STYLES[color] ?? STYLES.slate}`}
    >
      {String(text ?? "").replace(/_/g, " ")}
    </span>
  );
}
