import LoopMark from "../../components/LoopMark";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell-inner">
        <div className="auth-header">
          <div className="auth-mark">
            <LoopMark size={38} />
          </div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>
        <div className="panel auth-panel">{children}</div>
      </div>
    </div>
  );
}
