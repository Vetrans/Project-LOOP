import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldPlus, Copy, Check, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

const initialForm = { name: "", email: "", role: "VIEWER" };

export default function InviteMemberModal({ open, onClose, onInvite }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // { member, tempPassword } once invited
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.email.trim()) {
      toast.error("Enter an email address.");
      return;
    }

    setSaving(true);
    try {
      const data = await onInvite(form);
      setResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not invite member.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setResult(null);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg rounded-3xl border border-[#173331] bg-[#111B1A] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#173331] p-6">
            <h2 className="text-2xl font-bold text-white">
              {result ? "Member Invited" : "Invite Team Member"}
            </h2>

            <button
              onClick={handleClose}
              className="rounded-xl p-2 transition hover:bg-[#173331]"
            >
              <X className="text-white" />
            </button>
          </div>

          {!result ? (
            <>
              <div className="space-y-5 p-6">
                <p className="text-sm text-gray-400">
                  LOOP doesn't send real invite emails yet — a login account is
                  created immediately with a one-time temporary password for
                  you to relay to them directly.
                </p>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Full Name (optional)
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none focus:border-[#32E6A4]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none focus:border-[#32E6A4]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white"
                  >
                    <option value="ADMIN">Admin — full access, manages members</option>
                    <option value="ANALYST">Analyst — ingest & manage feedback, use AI</option>
                    <option value="VIEWER">Viewer — read-only access</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#173331] p-6">
                <button
                  onClick={handleClose}
                  className="rounded-xl border border-[#173331] px-6 py-3 text-white transition hover:border-red-500"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShieldPlus size={18} />
                  {saving ? "Inviting..." : "Send Invite"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6 p-6">
              <div className="rounded-2xl border border-[#32E6A4]/30 bg-[#32E6A4]/10 p-5">
                <p className="text-white">
                  <span className="font-semibold">{result.member.name}</span>{" "}
                  ({result.member.email}) has been added as{" "}
                  <span className="font-semibold text-[#32E6A4]">{result.member.role}</span>.
                </p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-sm text-yellow-400">
                  <ClipboardCheck size={16} />
                  Copy this temporary password now — it will not be shown again.
                </p>

                <div className="flex items-center gap-3 rounded-xl border border-[#173331] bg-[#060F0E] p-4">
                  <code className="flex-1 break-all font-mono text-lg text-white">
                    {result.tempPassword}
                  </code>

                  <button
                    onClick={handleCopy}
                    className="rounded-xl bg-[#173331] p-2.5 transition hover:bg-[#32E6A4] hover:text-black"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end border-t border-[#173331] pt-6">
                <button
                  onClick={handleClose}
                  className="rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}