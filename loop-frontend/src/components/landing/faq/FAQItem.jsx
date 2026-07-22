import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#101817]
        transition-all
        duration-300
        hover:border-[#32E6A4]/40
      "
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between
          px-8
          py-6
          text-left
        "
      >
        <span className="text-lg font-semibold text-white">
          {question}
        </span>

        <ChevronDown
          size={22}
          className={`text-[#32E6A4] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <p className="border-t border-white/10 px-8 py-6 leading-8 text-white/70">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}