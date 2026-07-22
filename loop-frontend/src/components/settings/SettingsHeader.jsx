import { motion } from "framer-motion";
import { Settings, RefreshCw, Save } from "lucide-react";

export default function SettingsHeader({
  onRefresh,
  onSave,
  loading = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 flex flex-col gap-5 rounded-3xl border border-[#173331] bg-[#101C1B] p-6 shadow-lg md:flex-row md:items-center md:justify-between"
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-[#32E6A4]/15 p-4">
          <Settings className="h-8 w-8 text-[#32E6A4]" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Manage your profile, security, notifications, AI preferences and organization settings.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[#173331] bg-[#0E1615] px-5 py-3 text-white transition hover:border-[#32E6A4] hover:bg-[#173331]"
        >
          <RefreshCw
            className={`h-5 w-5 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-[1.03] hover:bg-[#2bd99b]"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}