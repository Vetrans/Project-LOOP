import { motion } from "framer-motion";
import { Bot, Sparkles, Trash2, ShieldCheck } from "lucide-react";

export default function ChatHeader({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0F172A] via-[#0B1F2A] to-[#102A43] px-6 py-5"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg">
          <Bot className="h-7 w-7 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">
              LOOP AI Assistant
            </h2>

            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>AI Ready • Secure • Real-Time Analysis</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <button
        onClick={onClear}
        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
      >
        <Trash2 size={18} />
        New Chat
      </button>
    </motion.div>
  );
}