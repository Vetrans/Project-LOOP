import { Search, RotateCcw } from "lucide-react";

const CHANNELS = [
  "Support ticket",
  "App store review",
  "NPS survey",
  "Sales call note",
  "Community post",
];

const SENTIMENT_OPTIONS = [
  { label: "All Sentiments", value: "" },
  { label: "Positive", value: "POS" },
  { label: "Neutral", value: "NEU" },
  { label: "Negative", value: "NEG" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "NEW" },
  { label: "In Review", value: "REVIEWED" },
  { label: "Resolved", value: "ACTIONED" },
];

export default function FeedbackFilters({
  filters,
  onChange,
  themes,
  onClear,
}) {
  const update = (key) => (e) => onChange(key, e.target.value);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1515] p-6">
      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">

        {/* Search */}
        <div className="relative lg:col-span-3 xl:col-span-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search customer or feedback..."
            value={filters.search}
            onChange={update("search")}
            className="w-full rounded-xl border border-white/10 bg-[#141C1C] py-3 pl-11 pr-4 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Channel */}
        <select
          value={filters.channel}
          onChange={update("channel")}
          className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option value="">All Channels</option>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Sentiment */}
        <select
          value={filters.sentiment}
          onChange={update("sentiment")}
          className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-cyan-400"
        >
          {SENTIMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={update("status")}
          className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-cyan-400"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Theme */}
        <select
          value={filters.theme}
          onChange={update("theme")}
          className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option value="">All Themes</option>
          {themes.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} {typeof t.count === "number" ? `(${t.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {/* Date range */}
        <div className="lg:col-span-1 xl:col-span-2">
          <label className="mb-1 block text-xs text-gray-500">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={update("startDate")}
            max={filters.endDate || undefined}
            className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-2.5 text-gray-200 outline-none focus:border-cyan-400"
          />
        </div>

        <div className="lg:col-span-1 xl:col-span-2">
          <label className="mb-1 block text-xs text-gray-500">To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={update("endDate")}
            min={filters.startDate || undefined}
            className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-2.5 text-gray-200 outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-end lg:col-span-1 xl:col-span-2">
          <button
            onClick={onClear}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#141C1C] px-5 py-2.5 text-gray-300 transition hover:border-red-400 hover:text-red-400"
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}