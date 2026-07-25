import FeedbackRow from "./FeedbackRow";

export default function FeedbackTable({
  feedback = [],
  onStatusChange,
  loading = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1515]">
      <table className="w-full">
        <thead className="border-b border-white/10 text-left">
          <tr>
            <th className="p-5">Customer</th>
            <th className="p-5">Feedback</th>
            <th className="p-5">Channel</th>
            <th className="p-5">Sentiment</th>
            <th className="p-5">Feature Area</th>
            <th className="p-5">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-400">
                Loading feedback...
              </td>
            </tr>
          ) : feedback.length > 0 ? (
            feedback.map((item) => (
              <FeedbackRow
                key={item.id}
                item={item}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-400">
                No feedback found. Try adjusting your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}