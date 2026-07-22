import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function RecentInsights({ insights }) {
  const icons = [
    <TrendingUp className="h-5 w-5 text-emerald-400" />,
    <CheckCircle2 className="h-5 w-5 text-cyan-400" />,
    <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    <Sparkles className="h-5 w-5 text-purple-400" />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500">
          <Sparkles className="h-6 w-6 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            AI Insights
          </h2>

          <p className="text-sm text-gray-400">
            Automatically generated business recommendations.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.08,
            }}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0F172A] p-4 transition hover:border-cyan-500/40"
          >
            <div className="mt-1">
              {icons[index % icons.length]}
            </div>

            <p className="leading-7 text-gray-300">
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}