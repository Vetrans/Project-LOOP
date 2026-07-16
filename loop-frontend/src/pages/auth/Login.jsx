import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ErrorState } from "../../components/ui";
import AuthShell from "./AuthShell";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't sign you in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your workspace to see what customers are saying.">
      <form onSubmit={handleSubmit} className="stack gap-4">
        {error && <ErrorState message={error} />}
        <div className="field">
          <label className="u-label" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            className="input"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="u-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="input"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="auth-footer-text">
        New to LOOP? <Link to="/signup">Create a workspace</Link>
      </p>
      <p className="auth-hint">
        Seeded demo logins: admin@acme-demo.com / analyst@acme-demo.com / viewer@acme-demo.com — password
        Password123!
      </p>
    </AuthShell>
  );
}
