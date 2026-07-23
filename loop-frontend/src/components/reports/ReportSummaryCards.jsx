import { motion } from "framer-motion";
import {
  FileText,
  CalendarDays,
  Clock3,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  "Total Reports": FileText,
  "Generated Today": CalendarDays,
  "This Week": Clock3,
  "This Month": TrendingUp,
};

const colorMap = {
  "Total Reports": "from-cyan-500 to-blue-500",
  "Generated Today": "from-emerald-500 to-green-500",
  "This Week": "from-violet-500 to-purple-500",
  "This Month": "from-yellow-500 to-orange-500",
};

export default function ReportSummaryCards({ summary }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item, index) => {
        const Icon = iconMap[item.title] || FileText;

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
            className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
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

            <div className="mt-6">
              <span className="text-sm text-gray-500">
                {item.change}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}