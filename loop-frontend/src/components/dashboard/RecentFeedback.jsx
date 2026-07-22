import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import { getRecentFeedback } from "../../services/dashboardService";

export default function RecentFeedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const loadFeedback = async () => {
      const data = await getRecentFeedback();
      setFeedback(data);
    };

    loadFeedback();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1515] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Recent Feedback
          </h2>

          <p className="text-sm text-gray-400">
            Latest customer feedback received.
          </p>
        </div>

        <button className="rounded-lg border border-cyan-500 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500 hover:text-black">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="pb-4">Customer</th>
              <th className="pb-4">Feedback</th>
              <th className="pb-4">Sentiment</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {feedback.map((item) => (
              <tr
                key={item.customer}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="py-4 font-medium">
                  {item.customer}
                </td>

                <td className="py-4 max-w-sm">
                  {item.message}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.sentiment === "Positive"
                        ? "bg-green-500/20 text-green-400"
                        : item.sentiment === "Negative"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </td>

                <td className="py-4">
                  {item.category}
                </td>

                <td className="py-4">
                  {item.status === "Resolved" && (
                    <span className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 size={16} />
                      Resolved
                    </span>
                  )}

                  {item.status === "Pending" && (
                    <span className="flex items-center gap-2 text-red-400">
                      <AlertTriangle size={16} />
                      Pending
                    </span>
                  )}

                  {item.status === "In Review" && (
                    <span className="flex items-center gap-2 text-yellow-400">
                      <Clock3 size={16} />
                      In Review
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}