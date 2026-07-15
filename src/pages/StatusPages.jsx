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
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-950 px-4 text-center">
      <div className="rounded-full bg-ink-800 p-4 text-loop-violet">
        <Icon size={26} />
      </div>
      <h1 className="font-display text-xl font-bold text-mist-100">{title}</h1>
      <p className="max-w-sm text-sm text-mist-400">{description}</p>
      <Link to="/" className="btn-primary mt-3">
        Back to dashboard
      </Link>
    </div>
  );
}
