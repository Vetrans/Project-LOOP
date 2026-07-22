import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialCard({
  name,
  role,
  company,
  review,
  rating,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="rounded-[28px] border border-white/10 bg-[#101817] p-8 transition-all"
    >
      <div className="flex gap-1 text-[#32E6A4]">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            size={18}
            fill="currentColor"
          />
        ))}
      </div>

      <p className="mt-6 leading-8 text-white/70">
        "{review}"
      </p>

      <div className="mt-8">
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-white/50 text-sm">
          {role} • {company}
        </p>
      </div>
    </motion.div>
  );
}