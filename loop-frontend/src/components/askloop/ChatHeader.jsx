import { motion } from "framer-motion";
import { Bot, Sparkles, Plus, ShieldCheck } from "lucide-react";

export default function ChatHeader({ title, onNewChat }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between border-b border-white/10 bg-linear-to-r from-[#0F172A] via-[#0B1F2A] to-[#102A43] px-6 py-5"
    >
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-emerald-500 shadow-lg">
          <Bot className="h-7 w-7 text-white" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">
              LOOP AI Assistant
            </h2>
            <Sparkles className="h-5 w-5 shrink-0 text-yellow-400" />
          </div>

          <p
            className="mt-1 truncate text-sm font-medium text-gray-300"
            title={title}
          >
            {title}
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>AI Ready • Secure • Real-Time Analysis</span>
          </div>
        </div>
      </div>

      {/* Right Section — creates a new conversation, doesn't touch this one */}
      <button
        onClick={onNewChat}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
      >
        <Plus size={18} />
        New Chat
      </button>
    </motion.div>
  );
}