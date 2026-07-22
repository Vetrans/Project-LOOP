import { useEffect, useState } from "react";
import { X, UserPlus, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
  name: "",
  email: "",
  phone: "",
  role: "Frontend Developer",
  department: "Engineering",
  status: "Active",
};

export default function MemberModal({
  open,
  onClose,
  onSave,
  member,
}) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        role: member.role || "Frontend Developer",
        department: member.department || "Engineering",
        status: member.status || "Active",
      });
    } else {
      setForm(initialState);
    }

    setErrors({});
  }, [member, open]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim())
      err.name = "Name is required.";

    if (!form.email.trim())
      err.email = "Email is required.";

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      err.email = "Enter a valid email.";
    }

    if (!form.phone.trim())
      err.phone = "Phone number is required.";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="w-full max-w-2xl rounded-3xl border border-[#173331] bg-[#111B1A] shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-[#173331] p-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {member
                    ? "Edit Team Member"
                    : "Add New Team Member"}
                </h2>

                <p className="mt-1 text-gray-400">
                  {member
                    ? "Update member details."
                    : "Invite a new member to LOOP AI."}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 transition hover:bg-[#173331]"
              >
                <X className="text-white" />
              </button>

            </div>

            {/* Body */}

            <div className="grid gap-5 p-6 md:grid-cols-2">

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none focus:border-[#32E6A4]"
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Email
                </label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none focus:border-[#32E6A4]"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Phone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none focus:border-[#32E6A4]"
                />

                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.phone}
                  </p>
                )}

              </div>

              {/* Role */}

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
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>AI Engineer</option>
                  <option>QA Engineer</option>
                  <option>UI/UX Designer</option>
                  <option>Project Manager</option>
                </select>

              </div>

              {/* Department */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Department
                </label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white"
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Testing</option>
                  <option>Management</option>
                </select>

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white"
                >
                  <option>Active</option>
                  <option>Away</option>
                  <option>Offline</option>
                </select>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-[#173331] p-6">

              <button
                onClick={onClose}
                className="rounded-xl border border-[#173331] px-6 py-3 text-white transition hover:border-red-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                {member ? (
                  <>
                    <Save size={18} />
                    Update Member
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Add Member
                  </>
                )}
              </button>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}