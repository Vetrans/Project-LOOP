import { motion } from "framer-motion";
import {
  Sparkles,
  BarChart3,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

const icons = {
  "✨": Sparkles,
  "📈": BarChart3,
  "📦": AlertTriangle,
  "💡": Lightbulb,
};

export default function SuggestedQuestions({
  prompts,
  onSelect,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {prompts.map((prompt, index) => {
        const Icon = icons[prompt.icon] || Sparkles;

        return (
          <motion.button
            key={prompt.title}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => onSelect(prompt.title)}
            className="group rounded-2xl border border-white/10 bg-[#131C1C] p-6 text-left transition-all duration-300 hover:border-cyan-500/50 hover:bg-[#182424] hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg">
              <Icon size={24} />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-white transition group-hover:text-cyan-400">
              {prompt.title}
            </h3>

            <p className="text-sm leading-6 text-gray-400">
              {prompt.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}