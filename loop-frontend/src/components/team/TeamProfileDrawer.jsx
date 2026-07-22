import {
  X,
  Mail,
  Phone,
  Building2,
  FolderKanban,
  CalendarDays,
  Activity,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

export default function TeamProfileDrawer({
  open,
  member,
  onClose,
}) {
  if (!member) return null;

  const initials = member.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 flex h-full w-full max-w-md flex-col border-l border-[#173331] bg-[#101C1B] shadow-2xl"
          >
            {/* Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173331] bg-[#101C1B] p-6">

              <h2 className="text-3xl font-bold text-white">
                Member Details
              </h2>

              <button
                onClick={onClose}
                className="rounded-xl p-2 transition hover:bg-[#173331]"
              >
                <X className="text-white" />
              </button>

            </div>

            {/* Scrollable Content */}

            <div className="drawer-scroll flex-1 p-6">

              {/* Avatar */}

              <div className="flex flex-col items-center">

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#32E6A4] to-[#10B981] text-4xl font-bold text-black shadow-lg">

                  {initials}

                </div>

                <h3 className="mt-5 text-3xl font-bold text-white">
                  {member.name}
                </h3>

                <p className="mt-1 text-lg text-[#32E6A4]">
                  {member.role}
                </p>

                <span
                  className={`mt-3 rounded-full px-4 py-2 text-sm font-medium ${
                    member.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : member.status === "Away"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {member.status}
                </span>

              </div>

              {/* Information */}

              <div className="mt-8 space-y-4">

                <InfoCard
                  icon={<Mail size={18} />}
                  title="Email"
                  value={member.email}
                />

                <InfoCard
                  icon={<Phone size={18} />}
                  title="Phone"
                  value={member.phone}
                />

                <InfoCard
                  icon={<Building2 size={18} />}
                  title="Department"
                  value={member.department}
                />

                <InfoCard
                  icon={<FolderKanban size={18} />}
                  title="Projects"
                  value={member.projects}
                />

                <InfoCard
                  icon={<CalendarDays size={18} />}
                  title="Joined"
                  value={member.joined}
                />

                <InfoCard
                  icon={<Activity size={18} />}
                  title="Last Active"
                  value={member.lastActive}
                />

              </div>

              {/* Performance */}

              <div className="mt-8 rounded-2xl border border-[#173331] bg-[#173331]/40 p-5">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="font-semibold text-white">
                    Performance
                  </h3>

                  <span className="font-bold text-[#32E6A4]">
                    {member.performance}%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-[#0E1615]">

                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-[#32E6A4] to-[#10B981]"
                    style={{
                      width: `${member.performance}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#173331] bg-[#173331]/40 p-4">

      <div className="rounded-xl bg-[#32E6A4]/20 p-3 text-[#32E6A4]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-400">
          {title}
        </p>

        <h4 className="font-semibold text-white">
          {value}
        </h4>
      </div>

    </div>
  );
}