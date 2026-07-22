import { Trash2, X } from "lucide-react";

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Feedback",
  description = "Are you sure you want to delete this feedback? This action cannot be undone.",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1515] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/20 p-2">
              <Trash2 className="text-red-400" size={20} />
            </div>

            <h2 className="text-xl font-semibold">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-400 leading-7">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/10 p-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}