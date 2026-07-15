import { useState } from "react";
import { FileText, Plus, Download } from "lucide-react";
import { mockReports } from "../lib/mockData";
import { EmptyState, Modal } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { can } = useAuth();
  const [reports, setReports] = useState(mockReports);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [active, setActive] = useState(null);

  function generate() {
    setGenerating(true);
    // Wire to reportsApi.generate(period) — backend pre-computes the
    // period's stats first, then asks Claude to write the narrative
    // around those numbers only (see brief §9.3).
    setTimeout(() => {
      const report = {
        id: `r_${Date.now()}`,
        title: `Voice of Customer — Week of Jul 13`,
        period: "Jul 13 – Jul 19, 2026",
        createdAt: new Date().toISOString(),
        topThemes: ["Onboarding friction", "SSO / security"],
      };
      setReports((prev) => [report, ...prev]);
      setGenerating(false);
      setOpen(false);
    }, 1200);
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-mist-100">Voice-of-Customer reports</h1>
          <p className="mt-1 text-sm text-mist-400">Shareable digests you could forward to leadership as-is.</p>
        </div>
        {can("use_ai") && (
          <button className="btn-primary" onClick={() => setOpen(true)}>
            <Plus size={15} /> Generate report
          </button>
        )}
      </header>

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Generate your first Voice-of-Customer report to get a shareable weekly digest."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r)}
              className="panel flex flex-col gap-2 p-5 text-left transition-colors hover:border-loop-violet/50"
            >
              <div className="flex items-center gap-2 text-loop-violet">
                <FileText size={16} />
                <span className="font-mono text-[11px] uppercase tracking-wide text-mist-400">{r.period}</span>
              </div>
              <p className="font-display text-sm font-semibold text-mist-100">{r.title}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {r.topThemes.map((t) => (
                  <span key={t} className="badge bg-ink-800 text-mist-300">
                    {t}
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
            <button className="btn-secondary" onClick={() => setOpen(false)} disabled={generating}>
              Cancel
            </button>
            <button className="btn-primary" onClick={generate} disabled={generating}>
              {generating ? "Generating…" : "Generate"}
            </button>
          </>
        }
      >
        <p className="text-sm text-mist-300">
          LOOP will summarize top themes, sentiment shifts, and representative quotes from the last 7 days,
          grounded strictly in your workspace's actual feedback.
        </p>
      </Modal>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-mist-400">{active.period}</p>
            <div>
              <p className="label mb-2">Top themes</p>
              <div className="flex flex-wrap gap-1.5">
                {active.topThemes.map((t) => (
                  <span key={t} className="badge bg-loop-violet/10 text-loop-violet">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-mist-300">
              This is a preview placeholder — once the backend is connected, this panel renders the full
              narrative Claude generated from your pre-computed period stats, plus verbatim quotes and
              recommended actions.
            </p>
            <button className="btn-secondary self-start">
              <Download size={14} /> Export as PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
