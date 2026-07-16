import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ErrorState } from "../../components/ui";
import AuthShell from "./AuthShell";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", workspace: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't create your workspace. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Create your workspace" subtitle="You'll be the Admin — invite your team once you're in.">
      <form onSubmit={handleSubmit} className="stack gap-4">
        {error && <ErrorState message={error} />}
        <div className="field">
          <label className="text-eyebrow" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            required
            className="input"
            placeholder="Rishi Sharma"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="text-eyebrow" htmlFor="workspace">
            Workspace / company name
          </label>
          <input
            id="workspace"
            required
            className="input"
            placeholder="Acme Corp"
            value={form.workspace}
            onChange={(e) => setForm({ ...form, workspace: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="text-eyebrow" htmlFor="email">
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
          <label className="text-eyebrow" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className="input"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? "Creating workspace…" : "Create workspace"}
        </button>
      </form>
      <p className="auth-footer-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
