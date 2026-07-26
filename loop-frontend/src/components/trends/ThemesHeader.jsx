import { motion } from "framer-motion";
import { RefreshCw, TrendingUp } from "lucide-react";

const WEEK_OPTIONS = [4, 8, 12];

export default function ThemesHeader({
  weeks,
  onWeeksChange,
  onRefresh,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-cyan-500 shadow-lg">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">Theme Trends</h1>
          <p className="mt-1 text-gray-400">
            See which themes are growing, shrinking, or spiking week over week.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-xl border border-white/10">
          {WEEK_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => onWeeksChange(w)}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                weeks === w
                  ? "bg-purple-500 text-white"
                  : "bg-[#1f2937] text-gray-400 hover:text-white"
              }`}
            >
              {w}w
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-cyan-400 transition hover:bg-cyan-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </motion.div>
  );
}