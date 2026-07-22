import {
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

import { motion } from "framer-motion";

export default function TeamFilters({
  search,
  setSearch,

  role,
  setRole,

  department,
  setDepartment,

  status,
  setStatus,

  roles,
  departments,
  statusList,

  onClear,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="mb-8 rounded-2xl border border-[#173331] bg-[#111B1A] p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Filter
          size={20}
          className="text-[#32E6A4]"
        />

        <h2 className="text-lg font-semibold text-white">
          Filter Team Members
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}

        <div className="relative xl:col-span-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-[#173331] bg-[#060F0E] py-3 pl-11 pr-4 text-white outline-none transition focus:border-[#32E6A4]"
          />
        </div>

        {/* Role */}

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none transition focus:border-[#32E6A4]"
        >
          {roles.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {/* Department */}

        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
          className="rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none transition focus:border-[#32E6A4]"
        >
          {departments.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="rounded-xl border border-[#173331] bg-[#060F0E] p-3 text-white outline-none transition focus:border-[#32E6A4]"
        >
          {statusList.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl border border-[#173331] bg-[#060F0E] px-5 py-3 text-white transition hover:border-[#32E6A4]"
        >
          <RotateCcw size={18} />

          Clear Filters

        </button>

      </div>

    </motion.div>
  );
}