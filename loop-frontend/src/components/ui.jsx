import { AlertCircle, Inbox } from "lucide-react";

export function StatCard({ label, value, sub, accent = "violet" }) {
  return (
    <div className="panel panel-pad">
      <p className="text-eyebrow">{label}</p>
      <p className={`stat-card-value accent-${accent}`}>{value}</p>
      {sub && <p className="stat-card-sub">{sub}</p>}
    </div>
  );
}

const TONE_CLASS = {
  neutral: "badge-neutral",
  positive: "badge-positive",
  negative: "badge-negative",
  warning: "badge-warning",
  violet: "badge-violet",
  plain: "badge-plain",
};

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${TONE_CLASS[tone] ?? TONE_CLASS.neutral}`}>{children}</span>;
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
  const map = { NEW: "violet", REVIEWED: "warning", ACTIONED: "positive" };
  return <Badge tone={map[status] ?? "neutral"}>{status}</Badge>;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={21} />
      </div>
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-desc">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="error-state">
      <AlertCircle size={15} />
      {message}
    </div>
  );
}

export function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="panel modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
