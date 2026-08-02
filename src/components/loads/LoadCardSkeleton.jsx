export default function LoadCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5" aria-hidden="true">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-4 shimmer rounded w-2/3" />
        <div className="h-5 shimmer rounded-full w-16 shrink-0" />
      </div>
      <div className="h-3 shimmer rounded w-full mb-2" />
      <div className="h-3 shimmer rounded w-4/5 mb-5" />
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-2.5 shimmer rounded w-3/4 mb-2" />
            <div className="h-3.5 shimmer rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
