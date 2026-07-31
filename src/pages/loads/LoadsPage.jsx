import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, PackageOpen } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import LoadCard from "../../components/loads/LoadCard";
import LoadCardSkeleton from "../../components/loads/LoadCardSkeleton";
import LoadFilters from "../../components/loads/LoadFilters";
import Button from "../../components/ui/Button";
import { getMyLoads } from "../../api/loads";
import { errorMessage } from "../../lib/errors";
import { listContainer, fadeUp } from "../../components/motion/variants";

export default function LoadsPage() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [goodsType, setGoodsType] = useState("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    async function fetchLoads() {
      try {
        const data = await getMyLoads();
        if (!cancelled) setLoads(data);
      } catch (err) {
        if (cancelled) return;
        setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLoads();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const visibleLoads = loads.filter((load) => {
    const haystack = `${load.origin} ${load.destination} ${load.goods_type}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase().trim());
    const matchesGoods = goodsType === "all" || load.goods_type === goodsType;
    return matchesSearch && matchesGoods;
  });

  function renderContent() {
    if (loading) {
      return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <LoadCardSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-6 text-center"
        >
          <p className="text-sm font-semibold text-red-700 mb-4">{error}</p>
          <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
            Try again
          </Button>
        </motion.div>
      );
    }

    if (loads.length === 0) {
      return (
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center py-20">
          <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No loads posted yet</p>
          <p className="text-slate-400 text-sm mt-1">Your posted freight will appear here.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={listContainer}
        initial="initial"
        animate="animate"
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleLoads.map((load) => (
            <LoadCard key={load.id} load={load} />
          ))}
        </AnimatePresence>

        {visibleLoads.length === 0 && (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="col-span-full text-center py-16"
          >
            <p className="text-slate-600 font-semibold">No loads match your filters</p>
            <p className="text-slate-400 text-sm mt-1">Try another city or goods type</p>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex items-start justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Loads</h1>
            <p className="text-slate-500 mt-1">
              {loading ? "Fetching from your API..." : `Showing ${visibleLoads.length} of ${loads.length} loads`}
            </p>
          </div>
          <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </motion.div>

        <LoadFilters
          search={search}
          onSearchChange={setSearch}
          goodsType={goodsType}
          onGoodsTypeChange={setGoodsType}
        />

        {renderContent()}
      </main>
    </div>
  );
}