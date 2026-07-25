import { motion } from "framer-motion";
import { RefreshCw, ShieldPlus, Users } from "lucide-react";

export default function MembersHeader({
  onRefresh,
  onInvite,
  isAdmin,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 flex flex-col gap-5 rounded-3xl border border-[#173331] bg-[#101C1B] p-6 shadow-lg md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-[#32E6A4]/15 p-4">
          <Users className="h-8 w-8 text-[#32E6A4]" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Workspace Members
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            {isAdmin
              ? "Invite teammates and manage who can access this workspace."
              : "Everyone with access to this workspace and their role."}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border border-[#173331] bg-[#0E1615] px-5 py-3 text-white transition hover:border-[#32E6A4] hover:bg-[#173331]"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

        {isAdmin && (
          <button
            onClick={onInvite}
            className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <ShieldPlus size={18} />
            Invite Member
          </button>
        )}
      </div>
    </motion.div>
  );
}