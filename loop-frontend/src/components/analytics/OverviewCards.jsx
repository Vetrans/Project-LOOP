import { motion } from "framer-motion";
import {
  MessageSquare,
  Smile,
  Frown,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const iconMap = {
  "Total Feedback": MessageSquare,
  "Positive Reviews": Smile,
  "Negative Reviews": Frown,
  "Average Rating": Star,
};

const colorMap = {
  "Total Feedback": "from-cyan-500 to-blue-500",
  "Positive Reviews": "from-emerald-500 to-green-500",
  "Negative Reviews": "from-red-500 to-rose-500",
  "Average Rating": "from-yellow-500 to-orange-500",
};

export default function OverviewCards({ stats }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = iconMap[item.title] || MessageSquare;
        const isPositive = item.trend === "up";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.35,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {item.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-white">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[item.title]}`}
              >
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}

              <span
                className={`font-semibold ${
                  isPositive
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {item.change}
              </span>

              <span className="text-sm text-gray-500">
                vs last month
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}