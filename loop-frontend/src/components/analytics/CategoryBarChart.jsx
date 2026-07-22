import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
];

export default function CategoryBarChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Complaint Categories
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Most frequently reported customer issues.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
            />

            <XAxis
              dataKey="category"
              stroke="#9CA3AF"
            />

            <YAxis
              stroke="#9CA3AF"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="complaints"
              radius={[10, 10, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}