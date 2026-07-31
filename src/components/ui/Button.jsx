export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const base = `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm
                font-semibold transition-all active:scale-95 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`;

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}