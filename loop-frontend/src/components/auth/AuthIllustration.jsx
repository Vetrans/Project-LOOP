import { Brain, BarChart3, MessageSquareText } from "lucide-react";

export default function AuthIllustration() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600/10 via-transparent to-emerald-500/10 p-10">

      <div className="absolute h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center gap-8">

        <div className="rounded-full bg-cyan-500/20 p-8">
          <Brain size={70} className="text-cyan-400" />
        </div>

        <div className="grid gap-4">

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111818]/80 p-4">
            <BarChart3 className="text-cyan-400" />
            <span>Real-time Analytics</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111818]/80 p-4">
            <MessageSquareText className="text-emerald-400" />
            <span>AI Feedback Intelligence</span>
          </div>

        </div>

      </div>

    </div>
  );
}