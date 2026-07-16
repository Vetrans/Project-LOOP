import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="status-page">
        <p className="u-muted">Loading…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Mirrors server-side RBAC: hiding a nav link is a UX nicety, this guard
// is the client-side backstop, and the real enforcement (403s) lives in
// the API layer, not here.
export function RequirePermission({ permission, children }) {
  const { can } = useAuth();
  if (!can(permission)) return <Navigate to="/forbidden" replace />;
  return children;
}
