import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const FALLBACK_COLORS = [
  "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444",
  "#EC4899", "#22D3EE", "#84CC16",
];

// The backend returns flat rows: [{ themeName, themeColor, week, count }].
// Recharts wants one array of { week, [themeA]: n, [themeB]: n, ... }.
function pivotSeries(rows) {
  const weekMap = new Map();
  const themeColors = new Map();

  for (const row of rows) {
    const asDate = new Date(row.week);
    const weekLabel = Number.isNaN(asDate.getTime())
      ? String(row.week)
      : asDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (!weekMap.has(weekLabel)) weekMap.set(weekLabel, { week: weekLabel });
    weekMap.get(weekLabel)[row.themeName] = row.count;

    if (row.themeColor && !themeColors.has(row.themeName)) {
      themeColors.set(row.themeName, row.themeColor);
    }
  }

  return {
    chartData: Array.from(weekMap.values()),
    themeNames: Array.from(new Set(rows.map((r) => r.themeName))),
    themeColors,
  };
}

export default function ThemeTrendChart({ series }) {
  const { chartData, themeNames, themeColors } = useMemo(
    () => pivotSeries(series || []),
    [series],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Theme Volume Over Time</h2>
        <p className="mt-1 text-sm text-gray-400">
          Weekly mention count per theme.
        </p>
      </div>

      {themeNames.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-gray-500">
          Not enough data yet to chart theme trends.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ color: "#D1D5DB" }} />

              {themeNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={themeColors.get(name) || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}