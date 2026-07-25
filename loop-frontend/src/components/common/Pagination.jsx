import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
}) {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
      <p className="text-sm text-gray-400">
        Showing <span className="text-white">{start}</span>–
        <span className="text-white">{end}</span> of{" "}
        <span className="text-white">{total}</span> results
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#141C1C] px-3 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <span className="px-3 text-sm text-gray-400">
          Page <span className="text-white">{page}</span> of{" "}
          <span className="text-white">{pages}</span>
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#141C1C] px-3 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}