import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function LogoutCard({ onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-red-500/20 bg-[#101C1B] p-6 shadow-lg"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-500/15 p-3">
            <LogOut className="h-6 w-6 text-red-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Log Out</h2>
            <p className="mt-1 text-sm text-gray-400">
              Sign out of LOOP AI on this device. You'll need to log back in
              to access your workspace again.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-red-500 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </motion.div>
  );
}