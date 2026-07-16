import { useMemo, useState } from "react";
import { Search, Plus, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState, Modal, SentimentBadge, StatusBadge } from "../components/ui";
import { mockFeedback } from "../lib/mockData";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 5;
const STATUSES = ["NEW", "REVIEWED", "ACTIONED"];
const CHANNELS = ["Support ticket", "App store review", "NPS survey", "Sales call note", "Community post"];
const SENTIMENTS = ["POS", "NEU", "NEG"];

export default function Inbox() {
  const { can } = useAuth();
  const [items, setItems] = useState(mockFeedback);
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((f) => {
      if (search && !f.content.toLowerCase().includes(search.toLowerCase())) return false;
      if (channel && f.channel !== channel) return false;
      if (sentiment && f.sentiment !== sentiment) return false;
      if (status && f.status !== status) return false;
      return true;
    });
  }, [items, search, channel, sentiment, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function cycleStatus(id) {
    if (!can("manage_feedback")) return;
    setItems((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const next = STATUSES[(STATUSES.indexOf(f.status) + 1) % STATUSES.length];
        return { ...f, status: next };
      })
    );
  }

  function addFeedback(entry) {
    setItems((prev) => [
      { ...entry, id: `f_${Date.now()}`, createdAt: new Date().toISOString(), status: "NEW", themes: [] },
      ...prev,
    ]);
    setAddOpen(false);
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-mist-100">Feedback inbox</h1>
          <p className="mt-1 text-sm text-mist-400">
            {filtered.length} item{filtered.length === 1 ? "" : "s"} · search, filter, and triage
          </p>
        </div>
        {can("manage_feedback") && (
          <div className="flex shrink-0 gap-2">
            <button className="btn-secondary" onClick={() => setCsvOpen(true)}>
              <Upload size={15} /> Import CSV
            </button>
            <button className="btn-primary" onClick={() => setAddOpen(true)}>
              <Plus size={15} /> Add feedback
            </button>
          </div>
        )}
      </header>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
          <input
            className="input pl-9"
            placeholder="Search feedback content…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <FilterSelect label="Channel" value={channel} onChange={setChannel} options={CHANNELS} />
        <FilterSelect
          label="Sentiment"
          value={sentiment}
          onChange={setSentiment}
          options={SENTIMENTS}
          labels={{ POS: "Positive", NEU: "Neutral", NEG: "Negative" }}
        />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUSES} />
      </div>

      <div className="panel overflow-hidden">
        {pageItems.length === 0 ? (
          <EmptyState
            title="No feedback matches these filters"
            description="Try widening your search, or clear filters to see everything in this workspace."
          />
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-mist-400">
                <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Feedback</th>
                <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Channel</th>
                <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Sentiment</th>
                <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((f) => (
                <tr key={f.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                  <td className="max-w-md px-5 py-3.5">
                    <p className="text-mist-100">{f.content}</p>
                    <p className="mt-0.5 text-xs text-mist-400">{f.customerLabel}</p>
                  </td>
                  <td className="px-5 py-3.5 text-mist-300">{f.channel}</td>
                  <td className="px-5 py-3.5">
                    <SentimentBadge sentiment={f.sentiment} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => cycleStatus(f.id)}
                      className="disabled:cursor-default"
                      disabled={!can("manage_feedback")}
                      title={can("manage_feedback") ? "Click to advance status" : undefined}
                    >
                      <StatusBadge status={f.status} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-mist-400">
                    {new Date(f.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-ink-700 px-5 py-3">
            <p className="font-mono text-xs text-mist-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                className="btn-ghost !px-2 !py-1"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                className="btn-ghost !px-2 !py-1"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddFeedbackModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addFeedback} />
      <CsvImportModal open={csvOpen} onClose={() => setCsvOpen(false)} />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, labels = {} }) {
  return (
    <select
      className="input w-auto min-w-[140px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      <option value="">All {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {labels[opt] ?? opt}
        </option>
      ))}
    </select>
  );
}

function AddFeedbackModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ content: "", channel: CHANNELS[0], sentiment: "NEU", customerLabel: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.content.trim()) return;
    onSubmit({ ...form, score: 0 });
    setForm({ content: "", channel: CHANNELS[0], sentiment: "NEU", customerLabel: "" });
  }

  return (
    <Modal open={open} onClose={onClose} title="Add feedback">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Content</label>
          <textarea
            required
            rows={3}
            className="input mt-1.5"
            placeholder="What did the customer say?"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Channel</label>
            <select
              className="input mt-1.5"
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
            >
              {CHANNELS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Customer</label>
            <input
              className="input mt-1.5"
              placeholder="Optional"
              value={form.customerLabel}
              onChange={(e) => setForm({ ...form, customerLabel: e.target.value })}
            />
          </div>
        </div>
        <p className="font-mono text-xs text-mist-400">
          Sentiment and themes are filled in automatically by Claude once this item is submitted.
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add feedback
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CsvImportModal({ open, onClose }) {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
  }

  function handleImport() {
    // Wire this to feedbackApi.uploadCsv(formData) once the backend exists.
    setResult({ imported: 118, failed: 2 });
  }

  return (
    <Modal open={open} onClose={onClose} title="Import feedback from CSV">
      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-600 px-4 py-8 text-center hover:border-loop-violet/50">
          <Upload size={20} className="text-mist-400" />
          <span className="text-sm text-mist-300">{fileName || "Click to choose a .csv file"}</span>
          <span className="font-mono text-[11px] text-mist-400">content, channel, customer_label, created_at</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>

        {result && (
          <div className="rounded-lg border border-loop-teal/30 bg-loop-teal/10 px-4 py-3 text-sm text-loop-teal">
            Imported {result.imported} rows · {result.failed} failed validation
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" disabled={!fileName} onClick={handleImport}>
            Import
          </button>
        </div>
      </div>
    </Modal>
  );
}
