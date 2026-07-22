import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function RatingDistribution({ data }) {
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Rating Distribution
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Breakdown of customer ratings from 1 to 5 stars.
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={index}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span className="font-medium text-white">
                  {item.rating}
                </span>
              </div>

              <span className="text-sm text-gray-400">
                {item.count} Reviews
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(item.count / maxCount) * 100}%`,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                }}
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}