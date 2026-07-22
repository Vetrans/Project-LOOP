import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";

export default function ExportAnalyticsModal({
  isOpen,
  onClose,
  onExport,
}) {
  if (!isOpen) return null;

  const options = [
    {
      title: "PDF",
      type: "pdf",
      icon: FileText,
      color: "from-red-500 to-pink-500",
      description: "Printable analytics report",
    },
    {
      title: "Excel",
      type: "excel",
      icon: FileSpreadsheet,
      color: "from-green-500 to-emerald-500",
      description: "Spreadsheet export",
    },
    {
      title: "CSV",
      type: "csv",
      icon: FileArchive,
      color: "from-cyan-500 to-blue-500",
      description: "Raw analytics data",
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
          initial={{ scale: .95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: .95, opacity: 0 }}
          className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111827]"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Export Analytics
              </h2>

              <p className="text-gray-400">
                Select export format
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <X className="text-gray-400" />
            </button>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-3">
            {options.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.type}
                  onClick={() => onExport(item.type)}
                  className="rounded-2xl border border-white/10 bg-[#1f2937] p-6 text-left transition hover:border-cyan-500"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
                  >
                    <Icon
                      className="text-white"
                      size={28}
                    />
                  </div>

                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-6 text-right">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}