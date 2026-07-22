import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  member,
  onClose,
  onDelete,
}) {
  return (
    <AnimatePresence>
      {open && member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-3xl border border-[#173331] bg-[#111B1A] shadow-2xl"
          >
            <div className="p-8">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15">
                <AlertTriangle
                  size={40}
                  className="text-red-500"
                />
              </div>

              <h2 className="mt-6 text-center text-2xl font-bold text-white">
                Delete Team Member
              </h2>

              <p className="mt-4 text-center text-gray-400">
                Are you sure you want to remove
              </p>

              <h3 className="mt-2 text-center text-xl font-semibold text-[#32E6A4]">
                {member.name}
              </h3>

              <p className="mt-4 text-center text-sm text-red-400">
                This action cannot be undone.
              </p>

              <div className="mt-8 flex gap-3">

                <button
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#173331] py-3 text-white transition hover:border-gray-400"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  onClick={onDelete}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  <Trash2 size={18} />
                  Delete
                </button>

              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}