import { motion } from "framer-motion";

import {
  Save,
  RotateCcw,
  XCircle,
  CheckCircle2,
} from "lucide-react";

export default function SaveSettings({
  onSave,
  onCancel,
  onReset,
  loading = false,
  lastSaved = "Never",
}) {
  const hasSaved = lastSaved !== "Never";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky bottom-0 z-20 mt-8 rounded-3xl border border-[#173331] bg-[#101C1B]/95 p-6 shadow-2xl backdrop-blur-md"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Status */}

        <div className="flex items-center gap-3">

          <div
            className={`rounded-full p-3 ${
              hasSaved
                ? "bg-[#32E6A4]/15"
                : "bg-yellow-500/15"
            }`}
          >
            <CheckCircle2
              className={`h-6 w-6 ${
                hasSaved
                  ? "text-[#32E6A4]"
                  : "text-yellow-400"
              }`}
            />
          </div>

          <div>

            <h3 className="font-semibold text-white">
              Settings Status
            </h3>

            <p className="text-sm text-gray-400">

              Last Saved :

              <span className="ml-2 font-medium text-[#32E6A4]">
                {lastSaved}
              </span>

            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-yellow-500 px-5 py-3 text-yellow-400 transition hover:bg-yellow-500/10 disabled:opacity-60"
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-red-500 px-5 py-3 text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            <XCircle size={18} />
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onSave}
            className="flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </motion.div>
  );
}