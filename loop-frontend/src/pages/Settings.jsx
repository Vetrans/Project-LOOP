import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { membersApi } from "../lib/api";
import { Badge, ErrorState, Modal, Skeleton } from "../components/ui";

const ROLES = ["ADMIN", "ANALYST", "VIEWER"];
const ROLE_TONE = { ADMIN: "violet", ANALYST: "positive", VIEWER: "neutral" };

export default function Settings() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "ANALYST" });
  const [invited, setInvited] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    membersApi
      .list()
      .then((res) => setMembers(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Couldn't load members."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateRole(id, role) {
    const prev = members;
    setMembers((p) => p.map((m) => (m._id === id ? { ...m, role } : m)));
    try {
      await membersApi.updateRole(id, role);
    } catch {
      setMembers(prev);
    }
  }

  async function invite(e) {
    e.preventDefault();
    if (!form.email.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await membersApi.invite(form);
      setInvited(res.data);
      setForm({ email: "", role: "ANALYST" });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't invite that member.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Members &amp; roles</h1>
          <p className="page-subtitle">
            Admins manage members. Analysts ingest and classify feedback. Viewers are read-only.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          <UserPlus size={15} /> Invite member
        </button>
      </header>

      {error && <ErrorState message={error} />}

      <div className="panel table-wrap">
        {loading ? (
          <div className="stack gap-3" style={{ padding: 20 }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} style={{ height: 40, width: "100%" }} />
            ))}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id}>
                  <td className="cell-primary">{m.name}</td>
                  <td className="cell-secondary">{m.email}</td>
                  <td>
                    <select
                      value={m.role}
                      onChange={(e) => updateRole(m._id, e.target.value)}
                      className="input select-auto"
                      style={{ padding: "6px 10px" }}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="row gap-2" style={{ marginTop: 16 }}>
        {ROLES.map((r) => (
          <Badge key={r} tone={ROLE_TONE[r]}>
            {r}
          </Badge>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setInvited(null);
        }}
        title="Invite a member"
      >
        {invited ? (
          <div className="stack gap-3">
            <p style={{ fontSize: 14, color: "var(--mist-300)" }}>
              Account created for <span style={{ color: "var(--mist-100)" }}>{invited.member.email}</span>. LOOP
              doesn't send invite emails (out of scope) — share this temporary password with them directly:
            </p>
            <p
              className="u-mono"
              style={{
                borderRadius: 8,
                border: "1px solid rgba(45,217,185,0.3)",
                background: "var(--teal-wash)",
                padding: "10px 16px",
                textAlign: "center",
                fontSize: 14,
                color: "var(--teal)",
              }}
            >
              {invited.tempPassword}
            </p>
            <button
              className="btn btn-secondary"
              style={{ alignSelf: "flex-end" }}
              onClick={() => {
                setOpen(false);
                setInvited(null);
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={invite} className="stack gap-4">
            <div className="field">
              <label className="u-label">Email</label>
              <input
                type="email"
                required
                className="input"
                placeholder="teammate@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="u-label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Inviting…" : "Send invite"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
