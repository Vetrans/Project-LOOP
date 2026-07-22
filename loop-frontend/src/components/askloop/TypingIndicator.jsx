import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  const dots = [0, 1, 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex max-w-[75%] gap-3">
        {/* AI Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Bot size={20} className="text-white" />
        </div>

        {/* Typing Bubble */}
        <div className="rounded-3xl border border-white/10 bg-[#131C1C] px-5 py-4 shadow-lg">
          <div className="mb-2 text-sm font-medium text-gray-300">
            LOOP AI is thinking...
          </div>

          <div className="flex items-center gap-2">
            {dots.map((dot) => (
              <motion.span
                key={dot}
                className="h-2.5 w-2.5 rounded-full bg-cyan-400"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: dot * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}