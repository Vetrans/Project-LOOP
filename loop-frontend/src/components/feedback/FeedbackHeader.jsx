import { Plus, Download, Upload, Zap, Loader2 } from "lucide-react";

export default function FeedbackHeader({
  onAdd,
  onExport,
  exporting = false,
  onUpload,
  onSimulate,
  canManage = true,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">

      {canManage && (
        <button
          onClick={onSimulate}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-purple-500
            px-5
            py-3
            font-medium
            text-purple-400
            transition
            hover:bg-purple-500/10
          "
        >
          <Zap size={18} />
          Simulate Channel
        </button>
      )}

      {canManage && (
        <button
          onClick={onUpload}
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
          <Upload size={18} />
          Upload CSV
        </button>
      )}

      <button
        onClick={onExport}
        disabled={exporting}
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
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        {exporting ? "Exporting..." : "Export CSV"}
      </button>

      {canManage && (
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
      )}

    </div>
  );
}