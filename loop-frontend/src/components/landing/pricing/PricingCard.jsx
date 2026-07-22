import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingCard({
  name,
  price,
  period,
  features,
  popular,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`relative rounded-[30px] border p-8 transition-all duration-300 ${
        popular
          ? "border-[#32E6A4] bg-[#0F1F1A]"
          : "border-white/10 bg-[#101817]"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#32E6A4] px-4 py-2 text-sm font-semibold text-black flex items-center gap-2">
          <Sparkles size={16} />
          Most Popular
        </div>
      )}

      <h3 className="mt-4 text-2xl font-bold">{name}</h3>

      <div className="mt-6 flex items-end gap-1">
        <span className="text-5xl font-black">{price}</span>
        <span className="mb-1 text-white/60">{period}</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check size={18} className="text-[#32E6A4]" />
            <span className="text-white/70">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-10 w-full rounded-xl py-3 font-semibold transition ${
          popular
            ? "bg-[#32E6A4] text-black hover:opacity-90"
            : "border border-white/20 hover:border-[#32E6A4] hover:text-[#32E6A4]"
        }`}
      >
        Get Started
      </button>
    </motion.div>
  );
}