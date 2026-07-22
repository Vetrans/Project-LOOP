import FeedbackRow from "./FeedbackRow";

export default function FeedbackTable({
  feedback = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1515]">
      <table className="w-full">
        <thead className="border-b border-white/10 text-left">
          <tr>
            <th className="p-5">Customer</th>
            <th className="p-5">Feedback</th>
            <th className="p-5">Sentiment</th>
            <th className="p-5">Category</th>
            <th className="p-5">Status</th>
            <th className="p-5 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {feedback.length > 0 ? (
            feedback.map((item) => (
              <FeedbackRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-gray-400"
              >
                No feedback found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}