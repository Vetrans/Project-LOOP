import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function FeedbackTrendChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Monthly Feedback Trend
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Customer feedback received over the last 7 months.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
            />

            <XAxis
              dataKey="month"
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

            <Line
              type="monotone"
              dataKey="feedback"
              stroke="#06B6D4"
              strokeWidth={4}
              dot={{
                fill: "#06B6D4",
                r: 5,
              }}
              activeDot={{
                r: 8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}