import { useId } from "react";

export default function Input({ label, error, hint, className = "", id, ...rest }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const base = `w-full px-4 py-2.5 rounded-lg border bg-white text-sm text-slate-900
                placeholder:text-slate-400 transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`;

  const state = error
    ? "border-red-400 focus-visible:ring-red-500 focus-visible:border-red-500"
    : "border-slate-300 focus-visible:ring-emerald-600 focus-visible:border-emerald-600";

  return (
    <div className={className}>
      {label && (
        // htmlFor makes the label clickable, which also enlarges the hit target.
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${base} ${state}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1.5">{error}</p>
      )}
      {!error && hint && (
        <p id={hintId} className="text-xs text-slate-500 mt-1.5">{hint}</p>
      )}
    </div>
  );
}
