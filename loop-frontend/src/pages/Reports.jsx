import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { reportsApi } from "../lib/api";
import { EmptyState, ErrorState, Modal, Skeleton } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { can } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [active, setActive] = useState(null);

  function load() {
    setLoading(true);
    reportsApi
      .list()
      .then((res) => setReports(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Couldn't load reports."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      await reportsApi.generate(7);
      setOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't generate a report.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Voice-of-Customer reports</h1>
          <p className="page-subtitle">Shareable digests you could forward to leadership as-is.</p>
        </div>
        {can("use_ai") && (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={15} /> Generate report
          </button>
        )}
      </header>

      {error && <ErrorState message={error} />}

      {loading ? (
        <div className="grid-two">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} style={{ height: 124, width: "100%" }} />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState title="No reports yet" description="Generate your first Voice-of-Customer report to get a shareable weekly digest." />
      ) : (
        <div className="grid-two">
          {reports.map((r) => (
            <button key={r._id} onClick={() => setActive(r)} className="panel panel-pad report-card">
              <div className="report-card-period">
                <FileText size={15} />
                <span>
                  {new Date(r.periodStart).toLocaleDateString()} – {new Date(r.periodEnd).toLocaleDateString()}
                </span>
              </div>
              <p className="report-card-title">{r.title}</p>
              <div className="report-card-themes">
                {r.contentJson?.stats?.topThemes?.slice(0, 3).map((t) => (
                  <span key={t.name} className="badge badge-plain">
                    {t.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => !generating && setOpen(false)}
        title="Generate a Voice-of-Customer report"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setOpen(false)} disabled={generating}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={generate} disabled={generating}>
              {generating ? "Generating…" : "Generate"}
            </button>
          </>
        }
      >
        <p className="text-body-muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
          LOOP will summarize top themes, sentiment shifts, and representative quotes from the last 7 days,
          grounded strictly in your workspace's actual feedback.
        </p>
      </Modal>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <div className="stack gap-4">
            <p className="text-meta">
              {new Date(active.periodStart).toLocaleDateString()} – {new Date(active.periodEnd).toLocaleDateString()}
            </p>
            <div>
              <p className="text-eyebrow report-detail-label">Top themes</p>
              <div className="row-wrap gap-2">
                {active.contentJson?.stats?.topThemes?.map((t) => (
                  <span key={t.name} className="badge badge-violet">
                    {t.name} · {t.count}
                  </span>
                ))}
              </div>
            </div>
            <p className="report-detail-narrative">{active.contentJson?.narrative}</p>
            {active.contentJson?.recommendedActions?.length > 0 && (
              <div>
                <p className="text-eyebrow report-detail-label">Recommended actions</p>
                <ul className="report-detail-actions">
                  {active.contentJson.recommendedActions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
