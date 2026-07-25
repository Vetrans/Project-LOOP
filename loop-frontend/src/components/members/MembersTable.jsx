import { Trash2, ShieldCheck, ShieldAlert, Eye } from "lucide-react";
import { motion } from "framer-motion";

const ROLES = ["ADMIN", "ANALYST", "VIEWER"];

const roleStyles = {
  ADMIN: "bg-[#32E6A4]/15 text-[#32E6A4] border border-[#32E6A4]/30",
  ANALYST: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  VIEWER: "bg-gray-500/15 text-gray-300 border border-gray-500/30",
};

const roleIcons = {
  ADMIN: ShieldCheck,
  ANALYST: ShieldAlert,
  VIEWER: Eye,
};

export default function MembersTable({
  members,
  currentUserId,
  isAdmin,
  onChangeRole,
  onRemove,
}) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-[#173331] bg-[#111B1A] py-16 text-center text-gray-400">
        No members found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#173331] bg-[#111B1A]">
      <table className="w-full">
        <thead className="border-b border-[#173331] bg-[#0E1615] text-left text-sm text-gray-400">
          <tr>
            <th className="p-5">Name</th>
            <th className="p-5">Email</th>
            <th className="p-5">Role</th>
            {isAdmin && <th className="p-5 text-center">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {members.map((member, index) => {
            const RoleIcon = roleIcons[member.role] || Eye;
            const isSelf = member.id === currentUserId;

            return (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="p-5 font-medium text-white">
                  {member.name}
                  {isSelf && (
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                      You
                    </span>
                  )}
                </td>

                <td className="p-5 text-gray-300">{member.email}</td>

                <td className="p-5">
                  {isAdmin ? (
                    <select
                      value={member.role}
                      onChange={(e) => onChangeRole(member, e.target.value)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium outline-none ${roleStyles[member.role]}`}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role} className="bg-[#111B1A] text-white">
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${roleStyles[member.role]}`}
                    >
                      <RoleIcon size={14} />
                      {member.role}
                    </span>
                  )}
                </td>

                {isAdmin && (
                  <td className="p-5 text-center">
                    <button
                      onClick={() => onRemove(member)}
                      disabled={isSelf}
                      title={isSelf ? "You can't remove your own account" : "Remove member"}
                      className="rounded-xl bg-[#173331] p-2.5 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#173331]"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </td>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}