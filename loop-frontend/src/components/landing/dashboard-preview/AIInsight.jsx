import { BrainCircuit, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  {
    title: "Positive sentiment increased",
    value: "+18%",
    icon: TrendingUp,
  },
  {
    title: "Checkout complaints reduced",
    value: "-12%",
    icon: Sparkles,
  },
  {
    title: "AI Confidence",
    value: "98%",
    icon: BrainCircuit,
  },
];

export default function AIInsight() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        rounded-2xl
        border
        border-[#32E6A4]/20
        bg-gradient-to-br
        from-[#12211C]
        to-[#0D1514]
        p-6
      "
    >
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-[#32E6A4]/15 p-3">
          <BrainCircuit
            size={24}
            className="text-[#32E6A4]"
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">
            AI Assistant
          </h3>

          <p className="text-sm text-white/50">
            Generated insights
          </p>
        </div>

      </div>

      <div className="mt-6 space-y-4">

        {insights.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-white/5
                bg-white/5
                p-4
              "
            >
              <div className="flex items-center gap-3">

                <Icon
                  size={18}
                  className="text-[#32E6A4]"
                />

                <span className="text-white/70">
                  {item.title}
                </span>

              </div>

              <span className="font-semibold text-[#32E6A4]">
                {item.value}
              </span>

            </div>
          );

        })}

      </div>

      <div className="mt-6 rounded-xl bg-[#32E6A4]/10 p-4">

        <p className="text-sm leading-7 text-white/70">

          Based on customer feedback from the last
          7 days, AI recommends prioritizing the
          checkout experience before introducing
          new features.

        </p>

      </div>

    </motion.div>
  );
}