import { AlertCircle, Inbox } from "lucide-react";

export function StatCard({ label, value, sub, accent = "violet" }) {
  const accents = {
    violet: "text-loop-violet",
    teal: "text-loop-teal",
    coral: "text-loop-coral",
    amber: "text-loop-amber",
  };
  return (
    <div className="panel p-5">
      <p className="label">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accents[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-mist-400">{sub}</p>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-ink-700 text-mist-200",
    positive: "bg-loop-teal/10 text-loop-teal",
    negative: "bg-loop-coral/10 text-loop-coral",
    warning: "bg-loop-amber/10 text-loop-amber",
    violet: "bg-loop-violet/10 text-loop-violet",
  };
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}

export function SentimentBadge({ sentiment }) {
  const map = {
    POS: { tone: "positive", label: "Positive" },
    NEU: { tone: "warning", label: "Neutral" },
    NEG: { tone: "negative", label: "Negative" },
  };
  const s = map[sentiment] ?? map.NEU;
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function StatusBadge({ status }) {
  const map = {
    NEW: "violet",
    REVIEWED: "warning",
    ACTIONED: "positive",
  };
  return <Badge tone={map[status] ?? "neutral"}>{status}</Badge>;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-ink-800 p-3 text-mist-400">
        <Icon size={22} />
      </div>
      <p className="font-display text-base font-medium text-mist-100">{title}</p>
      {description && <p className="max-w-sm text-sm text-mist-400">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-loop-coral/30 bg-loop-coral/10 px-4 py-3 text-sm text-loop-coral">
      <AlertCircle size={16} />
      {message}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-ink-700 ${className}`} />;
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="panel w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-mist-100">{title}</h3>
          <button className="btn-ghost !px-2 !py-1" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
