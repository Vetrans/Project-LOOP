export default function FeedbackRow({
  item,
}) {
  return (
    <tr className="border-b border-white/5 transition hover:bg-white/5">
      <td className="px-6 py-5 font-medium">
        {item.customer}
      </td>

      <td className="px-6 py-5">
        {item.feedback}
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
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

      <td className="px-6 py-5">
        {item.category}
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            item.status === "Resolved"
              ? "bg-green-500/20 text-green-400"
              : item.status === "Pending"
              ? "bg-red-500/20 text-red-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {item.status}
        </span>
      </td>

      <td className="px-6 py-5 text-center text-sm text-gray-500">Managed by API</td>
    </tr>
  );
}
