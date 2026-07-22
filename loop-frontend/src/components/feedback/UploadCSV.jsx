import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

import { uploadFeedbackCSV } from "../../services/feedbackService";

export default function UploadCSV({
  open,
  onClose,
  onSuccess,
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSelect = (selected) => {
    if (!selected) return;

    if (
      selected.type !== "text/csv" &&
      !selected.name.endsWith(".csv")
    ) {
      toast.error("Please select a CSV file.");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a CSV file first.");
      return;
    }

    try {
      setLoading(true);

      await uploadFeedbackCSV(file);

      toast.success("CSV uploaded successfully.");

      setFile(null);

      onSuccess?.();

      onClose();
    } catch (err) {
      console.error(err);

      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0E1515]">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 p-6">

          <h2 className="text-2xl font-bold">
            Upload CSV
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleSelect(e.dataTransfer.files[0]);
            }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-cyan-500/40 bg-[#151F1F] p-10 text-center hover:border-cyan-400"
          >

            <Upload
              className="mx-auto mb-4 text-cyan-400"
              size={40}
            />

            <p className="font-semibold">
              Drag & Drop CSV Here
            </p>

            <p className="mt-2 text-sm text-gray-400">
              or click to browse
            </p>

            <input
              hidden
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={(e) =>
                handleSelect(e.target.files[0])
              }
            />

          </div>

          {file && (

            <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">

              <FileText
                className="text-cyan-400"
                size={22}
              />

              <div>

                <p className="font-medium">
                  {file.name}
                </p>

                <p className="text-sm text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

              </div>

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-white/10 p-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleUpload}
            className="rounded-xl bg-cyan-500 px-6 py-2 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>

    </div>
  );
}