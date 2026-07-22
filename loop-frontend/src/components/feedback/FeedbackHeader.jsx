import { Plus, Download } from "lucide-react";

export default function FeedbackHeader({
  onAdd,
  onExport,
}) {
  return (
    <div className="mb-6 flex items-center justify-end gap-3">

      <button
        onClick={onExport}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-cyan-500
          px-5
          py-3
          font-medium
          text-cyan-400
          transition
          hover:bg-cyan-500/10
        "
      >
        <Download size={18} />
        Export CSV
      </button>

      <button
        onClick={onAdd}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-cyan-500
          px-5
          py-3
          font-medium
          text-black
          transition
          hover:bg-cyan-400
        "
      >
        <Plus size={18} />
        Add Feedback
      </button>

    </div>
  );
}