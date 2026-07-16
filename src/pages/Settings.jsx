import { useState } from "react";
import { UserPlus } from "lucide-react";
import { mockMembers } from "../lib/mockData";
import { Badge, Modal } from "../components/ui";

const ROLES = ["ADMIN", "ANALYST", "VIEWER"];
const ROLE_TONE = { ADMIN: "violet", ANALYST: "positive", VIEWER: "neutral" };

export default function Settings() {
  const [members, setMembers] = useState(mockMembers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "ANALYST" });

  function updateRole(id, role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  function invite(e) {
    e.preventDefault();
    if (!form.email.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: `u_${Date.now()}`, name: form.email.split("@")[0], email: form.email, role: form.role },
    ]);
    setForm({ email: "", role: "ANALYST" });
    setOpen(false);
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-mist-100">Members & roles</h1>
          <p className="mt-1 text-sm text-mist-400">
            Admins manage members. Analysts ingest and classify feedback. Viewers are read-only.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <UserPlus size={15} /> Invite member
        </button>
      </header>

      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-mist-400">
              <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Name</th>
              <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Email</th>
              <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                <td className="px-5 py-3.5 text-mist-100">{m.name}</td>
                <td className="px-5 py-3.5 text-mist-400">{m.email}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={m.role}
                    onChange={(e) => updateRole(m.id, e.target.value)}
                    className="input w-auto !py-1.5"
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
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <Badge key={r} tone={ROLE_TONE[r]}>
            {r}
          </Badge>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Invite a member">
        <form onSubmit={invite} className="flex flex-col gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input mt-1.5"
              placeholder="teammate@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select
              className="input mt-1.5"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
