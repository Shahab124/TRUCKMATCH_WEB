export default function LoadCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-5 bg-slate-100 rounded-full w-16 shrink-0" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-full mb-2" />
      <div className="h-3 bg-slate-100 rounded w-4/5 mb-5" />
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-2.5 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-3.5 bg-slate-200 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}