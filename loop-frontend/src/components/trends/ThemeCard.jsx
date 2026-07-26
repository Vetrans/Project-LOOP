import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

const FALLBACK_COLORS = [
  "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444",
  "#EC4899", "#22D3EE", "#84CC16",
];

export default function ThemeCard({ theme, index, onSelect }) {
  const color = theme.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  const trendPct = theme.trendPct ?? 0;
  const isSpike = Math.abs(trendPct) >= 20;

  return (
    <motion.button
      onClick={() => onSelect(theme)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`group flex flex-col rounded-2xl border p-5 text-left transition ${
        isSpike
          ? "border-purple-500/40 bg-purple-500/5 hover:border-purple-400"
          : "border-white/10 bg-[#111827] hover:border-cyan-500/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-white">{theme.name}</h3>
        </div>

        <ChevronRight
          size={18}
          className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
        />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-white">{theme.count}</p>
          <p className="text-xs text-gray-500">mentions</p>
        </div>

        {trendPct !== 0 && (
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              trendPct > 0
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {trendPct > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trendPct)}%
          </span>
        )}

        {trendPct === 0 && (
          <span className="flex items-center gap-1 rounded-full bg-gray-500/15 px-2.5 py-1 text-xs font-semibold text-gray-400">
            <Minus size={12} />
            Flat
          </span>
        )}
      </div>

      {isSpike && (
        <p className="mt-3 text-xs font-medium text-purple-400">
          ⚡ Spiking — {trendPct > 0 ? "growing" : "dropping"} fast vs. last week
        </p>
      )}
    </motion.button>
  );
}