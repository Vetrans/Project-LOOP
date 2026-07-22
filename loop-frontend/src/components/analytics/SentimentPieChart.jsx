import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#10B981", // Positive
  "#FBBF24", // Neutral
  "#EF4444", // Negative
];

export default function SentimentPieChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Customer Sentiment
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Overall sentiment distribution based on customer feedback.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                color: "#D1D5DB",
                paddingTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}