import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { toast } from "sonner";

const CHANNELS = [
  "Support ticket",
  "App store review",
  "NPS survey",
  "Sales call note",
  "Community post",
];

export default function SimulateChannelModal({
  open,
  onClose,
  onSimulate,
}) {
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const result = await onSimulate(channel, count);
      toast.success(
        `Simulated ${result.imported} new "${channel}" item${result.imported === 1 ? "" : "s"} — classified and added to your inbox.`,
      );
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not simulate channel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1515]"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/15 p-2.5">
                <Zap className="text-purple-400" size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Simulate Channel</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Mimic new feedback arriving from a live integration.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <p className="text-sm text-gray-400">
              LOOP doesn't pull from real third-party integrations (that's
              out of scope) — this drops in realistic sample feedback for the
              channel you pick, and classifies each item exactly like a real
              submission would be.
            </p>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Channel
              </label>

              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-purple-400"
              >
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Number of items
              </label>

              <input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) =>
                  setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))
                }
                className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-purple-400"
              />
              <p className="mt-1 text-xs text-gray-500">Between 1 and 20 items.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 p-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/10 px-5 py-2 hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-2 font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Zap size={18} />
              {loading ? "Simulating..." : "Simulate"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}