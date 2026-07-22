import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#050B0B] py-28">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#32E6A4]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#101817] to-[#0B1212] p-14 text-center"
        >
          <span className="rounded-full border border-[#32E6A4]/30 bg-[#32E6A4]/10 px-4 py-2 text-sm font-medium text-[#32E6A4]">
            🚀 Start Today
          </span>

          <h2 className="mx-auto mt-8 max-w-3xl text-5xl font-black leading-tight text-white">
            Turn Customer Feedback Into
            <span className="block text-[#32E6A4]">
              Business Growth
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Join thousands of companies using LOOP to understand
            customers, discover trends, and make smarter decisions
            powered by AI.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <button className="rounded-xl bg-[#32E6A4] px-8 py-4 font-semibold text-black transition hover:scale-105">
              Get Started Free
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-white transition hover:border-[#32E6A4] hover:text-[#32E6A4]">
              Book Demo
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}