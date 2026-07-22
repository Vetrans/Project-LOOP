import { Search } from "lucide-react";

export default function FeedbackFilters({
  searchTerm,
  setSearchTerm,
  sentiment,
  setSentiment,
  category,
  setCategory,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1515] p-6">
      <div className="grid gap-4 lg:grid-cols-4">

        <div className="relative lg:col-span-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customer or feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#141C1C] py-3 pl-11 pr-4 outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option>All Categories</option>
          <option>Delivery</option>
          <option>Payment</option>
          <option>Support</option>
          <option>Product</option>
        </select>

      </div>
    </div>
  );
}