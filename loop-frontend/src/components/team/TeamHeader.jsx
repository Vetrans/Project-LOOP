import { RefreshCw, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function TeamHeader({
  onRefresh,
  onAddMember,
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white"
        >
          Team Management
        </motion.h1>

        <p className="mt-2 text-gray-400">
          Manage your organization members, assign roles and monitor productivity.
        </p>
      </div>

      <div className="flex gap-3">

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border border-[#1D3432] bg-[#111B1A] px-5 py-3 text-white transition duration-300 hover:border-[#32E6A4]"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

        <button
          onClick={onAddMember}
          className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-5 py-3 font-semibold text-black transition duration-300 hover:scale-105"
        >
          <UserPlus size={18} />
          Add Member
        </button>

      </div>

    </div>
  );
}