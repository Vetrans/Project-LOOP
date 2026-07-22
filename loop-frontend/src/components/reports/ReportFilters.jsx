import { Search, Filter, RotateCcw } from "lucide-react";

export default function ReportFilters({
  search,
  setSearch,
  type,
  setType,
  status,
  setStatus,
  reportTypes,
  reportStatus,
  onClear,
}) {
  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-2">
        <Filter className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">
          Filter Reports
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Search */}

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1f2937] py-3 pl-11 pr-4 text-white outline-none transition focus:border-cyan-500"
          />
        </div>

        {/* Type */}

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none transition focus:border-cyan-500"
        >
          {reportTypes.map((item) => (
            <option
              key={item}
              value={item}
              className="bg-[#1f2937]"
            >
              {item}
            </option>
          ))}
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none transition focus:border-cyan-500"
        >
          {reportStatus.map((item) => (
            <option
              key={item}
              value={item}
              className="bg-[#1f2937]"
            >
              {item}
            </option>
          ))}
        </select>

        {/* Clear */}

        <button
          onClick={onClear}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-5 py-3 font-medium text-white transition hover:scale-105"
        >
          <RotateCcw size={18} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}