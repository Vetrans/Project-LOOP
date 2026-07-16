import { Link } from "react-router-dom";
import { Ghost, ShieldAlert } from "lucide-react";

export function NotFound() {
  return (
    <StatusPage
      icon={Ghost}
      title="Page not found"
      description="That page doesn't exist, or it belongs to a workspace you can't access."
    />
  );
}

export function Forbidden() {
  return (
    <StatusPage
      icon={ShieldAlert}
      title="You don't have access to this"
      description="Your role doesn't permit this action. Ask a workspace Admin if you think this is wrong."
    />
  );
}

function StatusPage({ icon: Icon, title, description }) {
  return (
    <div className="status-page">
      <div className="status-page-icon">
        <Icon size={26} />
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--mist-100)" }}>{title}</h1>
      <p className="u-muted" style={{ maxWidth: 360, fontSize: 14 }}>
        {description}
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
        Back to dashboard
      </Link>
    </div>
  );
}
