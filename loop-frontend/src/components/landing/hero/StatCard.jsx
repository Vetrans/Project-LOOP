import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  change,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/5
      p-4
      backdrop-blur-xl
    "
    >
      <p className="text-sm text-white/50">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>

      <span className="mt-2 inline-block rounded-full bg-[#32E6A4]/10 px-3 py-1 text-xs text-[#32E6A4]">
        {change}
      </span>
    </motion.div>
  );
}