export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell-inner">
        <div className="auth-header">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="auth-mark">
            <circle cx="16" cy="16" r="12" stroke="#2A3349" strokeWidth="3" />
            <path d="M16 4a12 12 0 0 1 12 12" stroke="#7C6FF0" strokeWidth="3" strokeLinecap="round" />
            <circle cx="28" cy="16" r="2.5" fill="#2DD9B9" />
          </svg>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>
        <div className="panel auth-panel">{children}</div>
      </div>
    </div>
  );
}
