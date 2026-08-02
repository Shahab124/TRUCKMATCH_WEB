export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...rest
}) {
  // touch-action:manipulation kills the 300ms double-tap zoom delay on mobile.
  // Explicit transition properties, never `transition: all`.
  const base = `inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm
                font-semibold cursor-pointer touch-manipulation whitespace-nowrap
                transition-[background-color,color,border-color,transform,box-shadow] duration-200
                active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`;

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus-visible:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
    accent: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
