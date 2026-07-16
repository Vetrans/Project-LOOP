import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState, ErrorState, Modal, SentimentBadge, StatusBadge, Skeleton } from "../components/ui";
import { feedbackApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["NEW", "REVIEWED", "ACTIONED"];
const CHANNELS = ["Support ticket", "App store review", "NPS survey", "Sales call note", "Community post"];
const SENTIMENTS = ["POS", "NEU", "NEG"];

export default function Inbox() {
  const { can } = useAuth();
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    feedbackApi
      .list({ search, channel, sentiment, status, page, limit: 8 })
      .then((res) => {
        setItems(res.data.items);
        setPages(res.data.pages);
        setTotal(res.data.total);
      })
      .catch((err) => setError(err?.response?.data?.message || "Couldn't load the inbox."))
      .finally(() => setLoading(false));
  }, [search, channel, sentiment, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 250); // light debounce, mainly for search-as-you-type
    return () => clearTimeout(t);
  }, [load]);

  function handleFilterChange(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  async function cycleStatus(item) {
    if (!can("manage_feedback")) return;
    const next = STATUSES[(STATUSES.indexOf(item.status) + 1) % STATUSES.length];
    setItems((prev) => prev.map((f) => (f._id === item._id ? { ...f, status: next } : f)));
    try {
      await feedbackApi.updateStatus(item._id, next);
    } catch {
      load(); // revert to server truth if the update failed
    }
  }

  async function addFeedback(entry) {
    await feedbackApi.create(entry);
    setAddOpen(false);
    setPage(1);
    load();
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Feedback inbox</h1>
          <p className="page-subtitle">
            {total} item{total === 1 ? "" : "s"} · search, filter, and triage
          </p>
        </div>
        {can("manage_feedback") && (
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => setCsvOpen(true)}>
              <Upload size={15} /> Import CSV
            </button>
            <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
              <Plus size={15} /> Add feedback
            </button>
          </div>
        )}
      </header>

      <div className="row gap-3" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <div className="input-icon-wrap">
          <Search size={15} />
          <input
            className="input"
            placeholder="Search feedback content…"
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          />
        </div>
        <FilterSelect label="Channel" value={channel} onChange={handleFilterChange(setChannel)} options={CHANNELS} />
        <FilterSelect
          label="Sentiment"
          value={sentiment}
          onChange={handleFilterChange(setSentiment)}
          options={SENTIMENTS}
          labels={{ POS: "Positive", NEU: "Neutral", NEG: "Negative" }}
        />
        <FilterSelect label="Status" value={status} onChange={handleFilterChange(setStatus)} options={STATUSES} />
      </div>

      {error && <ErrorState message={error} />}

      <div className="panel table-wrap">
        {loading ? (
          <div className="stack gap-3" style={{ padding: 20 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} style={{ height: 48, width: "100%" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No feedback matches these filters"
            description="Try widening your search, or clear filters to see everything in this workspace."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Feedback</th>
                <th>Channel</th>
                <th>Sentiment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f._id}>
                  <td style={{ maxWidth: 420 }}>
                    <p className="cell-primary">{f.content}</p>
                    <p className="cell-muted">{f.customerLabel}</p>
                  </td>
                  <td className="cell-secondary">{f.channel}</td>
                  <td>
                    <SentimentBadge sentiment={f.sentiment} />
                  </td>
                  <td>
                    <button
                      onClick={() => cycleStatus(f)}
                      style={{ background: "none", border: "none", padding: 0, cursor: can("manage_feedback") ? "pointer" : "default" }}
                      disabled={!can("manage_feedback")}
                      title={can("manage_feedback") ? "Click to advance status" : undefined}
                    >
                      <StatusBadge status={f.status} />
                    </button>
                  </td>
                  <td className="cell-date">
                    {new Date(f.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && items.length > 0 && (
          <div className="table-pagination">
            <p className="u-mono u-muted" style={{ fontSize: 12 }}>
              Page {page} of {pages}
            </p>
            <div className="row gap-1">
              <button className="btn btn-ghost btn-icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={15} />
              </button>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddFeedbackModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addFeedback} />
      <CsvImportModal open={csvOpen} onClose={() => setCsvOpen(false)} onImported={load} />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, labels = {} }) {
  return (
    <select className="input select-auto" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
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
  const [form, setForm] = useState({ content: "", channel: CHANNELS[0], customerLabel: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
      setForm({ content: "", channel: CHANNELS[0], customerLabel: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't add that feedback item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add feedback">
      <form onSubmit={handleSubmit} className="stack gap-4">
        {error && <ErrorState message={error} />}
        <div className="field">
          <label className="u-label">Content</label>
          <textarea
            required
            rows={3}
            className="input"
            placeholder="What did the customer say?"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
        <div className="grid-2">
          <div className="field">
            <label className="u-label">Channel</label>
            <select className="input" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
              {CHANNELS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="u-label">Customer</label>
            <input
              className="input"
              placeholder="Optional"
              value={form.customerLabel}
              onChange={(e) => setForm({ ...form, customerLabel: e.target.value })}
            />
          </div>
        </div>
        <p className="u-mono u-muted" style={{ fontSize: 12 }}>
          Sentiment and themes are filled in automatically once this item is submitted.
        </p>
        <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Classifying…" : "Add feedback"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CsvImportModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  function handleFile(e) {
    setFile(e.target.files?.[0] ?? null);
    setResult(null);
    setError("");
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await feedbackApi.uploadCsv(formData);
      setResult(res.data);
      onImported();
    } catch (err) {
      setError(err?.response?.data?.message || "Import failed.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setFile(null);
        setResult(null);
        onClose();
      }}
      title="Import feedback from CSV"
    >
      <div className="stack gap-4">
        {error && <ErrorState message={error} />}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 8,
            border: "1px dashed var(--ink-600)",
            padding: "32px 16px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <Upload size={20} className="u-muted" />
          <span style={{ fontSize: 14, color: "var(--mist-300)" }}>{file?.name || "Click to choose a .csv file"}</span>
          <span className="u-mono u-muted" style={{ fontSize: 11 }}>
            content, channel, customer_label, created_at
          </span>
          <input type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
        </label>

        {result && (
          <div
            style={{
              borderRadius: 8,
              border: "1px solid rgba(45,217,185,0.3)",
              background: "var(--teal-wash)",
              padding: "10px 16px",
              fontSize: 14,
              color: "var(--teal)",
            }}
          >
            Imported {result.imported} rows · {result.failed} failed validation
          </div>
        )}

        <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" disabled={!file || importing} onClick={handleImport}>
            {importing ? "Importing…" : "Import"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
