import { motion } from "framer-motion";

export default function WorkflowStep({
  icon: Icon,
  title,
  description,
  index,
  isLast,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Circle */}

      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#32E6A4]/30 bg-[#101817] text-[#32E6A4] shadow-lg shadow-[#32E6A4]/10">

        <Icon size={34} />

      </div>

      {/* Connector */}

      {!isLast && (
        <div className="absolute top-10 left-full hidden h-[2px] w-full bg-gradient-to-r from-[#32E6A4]/50 to-transparent lg:block" />
      )}

      <h3 className="mt-8 text-xl font-bold">

        {title}

      </h3>

      <p className="mt-4 max-w-xs leading-7 text-white/60">

        {description}

      </p>
    </motion.div>
  );
}