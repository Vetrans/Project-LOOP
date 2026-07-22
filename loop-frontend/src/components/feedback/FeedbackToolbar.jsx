import { Plus, Upload } from "lucide-react";

export default function FeedbackToolbar({
  onAdd,
  onUpload,
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0E1515] p-6 lg:flex-row lg:items-center">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Feedback Management
        </h2>

        <p className="mt-1 text-gray-400">
          Manage customer feedback efficiently.
        </p>
      </div>

      <div className="flex gap-3">

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black transition hover:bg-cyan-400"
        >
          <Plus size={18} />
          Add Feedback
        </button>

        <button
          onClick={onUpload}
          className="flex items-center gap-2 rounded-xl border border-cyan-500 px-5 py-3 font-medium text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <Upload size={18} />
          Upload CSV
        </button>

      </div>

    </div>
  );
}