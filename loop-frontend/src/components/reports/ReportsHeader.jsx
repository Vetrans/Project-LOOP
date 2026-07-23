import { motion } from "framer-motion";
import { FileText, Download, RefreshCw, Sparkles } from "lucide-react";

export default function ReportsHeader({
  onRefresh,
  onExport,
  onGenerate,
  generating = false,
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Reports Center
          </h1>

          <p className="mt-1 text-gray-400">
            Generate, preview and export customer feedback reports.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {today}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3 font-medium text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles size={18} />
          {generating ? "Generating..." : "Generate Report"}
        </button>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 font-medium text-white transition hover:scale-105"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>
    </motion.div>
  );
}