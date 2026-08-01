import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getFeedback } from "../../services/feedbackService";

const PAGE_SIZE = 20;

const sentimentLabel = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };
const sentimentStyles = {
  POS: "bg-green-500/20 text-green-400",
  NEU: "bg-yellow-500/20 text-yellow-400",
  NEG: "bg-red-500/20 text-red-400",
};

export default function ThemeDrilldownModal({ theme, onClose }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!theme) return;

    // Reset to a fresh first page whenever a different theme is opened.
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setTotal(0);
    setLoading(true);

    getFeedback({ theme: theme._id, page: 1, limit: PAGE_SIZE })
      .then((data) => {
        setItems(data.items);
        setTotalPages(data.pages);
        setTotal(data.total);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Could not load feedback for this theme.");
      })
      .finally(() => setLoading(false));
  }, [theme]);

  async function handleLoadMore() {
    if (!theme) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await getFeedback({ theme: theme._id, page: nextPage, limit: PAGE_SIZE });
      setItems((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load more feedback.");
    } finally {
      setLoadingMore(false);
    }
  }

  const hasMore = page < totalPages;

  return (
    <AnimatePresence>
      {theme && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-[#0E1515] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/15 p-2.5">
                  <MessageSquare className="text-purple-400" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{theme.name}</h2>
                  <p className="text-sm text-gray-400">
                    {loading
                      ? "Loading feedback items..."
                      : `Showing ${items.length} of ${total} feedback item${total === 1 ? "" : "s"}`}
                  </p>
                </div>
              </div>

              <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <p className="py-10 text-center text-gray-400">Loading feedback...</p>
              ) : items.length === 0 ? (
                <p className="py-10 text-center text-gray-400">
                  No feedback items found for this theme.
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            {item.customerLabel || "Anonymous"}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              sentimentStyles[item.sentiment] || "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {sentimentLabel[item.sentiment] || item.sentiment}
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-gray-300">{item.content}</p>

                        <p className="mt-2 text-xs text-gray-500">{item.channel}</p>
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-300 transition hover:border-purple-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        `Load ${Math.min(PAGE_SIZE, total - items.length)} more`
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}