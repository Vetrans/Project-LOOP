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
        <Icon size={24} />
      </div>
      <h1 className="status-page-title">{title}</h1>
      <p className="status-page-desc">{description}</p>
      <Link to="/app" className="btn btn-primary section-gap">
        Back to dashboard
      </Link>
    </div>
  );
}
