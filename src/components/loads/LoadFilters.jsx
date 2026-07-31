import { Search } from "lucide-react";
import { GOODS_TYPES } from "../../lib/constants";

export default function LoadFilters({ search, onSearchChange, goodsType, onGoodsTypeChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">

      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search origin, destination or goods..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                     placeholder:text-slate-400 focus:outline-none focus:ring-2
                     focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>

      <select
        value={goodsType}
        onChange={(e) => onGoodsTypeChange(e.target.value)}
        className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm
                   text-slate-700 cursor-pointer focus:outline-none focus:ring-2
                   focus:ring-emerald-500 focus:border-emerald-500 transition-all"
      >
        <option value="all">All goods types</option>
        {GOODS_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

    </div>
  );
}