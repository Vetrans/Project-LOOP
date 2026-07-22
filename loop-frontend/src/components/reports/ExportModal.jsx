import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
}) {
  if (!isOpen) return null;

  const exportOptions = [
    {
      title: "PDF Report",
      type: "pdf",
      icon: FileText,
      color: "from-red-500 to-rose-500",
      description: "Professional printable report",
    },
    {
      title: "Excel Report",
      type: "excel",
      icon: FileSpreadsheet,
      color: "from-emerald-500 to-green-500",
      description: "Spreadsheet for further analysis",
    },
    {
      title: "CSV Report",
      type: "csv",
      icon: FileArchive,
      color: "from-cyan-500 to-blue-500",
      description: "Raw data export",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
            y: 20,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111827] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Export Report
              </h2>

              <p className="mt-1 text-gray-400">
                Choose your preferred export format.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-3">
            {exportOptions.map((option) => {
              const Icon = option.icon;

              return (
                <motion.button
                  key={option.type}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => onExport(option.type)}
                  className="rounded-2xl border border-white/10 bg-[#1f2937] p-6 text-left transition hover:border-cyan-500/40"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color}`}
                  >
                    <Icon
                      className="text-white"
                      size={28}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {option.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-6 text-right">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-700 px-6 py-3 text-white transition hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}