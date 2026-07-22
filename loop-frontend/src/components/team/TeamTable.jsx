import {
  Mail,
  Phone,
  Eye,
  Pencil,
  Trash2,
  FolderKanban,
  Clock,
} from "lucide-react";

import { motion } from "framer-motion";

export default function TeamTable({
  members,
  onView,
  onEdit,
  onDelete,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Away":
        return "bg-yellow-500";
      case "Offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

      {members.map((member, index) => {

        const initials = member.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        return (

          <motion.div
            key={member.id}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.05,
            }}
            whileHover={{
              y: -6,
            }}
            className="group rounded-2xl border border-[#173331] bg-[#111B1A] p-6 transition hover:border-[#32E6A4]"
          >

            {/* Header */}

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-4">

                <div className="relative">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#32E6A4] to-[#0FAE7E] text-xl font-bold text-black">

                    {initials}

                  </div>

                  <span
                    className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#111B1A] ${getStatusColor(
                      member.status
                    )}`}
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-white">

                    {member.name}

                  </h2>

                  <p className="text-[#32E6A4]">

                    {member.role}

                  </p>

                  <p className="mt-1 text-sm text-gray-500">

                    {member.department}

                  </p>

                </div>

              </div>

            </div>

            {/* Contact */}

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 text-gray-300">

                <Mail size={16} />

                {member.email}

              </div>

              <div className="flex items-center gap-3 text-gray-300">

                <Phone size={16} />

                {member.phone}

              </div>

            </div>

            {/* Projects */}

            <div className="mt-6 flex items-center justify-between rounded-xl bg-[#173331] p-4">

              <div className="flex items-center gap-2">

                <FolderKanban
                  size={18}
                  className="text-[#32E6A4]"
                />

                <span className="text-gray-300">

                  Projects

                </span>

              </div>

              <span className="font-bold text-white">

                {member.projects}

              </span>

            </div>

            {/* Performance */}

            <div className="mt-6">

              <div className="mb-2 flex justify-between">

                <span className="text-gray-400">

                  Performance

                </span>

                <span className="font-semibold text-[#32E6A4]">

                  {member.performance}%

                </span>

              </div>

              <div className="h-2 rounded-full bg-[#173331]">

                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#32E6A4] to-[#1BD8B1]"
                  style={{
                    width: `${member.performance}%`,
                  }}
                />

              </div>

            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between">

              <div className="flex items-center gap-2 text-sm text-gray-500">

                <Clock size={15} />

                {member.lastActive}

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => onView(member)}
                  className="rounded-xl bg-[#173331] p-3 transition hover:bg-blue-600"
                  title="View"
                >
                  <Eye
                    size={18}
                    className="text-white"
                  />
                </button>

                <button
                  onClick={() => onEdit(member)}
                  className="rounded-xl bg-[#173331] p-3 transition hover:bg-yellow-500"
                  title="Edit"
                >
                  <Pencil
                    size={18}
                    className="text-white"
                  />
                </button>

                <button
                  onClick={() => onDelete(member)}
                  className="rounded-xl bg-[#173331] p-3 transition hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2
                    size={18}
                    className="text-white"
                  />
                </button>

              </div>

            </div>

          </motion.div>

        );

      })}

    </div>
  );
}