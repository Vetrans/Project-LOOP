const STATUS_OPTIONS = [
  { label: "Pending", value: "NEW" },
  { label: "In Review", value: "REVIEWED" },
  { label: "Resolved", value: "ACTIONED" },
];

const statusStyles = {
  NEW: "bg-red-500/20 text-red-400 border-red-500/30",
  REVIEWED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ACTIONED: "bg-green-500/20 text-green-400 border-green-500/30",
};

const statusLabel = { NEW: "Pending", REVIEWED: "In Review", ACTIONED: "Resolved" };

const sentimentStyles = {
  POS: "bg-green-500/20 text-green-400",
  NEU: "bg-yellow-500/20 text-yellow-400",
  NEG: "bg-red-500/20 text-red-400",
};

const sentimentLabel = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };

export default function FeedbackRow({
  item,
  onStatusChange,
  canManage = true,
}) {
  return (
    <tr className="border-b border-white/5 transition hover:bg-white/5">
      <td className="px-6 py-5 font-medium">
        {item.customer}
      </td>

      <td className="max-w-sm px-6 py-5">
        {item.feedback}
      </td>

      <td className="px-6 py-5 text-sm text-gray-400">
        {item.channel}
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            sentimentStyles[item.sentiment] || "bg-gray-500/20 text-gray-300"
          }`}
        >
          {sentimentLabel[item.sentiment] || item.sentiment}
        </span>
      </td>

      <td className="px-6 py-5 text-sm text-gray-400">
        {item.category}
      </td>

      <td className="px-6 py-5">
        {canManage ? (
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium outline-none ${
              statusStyles[item.status] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
            }`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0E1515] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <span
            title="Viewers have read-only access to status"
            className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${
              statusStyles[item.status] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
            }`}
          >
            {statusLabel[item.status] || item.status}
          </span>
        )}
      </td>
    </tr>
  );
}