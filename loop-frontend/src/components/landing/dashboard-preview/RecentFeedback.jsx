import { MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const feedback = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Checkout is much faster after the latest update.",
    sentiment: "Positive",
  },
  {
    name: "James Wilson",
    rating: 4,
    comment: "Dark mode would make the experience even better.",
    sentiment: "Suggestion",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment: "Customer support responded within minutes!",
    sentiment: "Positive",
  },
];

export default function RecentFeedback() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-6
      "
    >
      <div className="flex items-center gap-3">

        <MessageCircle
          className="text-[#32E6A4]"
          size={22}
        />

        <h3 className="text-xl font-bold text-white">
          Live Feedback
        </h3>

      </div>

      <div className="mt-6 space-y-5">

        {feedback.map((item) => (

          <div
            key={item.name}
            className="
              rounded-xl
              border
              border-white/10
              bg-[#101817]
              p-4
            "
          >

            <div className="flex items-center justify-between">

              <h4 className="font-semibold text-white">

                {item.name}

              </h4>

              <span className="rounded-full bg-[#32E6A4]/10 px-3 py-1 text-xs text-[#32E6A4]">

                {item.sentiment}

              </span>

            </div>

            <div className="mt-2 flex gap-1">

              {[...Array(item.rating)].map((_, i) => (

                <Star
                  key={i}
                  size={14}
                  fill="#FACC15"
                  color="#FACC15"
                />

              ))}

            </div>

            <p className="mt-3 text-sm leading-6 text-white/65">

              {item.comment}

            </p>

          </div>

        ))}

      </div>

    </motion.div>
  );
}