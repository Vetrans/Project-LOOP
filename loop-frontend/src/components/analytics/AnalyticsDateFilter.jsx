import { CalendarRange, RotateCcw } from "lucide-react";

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

const PRESETS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
];

export default function AnalyticsDateFilter({
  startDate,
  endDate,
  onChange,
  loading = false,
}) {
  const applyPreset = (days) => {
    onChange({ startDate: daysAgo(days), endDate: toISODate(new Date()) });
  };

  const clear = () => onChange({ startDate: "", endDate: "" });

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0E1515] p-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/10 p-2.5">
          <CalendarRange className="text-cyan-400" size={20} />
        </div>

        <div>
          <h3 className="font-semibold text-white">Date Range</h3>
          <p className="text-sm text-gray-400">
            {startDate || endDate
              ? "Charts below reflect the selected range."
              : "Showing the last 30 days by default."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">From</label>
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => onChange({ startDate: e.target.value, endDate })}
            className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-2.5 text-gray-200 outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">To</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => onChange({ startDate, endDate: e.target.value })}
            className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-2.5 text-gray-200 outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.days)}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-[#141C1C] px-3 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-white disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}

          <button
            onClick={clear}
            disabled={loading}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#141C1C] px-3 py-2 text-sm text-gray-300 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}