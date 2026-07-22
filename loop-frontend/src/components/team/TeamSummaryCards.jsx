import {
  Users,
  Code2,
  Palette,
  Briefcase,
} from "lucide-react";

import { motion } from "framer-motion";

const icons = {
  users: Users,
  code: Code2,
  palette: Palette,
  briefcase: Briefcase,
};

export default function TeamSummaryCards({ summary }) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {summary.map((item, index) => {

        const Icon = icons[item.icon];

        return (

          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -6,
            }}
            className="group relative overflow-hidden rounded-2xl border border-[#173331] bg-[#111B1A] p-6"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-[#32E6A4]/5 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative z-10">

              <div className="mb-6 flex items-center justify-between">

                <div className="rounded-2xl bg-[#173331] p-4 transition group-hover:bg-[#32E6A4]">

                  <Icon
                    size={26}
                    className="text-[#32E6A4] transition group-hover:text-black"
                  />

                </div>

                <span className="rounded-full bg-[#173331] px-3 py-1 text-xs text-[#32E6A4]">
                  {item.change}
                </span>

              </div>

              <h2 className="text-4xl font-bold text-white">
                {item.value}
              </h2>

              <p className="mt-2 text-gray-400">
                {item.title}
              </p>

            </div>

          </motion.div>

        );

      })}

    </div>
  );
}